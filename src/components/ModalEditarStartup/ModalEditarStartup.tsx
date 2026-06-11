import { useEffect, useState } from "react";
import { IStartup, SetorStartup } from "../../types";

interface IPropsModalEditarStartup {
  startup: IStartup;
  onFechar: () => void;
  onSalvar: (startup: IStartup) => void;
}

const setores: SetorStartup[] = [
  "Tecnologia", "Saúde", "Educação", "Agronegócio", "Varejo", "Serviços", "Outro"
];

export function ModalEditarStartup({ startup, onFechar, onSalvar }: IPropsModalEditarStartup) {
  const [nomeProjeto, setNomeProjeto] = useState(startup.nomeProjeto);
  const [nomeFundador, setNomeFundador] = useState(startup.nomeFundador);
  const [setor, setSetor] = useState<SetorStartup>(startup.setor as SetorStartup);
  const [descricao, setDescricao] = useState(startup.descricao);
  const [dataEntrada, setDataEntrada] = useState(startup.dataEntrada);

  useEffect(() => {
    const fecharEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onFechar(); };
    document.addEventListener("keydown", fecharEsc);
    return () => document.removeEventListener("keydown", fecharEsc);
  }, [onFechar]);

  function handleSalvar(): void {
    if (!nomeProjeto.trim() || !nomeFundador.trim() || !descricao.trim() || !dataEntrada) return;

    onSalvar({
      ...startup,
      nomeProjeto,
      nomeFundador,
      setor,
      descricao,
      dataEntrada,
    });
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onFechar()}
    >
      <div className="modal-box" role="dialog" aria-modal="true">
        <div className="modal-header">
          <div className="modal-nome">Editar Startup</div>
          <button className="modal-fechar" onClick={onFechar}>✕</button>
        </div>

        <div className="modal-body">
          <div>
            <p className="detalhe-label">Nome do Projeto</p>
            <input
              className="modal-select"
              type="text"
              value={nomeProjeto}
              onChange={(e) => setNomeProjeto(e.target.value)}
            />
          </div>

          <div>
            <p className="detalhe-label">Nome do Fundador</p>
            <input
              className="modal-select"
              type="text"
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
            <p className="detalhe-label">Data de Entrada</p>
            <input
              className="modal-select"
              type="date"
              value={dataEntrada}
              onChange={(e) => setDataEntrada(e.target.value)}
            />
          </div>

          <div>
            <p className="detalhe-label">Descrição</p>
            <textarea
              className="modal-select"
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
            <button className="btn btn-azul" onClick={handleSalvar}>Salvar alterações</button>
          </div>
        </div>
      </div>
    </div>
  );
}