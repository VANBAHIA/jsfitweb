import React, { useState, useEffect } from 'react';
import { UserCog, Search, Loader, Edit, Trash2, Plus, Filter, X, Shield, Mail, Phone } from 'lucide-react';
import { usuariosService } from '../../../services/api/usuariosService';
import { empresasService } from '../../../services/api/empresasService';
import UsuarioForm from './UsuarioForm';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { useProtecaoModulo } from '../../../hooks/useProtecaoModulo';
import ErrorToast from '../../../components/common/ErrorToast';
import { usePermissoes } from '../../../hooks/usePermissoes';
import BotaoPermissao from '../../../components/common/BotaoPermissao';



function Usuarios() {
  // ⭐ Use assim
  const [erroDelete, setErroDelete] = useState({ isOpen: false, mensagem: '' });

  const { autorizado } = useProtecaoModulo(['SUPER_ADMIN', 'ADMIN', 'GERENTE']);
  const { temPermissao } = usePermissoes();
  const usuarioLogado = usuariosService.getUsuarioLogado();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, usuario: null });
  const [salvando, setSalvando] = useState(false);
  const [empresaId, setEmpresaId] = useState(null);
  const [empresas, setEmpresas] = useState([]);

  const [filtros, setFiltros] = useState({
    busca: '',
    perfil: '',
    situacao: ''
  });

  const carregarTodasEmpresas = async () => {
    try {
      const resposta = await empresasService.listarTodos({ limit: 100 });
      const empresasData = resposta.data?.data || resposta.data || {};
      const empresasArray = empresasData.empresas || [];
      setEmpresas(empresasArray);
    } catch (error) {
      console.error('❌ Erro ao carregar empresas:', error);
    }
  };

  const getNomeEmpresa = (empresaId) => {
    const empresa = empresas.find(e => e.id === empresaId);
    return empresa?.nomeFantasia || empresa?.razaoSocial || 'Não informado';
  };
  useEffect(() => {
    carregarEmpresa();
    carregarTodasEmpresas();
  }, []);

  useEffect(() => {
    if (empresaId) {
      carregarDados();
    }
  }, [empresaId]);

  // Adicione esta função para obter o perfil do usuário logado
  const getPerfilUsuarioLogado = () => {
    const usuario = usuariosService.getUsuarioLogado();
    return usuario?.perfil;
  };

  const carregarEmpresa = async () => {
    try {
      const resposta = await empresasService.listarTodos({ limit: 1 });
      const empresasData = resposta.data?.data || resposta.data || {};
      const empresasArray = empresasData.empresas || [];

      if (empresasArray.length > 0) {
        setEmpresaId(empresasArray[0].id);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar empresa:', error);
    }
  };

  const carregarDados = async () => {
    try {
      setLoading(true);
      const resposta = await usuariosService.listarTodos({ empresaId });

      let usuariosArray = resposta.data?.data?.usuarios || [];

      // ⭐ FILTRO CORRIGIDO
      const perfilLogado = usuariosService.getUsuarioLogado()?.perfil;

      // Se NÃO for SUPER_ADMIN, exclui os SUPER_ADMIN da lista
      if (perfilLogado !== 'SUPER_ADMIN') {
        usuariosArray = usuariosArray.filter(u => u.perfil !== 'SUPER_ADMIN');
      }
      // Se FOR SUPER_ADMIN, mostra todos

      setUsuarios(usuariosArray);
      setErro(null);
    } catch (error) {
      setErro('Erro ao carregar usuários');
      console.error('❌ Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNovoUsuario = () => {
    setUsuarioSelecionado(null);
    setMostrarForm(true);
  };

  const handleEditarUsuario = async (usuario) => {
    try {
      const resposta = await usuariosService.buscarPorId(usuario.id);
      setUsuarioSelecionado(resposta.data?.data || resposta.data);
      setMostrarForm(true);
    } catch (error) {
      alert('Erro ao carregar dados do usuário: ' + error.message);
    }
  };

  const handleSalvarUsuario = async (dados) => {
    try {
      setSalvando(true);

      if (usuarioSelecionado) {
        await usuariosService.atualizar(usuarioSelecionado.id, dados);
      } else {
        await usuariosService.criar(dados);
      }

      setMostrarForm(false);
      setUsuarioSelecionado(null);
      await carregarDados();
    } catch (error) {
      console.error('❌ Erro:', error.response?.data || error.message);
      alert('Erro ao salvar: ' + (error.response?.data?.message || error.message));
    } finally {
      setSalvando(false);
    }
  };

  const handleConfirmarExclusao = (usuario) => {
    if (usuario.id === usuarioLogado?.id) {
      setErroDelete({
        isOpen: true,
        mensagem: 'Você não pode excluir sua própria conta de usuário.'
      });
      return;
    }
    setConfirmDelete({ isOpen: true, usuario });
  };


  const handleExcluirUsuario = async () => {
    try {
      await usuariosService.excluir(confirmDelete.usuario.id);
      setConfirmDelete({ isOpen: false, usuario: null });
      carregarDados();
    } catch (error) {
      alert('Erro ao excluir usuário: ' + error.message);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const limparFiltros = () => {
    setFiltros({ busca: '', perfil: '', situacao: '' });
  };

  const usuariosFiltrados = usuarios.filter(user => {
    const busca = filtros.busca.toLowerCase();
    const matchBusca = !filtros.busca ||
      user.nome?.toLowerCase().includes(busca) ||
      user.nomeUsuario?.toLowerCase().includes(busca) ||
      user.email?.toLowerCase().includes(busca);
    const matchPerfil = !filtros.perfil || user.perfil === filtros.perfil;
    const matchSituacao = !filtros.situacao || user.situacao === filtros.situacao;

    return matchBusca && matchPerfil && matchSituacao;
  });

  const getPerfilBadge = (perfil) => {
    const badges = {
      SUPER_ADMIN: { bg: 'bg-purple-100', text: 'text-purple-800', icon: '👑' },
      ADMIN: { bg: 'bg-purple-100', text: 'text-purple-800', icon: '👑' },
      GERENTE: { bg: 'bg-blue-100', text: 'text-blue-800', icon: '👔' },
      INSTRUTOR: { bg: 'bg-green-100', text: 'text-green-800', icon: '🏋️' },
      USUARIO: { bg: 'bg-gray-100', text: 'text-gray-800', icon: '👤' }
    };
    return badges[perfil] || badges.USUARIO;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }


  if (!autorizado) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg text-center">
          <h3 className="font-bold text-lg mb-2">🔒 Acesso Negado</h3>
          <p>Seu perfil não tem permissão para acessar este módulo.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserCog className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Usuários do Sistema</h2>
              <p className="text-sm text-gray-600">Total: {usuariosFiltrados.length} usuários cadastrados</p>
            </div>
          </div>
          <BotaoPermissao
            modulo="usuarios"
            acao="criar"
            onClick={handleNovoUsuario}
            disabled={!empresaId}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
            Novo Usuário
          </BotaoPermissao>
        </div>

        {/* Filtros */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={18} className="text-gray-600" />
            <h3 className="font-semibold text-gray-800">Filtros de Busca</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar por nome, usuário ou e-mail..."
                  value={filtros.busca}
                  onChange={(e) => handleFiltroChange('busca', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <select
                value={filtros.perfil}
                onChange={(e) => handleFiltroChange('perfil', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos os Perfis</option>
                <option value="ADMIN">Administrador</option>
                <option value="GERENTE">Gerente</option>
                <option value="INSTRUTOR">Instrutor</option>
                <option value="USUARIO">Usuário</option>
              </select>
            </div>
            <div className="flex gap-2">
              <select
                value={filtros.situacao}
                onChange={(e) => handleFiltroChange('situacao', e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas Situações</option>
                <option value="ATIVO">Ativos</option>
                <option value="INATIVO">Inativos</option>
                <option value="BLOQUEADO">Bloqueados</option>
              </select>
              {(filtros.busca || filtros.perfil || filtros.situacao) && (
                <button
                  onClick={limparFiltros}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
                  title="Limpar filtros"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {erro && (
          <div className="m-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {erro}
          </div>
        )}

        {!empresaId && (
          <div className="m-6 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded">
            <strong>Atenção:</strong> Cadastre primeiro os dados da academia antes de criar usuários.
          </div>
        )}

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Usuário</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Contato</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Perfil</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Empresa</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {usuariosFiltrados.map((usuario) => {
                const perfilBadge = getPerfilBadge(usuario.perfil);
                return (
                  <tr key={usuario.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-lg">
                            {usuario.nome?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{usuario.nome}</p>
                          <p className="text-sm text-gray-500">@{usuario.nomeUsuario}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={14} />
                          <span>{usuario.email}</span>
                        </div>
                        {usuario.telefone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone size={14} />
                            <span>{usuario.telefone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${perfilBadge.bg} ${perfilBadge.text}`}>
                        <span>{perfilBadge.icon}</span>
                        {usuario.perfil}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          🏢 {getNomeEmpresa(usuario.empresaId)}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${usuario.situacao === 'ATIVO'
                        ? 'bg-green-100 text-green-800'
                        : usuario.situacao === 'BLOQUEADO'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                        }`}>
                        {usuario.situacao || 'ATIVO'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <BotaoPermissao
                          modulo="usuarios"
                          acao="editar"
                          onClick={() => handleEditarUsuario(usuario)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Editar usuário"
                        >
                          <Edit size={18} />
                        </BotaoPermissao>
                        <BotaoPermissao
                          modulo="usuarios"
                          acao="excluir"
                          onClick={() => handleConfirmarExclusao(usuario)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Excluir usuário"
                        >
                          <Trash2 size={18} />
                        </BotaoPermissao>

                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {usuariosFiltrados.length === 0 && !erro && empresaId && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <UserCog className="text-gray-400" size={32} />
            </div>
            <p className="text-gray-600 font-medium mb-1">
              {filtros.busca || filtros.perfil || filtros.situacao
                ? 'Nenhum usuário encontrado com os filtros aplicados'
                : 'Nenhum usuário cadastrado'}
            </p>
            <p className="text-sm text-gray-500">
              {!filtros.busca && !filtros.perfil && !filtros.situacao && (
                temPermissao('usuarios', 'criar')
                  ? 'Clique em "Novo Usuário" para começar'
                  : 'Você não tem permissão para criar usuários'
              )}
            </p>
          </div>
        )}
      </div>

      {/* Formulário */}
      {mostrarForm && (
        <UsuarioForm
          usuario={usuarioSelecionado}
          empresaId={empresaId}
          onSalvar={handleSalvarUsuario}
          onCancelar={() => {
            setMostrarForm(false);
            setUsuarioSelecionado(null);
          }}
          salvando={salvando}
        />
      )}
      {erroDelete.isOpen && (
        <ErrorToast
          mensagem={erroDelete.mensagem}
          onFechar={() => setErroDelete({ isOpen: false, mensagem: '' })}
        />
      )}
      {/* Diálogo de Confirmação */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        titulo="Confirmar Exclusão"
        mensagem={`Tem certeza que deseja excluir o usuário "${confirmDelete.usuario?.nome}"? Esta ação não poderá ser desfeita.`}
        onConfirmar={handleExcluirUsuario}
        onCancelar={() => setConfirmDelete({ isOpen: false, usuario: null })}
      />
    </div>
  );
}

export default Usuarios;