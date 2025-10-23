import api from './axiosConfig';

export const frequenciaService = {
  // Listar todas as frequências com filtros
  listarTodos: async (filtros = {}) => {
    const params = new URLSearchParams();
    
    if (filtros.alunoId) params.append('alunoId', filtros.alunoId);
    if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio);
    if (filtros.dataFim) params.append('dataFim', filtros.dataFim);
    if (filtros.presente !== undefined) params.append('presente', filtros.presente);
    if (filtros.page) params.append('page', filtros.page);
    if (filtros.limit) params.append('limit', filtros.limit);

    return await api.get(`/frequencias?${params.toString()}`);
  },

  // Buscar por ID
  buscarPorId: async (id) => {
    return await api.get(`/frequencias/${id}`);
  },

  // Registrar frequência manual
  registrar: async (dados) => {
    return await api.post('/frequencias', dados);
  },

  // Registrar presença via senha
  registrarPresenca: async (alunoId, senha) => {
    return await api.post('/frequencias/registrar-presenca', {
      alunoId,
      senha
    });
  },

  // Atualizar frequência
  atualizar: async (id, dados) => {
    return await api.put(`/frequencias/${id}`, dados);
  },

  // Excluir frequência
  excluir: async (id) => {
    return await api.delete(`/frequencias/${id}`);
  },

  // Buscar estatísticas
  buscarEstatisticas: async (alunoId, dataInicio, dataFim) => {
    const params = new URLSearchParams();
    if (dataInicio) params.append('dataInicio', dataInicio);
    if (dataFim) params.append('dataFim', dataFim);

    return await api.get(`/frequencias/aluno/${alunoId}/estatisticas?${params.toString()}`);
  },

  // Gerar relatório
  gerarRelatorio: async (filtros) => {
    const params = new URLSearchParams();
    if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio);
    if (filtros.dataFim) params.append('dataFim', filtros.dataFim);
    if (filtros.alunoIds) params.append('alunoIds', filtros.alunoIds);

    return await api.get(`/frequencias/relatorio?${params.toString()}`);
  }
};