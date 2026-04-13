import { IPropsDashboard } from "../../types";

export function Dashboard({ contadores }: IPropsDashboard) {
  return (
    <section className="dashboard-section">
      <p className="dashboard-titulo">Resumo Geral</p>
      <div className="contadores-grid">
        <div className="contador-card cor-azul">
          <div className="contador-numero">{contadores.totalAtivas}</div>
          <div className="contador-label">Startups Ativas</div>
        </div>
        <div className="contador-card cor-preto">
          <div className="contador-numero">{contadores.ciclo1}</div>
          <div className="contador-label">Ciclo 1 – Ideação</div>
        </div>
        <div className="contador-card cor-preto">
          <div className="contador-numero">{contadores.ciclo2}</div>
          <div className="contador-label">Ciclo 2 – Tração</div>
        </div>
        <div className="contador-card cor-preto">
          <div className="contador-numero">{contadores.ciclo3}</div>
          <div className="contador-label">Ciclo 3 – Aceleração</div>
        </div>
        <div className="contador-card cor-vermelho">
          <div className="contador-numero">{contadores.desclassificadas}</div>
          <div className="contador-label">Desclassificadas</div>
        </div>
        <div className="contador-card cor-laranja">
          <div className="contador-numero">{contadores.relatoriosPendentes}</div>
          <div className="contador-label">Relatório Pendente</div>
        </div>
      </div>
    </section>
  );
}
