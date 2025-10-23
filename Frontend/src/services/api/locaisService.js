import api from './axiosConfig';

/**
 * Service para gerenciamento de Locais da academia
 * Endpoints: /api/locais
 */
export const locaisService = {
  /**
   * Lista todos os locais
   * @param {Object} params - Parâmetros de filtro (opcional)
   * @param {String} params.status - Filtrar por status (ATIVO/INATIVO)
   * @param {String} params.busca - Buscar por nome
   * @returns {Promise} Resposta da API com lista de locais
   * @example
   * // Listar todos
   * const locais = await locaisService.listarTodos();
   * 
   * // Listar apenas ativos
   * const ativos = await locaisService.listarTodos({ status: 'ATIVO' });
   */
  listarTodos: async (params = {}) => {
    try {
      const response = await api.get('/locais', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao listar locais:', error);
      throw error;
    }
  },

  /**
   * Busca um local por ID
   * @param {String} id - ID do local (MongoDB ObjectId)
   * @returns {Promise} Resposta da API com dados do local
   * @example
   * const local = await locaisService.buscarPorId('507f1f77bcf86cd799439011');
   */
  buscarPorId: async (id) => {
    try {
      if (!id) {
        throw new Error('ID do local é obrigatório');
      }
      const response = await api.get(`/locais/${id}`);
      return { data: response.data };
    } catch (error) {
      console.error(`❌ Erro ao buscar local ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cria um novo local
   * @param {Object} dados - Dados do local
   * @param {String} dados.nome - Nome do local (obrigatório)
   * @param {String} dados.status - Status (ATIVO/INATIVO) - padrão: ATIVO
   * @returns {Promise} Resposta da API com local criado
   * @example
   * await locaisService.criar({
   *   nome: 'Sala de Musculação',
   *   status: 'ATIVO'
   * });
   */
  criar: async (dados) => {
    try {
      // Validações básicas
      if (!dados.nome || !dados.nome.trim()) {
        throw new Error('Nome do local é obrigatório');
      }

      const dadosFormatados = {
        nome: dados.nome.trim(),
        status: dados.status || 'ATIVO'
      };

      const response = await api.post('/locais', dadosFormatados);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao criar local:', error);
      throw error;
    }
  },

  /**
   * Atualiza um local existente
   * @param {String} id - ID do local
   * @param {Object} dados - Dados atualizados
   * @param {String} dados.nome - Nome do local
   * @param {String} dados.status - Status (ATIVO/INATIVO)
   * @returns {Promise} Resposta da API com local atualizado
   * @example
   * await locaisService.atualizar('507f1f77bcf86cd799439011', {
   *   nome: 'Sala de Musculação Premium',
   *   status: 'ATIVO'
   * });
   */
  atualizar: async (id, dados) => {
    try {
      if (!id) {
        throw new Error('ID do local é obrigatório');
      }

      if (!dados.nome || !dados.nome.trim()) {
        throw new Error('Nome do local é obrigatório');
      }

      const dadosFormatados = {
        nome: dados.nome.trim(),
        status: dados.status || 'ATIVO'
      };

      const response = await api.put(`/locais/${id}`, dadosFormatados);
      return response.data;
    } catch (error) {
      console.error(`❌ Erro ao atualizar local ${id}:`, error);
      throw error;
    }
  },

  /**
   * Exclui um local
   * @param {String} id - ID do local
   * @returns {Promise} Resposta da API
   * @throws {Error} Se o local estiver em uso
   * @example
   * await locaisService.excluir('507f1f77bcf86cd799439011');
   */
  excluir: async (id) => {
    try {
      if (!id) {
        throw new Error('ID do local é obrigatório');
      }
      const response = await api.delete(`/locais/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Erro ao excluir local ${id}:`, error);
      
      // Tratamento específico para erro de local em uso
      if (error.response?.status === 400) {
        throw new Error('Não é possível excluir este local pois está em uso por turmas ou horários');
      }
      
      throw error;
    }
  },

  /**
   * Busca locais por nome (busca parcial)
   * @param {String} nome - Nome ou parte do nome do local
   * @returns {Promise} Resposta da API com lista de locais encontrados
   * @example
   * const resultados = await locaisService.buscarPorNome('musculação');
   */
  buscarPorNome: async (nome) => {
    try {
      if (!nome || !nome.trim()) {
        return { data: { locais: [], total: 0 } };
      }
      const response = await api.get('/locais', { 
        params: { busca: nome.trim() } 
      });
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar locais por nome:', error);
      throw error;
    }
  },

  /**
   * Lista apenas locais ativos
   * @returns {Promise} Resposta da API com lista de locais ativos
   * @example
   * const ativos = await locaisService.listarAtivos();
   */
  listarAtivos: async () => {
    try {
      const response = await api.get('/locais', { 
        params: { status: 'ATIVO' } 
      });
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao listar locais ativos:', error);
      throw error;
    }
  },

  /**
   * Altera o status de um local (ativa/inativa)
   * @param {String} id - ID do local
   * @param {String} novoStatus - Novo status (ATIVO/INATIVO)
   * @returns {Promise} Resposta da API
   * @example
   * await locaisService.alterarStatus('507f1f77bcf86cd799439011', 'INATIVO');
   */
  alterarStatus: async (id, novoStatus) => {
    try {
      if (!id) {
        throw new Error('ID do local é obrigatório');
      }
      if (!['ATIVO', 'INATIVO'].includes(novoStatus)) {
        throw new Error('Status deve ser ATIVO ou INATIVO');
      }

      const response = await api.patch(`/locais/${id}/status`, { 
        status: novoStatus 
      });
      return response.data;
    } catch (error) {
      console.error(`❌ Erro ao alterar status do local ${id}:`, error);
      throw error;
    }
  }
};