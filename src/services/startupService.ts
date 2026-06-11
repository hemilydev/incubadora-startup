import api from './api';

/**
 * Representa os dados de uma Startup vindos do back-end.
 */
export interface Startup {
  id?: number;
  nome: string;
  fundador: string;
  setor: string;
  ciclo: string;
  descricao: string;
  dataEntrada?: string;
  relatorioEnviado: boolean;
}

/**
 * Busca todas as startups do banco de dados.
 */
export async function listarStartups(): Promise<Startup[]> {
  const response = await api.get('/api/startups');
  return response.data;
}

/**
 * Cadastra uma nova startup.
 */
export async function cadastrarStartup(startup: Startup): Promise<Startup> {
  const response = await api.post('/api/startups', startup);
  return response.data;
}

/**
 * Atualiza os dados de uma startup existente.
 */
export async function atualizarStartup(id: number, startup: Startup): Promise<Startup> {
  const response = await api.put(`/api/startups/${id}`, startup);
  return response.data;
}

/**
 * Remove uma startup pelo ID.
 */
export async function deletarStartup(id: number): Promise<void> {
  await api.delete(`/api/startups/${id}`);
}

/**
 * Avança a startup para o próximo ciclo.
 */
export async function avancarCiclo(id: number): Promise<Startup> {
  const response = await api.patch(`/api/startups/${id}/avancar`);
  return response.data;
}

/**
 * Desclassifica uma startup.
 */
export async function desclassificarStartup(id: number): Promise<Startup> {
  const response = await api.patch(`/api/startups/${id}/desclassificar`);
  return response.data;
}

/**
 * Registra o relatório de uma startup como enviado.
 */
export async function registrarRelatorio(id: number): Promise<Startup> {
  const response = await api.patch(`/api/startups/${id}/relatorio`);
  return response.data;
}