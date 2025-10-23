// src/services/api/gruposExercicioService.js

import api from './axiosConfig';

export const gruposExercicioService = {
  /**
   * Lista todos os grupos de exercício com paginação e filtros
   */
  async listarTodos(params = {}) {
    const { page = 1, limit = 50, busca = '' } = params;
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(busca && { busca })
    });

    return await api.get(`/gruposexercicio?${queryParams}`);
  },

  /**
   * Busca um grupo de exercício por ID
   */
  async buscarPorId(id) {
    return await api.get(`/gruposexercicio/${id}`);
  },

  /**
   * Cria um novo grupo de exercício
   */
  async criar(dados) {
    return await api.post('/gruposexercicio', dados);
  },

  /**
   * Atualiza um grupo de exercício existente
   */
  async atualizar(id, dados) {
    return await api.put(`/gruposexercicio/${id}`, dados);
  },

  /**
   * Exclui um grupo de exercício
   */
  async excluir(id) {
    return await api.delete(`/gruposexercicio/${id}`);
  }
};

export default gruposExercicioService;