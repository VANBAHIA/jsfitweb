// src/hooks/usePermissoes.js

import { useAuth } from '../context/AuthContext';

/**
 * Hook para verificar permissões do usuário
 */
export const usePermissoes = () => {
  const { usuario } = useAuth();

  /**
   * Verifica se o usuário tem permissão em um módulo
   * @param {string} modulo - Nome do módulo
   * @param {string} acao - Ação específica
   * @returns {boolean}
   */
  const temPermissao = (modulo, acao) => {
    if (!usuario) return false;

    // ADMIN tem todas as permissões
    if (usuario.perfil === 'ADMIN') return true;

    // Verifica permissão específica
    const permissoes = usuario.permissoes?.modulos?.[modulo];
    return permissoes?.[acao] === true;
  };

  /**
   * Verifica se o usuário tem uma ação especial
   * @param {string} acao - Nome da ação especial
   * @returns {boolean}
   */
  const temAcaoEspecial = (acao) => {
    if (!usuario) return false;

    // ADMIN tem todas as ações
    if (usuario.perfil === 'ADMIN') return true;

    const acoesEspeciais = usuario.permissoes?.acoes_especiais || [];
    return acoesEspeciais.includes(acao);
  };

  /**
   * Verifica se o usuário tem acesso ao módulo
   * @param {string} modulo
   * @returns {boolean}
   */
  const podeAcessarModulo = (modulo) => {
    return temPermissao(modulo, 'acessar');
  };

  /**
   * Retorna todas as permissões do usuário
   */
  const getPermissoes = () => {
    return usuario?.permissoes || { modulos: {}, acoes_especiais: [] };
  };

  return {
    temPermissao,
    temAcaoEspecial,
    podeAcessarModulo,
    getPermissoes
  };
};