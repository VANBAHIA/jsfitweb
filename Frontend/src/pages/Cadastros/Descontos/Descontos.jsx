import React, { useState, useEffect } from 'react';
import { Percent, Search, Loader, Edit, Trash2, Plus, Filter, X, DollarSign } from 'lucide-react';
import { descontosService } from '../../../services/api/descontosService';
import DescontoForm from './DescontoForm';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { usePermissoes } from '../../../hooks/usePermissoes';
import BotaoPermissao from '../../../components/common/BotaoPermissao';


function Descontos() {
  const [descontos, setDescontos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [descontoSelecionado, setDescontoSelecionado] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, desconto: null });
  const [salvando, setSalvando] = useState(false);
  const { temPermissao } = usePermissoes();

  const [filtros, setFiltros] = useState({
    busca: '',
    tipo: '',
    status: ''
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const resposta = await descontosService.listarTodos();

      const descontosData = resposta.data?.data || resposta.data || {};
      const descontosArray = descontosData.descontos || [];

      setDescontos(descontosArray);
      setErro(null);
    } catch (error) {
      setErro('Erro ao carregar descontos');
      console.error('❌ Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNovoDesconto = () => {
    setDescontoSelecionado(null);
    setMostrarForm(true);
  };

  const handleEditarDesconto = async (desconto) => {
    try {
      const resposta = await descontosService.buscarPorId(desconto.id);
      setDescontoSelecionado(resposta.data?.data || resposta.data);
      setMostrarForm(true);
    } catch (error) {
      alert('Erro ao carregar dados do desconto: ' + error.message);
    }
  };

  const handleSalvarDesconto = async (dados) => {
    try {
      setSalvando(true);

      if (descontoSelecionado) {
        await descontosService.atualizar(descontoSelecionado.id, dados);
      } else {
        await descontosService.criar(dados);
      }

      setMostrarForm(false);
      setDescontoSelecionado(null);
      await carregarDados();
    } catch (error) {
      console.error('❌ Erro:', error.response?.data || error.message);
      alert('Erro ao salvar: ' + (error.response?.data?.message || error.message));
    } finally {
      setSalvando(false);
    }
  };

  const handleConfirmarExclusao = (desconto) => {
    setConfirmDelete({ isOpen: true, desconto });
  };

  const handleExcluirDesconto = async () => {
    try {
      await descontosService.excluir(confirmDelete.desconto.id);
      setConfirmDelete({ isOpen: false, desconto: null });
      carregarDados();
    } catch (error) {
      alert('Erro ao excluir desconto: ' + error.message);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const limparFiltros = () => {
    setFiltros({ busca: '', tipo: '', status: '' });
  };

  const descontosFiltrados = descontos.filter(desc => {
    const busca = filtros.busca.toLowerCase();
    const matchBusca = !filtros.busca || desc.descricao?.toLowerCase().includes(busca);
    const matchTipo = !filtros.tipo || desc.tipo === filtros.tipo;
    const matchStatus = !filtros.status || desc.status === filtros.status;

    return matchBusca && matchTipo && matchStatus;
  });

  const formatarValor = (desconto) => {
    if (desconto.tipo === 'PERCENTUAL') {
      return `${desconto.valor.toFixed(2)}%`;
    }
    return `R$ ${desconto.valor.toFixed(2)}`;
  };

  const getIconeTipo = (tipo) => {
    return tipo === 'PERCENTUAL' ? Percent : DollarSign;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-green-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Percent className="text-green-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Gestão de Descontos</h2>
              <p className="text-sm text-gray-600">Total: {descontosFiltrados.length} descontos cadastrados</p>
            </div>
          </div>
          <BotaoPermissao
            modulo="descontos"
            acao="criar"
            onClick={handleNovoDesconto}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-semibold shadow-md transition-colors"
          >
            <Plus size={20} />
            Novo Desconto
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
                  placeholder="Buscar por descrição..."
                  value={filtros.busca}
                  onChange={(e) => handleFiltroChange('busca', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <select
              value={filtros.tipo}
              onChange={(e) => handleFiltroChange('tipo', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">Todos os Tipos</option>
              <option value="PERCENTUAL">Percentual</option>
              <option value="MONETARIO">Monetário</option>
            </select>
            <div className="flex gap-2">
              <select
                value={filtros.status}
                onChange={(e) => handleFiltroChange('status', e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Todos os Status</option>
                <option value="ATIVO">Ativos</option>
                <option value="INATIVO">Inativos</option>
              </select>
              {(filtros.busca || filtros.tipo || filtros.status) && (
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

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Descrição</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Tipo</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Valor</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {descontosFiltrados.map((desconto) => {
                const IconeTipo = getIconeTipo(desconto.tipo);
                return (
                  <tr key={desconto.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${desconto.tipo === 'PERCENTUAL' ? 'bg-purple-50' : 'bg-green-50'
                          }`}>
                          <IconeTipo className={
                            desconto.tipo === 'PERCENTUAL' ? 'text-purple-600' : 'text-green-600'
                          } size={18} />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {desconto.descricao || 'Sem descrição'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${desconto.tipo === 'PERCENTUAL'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                        }`}>
                        {desconto.tipo === 'PERCENTUAL' ? 'Percentual' : 'Monetário'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-lg font-bold text-gray-900">
                        {formatarValor(desconto)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${desconto.status === 'ATIVO'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {desconto.status || 'ATIVO'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <BotaoPermissao
                          modulo="descontos"
                          acao="editar"

                          onClick={() => handleEditarDesconto(desconto)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Editar desconto"
                        >
                          <Edit size={18} />
                        </BotaoPermissao>
                        <BotaoPermissao
                          modulo="descontos"
                          acao="excluir"

                          onClick={() => handleConfirmarExclusao(desconto)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Excluir desconto"
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

        {descontosFiltrados.length === 0 && !erro && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Percent className="text-gray-400" size={32} />
            </div>
            <p className="text-gray-600 font-medium mb-1">
              {filtros.busca || filtros.tipo || filtros.status
                ? 'Nenhum desconto encontrado com os filtros aplicados'
                : 'Nenhum desconto cadastrado'}
            </p>
            <p className="text-sm text-gray-500">
              {!filtros.busca && !filtros.tipo && !filtros.status && 'Clique em "Novo Desconto" para começar'}
            </p>
          </div>
        )}
      </div>

      {/* Formulário */}
      {mostrarForm && (
        <DescontoForm
          desconto={descontoSelecionado}
          onSalvar={handleSalvarDesconto}
          onCancelar={() => {
            setMostrarForm(false);
            setDescontoSelecionado(null);
          }}
          salvando={salvando}
        />
      )}

      {/* Diálogo de Confirmação */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        titulo="Confirmar Exclusão"
        mensagem={`Tem certeza que deseja excluir o desconto "${confirmDelete.desconto?.descricao}"? Esta ação não poderá ser desfeita.`}
        onConfirmar={handleExcluirDesconto}
        onCancelar={() => setConfirmDelete({ isOpen: false, desconto: null })}
      />
    </div>
  );
}

export default Descontos;