import React, { useState } from 'react';
import { LogIn, User, Lock, Eye, EyeOff, Loader } from 'lucide-react';
import { usuariosService } from '../../../services/api/usuariosService';

function LoginForm({ onLoginSuccess, onCancelar }) {
  const [formData, setFormData] = useState({
    nomeUsuario: '',
    senha: ''
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      setLoading(true);
      const resposta = await usuariosService.login(formData);

      if (resposta.data?.success) {
        onLoginSuccess(resposta.data.data);
      } else {
        setErro('Usuário ou senha incorretos');
      }
    } catch (error) {
      console.error('❌ Erro no login:', error);
      setErro(error.response?.data?.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
    setErro('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-8 text-center bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
            <span className="text-4xl font-bold text-blue-600">JS</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">FitGestão</h2>
          <p className="text-blue-100">Sistema de Gestão para Academias</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Bem-vindo de volta!
          </h3>

          {erro && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {erro}
            </div>
          )}

          {/* Nome de Usuário */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome de Usuário
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <User size={20} />
              </div>
              <input
                type="text"
                required
                value={formData.nomeUsuario}
                onChange={(e) => handleChange('nomeUsuario', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite seu usuário"
                disabled={loading}
              />
            </div>
          </div>

          {/* Senha */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Lock size={20} />
              </div>
              <input
                type={mostrarSenha ? 'text' : 'password'}
                required
                value={formData.senha}
                onChange={(e) => handleChange('senha', e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite sua senha"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Botão de Login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={20} />
                Entrando...
              </>
            ) : (
              <>
                <LogIn size={20} />
                Entrar no Sistema
              </>
            )}
          </button>

          {/* Links Adicionais */}
          <div className="mt-6 text-center">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Esqueceu sua senha?
            </button>
          </div>

          {/* Informações */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 text-center">
              <strong>🔐 Dica:</strong> Use as credenciais fornecidas pelo administrador do sistema.
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50 border-t text-center">
          <p className="text-xs text-gray-600">
            © 2024 JSFitGestão - Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;