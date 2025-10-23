import React, { useState, useEffect } from 'react';
import { GraduationCap, Search, Loader, Edit, Trash2, Plus, Filter, X, UserCheck } from 'lucide-react';
import { instrutoresService } from '../../../services/api/instrutoresService';
import InstrutorForm from './InstrutorForm';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { format } from 'date-fns';
import BotaoPermissao from '../../../components/common/BotaoPermissao';

function Instrutores() {
  const [instrutores, setInstrutores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [instrutorSelecionado, setInstrutorSelecionado] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, instrutor: null });
  const [salvando, setSalvando] = useState(false);

  const [filtros, setFiltros] = useState({
    busca: '',
    situacao: ''
  });

  useEffect(() => {
    carregarInstrutores();
  }, []);

  const carregarInstrutores = async () => {
    try {
      setLoading(true);
      const resposta = await instrutoresService.listarTodos();
      const instrutoresArray = resposta.data?.data || resposta.data || [];
      setInstrutores(instrutoresArray);
      setErro(null);
    } catch (error) {
      setErro('Erro ao carregar instrutores');
      console.error('❌ Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNovoInstrutor = () => {
    setInstrutorSelecionado(null);
    setMostrarForm(true);
  };

  const handleEditarInstrutor = async (instrutor) => {
    try {
      const resposta = await instrutoresService.buscarPorId(instrutor.id);
      setInstrutorSelecionado(resposta.data?.data || resposta.data);
      setMostrarForm(true);
    } catch (error) {
      alert('Erro ao carregar dados do instrutor: ' + error.message);
    }
  };

  const handleSalvarInstrutor = async (dados) => {
    try {
      setSalvando(true);

      if (instrutorSelecionado) {
        await instrutoresService.atualizar(instrutorSelecionado.id, dados);
      } else {
        await instrutoresService.criar(dados);
      }

      setMostrarForm(false);
      setInstrutorSelecionado(null);
      await carregarInstrutores();
    } catch (error) {
      console.error('❌ Erro:', error.response?.data || error.message);
      alert('Erro ao salvar: ' + (error.response?.data?.message || error.message));
    } finally {
      setSalvando(false);
    }
  };

  const handleConfirmarExclusao = (instrutor) => {
    setConfirmDelete({ isOpen: true, instrutor });
  };

  const handleExcluirInstrutor = async () => {
    try {
      await instrutoresService.excluir(confirmDelete.instrutor.id);
      setConfirmDelete({ isOpen: false, instrutor: null });
      carregarInstrutores();
    } catch (error) {
      alert('Erro ao excluir instrutor: ' + error.message);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const limparFiltros = () => {
    setFiltros({ busca: '', situacao: '' });
  };

  const instrutoresFiltrados = instrutores.filter(instrutor => {
    const busca = filtros.busca.toLowerCase();
    const matchBusca = !filtros.busca ||
      instrutor.funcionario?.pessoa?.nome1?.toLowerCase().includes(busca) ||
      instrutor.funcionario?.matricula?.toString().includes(busca);

    const situacaoInstrutor = instrutor.funcionario?.situacao || 'ATIVO';
    const matchSituacao = !filtros.situacao || situacaoInstrutor === filtros.situacao;

    return matchBusca && matchSituacao;
  });

  const formatarData = (data) => {
    if (!data) return 'N/A';
    try {
      return format(new Date(data), 'dd/MM/yyyy');
    } catch {
      return 'Data inválida';
    }
  };

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
            <div className="p-2 bg-purple-100 rounded-lg">
              <GraduationCap className="text-purple-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Gestão de Instrutores</h2>
              <p className="text-sm text-gray-600">Total: {instrutoresFiltrados.length} instrutores</p>
            </div>
          </div>
          <BotaoPermissao
            modulo="instrutores"
            acao="criar"
            onClick={handleNovoInstrutor}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 font-semibold shadow-md">
            <Plus size={20} />
            Novo Instrutor
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
                  placeholder="Buscar por nome ou matrícula do funcionário..."
                  value={filtros.busca}
                  onChange={(e) => handleFiltroChange('busca', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filtros.situacao}
                onChange={(e) => handleFiltroChange('situacao', e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                <option value="">Todas Situações</option>
                <option value="ATIVO">Ativos</option>
                <option value="INATIVO">Inativos</option>
              </select>
              {(filtros.busca || filtros.situacao) && (
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Matrícula</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Nome</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">CPF</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Função</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Situação</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Cadastro</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {instrutoresFiltrados.map((instrutor) => (
                <tr key={instrutor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">
                    {instrutor.funcionario?.matricula || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {instrutor.funcionario?.pessoa?.nome1 || 'Sem nome'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                    {instrutor.funcionario?.pessoa?.doc1 || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {instrutor.funcionario?.funcao?.funcao || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      instrutor.funcionario?.situacao === 'ATIVO'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {instrutor.funcionario?.situacao || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatarData(instrutor.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <BotaoPermissao
                        modulo="instrutores"
                        acao="editar"
                        onClick={() => handleEditarInstrutor(instrutor)}
                        className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                        title="Editar instrutor">
                        <Edit size={18} />
                      </BotaoPermissao>

                      <BotaoPermissao
                        modulo="instrutores"
                        acao="excluir"
                        onClick={() => handleConfirmarExclusao(instrutor)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Excluir instrutor">
                        <Trash2 size={18} />
                      </BotaoPermissao>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {instrutoresFiltrados.length === 0 && !erro && (
          <div className="p-8 text-center text-gray-500">
            {filtros.busca || filtros.situacao
              ? 'Nenhum instrutor encontrado com os filtros aplicados'
              : 'Nenhum instrutor cadastrado'}
          </div>
        )}
      </div>

      {/* Formulário */}
      {mostrarForm && (
        <InstrutorForm
          instrutor={instrutorSelecionado}
          onSalvar={handleSalvarInstrutor}
          onCancelar={() => {
            setMostrarForm(false);
            setInstrutorSelecionado(null);
          }}
          salvando={salvando}
        />
      )}

      {/* Diálogo de Confirmação */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        titulo="Confirmar Exclusão"
        mensagem={`Tem certeza que deseja remover ${confirmDelete.instrutor?.funcionario?.pessoa?.nome1} da lista de instrutores? O funcionário continuará cadastrado no sistema.`}
        onConfirmar={handleExcluirInstrutor}
        onCancelar={() => setConfirmDelete({ isOpen: false, instrutor: null })}
      />
    </div>
  );
}

export default Instrutores;