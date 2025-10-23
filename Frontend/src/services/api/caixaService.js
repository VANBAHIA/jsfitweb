import api from './axiosConfig';

export const caixaService = {
  listarTodos: async (params = {}) => {
    const response = await api.get('/caixas', { params });
    return response.data; // ⬅️ REMOVER O ENCAPSULAMENTO
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/caixas/${id}`);
    return response.data; // ⬅️ REMOVER O ENCAPSULAMENTO
  },

  buscarAberto: async () => {
    const response = await api.get('/caixas/aberto');
    return response.data;
  },

  abrir: async (dados) => {
    const response = await api.post('/caixas/abrir', dados);
    return response.data;
  },

  fechar: async (id, dados) => {
    const response = await api.post(`/caixas/${id}/fechar`, dados);
    return response.data;
  },

  registrarMovimento: async (id, dados) => {
    const response = await api.post(`/caixas/${id}/movimento`, dados);
    return response.data;
  },

  removerMovimento: async (id, movimentoId) => {
    const response = await api.delete(`/caixas/${id}/movimento/${movimentoId}`);
    return response.data;
  },

  sangria: async (id, dados) => {
    const response = await api.post(`/caixas/${id}/sangria`, dados);
    return response.data;
  },

  suprimento: async (id, dados) => {
    const response = await api.post(`/caixas/${id}/suprimento`, dados);
    return response.data;
  },

  relatorio: async (id) => {
    const response = await api.get(`/caixas/${id}/relatorio`);
    return response.data;
  }
};