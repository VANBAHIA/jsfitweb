import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Loader, AlertTriangle } from 'lucide-react';

/**
 * Componente de Rota Protegida
 * Só permite acesso se o usuário estiver autenticado
 */
function ProtectedRoute({ 
  children, 
  requiredPerfil = null, 
  requiredPermissao = null 
}) {
  const { autenticado, loading, usuario, temPerfil, temPermissao, licencaValida } = useAuth();

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  // Verifica autenticação
  if (!autenticado) {
    return null; // O App.jsx vai redirecionar para login
  }

  // Verifica licença
  if (!licencaValida()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertTriangle className="text-red-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Licença Expirada</h2>
          <p className="text-gray-600 mb-6">
            A licença da sua academia expirou. Entre em contato com o suporte para renovar.
          </p>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Academia:</strong> {usuario?.empresa?.nomeFantasia}<br />
              <strong>Dias restantes:</strong> {usuario?.licenca?.diasRestantes || 0}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Verifica perfil necessário
  if (requiredPerfil && !temPerfil(requiredPerfil)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <AlertTriangle className="text-orange-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Acesso Negado</h2>
          <p className="text-gray-600 mb-6">
            Você não tem permissão para acessar esta área do sistema.
          </p>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Seu perfil:</strong> {usuario?.perfil}<br />
              <strong>Perfil necessário:</strong> {Array.isArray(requiredPerfil) ? requiredPerfil.join(', ') : requiredPerfil}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Verifica permissão necessária
  if (requiredPermissao && !temPermissao(requiredPermissao)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <AlertTriangle className="text-orange-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Permissão Negada</h2>
          <p className="text-gray-600 mb-6">
            Você não tem permissão para acessar este módulo.
          </p>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Permissão necessária:</strong> {requiredPermissao}<br />
              <strong>Suas permissões:</strong> {usuario?.permissoes?.join(', ') || 'Nenhuma'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Usuário autenticado e autorizado
  return children;
}

export default ProtectedRoute;