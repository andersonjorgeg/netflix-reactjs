/**
 * Funções utilitárias para trabalhar com a API do TMDB
 */

// Configuração da API
export const API_CONFIG = {
  API_KEY: process.env.REACT_APP_TMDB_API_KEY,
  BASE_URL: process.env.REACT_APP_TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: process.env.REACT_APP_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p',
  DEFAULT_LANGUAGE: 'pt-BR'
};

/**
 * Constrói uma URL para requisições à API do TMDB
 * @param {string} endpoint - Endpoint da API (ex: '/movie/popular')
 * @param {Object} params - Parâmetros adicionais de consulta
 * @returns {string} - URL completa da API
 */
export const getApiUrl = (endpoint, params = {}) => {
  const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`);
  
  // Adiciona a chave da API
  url.searchParams.append('api_key', API_CONFIG.API_KEY);
  
  // Adiciona o idioma se não especificado
  if (!params.language) {
    url.searchParams.append('language', API_CONFIG.DEFAULT_LANGUAGE);
  }
  
  // Adiciona todos os outros parâmetros
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  
  return url.toString();
};

/**
 * Constrói uma URL para imagens do TMDB
 * @param {string} path - Caminho da imagem da API
 * @param {string} size - Tamanho da imagem (w92, w154, w185, w342, w500, w780, original)
 * @returns {string} - URL completa da imagem
 */
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `${API_CONFIG.IMAGE_BASE_URL}/${size}${path}`;
};