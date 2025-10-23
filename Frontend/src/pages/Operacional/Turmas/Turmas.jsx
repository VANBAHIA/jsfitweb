import React, { useState, useEffect } from 'react';
import { Users, Search, Loader, Edit, Trash2, Plus, Filter, X } from 'lucide-react';
import { turmasService } from '../../../services/api/turmasService';
import TurmaForm from './TurmaForm';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { usePermissoes } from '../../../hooks/usePermissoes';
import BotaoPermissao from '../../../components/common/BotaoPermissao';



function Turmas() {
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [turmaSelecionada, setTurmaSelecionada] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, turma: null });
  const [salvando, setSalvando] = useState(false);
  const { temPermissao } = usePermissoes();


  const [filtros, setFiltros] = useState({
    busca: '',
    status: '',
    sexo: ''
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const resposta = await turmasService.listarTodos();

      const turmasData = resposta.data?.data || resposta.data || {};
      const turmasArray = turmasData.turmas || [];

      setTurmas(turmasArray);
      setErro(null);
    } catch (error) {
      setErro('Erro ao carregar turmas');
      console.error('❌ Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNovaTurma = () => {
    setTurmaSelecionada(null);
    setMostrarForm(true);
  };

  const handleEditarTurma = async (turma) => {
    try {
      const resposta = await turmasService.buscarPorId(turma.id);
      setTurmaSelecionada(resposta.data?.data || resposta.data);
      setMostrarForm(true);
    } catch (error) {
      alert('Erro ao carregar dados da turma: ' + error.message);
    }
  };

  const handleSalvarTurma = async (dados) => {
    try {
      setSalvando(true);

      if (turmaSelecionada) {
        await turmasService.atualizar(turmaSelecionada.id, dados);
      } else {
        await turmasService.criar(dados);
      }

      setMostrarForm(false);
      setTurmaSelecionada(null);
      await carregarDados();
    } catch (error) {
      console.error('❌ Erro:', error.response?.data || error.message);
      alert('Erro ao salvar: ' + (error.response?.data?.message || error.message));
    } finally {
      setSalvando(false);
    }
  };

  const handleConfirmarExclusao = (turma) => {
    setConfirmDelete({ isOpen: true, turma });
  };

  const handleExcluirTurma = async () => {
    try {
      await turmasService.excluir(confirmDelete.turma.id);
      setConfirmDelete({ isOpen: false, turma: null });
      carregarDados();
    } catch (error) {
      alert('Erro ao excluir turma: ' + error.message);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const limparFiltros = () => {
    setFiltros({ busca: '', status: '', sexo: '' });
  };

  const obterTextoSexo = (sexo) => {
    switch (sexo) {
      case 'MASCULINO': return '♂️ Masculino';
      case 'FEMININO': return '♀️ Feminino';
      case 'AMBOS': return '⚥ Ambos';
      default: return sexo;
    }
  };

  const turmasFiltradas = turmas.filter(turma => {
    const busca = filtros.busca.toLowerCase();
    const matchBusca = !filtros.busca || turma.nome?.toLowerCase().includes(busca);
    const matchStatus = !filtros.status || turma.status === filtros.status;
    const matchSexo = !filtros.sexo || turma.sexo === filtros.sexo;

    return matchBusca && matchStatus && matchSexo;
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
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Gestão de Turmas</h2>
              <p className="text-sm text-gray-600">Total: {turmasFiltradas.length} turmas cadastradas</p>
            </div>
          </div>
          <BotaoPermissao
            modulo="turmas"
            acao="criar"
            onClick={handleNovaTurma}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-semibold shadow-md">
            <Plus size={20} />
            Nova Turma
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
                  placeholder="Buscar por nome da turma..."
                  value={filtros.busca}
                  onChange={(e) => handleFiltroChange('busca', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <select
                value={filtros.sexo}
                onChange={(e) => handleFiltroChange('sexo', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Todos os Sexos</option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMININO">Feminino</option>
                <option value="AMBOS">Ambos</option>
              </select>
            </div>
            <div className="flex gap-2">
              <select
                value={filtros.status}
                onChange={(e) => handleFiltroChange('status', e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Todos Status</option>
                <option value="ATIVO">Ativas</option>
                <option value="INATIVO">Inativas</option>
              </select>
              {(filtros.busca || filtros.status || filtros.sexo) && (
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Nome da Turma</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Sexo</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Horários</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Instrutores</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {turmasFiltradas.map((turma) => (
                <tr key={turma.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Users className="text-blue-600" size={18} />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900 block">
                          {turma.nome}
                        </span>
                        {turma.observacoes && (
                          <span className="text-xs text-gray-500">{turma.observacoes}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-gray-700">
                      {obterTextoSexo(turma.sexo)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                      {turma.horarios?.length || 0} horário(s)
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                      {turma.instrutores?.length || 0} instrutor(es)
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${turma.status === 'ATIVO'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {turma.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <BotaoPermissao
                        modulo="turmas"
                        acao="Editar"
                        onClick={() => handleEditarTurma(turma)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Editar turma">
                        <Edit size={18} />
                      </BotaoPermissao>
                      <BotaoPermissao
                        modulo="turmas"
                        acao="excluir"
                        onClick={() => handleConfirmarExclusao(turma)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Excluir turma">
                        <Trash2 size={18} />
                      </BotaoPermissao>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {turmasFiltradas.length === 0 && !erro && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Users className="text-gray-400" size={32} />
            </div>
            <p className="text-gray-600 font-medium mb-1">
              {filtros.busca || filtros.status || filtros.sexo
                ? 'Nenhuma turma encontrada com os filtros aplicados'
                : 'Nenhuma turma cadastrada'}
            </p>
            <p className="text-sm text-gray-500">
              {!filtros.busca && !filtros.status && !filtros.sexo && 'Clique em "Nova Turma" para começar'}
            </p>
          </div>
        )}
      </div>

      {/* Formulário */}
      {mostrarForm && (
        <TurmaForm
          turma={turmaSelecionada}
          onSalvar={handleSalvarTurma}
          onCancelar={() => {
            setMostrarForm(false);
            setTurmaSelecionada(null);
          }}
          salvando={salvando}
        />
      )}

      {/* Diálogo de Confirmação */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        titulo="Confirmar Exclusão"
        mensagem={`Tem certeza que deseja excluir a turma "${confirmDelete.turma?.nome}"? Esta ação não poderá ser desfeita.`}
        onConfirmar={handleExcluirTurma}
        onCancelar={() => setConfirmDelete({ isOpen: false, turma: null })}
      />
    </div>
  );
}

export default Turmas;