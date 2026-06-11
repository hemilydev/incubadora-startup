import { IPropsSidebar, IContadores, CicloStartup } from "../../types";

interface IPropsSidebarExtendida extends IPropsSidebar {
  contadores: IContadores;
}

type FiltroOpcao = CicloStartup | "Todas" | "Desclassificadas";

interface IOpcao {
  valor: FiltroOpcao;
  label: string;
  count: number;
}

export function Sidebar({ filtroAtivo, onFiltroChange, contadores }: IPropsSidebarExtendida) {
  const opcoes: IOpcao[] = [
    { valor: "Todas",           label: "Todas Ativas",      count: contadores.totalAtivas },
    { valor: 1,                 label: "Ciclo 1 – Ideação", count: contadores.ciclo1 },
    { valor: 2,                 label: "Ciclo 2 – Tração",  count: contadores.ciclo2 },
    { valor: 3,                 label: "Ciclo 3 – Aceleração", count: contadores.ciclo3 },
    { valor: "Desclassificadas", label: "Desclassificadas", count: contadores.desclassificadas },
  ];

  return (
    <aside className="sidebar">
      <p className="sidebar-titulo">Filtrar por</p>
      {opcoes.map((opcao) => (
        <button
          key={String(opcao.valor)}
          className={`sidebar-btn ${filtroAtivo === opcao.valor ? "ativo" : ""}`}
          onClick={() => onFiltroChange(opcao.valor)}
        >
          {opcao.label}
          <span className="count">{opcao.count}</span>
        </button>
      ))}
    </aside>
  );
}