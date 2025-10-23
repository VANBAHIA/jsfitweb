import api from './axiosConfig';

export const funcionariosService = {
  listarTodos: async (params = {}) => {
    const response = await api.get('/funcionarios', { params });
    return response.data;
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/funcionarios/${id}`);
    return { data: response.data };
  },

  criar: async (dados) => {
    
    const response = await api.post('/funcionarios', dados);
console.log(dados);
    return response.data;
  },

  atualizar: async (id, dados) => {
   
    const response = await api.put(`/funcionarios/${id}`, dados);
    return response.data;
  },

  excluir: async (id) => {
    const response = await api.delete(`/funcionarios/${id}`);
    return response.data;
  },

  demitir: async (id, dados) => {
    const response = await api.patch(`/funcionarios/${id}/demitir`, dados);
    return response.data;
  },

  reativar: async (id, dados) => {
    const response = await api.patch(`/funcionarios/${id}/reativar`, dados);
    return response.data;
  }
};