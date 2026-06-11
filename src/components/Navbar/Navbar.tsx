import { IPropsNavbar } from "../../types";

interface IPropsNavbarExtendida extends IPropsNavbar {
  onNovaStartup: () => void;
  onLogout: () => void;
}

export function Navbar({ titulo, onNovaStartup, onLogout }: IPropsNavbarExtendida) {
  // Pega o nome do usuário salvo no localStorage após o login
  const nome = localStorage.getItem("nome") ?? "Usuário";

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

        {/* Nome do usuário logado */}
        <span className="navbar-badge d-none d-sm-inline">
          👤 {nome}
        </span>

        {/* Botão de logout */}
        <button
          onClick={onLogout}
          style={{
            background: 'transparent',
            border: '1.5px solid rgba(255,255,255,0.5)',
            color: '#fff',
            borderRadius: '8px',
            padding: '6px 14px',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          Sair
        </button>
      </div>
    </header>
  );
}