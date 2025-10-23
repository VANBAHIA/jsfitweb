import api from './axiosConfig';

export const descontosService = {

  listarTodos: async (params = {}) => {
    try {
      const response = await api.get('/descontos', { params });
      // ✅ CORREÇÃO: Retornar { data: response.data } para manter padrão
      return { data: response.data };
    } catch (error) {
      console.error('❌ Erro ao listar descontos:', error);
      throw error;
    }
  },

  listarAtivos: async () => {
    try {
      const response = await api.get('/descontos', { 
        params: { status: 'ATIVO' } 
      });
      // ✅ CORREÇÃO: Retornar { data: response.data } para manter padrão
      return { data: response.data };
    } catch (error) {
      console.error('❌ Erro ao listar descontos ativos:', error);
      throw error;
    }
  },

  buscarPorId: async (id) => {
    try {
      if (!id) throw new Error('ID do desconto é obrigatório');
      const response = await api.get(`/descontos/${id}`);
      return { data: response.data };
    } catch (error) {
      console.error(`❌ Erro ao buscar desconto ${id}:`, error);
      throw error;
    }
  },

  criar: async (dados) => {
    try {
      const response = await api.post('/descontos', dados);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao criar desconto:', error);
      throw error;
    }
  },

  atualizar: async (id, dados) => {
    try {
      if (!id) throw new Error('ID do desconto é obrigatório');
      const response = await api.put(`/descontos/${id}`, dados);
      return response.data;
    } catch (error) {
      console.error(`❌ Erro ao atualizar desconto ${id}:`, error);
      throw error;
    }
  },

  excluir: async (id) => {
    try {
      if (!id) throw new Error('ID do desconto é obrigatório');
      const response = await api.delete(`/descontos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Erro ao excluir desconto ${id}:`, error);
      throw error;
    }
  },

  calcular: async (id, valorBase) => {
    try {
      if (!id) throw new Error('ID do desconto é obrigatório');
      if (!valorBase || valorBase <= 0) throw new Error('Valor base inválido');
      
      const response = await api.post(`/descontos/${id}/calcular`, { valorBase });
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao calcular desconto:', error);
      throw error;
    }
  }
};