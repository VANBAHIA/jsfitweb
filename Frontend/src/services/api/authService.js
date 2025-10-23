import api from './axiosConfig';

/**
 * Serviço de Autenticação
 * Gerencia login, logout e validação de tokens
 */
export const authService = {
  /**
   * Realiza login do usuário
   * @param {Object} credenciais - {nomeUsuario, senha}
   * @returns {Promise} Dados do usuário e token
   */
  login: async (credenciais) => {
    try {
      const response = await api.post('/usuarios/login', credenciais);
      
      if (response.data?.success && response.data?.data) {
        const { token, usuario } = response.data.data;
        
        // Armazena token e dados do usuário
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('usuario', JSON.stringify(usuario));
        
        // Configura token no header padrão do axios
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        return response.data;
      }
      
      throw new Error('Resposta inválida do servidor');
    } catch (error) {
      throw error;
    }
  },

  /**
   * Faz logout do usuário
   */
  logout: () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    delete api.defaults.headers.common['Authorization'];
  },

  /**
   * Valida o token atual
   * @returns {Promise<boolean>} Token válido ou não
   */
  validarToken: async () => {
    try {
      const token = authService.getToken();
      
      if (!token) {
        return false;
      }

      const response = await api.post('/usuarios/validar-token', { token });
      return response.data?.success || false;
    } catch (error) {
      console.error('Erro ao validar token:', error);
      return false;
    }
  },

  /**
   * Retorna o token armazenado
   * @returns {string|null} Token JWT
   */
  getToken: () => {
    return sessionStorage.getItem('token');
  },

  /**
   * Retorna o usuário logado
   * @returns {Object|null} Dados do usuário
   */
  getUsuarioLogado: () => {
    const usuario = sessionStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  },

  /**
   * Verifica se o usuário está autenticado
   * @returns {boolean}
   */
  isAutenticado: () => {
    return !!authService.getToken();
  },

  /**
   * Verifica se o usuário tem um perfil específico
   * @param {string|string[]} perfis - Perfil ou array de perfis
   * @returns {boolean}
   */
  temPerfil: (perfis) => {
    const usuario = authService.getUsuarioLogado();
    if (!usuario) return false;

    const perfisArray = Array.isArray(perfis) ? perfis : [perfis];
    return perfisArray.includes(usuario.perfil);
  },

  /**
   * Verifica se o usuário tem uma permissão específica
   * @param {string} permissao - Permissão a verificar
   * @returns {boolean}
   */
  temPermissao: (permissao) => {
    const usuario = authService.getUsuarioLogado();
    if (!usuario) return false;

    // Admin tem todas as permissões
    if (usuario.perfil === 'ADMIN' || usuario.permissoes?.includes('TODAS')) {
      return true;
    }

    return usuario.permissoes?.includes(permissao) || false;
  },

  /**
   * Verifica se a licença está válida
   * @returns {boolean}
   */
/**
 * Verifica se a licença está válida
 * @returns {boolean}
 */
licencaValida: () => {
  const usuario = authService.getUsuarioLogado();
  if (!usuario?.licenca) return false;

  // ✅ SUPER_ADMIN ou ADMIN têm licença sempre válida
  if (usuario.perfil === 'SUPER_ADMIN' || usuario.perfil === 'ADMIN') {
    return true;
  }

  // ✅ Aceitar '∞' como válido
  if (usuario.licenca.diasRestantes === '∞' || usuario.licenca.diasRestantes === Infinity) {
    return true;
  }

  // Verificação normal para outros usuários
  return usuario.licenca.diasRestantes > 0;
}
};

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se receber 401 (não autorizado), faz logout
    if (error.response?.status === 401) {
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default authService;