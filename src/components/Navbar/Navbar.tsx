import { IPropsNavbar } from "../../types";

export function Navbar({ titulo }: IPropsNavbar) {
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
      <span className="navbar-badge">Painel Administrativo</span>
    </header>
  );
}
