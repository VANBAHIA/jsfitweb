import api from './axiosConfig';

/**
 * Service para gerenciamento de Turmas
 * Endpoints: /api/turmas
 */
export const turmasService = {
  /**
   * Lista todas as turmas
   * @param {Object} params - Parâmetros de filtro (opcional)
   * @returns {Promise} Resposta da API com lista de turmas
   */
  listarTodos: async (params = {}) => {
    try {
      const response = await api.get('/turmas', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao listar turmas:', error);
      throw error;
    }
  },

  /**
   * Busca uma turma por ID
   * @param {String} id - ID da turma
   * @returns {Promise} Resposta da API com dados da turma
   */
  buscarPorId: async (id) => {
    try {
      if (!id) {
        throw new Error('ID da turma é obrigatório');
      }
      const response = await api.get(`/turmas/${id}`);
      return { data: response.data };
    } catch (error) {
      console.error(`❌ Erro ao buscar turma ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cria uma nova turma
   * @param {Object} dados - Dados da turma
   * @returns {Promise} Resposta da API com turma criada
   */
  criar: async (dados) => {
    try {
      console.log(dados);
      if (!dados.nome || !dados.nome.trim()) {
        throw new Error('Nome da turma é obrigatório');
      }
      if (!dados.sexo) {
        throw new Error('Sexo da turma é obrigatório');
      }

      const response = await api.post('/turmas', dados);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao criar turma:', error);
      throw error;
    }
  },

  /**
   * Atualiza uma turma existente
   * @param {String} id - ID da turma
   * @param {Object} dados - Dados atualizados
   * @returns {Promise} Resposta da API com turma atualizada
   */
  atualizar: async (id, dados) => {
    try {
      console.log(dados);
      if (!id) {
        throw new Error('ID da turma é obrigatório');
      }
      if (!dados.nome || !dados.nome.trim()) {
        throw new Error('Nome da turma é obrigatório');
      }

      const response = await api.put(`/turmas/${id}`, dados);
      return response.data;
    } catch (error) {
      console.error(`❌ Erro ao atualizar turma ${id}:`, error);
      throw error;
    }
  },

  /**
   * Exclui uma turma
   * @param {String} id - ID da turma
   * @returns {Promise} Resposta da API
   */
  excluir: async (id) => {
    try {
      if (!id) {
        throw new Error('ID da turma é obrigatório');
      }
      const response = await api.delete(`/turmas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Erro ao excluir turma ${id}:`, error);
      
      if (error.response?.status === 400) {
        throw new Error('Não é possível excluir esta turma pois possui alunos matriculados');
      }
      
      throw error;
    }
  },

  /**
   * Lista apenas turmas ativas
   * @returns {Promise} Resposta da API com lista de turmas ativas
   */
  listarAtivas: async () => {
    try {
      const response = await api.get('/turmas', { 
        params: { status: 'ATIVO' } 
      });
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao listar turmas ativas:', error);
      throw error;
    }
  },

  /**
   * Altera o status de uma turma
   * @param {String} id - ID da turma
   * @param {String} novoStatus - Novo status (ATIVO/INATIVO)
   * @returns {Promise} Resposta da API
   */
  alterarStatus: async (id, novoStatus) => {
    try {
      if (!id) {
        throw new Error('ID da turma é obrigatório');
      }
      if (!['ATIVO', 'INATIVO'].includes(novoStatus)) {
        throw new Error('Status deve ser ATIVO ou INATIVO');
      }

      const response = await api.patch(`/turmas/${id}/status`, { 
        status: novoStatus 
      });
      return response.data;
    } catch (error) {
      console.error(`❌ Erro ao alterar status da turma ${id}:`, error);
      throw error;
    }
  }
};