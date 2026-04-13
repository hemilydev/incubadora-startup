// Ciclos da incubadora DAP/PUC Goiás
export type CicloStartup = 1 | 2 | 3;

export type StatusStartup = "Ativa" | "Desclassificada";

export type SetorStartup =
  | "Tecnologia"
  | "Saúde"
  | "Educação"
  | "Agronegócio"
  | "Varejo"
  | "Serviços"
  | "Outro";

// Interface principal da startup
export interface IStartup {
  id: number;
  nomeProjeto: string;
  nomeFundador: string;
  setor: SetorStartup;
  ciclo: CicloStartup;
  status: StatusStartup;
  dataEntrada: string; // formato: "AAAA-MM"
  relatorioEnviado: boolean;
  descricao: string;
}

// Interface para os contadores do dashboard
export interface IContadores {
  totalAtivas: number;
  ciclo1: number;
  ciclo2: number;
  ciclo3: number;
  desclassificadas: number;
  relatoriosPendentes: number;
}

// Props dos componentes
export interface IPropsNavbar {
  titulo: string;
}

export interface IPropsDashboard {
  contadores: IContadores;
}

export interface IPropsStartupCard {
  startup: IStartup;
  onAvancarCiclo: (id: number) => void;
  onDesclassificar: (id: number) => void;
  onRegistrarRelatorio: (id: number) => void;
  onVerDetalhes: (startup: IStartup) => void;
}

export interface IPropsSidebar {
  filtroAtivo: CicloStartup | "Todas" | "Desclassificadas";
  onFiltroChange: (filtro: CicloStartup | "Todas" | "Desclassificadas") => void;
}

export interface IPropsModal {
  startup: IStartup | null;
  onFechar: () => void;
}
