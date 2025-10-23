import api from './axiosConfig';

export const contasPagarService = {
  listarTodos: async (params = {}) => {
    try {
      const response = await api.get('/contas-pagar', { params });
      
      return { data: response.data };
      
    } catch (error) {
      console.error('❌ Erro ao listar contas a pagar:', error);
      throw error;
    }
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/contas-pagar/${id}`);
    return { data: response.data };
  },

  buscarPorCategoria: async (categoria) => {
    const response = await api.get(`/contas-pagar/categoria/${categoria}`);
    return response.data;
  },

  criar: async (dados) => {
    const response = await api.post('/contas-pagar', dados);
    return response.data;
  },

  criarParcelado: async (dados) => {
    const response = await api.post('/contas-pagar/parcelado', dados);
    return response.data;
  },

  registrarPagamento: async (id, dados) => {
    const response = await api.post(`/contas-pagar/${id}/pagar`, dados);
    return response.data;
  },

  cancelar: async (id, motivo) => {
    const response = await api.patch(`/contas-pagar/${id}/cancelar`, { motivo });
    return response.data;
  },

  deletar: async (id) => {
    const response = await api.delete(`/contas-pagar/${id}`);
    return response.data;
  },

  relatorioTotais: async (params = {}) => {
    const response = await api.get('/contas-pagar/relatorio-totais', { params });
    return response.data;
  },

  atualizarVencidas: async () => {
    const response = await api.patch('/contas-pagar/atualizar-vencidas');
    return response.data;
  }
};