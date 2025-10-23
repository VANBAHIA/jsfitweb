import React from 'react';
import { usePermissoes } from '../../hooks/usePermissoes';

function BotaoPermissao({ 
  modulo, 
  acao, 
  acaoEspecial,
  children, 
  onClick, 
  className = '',
  disabled = false,
  ...props 
}) {
  const { temPermissao, temAcaoEspecial } = usePermissoes();

  // Verifica permissão de módulo
  if (modulo && acao && !temPermissao(modulo, acao)) {
    return null;
  }

  // Verifica ação especial
  if (acaoEspecial && !temAcaoEspecial(acaoEspecial)) {
    return null;
  }

  return (
    <button 
      onClick={onClick} 
      className={className} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default BotaoPermissao;