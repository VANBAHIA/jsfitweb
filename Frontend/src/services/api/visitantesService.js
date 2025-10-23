// src/services/api/visitantesService.js

import api from './axiosConfig';

export const visitantesService = {
  /**
   * Listar todos os visitantes com filtros
   */
  listarTodos: async (params = {}) => {
    const response = await api.get('/visitantes', { params });
    return response.data;
  },

  /**
   * Buscar visitante por ID
   */
  buscarPorId: async (id) => {
    const response = await api.get(`/visitantes/${id}`);
    return { data: response.data };
  },

  /**
   * Criar novo visitante
   */
  criar: async (dados) => {
  console.log(dados);
    const response = await api.post('/visitantes', dados);
    return response.data;
  },

  /**
   * Atualizar visitante
   */
  atualizar: async (id, dados) => {
    const response = await api.put(`/visitantes/${id}`, dados);
    return response.data;
  },

  /**
   * Excluir visitante
   */
  excluir: async (id) => {
    const response = await api.delete(`/visitantes/${id}`);
    return response.data;
  },

  /**
   * Relatório de visitantes por período
   */
  relatorioPorPeriodo: async (dataInicio, dataFim) => {
    const response = await api.get('/visitantes/relatorio/por-periodo', {
      params: { dataInicio, dataFim }
    });
    return response.data;
  }
};