import React, { useState, useEffect } from 'react';
import { LogIn, User, Lock, Eye, EyeOff, Loader, AlertCircle, Building2, ArrowLeft, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { empresasService } from '../../services/api/empresasService';
import { loginCache } from '../../utils/loginCache'; // ✅ ADICIONAR

function LoginPage() {
  const { login } = useAuth();
  
  // ✅ NOVO: Estado para empresa em cache
  const [empresaCache, setEmpresaCache] = useState(null);
  
  // Estados existentes
  const [etapa, setEtapa] = useState('CNPJ'); // 'CNPJ' ou 'LOGIN'
  const [cnpj, setCnpj] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
  const [formData, setFormData] = useState({
    nomeUsuario: '',
    senha: ''
  });
  
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buscandoEmpresa, setBuscandoEmpresa] = useState(false);
  const [erro, setErro] = useState('');

  // ✅ NOVO: Carregar cache ao montar componente
  useEffect(() => {
    const cache = loginCache.obterUltimaEmpresa();
    if (cache) {
      console.log('📦 Cache encontrado:', cache.nomeFantasia);
      setEmpresaCache(cache);
      // Preencher último usuário automaticamente
      setFormData(prev => ({
        ...prev,
        nomeUsuario: cache.ultimoUsuario || ''
      }));
    }
  }, []);

  // Formatar CNPJ
  const formatCNPJ = (value) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);
  };

  // Buscar empresa por CNPJ
  const handleBuscarEmpresa = async (e) => {
    e.preventDefault();
    setErro('');
    setBuscandoEmpresa(true);

    try {
      const cnpjLimpo = cnpj.replace(/\D/g, '');
      
      if (cnpjLimpo.length !== 14) {
        setErro('CNPJ deve conter 14 dígitos');
        return;
      }

      const resultado = await empresasService.buscarPorCNPJ(cnpjLimpo);
      
      if (resultado.data?.success) {
        setEmpresaSelecionada(resultado.data.data);
        setEtapa('LOGIN');
        setErro('');
      } else {
        setErro('Empresa não encontrada');
      }
    } catch (error) {
      console.error('❌ Erro ao buscar empresa:', error);
      setErro(
        error.response?.data?.message || 
        'CNPJ inválido ou empresa não cadastrada'
      );
    } finally {
      setBuscandoEmpresa(false);
    }
  };

  // Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      // Usar empresa do cache ou empresa selecionada manualmente
      const empresaId = empresaSelecionada?.id || empresaCache?.id;
      
      const resultado = await login({
        ...formData,
        empresaId
      });

      if (!resultado.success) {
        setErro(resultado.message || 'Erro ao fazer login');
      }
    } catch (error) {
      console.error('❌ Erro no login:', error);
      setErro('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
    setErro('');
  };

  const handleVoltarParaCNPJ = () => {
    setEtapa('CNPJ');
    setEmpresaSelecionada(null);
    setFormData({ nomeUsuario: '', senha: '' });
    setErro('');
  };

  // ✅ NOVO: Continuar com empresa em cache
  const handleContinuarComCache = () => {
    setEmpresaSelecionada(empresaCache);
    setEtapa('LOGIN');
  };

  // ✅ NOVO: Trocar empresa (limpar cache)
  const handleTrocarEmpresa = () => {
    loginCache.limparCache();
    setEmpresaCache(null);
    setFormData({ nomeUsuario: '', senha: '' });
    setEtapa('CNPJ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 flex items-center justify-center p-4">
      {/* Animação de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
      </div>

      {/* Card de Login */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-8 text-center bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-lg">
            <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              JS
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">FitGestão</h1>
          <p className="text-blue-100 text-sm">Sistema de Gestão para Academias</p>
        </div>

        {/* ✅ NOVO: Empresa em Cache - Tela Inicial */}
        {empresaCache && etapa === 'CNPJ' && !empresaSelecionada && (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Bem-vindo de volta!
            </h2>
            <p className="text-gray-600 text-sm text-center mb-6">
              Identificamos seu último acesso
            </p>

            {/* Card da Empresa em Cache */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                  <Building2 className="text-blue-600" size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg">
                    {empresaCache.nomeFantasia}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {empresaCache.razaoSocial}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    CNPJ: {loginCache.formatarCNPJ(empresaCache.cnpj)}
                  </p>
                </div>
              </div>
              
              {empresaCache.ultimoUsuario && (
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/60 rounded-lg p-3">
                  <User size={16} />
                  <span>
                    Último acesso: <strong>{empresaCache.ultimoUsuario}</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Botões de Ação */}
            <div className="space-y-3">
              <button
                onClick={handleContinuarComCache}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <LogIn size={20} />
                Continuar como {empresaCache.nomeFantasia}
              </button>

              <button
                onClick={handleTrocarEmpresa}
                className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all flex items-center justify-center gap-2"
              >
                <Building2 size={20} />
                Acessar Outra Empresa
              </button>
            </div>

            {/* Info último acesso */}
            <div className="mt-4 text-center text-xs text-gray-500">
              Último acesso em{' '}
              {new Date(empresaCache.dataUltimoAcesso).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}
            </div>
          </div>
        )}

        {/* Formulário */}
        {(!empresaCache || etapa !== 'CNPJ' || empresaSelecionada) && (
          <div className="p-8">
            {/* ETAPA 1: Buscar Empresa por CNPJ */}
            {etapa === 'CNPJ' && (
              <form onSubmit={handleBuscarEmpresa}>
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Bem-vindo!</h2>
                  <p className="text-gray-600 text-sm">Digite o CNPJ da sua academia</p>
                </div>

                {/* Erro */}
                {erro && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                    <p className="text-sm text-red-800 font-medium">{erro}</p>
                  </div>
                )}

                {/* Campo CNPJ */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CNPJ da Academia
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Building2 size={20} />
                    </div>
                    <input
                      type="text"
                      required
                      value={cnpj}
                      onChange={(e) => setCnpj(formatCNPJ(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="00.000.000/0000-00"
                      disabled={buscandoEmpresa}
                      maxLength={18}
                      autoFocus
                    />
                  </div>
                </div>

                {/* Botão Continuar */}
                <button
                  type="submit"
                  disabled={buscandoEmpresa || cnpj.replace(/\D/g, '').length !== 14}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {buscandoEmpresa ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Buscando...
                    </>
                  ) : (
                    'Continuar'
                  )}
                </button>
              </form>
            )}

            {/* ETAPA 2: Login Normal */}
            {etapa === 'LOGIN' && (
              <form onSubmit={handleSubmit}>
                {/* Badge da Empresa Selecionada */}
                <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Building2 className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-blue-900">
                          {empresaSelecionada?.nomeFantasia || empresaCache?.nomeFantasia}
                        </p>
                        <p className="text-xs text-blue-700">
                          {empresaSelecionada?.razaoSocial || empresaCache?.razaoSocial}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleVoltarParaCNPJ}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Alterar empresa"
                    >
                      <ArrowLeft size={20} />
                    </button>
                  </div>
                </div>

                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Acesse sua conta</h2>
                  <p className="text-gray-600 text-sm">Digite suas credenciais</p>
                </div>

                {/* Erro */}
                {erro && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                    <p className="text-sm text-red-800 font-medium">{erro}</p>
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Digite seu usuário"
                      disabled={loading}
                      autoComplete="username"
                      autoFocus
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
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Digite sua senha"
                      disabled={loading}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={loading}
                    >
                      {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Botão Login */}
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
              </form>
            )}

            {/* Link Esqueceu Senha */}
            <div className="mt-6 text-center">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                onClick={() => alert('Entre em contato com o administrador do sistema')}
              >
                Esqueceu sua senha?
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50 border-t text-center">
          <p className="text-xs text-gray-600">
            © 2024 JSFitGestão - Versão 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
