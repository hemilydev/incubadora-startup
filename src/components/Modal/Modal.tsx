import { useEffect } from "react";
import { IPropsModal } from "../../types";

const nomeCiclo: Record<number, string> = {
  1: "Ciclo 1 – Pré-incubação (Ideação)",
  2: "Ciclo 2 – Incubação (Tração)",
  3: "Ciclo 3 – Pós-incubação (Aceleração)",
};

function formatarData(dataEntrada: string): string {
  const [ano, mes] = dataEntrada.split("-");
  const meses = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho",
                 "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  return `${meses[parseInt(mes) - 1]} de ${ano}`;
}

export function Modal({ startup, onFechar }: IPropsModal) {
  useEffect(() => {
    const fecharEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onFechar(); };
    document.addEventListener("keydown", fecharEsc);
    return () => document.removeEventListener("keydown", fecharEsc);
  }, [onFechar]);

  if (!startup) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onFechar()}
    >
      <div className="modal-box" role="dialog" aria-modal="true" aria-label="Detalhes da startup">
        <div className="modal-header">
          <div>
            <div className="modal-nome">{startup.nomeProjeto}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--cinza-fraco)", marginTop: 2 }}>
              {startup.status === "Desclassificada" ? "⛔ Desclassificada" : nomeCiclo[startup.ciclo]}
            </div>
          </div>
          <button className="modal-fechar" onClick={onFechar} aria-label="Fechar">✕</button>
        </div>

        <div className="modal-body">
          <div className="modal-descricao">
            {startup.descricao}
          </div>

          <div className="row g-3">
            <div className="col-6">
              <p className="detalhe-label">Fundador</p>
              <p className="detalhe-valor">{startup.nomeFundador}</p>
            </div>
            <div className="col-6">
              <p className="detalhe-label">Setor</p>
              <p className="detalhe-valor">{startup.setor}</p>
            </div>
            <div className="col-6">
              <p className="detalhe-label">Entrada na incubadora</p>
              <p className="detalhe-valor">{formatarData(startup.dataEntrada)}</p>
            </div>
            <div className="col-6">
              <p className="detalhe-label">Relatório</p>
              <p className="detalhe-valor">
                {startup.relatorioEnviado
                  ? <span style={{ color: "var(--verde)", fontWeight: 600 }}>✓ Enviado</span>
                  : <span style={{ color: "#B25A00", fontWeight: 600 }}>⚠ Pendente</span>
                }
              </p>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <button className="btn btn-outline" onClick={onFechar}>Fechar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
