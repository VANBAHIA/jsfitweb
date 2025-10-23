import React, { useState, useEffect } from 'react';
import { Briefcase, Search, Loader, Edit, Trash2, Plus, Filter, X } from 'lucide-react';
import { funcoesService } from '../../../services/api/funcoesService';
import FuncaoForm from './FuncaoForm';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { usePermissoes } from '../../../hooks/usePermissoes';
import BotaoPermissao from '../../../components/common/BotaoPermissao';


function Funcoes() {
  const [funcoes, setFuncoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [funcaoSelecionada, setFuncaoSelecionada] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, funcao: null });
  const [salvando, setSalvando] = useState(false);

  const [filtros, setFiltros] = useState({
    busca: '',
    status: ''
  });
  const { temPermissao } = usePermissoes();



  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const resposta = await funcoesService.listarTodos();

      const funcoesData = resposta.data?.data || resposta.data || {};
      const funcoesArray = funcoesData.funcoes || [];

      setFuncoes(funcoesArray);
      setErro(null);
    } catch (error) {
      setErro('Erro ao carregar funções');
      console.error('❌ Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNovaFuncao = () => {
    setFuncaoSelecionada(null);
    setMostrarForm(true);
  };

  const handleEditarFuncao = async (funcao) => {
    try {
      const resposta = await funcoesService.buscarPorId(funcao.id);
      setFuncaoSelecionada(resposta.data?.data || resposta.data);
      setMostrarForm(true);
    } catch (error) {
      alert('Erro ao carregar dados da função: ' + error.message);
    }
  };

  const handleSalvarFuncao = async (dados) => {
    try {
      setSalvando(true);

      if (funcaoSelecionada) {
        await funcoesService.atualizar(funcaoSelecionada.id, dados);
      } else {
        await funcoesService.criar(dados);
      }

      setMostrarForm(false);
      setFuncaoSelecionada(null);
      await carregarDados();
    } catch (error) {
      console.error('❌ Erro:', error.response?.data || error.message);
      alert('Erro ao salvar: ' + (error.response?.data?.message || error.message));
    } finally {
      setSalvando(false);
    }
  };

  const handleConfirmarExclusao = (funcao) => {
    setConfirmDelete({ isOpen: true, funcao });
  };

  const handleExcluirFuncao = async () => {
    try {
      await funcoesService.excluir(confirmDelete.funcao.id);
      setConfirmDelete({ isOpen: false, funcao: null });
      carregarDados();
    } catch (error) {
      alert('Erro ao excluir função: ' + error.message);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const limparFiltros = () => {
    setFiltros({ busca: '', status: '' });
  };

  const funcoesFiltradas = funcoes.filter(func => {
    const busca = filtros.busca.toLowerCase();
    const matchBusca = !filtros.busca || func.funcao?.toLowerCase().includes(busca);
    const matchStatus = !filtros.status || func.status === filtros.status;

    return matchBusca && matchStatus;
  });

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
              <Briefcase className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Gestão de Funções</h2>
              <p className="text-sm text-gray-600">Total: {funcoesFiltradas.length} funções cadastradas</p>
            </div>
          </div>
          <BotaoPermissao
            modulo="funcoes"
            acao="criar"
            onClick={handleNovaFuncao}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-semibold shadow-md">
            <Plus size={20} />
            Nova Função
          </BotaoPermissao>
        </div>

        {/* Filtros */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={18} className="text-gray-600" />
            <h3 className="font-semibold text-gray-800">Filtros de Busca</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar por nome da função..."
                  value={filtros.busca}
                  onChange={(e) => handleFiltroChange('busca', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filtros.status}
                onChange={(e) => handleFiltroChange('status', e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Todos os Status</option>
                <option value="ATIVO">Ativas</option>
                <option value="INATIVO">Inativas</option>
              </select>
              {(filtros.busca || filtros.status) && (
                <button
                  onClick={limparFiltros}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
                  title="Limpar filtros">
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

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Nome da Função</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {funcoesFiltradas.map((funcao) => (
                <tr key={funcao.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Briefcase className="text-blue-600" size={18} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {funcao.funcao || 'Sem nome'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${funcao.status === 'ATIVO'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {funcao.status || 'ATIVO'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <BotaoPermissao
                        modulo="funcoes"
                        acao="editar"
                         onClick={() => handleEditarFuncao(funcao)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Editar função">
                        <Edit size={18} />
                      </BotaoPermissao>
                      <BotaoPermissao
                        modulo="funcoes"
                        acao="excluir"
                         onClick={() => handleConfirmarExclusao(funcao)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Excluir função">
                        <Trash2 size={18} />
                      </BotaoPermissao>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {funcoesFiltradas.length === 0 && !erro && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Briefcase className="text-gray-400" size={32} />
            </div>
            <p className="text-gray-600 font-medium mb-1">
              {filtros.busca || filtros.status
                ? 'Nenhuma função encontrada com os filtros aplicados'
                : 'Nenhuma função cadastrada'}
            </p>
            <p className="text-sm text-gray-500">
              {!filtros.busca && !filtros.status && 'Clique em "Nova Função" para começar'}
            </p>
          </div>
        )}
      </div>

      {/* Formulário */}
      {mostrarForm && (
        <FuncaoForm
          funcao={funcaoSelecionada}
          onSalvar={handleSalvarFuncao}
          onCancelar={() => {
            setMostrarForm(false);
            setFuncaoSelecionada(null);
          }}
          salvando={salvando}
        />
      )}

      {/* Diálogo de Confirmação */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        titulo="Confirmar Exclusão"
        mensagem={`Tem certeza que deseja excluir a função "${confirmDelete.funcao?.funcao}"? Esta ação não poderá ser desfeita.`}
        onConfirmar={handleExcluirFuncao}
        onCancelar={() => setConfirmDelete({ isOpen: false, funcao: null })}
      />
    </div>
  );
}

export default Funcoes;