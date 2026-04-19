import { IPropsNavbar } from "../../types";

interface IPropsNavbarExtendida extends IPropsNavbar {
  onNovaStartup: () => void;
}

export function Navbar({ titulo, onNovaStartup }: IPropsNavbarExtendida) {
  return (
    <header className="navbar-dap">
      <div className="navbar-logo">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkRVMomPkeIgA91lzdGj3seRr3wgUC-ARCSw&s"
          alt="Logo Incubadora"
          style={{ height: 36, width: "auto" }}
        />
        <div>
          <div className="navbar-titulo">{titulo}</div>
          <div className="navbar-subtitulo">PUC Goiás</div>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-nova-startup" onClick={onNovaStartup}>
          + Nova Startup
        </button>
        <span className="navbar-badge d-none d-sm-inline">Painel Administrativo</span>
      </div>
    </header>
  );
}
