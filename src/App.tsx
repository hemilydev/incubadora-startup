import { useState, useMemo } from "react";
import { Navbar }      from "./components/Navbar/Navbar";
import { Sidebar }     from "./components/Sidebar/Sidebar";
import { Dashboard }   from "./components/Dashboard/Dashboard";
import { StartupCard } from "./components/StartupCard/StartupCard";
import { Modal }       from "./components/Modal/Modal";
import { Footer }      from "./components/Footer/Footer";
import { startupsIniciais } from "./data/startups";
import { IStartup, IContadores, CicloStartup } from "./types";
import "./styles/global.css";

type FiltroAtivo = CicloStartup | "Todas" | "Desclassificadas";

function App() {
  const [startups, setStartups] = useState<IStartup[]>(startupsIniciais);
  const [filtro, setFiltro] = useState<FiltroAtivo>("Todas");
  const [modalStartup, setModalStartup] = useState<IStartup | null>(null);

  // Avança a startup para o próximo ciclo
  function handleAvancarCiclo(id: number): void {
    setStartups((prev) =>
      prev.map((s) =>
        s.id === id && s.ciclo < 3
          ? { ...s, ciclo: (s.ciclo + 1) as CicloStartup }
          : s
      )
    );
  }

  // Marca a startup como desclassificada
  function handleDesclassificar(id: number): void {
    setStartups((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: "Desclassificada" } : s
      )
    );
  }

  // Registra o envio de relatório
  function handleRegistrarRelatorio(id: number): void {
    setStartups((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, relatorioEnviado: true } : s
      )
    );
  }

  // Contadores derivados do estado atual (atualizam automaticamente)
  const contadores = useMemo<IContadores>(() => {
    const ativas = startups.filter((s) => s.status === "Ativa");
    return {
      totalAtivas:        ativas.length,
      ciclo1:             ativas.filter((s) => s.ciclo === 1).length,
      ciclo2:             ativas.filter((s) => s.ciclo === 2).length,
      ciclo3:             ativas.filter((s) => s.ciclo === 3).length,
      desclassificadas:   startups.filter((s) => s.status === "Desclassificada").length,
      relatoriosPendentes: ativas.filter((s) => !s.relatorioEnviado).length,
    };
  }, [startups]);

  // Lista filtrada pelo menu lateral
  const startupsFiltradas = useMemo<IStartup[]>(() => {
    if (filtro === "Todas")            return startups.filter((s) => s.status === "Ativa");
    if (filtro === "Desclassificadas") return startups.filter((s) => s.status === "Desclassificada");
    return startups.filter((s) => s.status === "Ativa" && s.ciclo === filtro);
  }, [startups, filtro]);

  return (
    <>
      {/* header – barra de navegação superior */}
      <Navbar titulo="Incubadora de Empresas" />

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
              {startupsFiltradas.length} projeto{startupsFiltradas.length !== 1 ? "s" : ""}
            </p>

            {startupsFiltradas.length === 0 ? (
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

          {/* address fica dentro do footer, no componente Footer */}
          <Footer />
        </main>
      </div>

      {/* Modal de detalhes */}
      {modalStartup && (
        <Modal startup={modalStartup} onFechar={() => setModalStartup(null)} />
      )}
    </>
  );
}

export default App;