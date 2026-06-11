import { IPropsNavbar } from "../../types";

interface IPropsNavbarExtendida extends IPropsNavbar {
  onNovaStartup: () => void;
  onLogout: () => void;
  pesquisa: string;
  onPesquisaChange: (valor: string) => void;
}

export function Navbar({ titulo, onNovaStartup, onLogout, pesquisa, onPesquisaChange }: IPropsNavbarExtendida) {
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

      {/* Barra de pesquisa centralizada */}
      <div style={{ flex: 1, maxWidth: "400px", margin: "0 24px" }}>
        <input
          type="text"
          placeholder="🔍 Pesquisar projeto ou fundador..."
          value={pesquisa}
          onChange={(e) => onPesquisaChange(e.target.value)}
          onFocus={(e) => e.target.style.background = "rgba(255,255,255,0.3)"}
          onBlur={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
          style={{
            width: "100%",
            padding: "8px 14px",
            borderRadius: "8px",
            border: "1.5px solid rgba(255,255,255,0.8)",
            background: "rgba(255,255,255,0.2)",
            color: "#fff",
            fontSize: "13px",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-nova-startup" onClick={onNovaStartup}>
          + Nova Startup
        </button>
        <span className="navbar-badge d-none d-sm-inline">
          👤 {nome}
        </span>
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