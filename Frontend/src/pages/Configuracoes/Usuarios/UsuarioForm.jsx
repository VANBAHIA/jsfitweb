import React, { useState, useEffect, useContext } from 'react';
import { X, Save, User, Mail, Lock, Shield, Phone } from 'lucide-react';
import { AuthContext } from '../../../context/AuthContext';

function UsuarioForm({ usuario, onSalvar, onCancelar, empresaId }) {
  const { usuario: usuarioLogado } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    empresaId: empresaId || '',
    nomeUsuario: '',
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    perfil: 'USUARIO',
    // ✅ MUDANÇA: permissoes agora é objeto conforme padrão do guia
    permissoes: {
      modulos: {},
      acoes_especiais: []
    },
    telefone: '',
    situacao: 'ATIVO'
  });

  const [erroSenha, setErroSenha] = useState('');

  useEffect(() => {
    if (usuario) {
      const dadosUsuario = usuario.data || usuario;

      // ✅ CORREÇÃO: Trata permissões vindas do backend
      let permissoesProcessadas = {
        modulos: {},
        acoes_especiais: []
      };

      if (dadosUsuario.permissoes) {
        // Se for objeto (padrão novo)
        if (typeof dadosUsuario.permissoes === 'object' && !Array.isArray(dadosUsuario.permissoes)) {
          permissoesProcessadas = {
            modulos: dadosUsuario.permissoes.modulos || {},
            acoes_especiais: dadosUsuario.permissoes.acoes_especiais || []
          };
        }
        // Se for array (padrão antigo - migrar)
        else if (Array.isArray(dadosUsuario.permissoes)) {
          // Converte array antigo para novo formato
          permissoesProcessadas.acoes_especiais = dadosUsuario.permissoes;
        }
      }

      setFormData({
        empresaId: dadosUsuario.empresaId || empresaId || '',
        nomeUsuario: dadosUsuario.nomeUsuario || '',
        nome: dadosUsuario.nome || '',
        email: dadosUsuario.email || '',
        senha: '',
        confirmarSenha: '',
        perfil: dadosUsuario.perfil || 'USUARIO',
        permissoes: permissoesProcessadas,
        telefone: dadosUsuario.telefone || '',
        situacao: dadosUsuario.situacao || 'ATIVO'
      });
    }
  }, [usuario, empresaId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validação de senha
    const senha = formData.senha.trim();
    const confirmarSenha = formData.confirmarSenha.trim();

    if (!usuario && senha !== confirmarSenha) {
      setErroSenha('As senhas não coincidem');
      return;
    }

    if (!usuario && senha.length < 6) {
      setErroSenha('A senha deve ter no mínimo 6 caracteres');
      return;
    }


 

    const dadosParaSalvar = {
      empresaId: formData.empresaId,
      nomeUsuario: formData.nomeUsuario.trim(),
      nome: formData.nome.trim(),
      email: formData.email.trim(),
      perfil: formData.perfil,
      // ✅ Envia permissões no novo formato
      permissoes: formData.permissoes,
      telefone: formData.telefone,
      situacao: formData.situacao
    };

    if (!usuario || formData.senha) {
      dadosParaSalvar.senha = formData.senha;
    }

    onSalvar(dadosParaSalvar);
  };

  const handleChange = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
    if (campo === 'senha' || campo === 'confirmarSenha') {
      setErroSenha('');
    }
  };

  // ✅ NOVA FUNÇÃO: Toggle de permissão de módulo
  const handleModuloPermissaoChange = (modulo, acao) => {
    setFormData(prev => {
      const moduloAtual = prev.permissoes.modulos[modulo] || {};
      const novoValor = !moduloAtual[acao];

      return {
        ...prev,
        permissoes: {
          ...prev.permissoes,
          modulos: {
            ...prev.permissoes.modulos,
            [modulo]: {
              ...moduloAtual,
              [acao]: novoValor
            }
          }
        }
      };
    });
  };

  // ✅ NOVA FUNÇÃO: Toggle de ação especial
  const handleAcaoEspecialChange = (acao) => {
    setFormData(prev => {
      const acoesAtuais = prev.permissoes.acoes_especiais || [];
      const novasAcoes = acoesAtuais.includes(acao)
        ? acoesAtuais.filter(a => a !== acao)
        : [...acoesAtuais, acao];

      return {
        ...prev,
        permissoes: {
          ...prev.permissoes,
          acoes_especiais: novasAcoes
        }
      };
    });
  };

  // ⭐ PERFIS DISPONÍVEIS BASEADO NO USUÁRIO LOGADO
  const getPerfisDisponiveis = () => {
    const perfisBase = [
      { valor: 'USUARIO', label: 'Usuário', descricao: 'Acesso básico ao sistema' }
    ];

    // GERENTE pode criar: USUARIO, INSTRUTOR
    if (usuarioLogado?.perfil === 'GERENTE') {
      return [
        { valor: 'INSTRUTOR', label: 'Instrutor', descricao: 'Treinos e avaliações' },
        ...perfisBase
      ];
    }

    // ADMIN pode criar: USUARIO, INSTRUTOR, GERENTE
    if (usuarioLogado?.perfil === 'ADMIN') {
      return [
        { valor: 'GERENTE', label: 'Gerente', descricao: 'Gestão operacional' },
        { valor: 'INSTRUTOR', label: 'Instrutor', descricao: 'Treinos e avaliações' },
        ...perfisBase
      ];
    }

    // SUPER_ADMIN pode criar todos os perfis
    if (usuarioLogado?.perfil === 'SUPER_ADMIN') {
      return [
        { valor: 'SUPER_ADMIN', label: 'Super Admin', descricao: 'Acesso total irrestrito' },
        { valor: 'ADMIN', label: 'Administrador', descricao: 'Acesso total ao sistema' },
        { valor: 'GERENTE', label: 'Gerente', descricao: 'Gestão operacional' },
        { valor: 'INSTRUTOR', label: 'Instrutor', descricao: 'Treinos e avaliações' },
        { valor: 'USUARIO', label: 'Usuário', descricao: 'Acesso básico' }
      ];
    }

    return perfisBase;
  };

  const perfisDisponiveis = getPerfisDisponiveis();

  // ✅ MÓDULOS DISPONÍVEIS (conforme guia)
  const modulosDisponiveis = [
    { id: 'alunos', nome: 'Alunos', icon: '👥', acoes: ['acessar', 'criar', 'editar', 'excluir'] },
    { id: 'funcionarios', nome: 'Funcionários', icon: '👔', acoes: ['acessar', 'criar', 'editar', 'excluir'] },
    { id: 'matriculas', nome: 'Matrículas', icon: '📝', acoes: ['acessar', 'criar', 'editar', 'excluir'] },
    { id: 'frequencia', nome: 'Frequência', icon: '✅', acoes: ['acessar', 'registrar'] },
    { id: 'turmas', nome: 'Turmas', icon: '🏫', acoes: ['acessar', 'criar', 'editar', 'excluir'] },
    { id: 'financeiro', nome: 'Financeiro', icon: '💰', acoes: ['acessar', 'criar', 'editar'] },
    { id: 'relatorios', nome: 'Relatórios', icon: '📊', acoes: ['acessar', 'gerar', 'exportar'] }
  ];

  // ✅ AÇÕES ESPECIAIS (conforme guia)
  const acoesEspeciais = [
    { id: 'APLICAR_DESCONTO_MAIOR_30', nome: 'Descontos acima de 30%', icon: '🏷️' },
    { id: 'FECHAR_CAIXA', nome: 'Fechar caixa', icon: '🔒' },
    { id: 'GERAR_RELATORIOS_AVANCADOS', nome: 'Relatórios avançados', icon: '📈' },
    { id: 'ALTERAR_DATA_RETROATIVA', nome: 'Alterar datas retroativas', icon: '📅' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl mx-4 my-8">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700">
          <h3 className="text-2xl font-bold text-white">
            {usuario ? 'Editar Usuário' : 'Novo Usuário'}
          </h3>
          <button onClick={onCancelar} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* ==================== DADOS PESSOAIS ==================== */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User size={20} className="text-blue-600" />
                Dados Pessoais
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => handleChange('nome', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Nome completo do usuário"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Phone size={18} />
                    </div>
                    <input
                      type="text"
                      value={formData.telefone}
                      onChange={(e) => handleChange('telefone', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ==================== DADOS DE ACESSO ==================== */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Lock size={20} className="text-blue-600" />
                Dados de Acesso
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome de Usuário *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nomeUsuario}
                    onChange={(e) => handleChange('nomeUsuario', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="usuario.login"
                    disabled={!!usuario}
                  />
                  {usuario && (
                    <p className="text-xs text-gray-500 mt-1">
                      O nome de usuário não pode ser alterado
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="usuario@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {usuario ? 'Nova Senha (deixe em branco para manter)' : 'Senha *'}
                  </label>
                  <input
                    type="password"
                    required={!usuario}
                    value={formData.senha}
                    onChange={(e) => handleChange('senha', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {usuario ? 'Confirmar Nova Senha' : 'Confirmar Senha *'}
                  </label>
                  <input
                    type="password"
                    required={!usuario}
                    value={formData.confirmarSenha}
                    onChange={(e) => handleChange('confirmarSenha', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Repita a senha"
                  />
                </div>
              </div>
              {erroSenha && (
                <p className="text-red-600 text-sm mt-2">{erroSenha}</p>
              )}
            </div>

            {/* ==================== PERFIL ==================== */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Shield size={20} className="text-blue-600" />
                Perfil de Acesso
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {perfisDisponiveis.map((perfil) => (
                  <label
                    key={perfil.valor}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.perfil === perfil.valor
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                      }`}
                  >
                    <input
                      type="radio"
                      name="perfil"
                      value={perfil.valor}
                      checked={formData.perfil === perfil.valor}
                      onChange={(e) => handleChange('perfil', e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${formData.perfil === perfil.valor
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                          }`}
                      />
                      <span className="font-semibold text-gray-900">{perfil.label}</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-6">{perfil.descricao}</p>
                  </label>
                ))}
              </div>
            </div>

            {/* ==================== PERMISSÕES POR MÓDULO ==================== */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Permissões Personalizadas por Módulo
              </h4>
              <div className="space-y-4">
                {modulosDisponiveis.map((modulo) => (
                  <div key={modulo.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{modulo.icon}</span>
                      <span className="font-semibold text-gray-900">{modulo.nome}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {modulo.acoes.map((acao) => (
                        <label
                          key={`${modulo.id}-${acao}`}
                          className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.permissoes.modulos[modulo.id]?.[acao] === true}
                            onChange={() => handleModuloPermissaoChange(modulo.id, acao)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 capitalize">{acao}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ==================== AÇÕES ESPECIAIS ==================== */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Ações Especiais
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {acoesEspeciais.map((acao) => (
                  <label
                    key={acao.id}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.permissoes.acoes_especiais?.includes(acao.id)}
                      onChange={() => handleAcaoEspecialChange(acao.id)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-xl">{acao.icon}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {acao.nome}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* ==================== STATUS ==================== */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status do Usuário
              </label>
              <select
                value={formData.situacao}
                onChange={(e) => handleChange('situacao', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="ATIVO">Ativo</option>
                <option value="INATIVO">Inativo</option>
                <option value="BLOQUEADO">Bloqueado</option>
              </select>
            </div>

            {/* ==================== INFORMATIVO ==================== */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">💡</div>
                <div>
                  <h6 className="font-semibold text-blue-900 mb-1">Dicas de Segurança</h6>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Use senhas fortes com letras, números e caracteres especiais</li>
                    <li>• Perfis disponíveis dependem de seu nível de acesso</li>
                    <li>• Permissões personalizadas complementam o perfil padrão</li>
                    <li>• Usuários bloqueados não conseguem fazer login</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* ==================== FOOTER ==================== */}
          <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancelar}
              className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 shadow-md transition-colors"
            >
              <Save size={18} />
              Salvar Usuário
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UsuarioForm;