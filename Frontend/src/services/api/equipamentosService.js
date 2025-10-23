// src/services/api/equipamentosService.js

import api from './axiosConfig';

export const equipamentosService = {
  /**
   * Lista todos os equipamentos com paginação e filtros
   */
  async listarTodos(params = {}) {
    const { page = 1, limit = 10, busca = '' } = params;
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(busca && { busca })
    });

    return await api.get(`/equipamentos?${queryParams}`);
  },

  /**
   * Busca um equipamento por ID
   */
  async buscarPorId(id) {
    return await api.get(`/equipamentos/${id}`);
  },

  /**
   * Busca um equipamento por código
   */
  async buscarPorCodigo(codigo) {
    return await api.get(`/equipamentos/codigo/${codigo}`);
  },

  /**
   * Cria um novo equipamento
   */
  async criar(dados) {
    return await api.post('/equipamentos', dados);
  },

  /**
   * Atualiza um equipamento existente
   */
  async atualizar(id, dados) {
    return await api.put(`/equipamentos/${id}`, dados);
  },

  /**
   * Exclui um equipamento
   */
  async excluir(id) {
    return await api.delete(`/equipamentos/${id}`);
  }
};

export default equipamentosService;