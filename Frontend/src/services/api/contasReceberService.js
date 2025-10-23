import api from './axiosConfig';

export const contasReceberService = {
  listarTodos: async (params = {}) => {
    try {
      const response = await api.get('/contas-receber', { params });
      
      // ✅ CORREÇÃO: Retornar apenas { data: response.data }
      // A API já retorna: { statusCode, success, data: [...] }
      return { data: response.data };
      
    } catch (error) {
      console.error('❌ Erro ao listar contas a receber:', error);
      throw error;
    }
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/contas-receber/${id}`);
    return { data: response.data };
  },

  criar: async (dados) => {
    const response = await api.post('/contas-receber', dados);
    return response.data;
  },

  registrarPagamento: async (id, dados) => {
    const response = await api.post(`/contas-receber/${id}/pagar`, dados);
    return response.data;
  },

  cancelar: async (id, motivo) => {
    const response = await api.patch(`/contas-receber/${id}/cancelar`, { motivo });
    return response.data;
  },

    atualizar: async (id, dados) => {
    const response = await api.put(`/contas-receber/${id}`, dados);
    return response.data;
  },

  atualizarVencidas: async () => {
    const response = await api.patch('/contas-receber/atualizar-vencidas');
    return response.data;
  }
};