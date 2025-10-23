import api from './axiosConfig';

/**
 * Service para gerenciar vínculos entre exercícios e equipamentos
 * Implementa operações CRUD e queries
 */
export const exercicioEquipamentoService = {
  /**
   * Vincular um exercício a um equipamento
   * POST /exercicios/:exercicioId/equipamentos/:equipamentoId
   */
  vincular: async (exercicioId, equipamentoId, dados = {}) => {
    try {
      
      const response = await api.post(
        `/exercicios/${exercicioId}/equipamentos/${equipamentoId}`,
        dados
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Desvincular exercício de equipamento
   * DELETE /exercicios/:exercicioId/equipamentos/:equipamentoId
   */
  desvincular: async (exercicioId, equipamentoId) => {
    try {
      const response = await api.delete(
        `/exercicios/${exercicioId}/equipamentos/${equipamentoId}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obter todos os equipamentos de um exercício
   * GET /exercicios/:exercicioId/equipamentos
   */
  listarEquipamentosDoExercicio: async (exercicioId, params = {}) => {
    try {
      const response = await api.get(
        `/exercicios/${exercicioId}/equipamentos`,
        { params }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obter exercício completo com seus equipamentos
   * GET /exercicios/:exercicioId/completo
   */
  obterExercicioCompleto: async (exercicioId) => {
    try {
      const response = await api.get(`/exercicios/${exercicioId}/completo`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obter todos os exercícios de um equipamento
   * GET /equipamentos/:equipamentoId/exercicios
   */
  listarExerciciosDoEquipamento: async (equipamentoId, params = {}) => {
    try {
      const response = await api.get(
        `/equipamentos/${equipamentoId}/exercicios`,
        { params }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Atualizar informações do vínculo (descrição, disponibilidade)
   * PATCH /exercicios/:exercicioId/equipamentos/:equipamentoId
   */
  atualizarVinculo: async (exercicioId, equipamentoId, dados) => {
    try {
      const response = await api.patch(
        `/exercicios/${exercicioId}/equipamentos/${equipamentoId}`,
        dados
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obter todas as informações de um vínculo
   * GET /exercicios/:exercicioId/equipamentos/:equipamentoId
   */
  obterVinculo: async (exercicioId, equipamentoId) => {
    try {
      const response = await api.get(
        `/exercicios/${exercicioId}/equipamentos/${equipamentoId}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Vincular múltiplos equipamentos a um exercício em uma única chamada
   * POST /exercicios/:exercicioId/equipamentos/bulk
   */
  vincularMultiplos: async (exercicioId, equipamentoIds, dados = {}) => {
    try {
      const response = await api.post(
        `/exercicios/${exercicioId}/equipamentos/bulk`,
        {
          equipamentoIds,
          ...dados
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Desvincular múltiplos equipamentos de um exercício
   * DELETE /exercicios/:exercicioId/equipamentos/bulk
   */
  desvincularMultiplos: async (exercicioId, equipamentoIds) => {
    try {
      const response = await api.delete(
        `/exercicios/${exercicioId}/equipamentos/bulk`,
        {
          data: { equipamentoIds }
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default exercicioEquipamentoService;