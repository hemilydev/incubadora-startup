import { useState, useMemo, useEffect, useCallback } from "react";
import { Navbar }      from "./components/Navbar/Navbar";
import { Sidebar }     from "./components/Sidebar/Sidebar";
import { Dashboard }   from "./components/Dashboard/Dashboard";
import { StartupCard } from "./components/StartupCard/StartupCard";
import { Modal }       from "./components/Modal/Modal";
import { Footer }      from "./components/Footer/Footer";
import { IStartup, IContadores, CicloStartup } from "./types";
import { ModalNovaStartup } from "./components/ModalNovaStartup/ModalNovaStartup";
import Login from "./components/Login";
import { isAuthenticated, logout } from "./services/authService";
import {
  listarStartups,
  cadastrarStartup,
  avancarCiclo,
  desclassificarStartup,
  registrarRelatorio,
  Startup as StartupAPI,
} from "./services/startupService";
import "./styles/global.css";

type FiltroAtivo = CicloStartup | "Todas" | "Desclassificadas";

/**
 * Converte o formato do back-end para o formato usado pelo front-end.
 * O back-end usa strings ("CICLO1", "CICLO2"...) e o front usa números (1, 2, 3).
 */
function converterParaIStartup(s: StartupAPI): IStartup {
  const cicloMap: Record<string, CicloStartup> = {
    CICLO1: 1, CICLO2: 2, CICLO3: 3,
  };
  return {
    id: s.id ?? 0,
    nomeProjeto: s.nome,
    nomeFundador: s.fundador,
    setor: s.setor,
    ciclo: cicloMap[s.ciclo] ?? 1,
    descricao: s.descricao,
    dataEntrada: s.dataEntrada ?? "",
    relatorioEnviado: s.relatorioEnviado,
    status: s.ciclo === "DESCLASSIFICADA" ? "Desclassificada" : "Ativa",
  };
}

/**
 * Converte o formato do front-end para o formato do back-end.
 */
function converterParaStartupAPI(s: IStartup): StartupAPI {
  const cicloMap: Record<number, string> = {
    1: "CICLO1", 2: "CICLO2", 3: "CICLO3",
  };
  return {
    nome: s.nomeProjeto,
    fundador: s.nomeFundador,
    setor: s.setor,
    ciclo: s.status === "Desclassificada" ? "DESCLASSIFICADA" : cicloMap[s.ciclo],
    descricao: s.descricao,
    dataEntrada: s.dataEntrada,
    relatorioEnviado: s.relatorioEnviado,
  };
}

function App() {
  // Controla se o usuário está autenticado
  const [autenticado, setAutenticado] = useState<boolean>(isAuthenticated());
  const [startups, setStartups] = useState<IStartup[]>([]);
  const [filtro, setFiltro] = useState<FiltroAtivo>("Todas");
  const [modalStartup, setModalStartup] = useState<IStartup | null>(null);
  const [modalNovaStartup, setModalNovaStartup] = useState<boolean>(false);
  const [carregando, setCarregando] = useState<boolean>(false);

  /**
   * Carrega as startups do back-end ao iniciar ou após login.
   */
  const carregarStartups = useCallback(async () => {
    setCarregando(true);
    try {
      const dados = await listarStartups();
      setStartups(dados.map(converterParaIStartup));
    } catch (err) {
      console.error("Erro ao carregar startups:", err);
    } finally {
      setCarregando(false);
    }
  }, []);

  // Carrega startups quando o usuário estiver autenticado
  useEffect(() => {
    if (autenticado) carregarStartups();
  }, [autenticado, carregarStartups]);

  // Avança a startup para o próximo ciclo
  async function handleAvancarCiclo(id: number): Promise<void> {
    try {
      await avancarCiclo(id);
      await carregarStartups();
    } catch (err) {
      console.error("Erro ao avançar ciclo:", err);
    }
  }

  // Marca a startup como desclassificada
  async function handleDesclassificar(id: number): Promise<void> {
    try {
      await desclassificarStartup(id);
      await carregarStartups();
    } catch (err) {
      console.error("Erro ao desclassificar:", err);
    }
  }

  // Registra o envio de relatório
  async function handleRegistrarRelatorio(id: number): Promise<void> {
    try {
      await registrarRelatorio(id);
      await carregarStartups();
    } catch (err) {
      console.error("Erro ao registrar relatório:", err);
    }
  }

  // Adiciona uma nova startup
  async function handleNovaStartup(novaStartup: IStartup): Promise<void> {
    try {
      await cadastrarStartup(converterParaStartupAPI(novaStartup));
      await carregarStartups();
      setModalNovaStartup(false);
    } catch (err) {
      console.error("Erro ao cadastrar startup:", err);
    }
  }

  // Faz logout do usuário
  function handleLogout(): void {
    logout();
    setAutenticado(false);
    setStartups([]);
  }

  // Contadores derivados do estado atual
  const contadores = useMemo<IContadores>(() => {
    const ativas = startups.filter((s) => s.status === "Ativa");
    return {
      totalAtivas:         ativas.length,
      ciclo1:              ativas.filter((s) => s.ciclo === 1).length,
      ciclo2:              ativas.filter((s) => s.ciclo === 2).length,
      ciclo3:              ativas.filter((s) => s.ciclo === 3).length,
      desclassificadas:    startups.filter((s) => s.status === "Desclassificada").length,
      relatoriosPendentes: ativas.filter((s) => !s.relatorioEnviado).length,
    };
  }, [startups]);

  // Lista filtrada pelo menu lateral
  const startupsFiltradas = useMemo<IStartup[]>(() => {
    if (filtro === "Todas")            return startups.filter((s) => s.status === "Ativa");
    if (filtro === "Desclassificadas") return startups.filter((s) => s.status === "Desclassificada");
    return startups.filter((s) => s.status === "Ativa" && s.ciclo === filtro);
  }, [startups, filtro]);

  // Se não estiver autenticado, exibe a tela de login
  if (!autenticado) {
    return <Login onLoginSuccess={() => setAutenticado(true)} />;
  }

  return (
    <>
      {/* header – barra de navegação superior */}
      <Navbar
        titulo="Incubadora de Empresas"
        onNovaStartup={() => setModalNovaStartup(true)}
        onLogout={handleLogout}
      />

      <div className="layout-wrapper">
        {/* aside – menu lateral de filtros */}
        <Sidebar
          filtroAtivo={filtro}
          onFiltroChange={setFiltro}
          contadores={contadores}
        />

        {/* main – conteúdo principal da página */}
        <main className="conteudo">

          {/* section – painel de resumo (dashboard) */}
          <section aria-label="Painel de resumo">
            <Dashboard contadores={contadores} />
          </section>

          {/* section – lista de startups */}
          <section aria-label="Lista de startups">
            <p className="secao-label">
              {carregando ? "Carregando..." : `${startupsFiltradas.length} projeto${startupsFiltradas.length !== 1 ? "s" : ""}`}
            </p>

            {!carregando && startupsFiltradas.length === 0 ? (
              <div className="empty-state">Nenhuma startup nesta categoria.</div>
            ) : (
              <div className="cards-grid">
                {startupsFiltradas.map((startup) => (
                  <StartupCard
                    key={startup.id}
                    startup={startup}
                    onAvancarCiclo={handleAvancarCiclo}
                    onDesclassificar={handleDesclassificar}
                    onRegistrarRelatorio={handleRegistrarRelatorio}
                    onVerDetalhes={setModalStartup}
                  />
                ))}
              </div>
            )}
          </section>

          <Footer />
        </main>
      </div>

      {/* Modal de detalhes */}
      {modalStartup && (
        <Modal startup={modalStartup} onFechar={() => setModalStartup(null)} />
      )}

      {/* Modal de nova startup */}
      {modalNovaStartup && (
        <ModalNovaStartup
          onFechar={() => setModalNovaStartup(false)}
          onSalvar={handleNovaStartup}
        />
      )}
    </>
  );
}

export default App;