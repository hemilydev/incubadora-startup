import axios from 'axios';

/**
 * Instância do axios configurada para o back-end.
 * Toda requisição feita por este arquivo vai para http://localhost:8080
 */
const api = axios.create({
  baseURL: 'http://localhost:8080',
});

/**
 * Interceptor — adiciona o token JWT automaticamente em todas as requisições.
 * Assim não precisamos adicionar o token manualmente em cada chamada.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;