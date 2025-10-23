import api from './axiosConfig';

/**
 * Serviço para operações com Empresas
 * Baseado na API documentada em GUIA EMPRESA E USUARIOS.md
 */
export const empresasService = {
  /**
   * Lista todas as empresas com paginação e filtros
   * @param {Object} params - Parâmetros de busca (page, limit, situacao)
   */
  listarTodos: async (params = {}) => {
    const response = await api.get('/empresas', { params });
    return response;
  },
  /**
 * Busca empresa por CNPJ (público - para login)
 * @param {string} cnpj - CNPJ da empresa
 */
  buscarPorCNPJ: async (cnpj) => {
    const response = await api.post('/empresas/buscar-cnpj', { cnpj });
    return response;
  },

  /**
   * Busca uma empresa específica por ID
   * @param {string} id - ID da empresa
   */
  buscarPorId: async (id) => {
    const response = await api.get(`/empresas/${id}`);
    return response;
  },

  /**
   * Cria uma nova empresa
   * @param {Object} dados - Dados da empresa
   */
  criar: async (dados) => {
    const response = await api.post('/empresas', dados);
    return response;
  },

  /**
   * Atualiza uma empresa existente
   * @param {string} id - ID da empresa
   * @param {Object} dados - Dados atualizados
   */
  atualizar: async (id, dados) => {
    const response = await api.put(`/empresas/${id}`, dados);
    return response;
  },

  /**
   * Altera a situação da empresa (ATIVO/BLOQUEADO/INATIVO)
   * @param {string} id - ID da empresa
   * @param {string} situacao - Nova situação
   */
  alterarSituacao: async (id, situacao) => {
    const response = await api.patch(`/empresas/${id}/situacao`, { situacao });
    return response;
  },

  /**
   * Exclui uma empresa
   * @param {string} id - ID da empresa
   */
  excluir: async (id) => {
    const response = await api.delete(`/empresas/${id}`);
    return response;
  }


};