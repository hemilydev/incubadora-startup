import { useState, useMemo, useEffect, useCallback } from "react";
import { Navbar }      from "./components/Navbar/Navbar";
import { Sidebar }     from "./components/Sidebar/Sidebar";
import { Dashboard }   from "./components/Dashboard/Dashboard";
import { StartupCard } from "./components/StartupCard/StartupCard";
import { Modal }       from "./components/Modal/Modal";
import { ModalEditarStartup } from "./components/ModalEditarStartup/ModalEditarStartup";
import { Footer }      from "./components/Footer/Footer";
import { IStartup, IContadores, CicloStartup } from "./types";
import { ModalNovaStartup } from "./components/ModalNovaStartup/ModalNovaStartup";
import Login from "./components/Login";
import { isAuthenticated, logout } from "./services/authService";
import {
  listarStartups,
  cadastrarStartup,
  atualizarStartup,
  avancarCiclo,
  voltarCiclo,
  desclassificarStartup,
  reativarStartup,
  registrarRelatorio,
  cancelarContrato,
  Startup as StartupAPI,
} from "./services/startupService";
import "./styles/global.css";

type FiltroAtivo = CicloStartup | "Todas" | "Desclassificadas";

/**
 * Converte o formato do back-end para o formato usado pelo front-end.
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
  const [autenticado, setAutenticado] = useState<boolean>(isAuthenticated());
  const [startups, setStartups] = useState<IStartup[]>([]);
  const [filtro, setFiltro] = useState<FiltroAtivo>("Todas");
  const [modalStartup, setModalStartup] = useState<IStartup | null>(null);
  const [modalNovaStartup, setModalNovaStartup] = useState<boolean>(false);
  const [modalEditarStartup, setModalEditarStartup] = useState<IStartup | null>(null);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [pesquisa, setPesquisa] = useState<string>("");

  /**
   * Carrega as startups do back-end.
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

  useEffect(() => {
    if (autenticado) carregarStartups();
  }, [autenticado, carregarStartups]);

  /** Avança a startup para o próximo ciclo com confirmação. */
  async function handleAvancarCiclo(id: number): Promise<void> {
    const startup = startups.find(s => s.id === id);
    if (!window.confirm(`Deseja avançar o ciclo de "${startup?.nomeProjeto}"?`)) return;
    try {
      await avancarCiclo(id);
      await carregarStartups();
    } catch (err) {
      console.error("Erro ao avançar ciclo:", err);
    }
  }

  /** Volta a startup para o ciclo anterior com confirmação. */
  async function handleVoltarCiclo(id: number): Promise<void> {
    const startup = startups.find(s => s.id === id);
    if (!window.confirm(`Deseja voltar o ciclo de "${startup?.nomeProjeto}"?`)) return;
    try {
      await voltarCiclo(id);
      await carregarStartups();
    } catch (err) {
      console.error("Erro ao voltar ciclo:", err);
    }
  }

  /** Desclassifica uma startup com confirmação. */
  async function handleDesclassificar(id: number): Promise<void> {
    const startup = startups.find(s => s.id === id);
    if (!window.confirm(`Deseja desclassificar "${startup?.nomeProjeto}"? Ela poderá ser reativada depois.`)) return;
    try {
      await desclassificarStartup(id);
      await carregarStartups();
    } catch (err) {
      console.error("Erro ao desclassificar:", err);
    }
  }

  /** Reativa uma startup desclassificada com confirmação. */
  async function handleReativar(id: number): Promise<void> {
    const startup = startups.find(s => s.id === id);
    if (!window.confirm(`Deseja reativar "${startup?.nomeProjeto}"? Ela voltará para o Ciclo 1.`)) return;
    try {
      await reativarStartup(id);
      await carregarStartups();
    } catch (err) {
      console.error("Erro ao reativar startup:", err);
    }
  }

  /** Registra o relatório como enviado. */
  async function handleRegistrarRelatorio(id: number): Promise<void> {
    try {
      await registrarRelatorio(id);
      await carregarStartups();
    } catch (err) {
      console.error("Erro ao registrar relatório:", err);
    }
  }

  /** Cancela o contrato de uma startup. */
  async function handleCancelarContrato(id: number): Promise<void> {
    const startup = startups.find(s => s.id === id);
    if (!window.confirm(`Deseja cancelar o contrato de "${startup?.nomeProjeto}"?`)) return;
    try {
      await cancelarContrato(id);
      await carregarStartups();
    } catch (err) {
      console.error("Erro ao cancelar contrato:", err);
    }
  }

  /** Cadastra uma nova startup. */
  async function handleNovaStartup(novaStartup: IStartup): Promise<void> {
    try {
      await cadastrarStartup(converterParaStartupAPI(novaStartup));
      await carregarStartups();
      setModalNovaStartup(false);
    } catch (err) {
      console.error("Erro ao cadastrar startup:", err);
    }
  }

  /** Atualiza os dados de uma startup existente. */
  async function handleEditarStartup(startupEditada: IStartup): Promise<void> {
    try {
      await atualizarStartup(startupEditada.id, converterParaStartupAPI(startupEditada));
      await carregarStartups();
      setModalEditarStartup(null);
    } catch (err) {
      console.error("Erro ao editar startup:", err);
    }
  }

  /** Faz logout do usuário. */
  function handleLogout(): void {
    logout();
    setAutenticado(false);
    setStartups([]);
  }

  // Contadores
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

  // Lista filtrada por ciclo e pesquisa
  const startupsFiltradas = useMemo<IStartup[]>(() => {
    let lista: IStartup[];
    if (filtro === "Todas")            lista = startups.filter((s) => s.status === "Ativa");
    else if (filtro === "Desclassificadas") lista = startups.filter((s) => s.status === "Desclassificada");
    else lista = startups.filter((s) => s.status === "Ativa" && s.ciclo === filtro);

    if (pesquisa.trim()) {
      const termo = pesquisa.toLowerCase();
      lista = lista.filter(
        (s) =>
          s.nomeProjeto.toLowerCase().includes(termo) ||
          s.nomeFundador.toLowerCase().includes(termo)
      );
    }

    return lista;
  }, [startups, filtro, pesquisa]);

  if (!autenticado) {
    return <Login onLoginSuccess={() => setAutenticado(true)} />;
  }

  return (
    <>
      <Navbar
        titulo="Incubadora de Empresas"
        onNovaStartup={() => setModalNovaStartup(true)}
        onLogout={handleLogout}
        pesquisa={pesquisa}
        onPesquisaChange={setPesquisa}
      />

      <div className="layout-wrapper">
        <Sidebar
          filtroAtivo={filtro}
          onFiltroChange={setFiltro}
          contadores={contadores}
        />

        <main className="conteudo">
          <section aria-label="Painel de resumo">
            <Dashboard contadores={contadores} />
          </section>

          <section aria-label="Lista de startups">

            <p className="secao-label">
              {carregando ? "Carregando..." : `${startupsFiltradas.length} projeto${startupsFiltradas.length !== 1 ? "s" : ""}`}
            </p>

            {!carregando && startupsFiltradas.length === 0 ? (
              <div className="empty-state">
                {pesquisa ? "Nenhuma startup encontrada para essa pesquisa." : "Nenhuma startup nesta categoria."}
              </div>
            ) : (
              <div className="cards-grid">
                {startupsFiltradas.map((startup) => (
                  <StartupCard
                    key={startup.id}
                    startup={startup}
                    onAvancarCiclo={handleAvancarCiclo}
                    onVoltarCiclo={handleVoltarCiclo}
                    onDesclassificar={handleDesclassificar}
                    onReativar={handleReativar}
                    onRegistrarRelatorio={handleRegistrarRelatorio}
                    onCancelarContrato={handleCancelarContrato}
                    onVerDetalhes={setModalStartup}
                    onEditar={setModalEditarStartup}
                  />
                ))}
              </div>
            )}
          </section>

          <Footer />
        </main>
      </div>

      {modalStartup && (
        <Modal startup={modalStartup} onFechar={() => setModalStartup(null)} />
      )}

      {modalNovaStartup && (
        <ModalNovaStartup
          onFechar={() => setModalNovaStartup(false)}
          onSalvar={handleNovaStartup}
        />
      )}

      {modalEditarStartup && (
        <ModalEditarStartup
          startup={modalEditarStartup}
          onFechar={() => setModalEditarStartup(null)}
          onSalvar={handleEditarStartup}
        />
      )}
    </>
  );
}

export default App;