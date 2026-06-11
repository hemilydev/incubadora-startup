import api from './api';

/**
 * Realiza o login do usuário.
 * Envia email e senha para o back-end e salva o token no localStorage.
 */
export async function login(email: string, senha: string) {
  const response = await api.post('/api/auth/login', { email, senha });
  
  // Salva o token e o nome do usuário no localStorage
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('nome', response.data.nome);
  
  return response.data;
}

/**
 * Realiza o logout do usuário.
 * Remove o token e o nome do localStorage.
 */
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('nome');
}

/**
 * Verifica se o usuário está autenticado.
 * Retorna true se houver token salvo no localStorage.
 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
}