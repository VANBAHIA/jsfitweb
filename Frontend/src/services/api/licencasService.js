import api from './axiosConfig';

export const licencasService = {
  // Listar todas as licenças
  listarTodos: async (params = {}) => {
    const response = await api.get('/licencas', { params });
    return response;
  },

  // Buscar licença por ID
  buscarPorId: async (id) => {
    const response = await api.get(`/licencas/${id}`);
    return response;
  },

  // Buscar licença por chave
  buscarPorChave: async (chave) => {
    const response = await api.get(`/licencas/chave/${chave}`);
    return response;
  },

  // Gerar chave de licença única
  gerarChave: async () => {
    const response = await api.get('/licencas/gerar-chave');
    return response;
  },

  // Criar nova licença
  criar: async (dados) => {
    const response = await api.post('/licencas', dados);
    return response;
  },

  // Validar licença
  validarLicenca: async (chave) => {
    const response = await api.post('/licencas/validar', { chave });
    return response;
  },

  // Atualizar licença
  atualizar: async (id, dados) => {
    const response = await api.put(`/licencas/${id}`, dados);
    return response;
  },

  // Renovar licença
  renovar: async (id, tipo) => {
    const response = await api.patch(`/licencas/${id}/renovar`, { tipo });
    return response;
  },

  // Cancelar licença
  cancelar: async (id, motivo) => {
    const response = await api.patch(`/licencas/${id}/cancelar`, { motivo });
    return response;
  },

  // Suspender licença
  suspender: async (id, motivo) => {
    const response = await api.patch(`/licencas/${id}/suspender`, { motivo });
    return response;
  },

  // Reativar licença
  reativar: async (id) => {
    const response = await api.patch(`/licencas/${id}/reativar`);
    return response;
  }
};