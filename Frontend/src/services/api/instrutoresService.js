// src/services/api/instrutoresService.js
import api from './axiosConfig';

export const instrutoresService = {
  /**
   * Listar todos os instrutores
   */
  async listarTodos(params = {}) {
    const response = await api.get('/instrutores', { params });
    return response.data;
  },

  /**
   * Listar apenas instrutores ativos
   */
  async listarAtivos() {
    const response = await api.get('/instrutores/ativos');
    return response.data;
  },

  /**
   * Buscar instrutor por ID
   */
  async buscarPorId(id) {
    const response = await api.get(`/instrutores/${id}`);
    return response.data;
  },

  /**
   * Buscar instrutor por funcionarioId
   */
  async buscarPorFuncionarioId(funcionarioId) {
    const response = await api.get(`/instrutores/funcionario/${funcionarioId}`);
    return response.data;
  },

  /**
   * Criar novo instrutor
   */
  async criar(dados) {
    const response = await api.post('/instrutores', dados);
    return response.data;
  },

  /**
   * Atualizar instrutor
   */
  async atualizar(id, dados) {
    const response = await api.put(`/instrutores/${id}`, dados);
    return response.data;
  },

  /**
   * Excluir instrutor
   */
  async excluir(id) {
    const response = await api.delete(`/instrutores/${id}`);
    return response.data;
  }
};