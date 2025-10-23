import React, { useState, useEffect } from 'react';
import { CreditCard, Search, Loader, Edit, Trash2, Plus, Filter, X } from 'lucide-react';
import { planosService } from '../../../services/api/planosService';
import PlanoForm from './PlanoForm';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { usePermissoes } from '../../../hooks/usePermissoes';
import BotaoPermissao from '../../../components/common/BotaoPermissao';


function Planos() {
  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [planoSelecionado, setPlanoSelecionado] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, plano: null });
  const [salvando, setSalvando] = useState(false);
  const { temPermissao } = usePermissoes();


  const [filtros, setFiltros] = useState({
    busca: '',
    status: '',
    periodicidade: '',
    tipoCobranca: '' // ✅ NOVO
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const resposta = await planosService.listarTodos();

      const planosData = resposta.data?.data || resposta.data || {};
      const planosArray = planosData.planos || [];

      setPlanos(planosArray);
      setErro(null);
    } catch (error) {
      setErro('Erro ao carregar planos');
      console.error('❌ Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNovoPlano = () => {
    setPlanoSelecionado(null);
    setMostrarForm(true);
  };

  const handleEditarPlano = async (plano) => {
    try {
      const resposta = await planosService.buscarPorId(plano.id);
      setPlanoSelecionado(resposta.data?.data || resposta.data);
      setMostrarForm(true);
    } catch (error) {
      alert('Erro ao carregar dados do plano: ' + error.message);
    }
  };

  const handleSalvarPlano = async (dados) => {
    try {
      setSalvando(true);

      if (planoSelecionado) {
        await planosService.atualizar(planoSelecionado.id, dados);
      } else {
        await planosService.criar(dados);
      }

      setMostrarForm(false);
      setPlanoSelecionado(null);
      await carregarDados();
    } catch (error) {
      console.error('❌ Erro:', error.response?.data || error.message);
      alert('Erro ao salvar: ' + (error.response?.data?.message || error.message));
    } finally {
      setSalvando(false);
    }
  };

  const handleConfirmarExclusao = (plano) => {
    setConfirmDelete({ isOpen: true, plano });
  };

  const handleExcluirPlano = async () => {
    try {
      await planosService.excluir(confirmDelete.plano.id);
      setConfirmDelete({ isOpen: false, plano: null });
      carregarDados();
    } catch (error) {
      alert('Erro ao excluir plano: ' + error.message);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const limparFiltros = () => {
    setFiltros({ busca: '', status: '', periodicidade: '', tipoCobranca: '' });
  };

  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const obterTextoPeriodicidade = (plano) => {
    const { periodicidade, numeroMeses, numeroDias } = plano;

    switch (periodicidade) {
      case 'MENSAL': return 'Mensal';
      case 'BIMESTRAL': return 'Bimestral';
      case 'TRIMESTRAL': return 'Trimestral';
      case 'QUADRIMESTRAL': return 'Quadrimestral';
      case 'SEMESTRAL': return 'Semestral';
      case 'ANUAL': return 'Anual';
      case 'MESES': return `${numeroMeses} ${numeroMeses === 1 ? 'Mês' : 'Meses'}`;
      case 'DIAS': return `${numeroDias} ${numeroDias === 1 ? 'Dia' : 'Dias'}`;
      default: return periodicidade;
    }
  };

  const planosFiltrados = planos.filter(plano => {
    const busca = filtros.busca.toLowerCase();
    const matchBusca = !filtros.busca ||
      plano.nome?.toLowerCase().includes(busca) ||
      plano.codigo?.toLowerCase().includes(busca);
    const matchStatus = !filtros.status || plano.status === filtros.status;
    const matchPeriodicidade = !filtros.periodicidade || plano.periodicidade === filtros.periodicidade;
    const matchTipoCobranca = !filtros.tipoCobranca || plano.tipoCobranca === filtros.tipoCobranca; // ✅ NOVO

    return matchBusca && matchStatus && matchPeriodicidade && matchTipoCobranca;
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
              <CreditCard className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Gestão de Planos</h2>
              <p className="text-sm text-gray-600">Total: {planosFiltrados.length} planos cadastrados</p>
            </div>
          </div>
          <BotaoPermissao
            modulo="planos"
            acao="criar"
            onClick={handleNovoPlano}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-semibold shadow-md">
            <Plus size={20} />
            Novo Plano
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
                  placeholder="Buscar por nome ou código..."
                  value={filtros.busca}
                  onChange={(e) => handleFiltroChange('busca', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <select
                value={filtros.tipoCobranca}
                onChange={(e) => handleFiltroChange('tipoCobranca', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Todos os Tipos</option>
                <option value="RECORRENTE">🔄 Recorrente</option>
                <option value="UNICA">💰 Única</option>
              </select>
            </div>
            <div>
              <select
                value={filtros.periodicidade}
                onChange={(e) => handleFiltroChange('periodicidade', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Todas Periodicidades</option>
                <option value="MENSAL">Mensal</option>
                <option value="BIMESTRAL">Bimestral</option>
                <option value="TRIMESTRAL">Trimestral</option>
                <option value="SEMESTRAL">Semestral</option>
                <option value="ANUAL">Anual</option>
              </select>
            </div>
            <div className="flex gap-2">
              <select
                value={filtros.status}
                onChange={(e) => handleFiltroChange('status', e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Todos Status</option>
                <option value="ATIVO">Ativos</option>
                <option value="INATIVO">Inativos</option>
              </select>
              {(filtros.busca || filtros.status || filtros.periodicidade) && (
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Código</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Nome do Plano</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Tipo de Cobrança</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Periodicidade</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Valor</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {planosFiltrados.map((plano) => (
                <tr key={plano.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-gray-600">{plano.codigo}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <CreditCard className="text-blue-600" size={18} />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900 block">
                          {plano.nome}
                        </span>
                        {plano.descricao && (
                          <span className="text-xs text-gray-500">{plano.descricao}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${plano.tipoCobranca === 'RECORRENTE'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                      }`}>
                      {plano.tipoCobranca === 'RECORRENTE' ? '🔄 Recorrente' : '💰 Única'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                      {obterTextoPeriodicidade(plano)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-bold text-green-600">
                      {formatarValor(plano.valorMensalidade)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${plano.status === 'ATIVO'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {plano.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <BotaoPermissao
                        modulo="planos"
                        acao="editar"
                        onClick={() => handleEditarPlano(plano)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Editar plano">
                        <Edit size={18} />
                      </BotaoPermissao>
                      <BotaoPermissao
                        modulo="planos"
                        acao="excluir"
                        onClick={() => handleConfirmarExclusao(plano)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Excluir plano">
                        <Trash2 size={18} />
                      </BotaoPermissao>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {planosFiltrados.length === 0 && !erro && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <CreditCard className="text-gray-400" size={32} />
            </div>
            <p className="text-gray-600 font-medium mb-1">
              {filtros.busca || filtros.status || filtros.periodicidade
                ? 'Nenhum plano encontrado com os filtros aplicados'
                : 'Nenhum plano cadastrado'}
            </p>
            <p className="text-sm text-gray-500">
              {!filtros.busca && !filtros.status && !filtros.periodicidade && 'Clique em "Novo Plano" para começar'}
            </p>
          </div>
        )}
      </div>

      {/* Formulário */}
      {mostrarForm && (
        <PlanoForm
          plano={planoSelecionado}
          onSalvar={handleSalvarPlano}
          onCancelar={() => {
            setMostrarForm(false);
            setPlanoSelecionado(null);
          }}
          salvando={salvando}
        />
      )}

      {/* Diálogo de Confirmação */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        titulo="Confirmar Exclusão"
        mensagem={`Tem certeza que deseja excluir o plano "${confirmDelete.plano?.nome}"? Esta ação não poderá ser desfeita.`}
        onConfirmar={handleExcluirPlano}
        onCancelar={() => setConfirmDelete({ isOpen: false, plano: null })}
      />
    </div>
  );
}

export default Planos;