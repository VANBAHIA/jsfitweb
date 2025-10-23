// src/services/api/exerciciosService.js

import api from './axiosConfig';

export const exerciciosService = {
  /**
   * Lista todos os exercícios com paginação e filtros
   */
  async listarTodos(params = {}) {
    const { page = 1, limit = 50, busca = '', grupoId = '' } = params;
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(busca && { busca }),
      ...(grupoId && { grupoId })
    });

    return await api.get(`/exercicios?${queryParams}`);
  },

  /**
   * Busca um exercício por ID
   */
  async buscarPorId(id) {
    return await api.get(`/exercicios/${id}`);
  },

  /**
   * Cria um novo exercício
   */
  async criar(dados) {
    return await api.post('/exercicios', dados);
  },

  /**
   * Atualiza um exercício existente
   */
  async atualizar(id, dados) {
    return await api.put(`/exercicios/${id}`, dados);
  },

  /**
   * Exclui um exercício
   */
  async excluir(id) {
    return await api.delete(`/exercicios/${id}`);
  },

  /**
   * Upload de imagem do exercício
   */
 async uploadImagem(id, formData) {
  console.log('🚀 Service: enviando upload para exercício', id);
  
  // Agora o interceptor vai remover o Content-Type automaticamente
  return await api.post(`/exercicios/${id}/imagem`, formData);
}
};

export default exerciciosService;