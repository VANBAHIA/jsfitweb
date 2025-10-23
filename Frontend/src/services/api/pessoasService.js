import api from './axiosConfig';

export const pessoasService = {
  criar: async (dados) => {
    
    const response = await api.post('/pessoas', dados);
    return response.data;
  },
  
  atualizar: async (id, dados) => {
    const response = await api.put(`/pessoas/${id}`, dados);
    return response.data;
  }
};