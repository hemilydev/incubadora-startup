import { IPropsStartupCard } from "../../types";

const nomeCiclo: Record<number, string> = {
  1: "Ciclo 1 – Ideação",
  2: "Ciclo 2 – Tração",
  3: "Ciclo 3 – Aceleração",
};

function formatarData(dataEntrada: string): string {
  if (!dataEntrada) return "—";
  const [ano, mes] = dataEntrada.split("-");
  const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  return `${meses[parseInt(mes) - 1]}/${ano}`;
}

export function StartupCard({
  startup,
  onAvancarCiclo,
  onVoltarCiclo,
  onDesclassificar,
  onReativar,
  onRegistrarRelatorio,
  onCancelarContrato,
  onEditar,
  onVerDetalhes,
}: IPropsStartupCard) {
  const desclassificada = startup.status === "Desclassificada";

  return (
    <article className={`startup-card ${desclassificada ? "desclassificada" : ""}`}>
      {/* Topo: nome + badge de ciclo */}
      <div className="card-topo">
        <div>
          <div className="card-nome">{startup.nomeProjeto}</div>
          <div className="card-fundador">{startup.nomeFundador}</div>
        </div>
        <span className={`badge-ciclo ${desclassificada ? "desclassificada" : ""}`}>
          {desclassificada ? "Desclassificada" : nomeCiclo[startup.ciclo]}
        </span>
      </div>

      {/* Chips de informação */}
      <div className="card-infos">
        <span className="info-chip">📅 {formatarData(startup.dataEntrada)}</span>
        <span className="info-chip">🏷️ {startup.setor}</span>
        <span className={`relatorio-chip ${startup.relatorioEnviado ? "enviado" : "pendente"}`}>
          {startup.relatorioEnviado ? "✓ Contrato assinado" : "⚠ Contrato pendente"}
        </span>
      </div>

      {/* Ações para startups ativas */}
      {!desclassificada && (
        <div className="card-acoes">
          <button className="btn btn-outline" onClick={() => onVerDetalhes(startup)}>
            Detalhes
          </button>

          <button className="btn btn-outline" onClick={() => onEditar(startup)}>
            ✏️ Editar
          </button>

          {startup.ciclo > 1 && (
            <button className="btn btn-outline" onClick={() => onVoltarCiclo(startup.id)}>
              ← Voltar ciclo
            </button>
          )}

          {startup.ciclo < 3 && (
            <button className="btn btn-azul" onClick={() => onAvancarCiclo(startup.id)}>
              Avançar ciclo →
            </button>
          )}

          {!startup.relatorioEnviado ? (
            <button className="btn btn-verde" onClick={() => onRegistrarRelatorio(startup.id)}>
              Registrar contrato
            </button>
          ) : (
            <button className="btn btn-outline" onClick={() => onCancelarContrato(startup.id)}>
              Cancelar contrato
            </button>
          )}

          <button className="btn btn-vermelho" onClick={() => onDesclassificar(startup.id)}>
            Desclassificar
          </button>
        </div>
      )}

      {/* Ações para startups desclassificadas */}
      {desclassificada && (
        <div className="card-acoes">
          <button className="btn btn-outline" onClick={() => onVerDetalhes(startup)}>
            Ver detalhes
          </button>
          <button className="btn btn-verde" onClick={() => onReativar(startup.id)}>
            Reativar startup
          </button>
        </div>
      )}
    </article>
  );
}