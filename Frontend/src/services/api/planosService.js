import api from './axiosConfig';

/**
 * Service para gerenciamento de Planos
 * Endpoints: /api/planos
 */
export const planosService = {
  /**
   * Lista todos os planos
   * @param {Object} params - Parâmetros de filtro (opcional)
   * @param {String} params.status - Filtrar por status (ATIVO/INATIVO)
   * @param {String} params.busca - Buscar por nome ou código
   * @returns {Promise} Resposta da API com lista de planos
   */
  listarTodos: async (params = {}) => {
    try {
      const response = await api.get('/planos', { params });
      return { data: response.data };
    } catch (error) {
      console.error('❌ Erro ao listar planos:', error);
      throw error;
    }
  },

  /**
   * Busca um plano por ID
   * @param {String} id - ID do plano (MongoDB ObjectId)
   * @returns {Promise} Resposta da API com dados do plano
   */
  buscarPorId: async (id) => {
    try {
      if (!id) {
        throw new Error('ID do plano é obrigatório');
      }
      const response = await api.get(`/planos/${id}`);
      return { data: response.data };
    } catch (error) {
      console.error(`❌ Erro ao buscar plano ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cria um novo plano
   * @param {Object} dados - Dados do plano
   * @returns {Promise} Resposta da API com plano criado
   */
  criar: async (dados) => {
    try {
      // Validações básicas
      if (!dados.nome || !dados.nome.trim()) {
        throw new Error('Nome do plano é obrigatório');
      }
      if (!dados.periodicidade) {
        throw new Error('Periodicidade é obrigatória');
      }
      if (!dados.valorMensalidade || dados.valorMensalidade <= 0) {
        throw new Error('Valor da mensalidade é obrigatório e deve ser maior que zero');
      }

      const response = await api.post('/planos', dados);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao criar plano:', error);
      throw error;
    }
  },

  /**
   * Atualiza um plano existente
   * @param {String} id - ID do plano
   * @param {Object} dados - Dados atualizados
   * @returns {Promise} Resposta da API com plano atualizado
   */
  atualizar: async (id, dados) => {
    try {
      if (!id) {
        throw new Error('ID do plano é obrigatório');
      }
      if (!dados.nome || !dados.nome.trim()) {
        throw new Error('Nome do plano é obrigatório');
      }

      const response = await api.put(`/planos/${id}`, dados);
      return response.data;
    } catch (error) {
      console.error(`❌ Erro ao atualizar plano ${id}:`, error);
      throw error;
    }
  },

  /**
   * Exclui um plano
   * @param {String} id - ID do plano
   * @returns {Promise} Resposta da API
   */
  excluir: async (id) => {
    try {
      if (!id) {
        throw new Error('ID do plano é obrigatório');
      }
      const response = await api.delete(`/planos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Erro ao excluir plano ${id}:`, error);
      
      if (error.response?.status === 400) {
        throw new Error('Não é possível excluir este plano pois está em uso');
      }
      
      throw error;
    }
  },

  /**
   * Lista apenas planos ativos
   * @returns {Promise} Resposta da API com lista de planos ativos
   */
  listarAtivos: async () => {
    try {
      const response = await api.get('/planos', { 
        params: { status: 'ATIVO' } 
      });
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao listar planos ativos:', error);
      throw error;
    }
  },

  /**
   * Altera o status de um plano
   * @param {String} id - ID do plano
   * @param {String} novoStatus - Novo status (ATIVO/INATIVO)
   * @returns {Promise} Resposta da API
   */
  alterarStatus: async (id, novoStatus) => {
    try {
      if (!id) {
        throw new Error('ID do plano é obrigatório');
      }
      if (!['ATIVO', 'INATIVO'].includes(novoStatus)) {
        throw new Error('Status deve ser ATIVO ou INATIVO');
      }

      const response = await api.patch(`/planos/${id}/status`, { 
        status: novoStatus 
      });
      return response.data;
    } catch (error) {
      console.error(`❌ Erro ao alterar status do plano ${id}:`, error);
      throw error;
    }
  }
};