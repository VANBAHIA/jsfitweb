import api from './axiosConfig';

export const alunosService = {
  listarTodos: async (params = {}) => {
    const response = await api.get('/alunos', { params });
    return response.data?.data || [];
  },

  buscarPorId: async (id) => {
    const response = await api.get(`/alunos/${id}`);
    return response.data?.data || {}; // ✅ dados do aluno direto
  },

  criar: async (dados) => {
    const response = await api.post('/alunos', dados);
    return response.data?.data || response.data;
  },

  atualizar: async (id, dados) => {
    const response = await api.put(`/alunos/${id}`, dados);
    return response.data?.data || response.data;
  },

  excluir: async (id) => {
    const response = await api.delete(`/alunos/${id}`);
    return response.data?.data || response.data;
  }
};
