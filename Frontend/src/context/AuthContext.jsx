import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/api/authService';
import { loginCache } from '../utils/loginCache'; // ✅ ADICIONAR

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    verificarAutenticacao();
  }, []);

  const verificarAutenticacao = async () => {
    try {
      const token = authService.getToken();
      console.log('🔑 Token encontrado:', token ? 'SIM' : 'NÃO');
      
      if (token) {
        const usuarioLogado = authService.getUsuarioLogado();
        console.log('👤 Usuário no storage:', usuarioLogado);
        
        const tokenValido = await authService.validarToken();
        console.log('✔️ Token válido:', tokenValido);
        
        if (tokenValido && usuarioLogado) {
          setUsuario(usuarioLogado);
          setAutenticado(true);
          console.log('✅ Usuário autenticado:', usuarioLogado.nome);
        } else {
          console.log('⚠️ Token inválido, fazendo logout');
          authService.logout();
          setUsuario(null);
          setAutenticado(false);
        }
      } else {
        console.log('ℹ️ Nenhum token encontrado');
      }
    } catch (error) {
      console.error('❌ Erro ao verificar autenticação:', error);
      authService.logout();
      setUsuario(null);
      setAutenticado(false);
    } finally {
      setLoading(false);
      console.log('🏁 Verificação de autenticação concluída');
    }
  };

  const login = async (credenciais) => {
    try {
      console.log('🔐 Tentando login para:', credenciais.nomeUsuario);
      const resposta = await authService.login(credenciais);
      
      if (resposta.success) {
        const usuarioLogado = authService.getUsuarioLogado();
        
        console.log('✅ Login bem-sucedido:', usuarioLogado?.nome);
        console.log('👤 Usuário com perfil:', usuarioLogado?.perfil);
        
        // ✅ NOVO: Salvar cache da última empresa logada
        if (usuarioLogado?.empresa) {
          loginCache.salvarUltimaEmpresa({
            id: usuarioLogado.empresa.id,
            nomeFantasia: usuarioLogado.empresa.nomeFantasia,
            razaoSocial: usuarioLogado.empresa.razaoSocial,
            cnpj: usuarioLogado.empresa.cnpj,
            logo: usuarioLogado.empresa.logo,
            ultimoUsuario: credenciais.nomeUsuario
          });
        }
        
        setUsuario(usuarioLogado);
        setAutenticado(true);
        
        return { success: true };
      }
      
      console.log('❌ Login falhou');
      return { success: false, message: 'Erro ao fazer login' };
    } catch (error) {
      console.error('❌ Erro no login:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Usuário ou senha incorretos'
      };
    }
  };

  const logout = () => {
    console.log('🚪 Fazendo logout');
    authService.logout();
    setUsuario(null);
    setAutenticado(false);
    // NÃO limpar cache - mantém empresa para próximo acesso
  };

  const temPerfil = (perfis) => {
    return authService.temPerfil(perfis);
  };

  const temPermissao = (permissao) => {
    return authService.temPermissao(permissao);
  };

  const licencaValida = () => {
    return authService.licencaValida();
  };

  const atualizarUsuario = (dadosAtualizados) => {
    const usuarioAtualizado = { ...usuario, ...dadosAtualizados };
    setUsuario(usuarioAtualizado);
    sessionStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));
  };

  const value = {
    usuario,
    autenticado,
    loading,
    login,
    logout,
    temPerfil,
    temPermissao,
    licencaValida,
    atualizarUsuario
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };