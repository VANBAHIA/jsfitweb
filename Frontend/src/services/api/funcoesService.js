import api from './axiosConfig';

export const funcoesService = {
  /**
   * Lista todas as funções
   * @param {Object} params - Parâmetros de filtro (opcional)
   * @returns {Promise} Resposta da API com lista de funções
   */
  listarTodos: async (params = {}) => {
    try {
      const response = await api.get('/funcoes', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao listar funções:', error);
      throw error;
    }
  },

  /**
   * Busca uma função por ID
   * @param {String} id - ID da função
   * @returns {Promise} Resposta da API com dados da função
   */
  buscarPorId: async (id) => {
    try {
      const response = await api.get(`/funcoes/${id}`);
      return { data: response.data };
    } catch (error) {
      console.error(`❌ Erro ao buscar função ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cria uma nova função
   * @param {Object} dados - Dados da função { funcao, status }
   * @returns {Promise} Resposta da API com função criada
   */
  criar: async (dados) => {
    console.log(dados)
    try {
      const response = await api.post('/funcoes', dados);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao criar função:', error);
      throw error;
    }
  },

  /**
   * Atualiza uma função existente
   * @param {String} id - ID da função
   * @param {Object} dados - Dados atualizados { funcao, status }
   * @returns {Promise} Resposta da API com função atualizada
   */
  atualizar: async (id, dados) => {
    
    try {
      const response = await api.put(`/funcoes/${id}`, dados);
      
      return response.data;
    } catch (error) {
      console.error(`❌ Erro ao atualizar função ${id}:`, error);
      throw error;
    }
  },

  /**
   * Exclui uma função
   * @param {String} id - ID da função
   * @returns {Promise} Resposta da API
   */
  excluir: async (id) => {
    try {
      const response = await api.delete(`/funcoes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Erro ao excluir função ${id}:`, error);
      throw error;
    }
  }
};