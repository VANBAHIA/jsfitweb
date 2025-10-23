import api from './axiosConfig';

/**
 * Service para gerenciamento de Jobs e Tarefas Automatizadas
 * Endpoints: /api/jobs
 */
export const jobsService = {
  /**
   * Aciona manualmente a geração de cobranças mensais
   * @returns {Promise} Resposta com resultado da geração
   */
  gerarCobrancas: async () => {
    try {
      console.log('🔄 Iniciando geração manual de cobranças...');
      
      const response = await api.post('/jobs/gerar-cobrancas');
      
      console.log('✅ Cobranças geradas com sucesso:', response.data);
      
      return response.data;
      
    } catch (error) {
      console.error('❌ Erro ao gerar cobranças:', {
        status: error.response?.status,
        mensagem: error.response?.data?.message || error.response?.data?.mensagem,
        detalhes: error.response?.data
      });
      throw error;
    }
  }
};