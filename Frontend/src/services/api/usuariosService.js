import api from './axiosConfig';

/**
 * Serviço para operações com Usuários do Sistema
 * Baseado na API documentada em GUIA EMPRESA E USUARIOS.md
 */
export const usuariosService = {
  /**
   * Realiza login do usuário
   * @param {Object} credenciais - {nomeUsuario, senha}
   */
  login: async (credenciais) => {
    const response = await api.post('/usuarios/login', credenciais);
    
    // Armazena token no localStorage (memória da sessão)
    if (response.data?.data?.token) {
      sessionStorage.setItem('token', response.data.data.token);
      sessionStorage.setItem('usuario', JSON.stringify(response.data.data.usuario));
    }
    
    return response;
  },

  

  /**
   * Valida um token JWT
   * @param {string} token - Token JWT
   */
  validarToken: async (token) => {
    const response = await api.post('/usuarios/validar-token', { token });
    return response;
  },

  /**
   * Lista todos os usuários com filtros
   * @param {Object} params - Parâmetros (empresaId, page, limit, perfil, situacao)
   */
  listarTodos: async (params = {}) => {
    const response = await api.get('/usuarios', { params });
    return response;
  },

  excluir: async (id) => {
    try {
      if (!id) throw new Error('ID do desconto é obrigatório');
      const response = await api.delete(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Erro ao excluir Usuário ${id}:`, error);
      throw error;
    }
  },

  /**
   * Busca um usuário específico por ID
   * @param {string} id - ID do usuário
   */
  buscarPorId: async (id) => {
    const response = await api.get(`/usuarios/${id}`);
    return response;
  },

  /**
   * Cria um novo usuário
   * @param {Object} dados - Dados do usuário
   */
  criar: async (dados) => {
    const response = await api.post('/usuarios', dados);
    return response;
  },

  /**
   * Atualiza um usuário existente
   * @param {string} id - ID do usuário
   * @param {Object} dados - Dados atualizados
   */
  atualizar: async (id, dados) => {
    const response = await api.put(`/usuarios/${id}`, dados);
    return response;
  },

  /**
   * Altera a senha do usuário
   * @param {string} id - ID do usuário
   * @param {Object} senhas - {senhaAtual, novaSenha}
   */
  alterarSenha: async (id, senhas) => {
    const response = await api.patch(`/usuarios/${id}/senha`, senhas);
    return response;
  },

  /**
   * Altera a situação do usuário (ATIVO/INATIVO/BLOQUEADO)
   * @param {string} id - ID do usuário
   * @param {string} situacao - Nova situação
   */
  alterarSituacao: async (id, situacao) => {
    const response = await api.patch(`/usuarios/${id}/situacao`, { situacao });
    return response;
  },

  /**
   * Faz logout do usuário
   */
  logout: () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
  },

  /**
   * Retorna o usuário logado (se existir)
   */
  getUsuarioLogado: () => {
    const usuario = sessionStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  },

  /**
   * Retorna o token armazenado
   */
  getToken: () => {
    return sessionStorage.getItem('token');
  }
};

// Interceptor para adicionar token JWT nas requisições
api.interceptors.request.use(
  (config) => {
    const token = usuariosService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);