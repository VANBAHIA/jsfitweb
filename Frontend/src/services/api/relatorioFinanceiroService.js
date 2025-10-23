import api from './axiosConfig';

export const relatorioFinanceiroService = {
  resumo: async (dataInicio, dataFim) => {
    const response = await api.get('/relatorios/financeiro/resumo', {
      params: { dataInicio, dataFim }
    });
    return response.data;
  },

  receitasForma: async (dataInicio, dataFim) => {
    const response = await api.get('/relatorios/financeiro/receitas-forma', {
      params: { dataInicio, dataFim }
    });
    return response.data;
  },

  despesasCategoria: async (dataInicio, dataFim) => {
    const response = await api.get('/relatorios/financeiro/despesas-categoria', {
      params: { dataInicio, dataFim }
    });
    return response.data;
  },

  evolucao: async (dataInicio, dataFim) => {
    const response = await api.get('/relatorios/financeiro/evolucao', {
      params: { dataInicio, dataFim }
    });
    return response.data;
  },

  contasVencidas: async () => {
    const response = await api.get('/relatorios/financeiro/vencidas');
    return response.data;
  }
};