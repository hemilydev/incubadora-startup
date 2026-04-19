import { useEffect, useState } from "react";
import { IStartup, SetorStartup } from "../../types";

interface IPropsModalNovaStartup {
  onFechar: () => void;
  onSalvar: (novaStartup: IStartup) => void;
}

const setores: SetorStartup[] = [
  "Tecnologia", "Saúde", "Educação", "Agronegócio", "Varejo", "Serviços", "Outro"
];

export function ModalNovaStartup({ onFechar, onSalvar }: IPropsModalNovaStartup) {
  const [nomeProjeto, setNomeProjeto] = useState("");
  const [nomeFundador, setNomeFundador] = useState("");
  const [setor, setSetor] = useState<SetorStartup>("Tecnologia");
  const [descricao, setDescricao] = useState("");
  const [ciclo, setCiclo] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    const fecharEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onFechar(); };
    document.addEventListener("keydown", fecharEsc);
    return () => document.removeEventListener("keydown", fecharEsc);
  }, [onFechar]);

  function handleSalvar(): void {
    if (!nomeProjeto.trim() || !nomeFundador.trim() || !descricao.trim()) return;

    const novaStartup: IStartup = {
      id: Date.now(),
      nomeProjeto,
      nomeFundador,
      setor,
      ciclo: ciclo,
      status: "Ativa",
      dataEntrada: new Date().toISOString().slice(0, 7),
      relatorioEnviado: false,
      descricao,
    };

    onSalvar(novaStartup);
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onFechar()}
    >
      <div className="modal-box" role="dialog" aria-modal="true">
        <div className="modal-header">
          <div className="modal-nome">Nova Startup</div>
          <button className="modal-fechar" onClick={onFechar}>✕</button>
        </div>

        <div className="modal-body">
          <div>
            <p className="detalhe-label">Nome do Projeto</p>
            <input
              className="modal-select"
              type="text"
              placeholder="Ex: MedFácil"
              value={nomeProjeto}
              onChange={(e) => setNomeProjeto(e.target.value)}
            />
          </div>

          <div>
            <p className="detalhe-label">Nome do Fundador</p>
            <input
              className="modal-select"
              type="text"
              placeholder="Ex: Ana Paula Ribeiro"
              value={nomeFundador}
              onChange={(e) => setNomeFundador(e.target.value)}
            />
          </div>

          <div>
            <p className="detalhe-label">Setor</p>
            <select
              className="modal-select"
              value={setor}
              onChange={(e) => setSetor(e.target.value as SetorStartup)}
            >
              {setores.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <p className="detalhe-label">Ciclo de Entrada</p>
            <select
              className="modal-select"
              value={ciclo}
              onChange={(e) => setCiclo(Number(e.target.value) as 1 | 2 | 3)}
            >
              <option value={1}>Ciclo 1 – Pré-incubação (Ideação)</option>
              <option value={2}>Ciclo 2 – Incubação (Tração)</option>
              <option value={3}>Ciclo 3 – Pós-incubação (Aceleração)</option>
            </select>
          </div>

          <div>
            <p className="detalhe-label">Descrição</p>
            <textarea
              className="modal-select"
              placeholder="Descreva brevemente o projeto..."
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              style={{ resize: "none" }}
            />
          </div>

          <p style={{ fontSize: "0.75rem", color: "var(--cinza-fraco)" }}>
            * Todos os campos são obrigatórios.
          </p>

          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-outline" onClick={onFechar}>Cancelar</button>
            <button className="btn btn-azul" onClick={handleSalvar}>Salvar</button>
          </div>
        </div>
      </div>
    </div>
  );
}