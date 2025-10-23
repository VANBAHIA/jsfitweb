import React, { useState, useEffect } from 'react';
import { Wrench, Search, Loader, Edit, Trash2, Plus, Filter, X } from 'lucide-react';
import { equipamentosService } from '../../../services/api/equipamentosService';
import EquipamentoForm from './EquipamentoForm';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { usePermissoes } from '../../../hooks/usePermissoes';
import BotaoPermissao from '../../../components/common/BotaoPermissao';

function Equipamentos() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, equipamento: null });
  const [salvando, setSalvando] = useState(false);
  const { temPermissao } = usePermissoes();

  const [filtros, setFiltros] = useState({
    busca: ''
  });

  const [paginacao, setPaginacao] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    carregarDados();
  }, [paginacao.page]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const resposta = await equipamentosService.listarTodos({
        page: paginacao.page,
        limit: paginacao.limit,
        busca: filtros.busca
      });

      const dados = resposta.data?.data || resposta.data || {};
      const equipamentosArray = dados.data || [];
      const paginacaoData = dados.pagination || {};

      setEquipamentos(equipamentosArray);
      setPaginacao(prev => ({
        ...prev,
        total: paginacaoData.total || 0,
        totalPages: paginacaoData.totalPages || 1
      }));
      setErro(null);
    } catch (error) {
      setErro('Erro ao carregar equipamentos');
      console.error('❌ Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNovoEquipamento = () => {
    setEquipamentoSelecionado(null);
    setMostrarForm(true);
  };

  const handleEditarEquipamento = async (equipamento) => {
    try {
      const resposta = await equipamentosService.buscarPorId(equipamento.id);
      setEquipamentoSelecionado(resposta.data?.data || resposta.data);
      setMostrarForm(true);
    } catch (error) {
      alert('Erro ao carregar dados do equipamento: ' + error.message);
    }
  };

  const handleSalvarEquipamento = async (dados) => {
    try {
      setSalvando(true);

      if (equipamentoSelecionado) {
        await equipamentosService.atualizar(equipamentoSelecionado.id, dados);
      } else {
        await equipamentosService.criar(dados);
      }

      setMostrarForm(false);
      setEquipamentoSelecionado(null);
      await carregarDados();
    } catch (error) {
      console.error('❌ Erro:', error.response?.data || error.message);
      alert('Erro ao salvar: ' + (error.response?.data?.message || error.message));
    } finally {
      setSalvando(false);
    }
  };

  const handleConfirmarExclusao = (equipamento) => {
    setConfirmDelete({ isOpen: true, equipamento });
  };

  const handleExcluirEquipamento = async () => {
    try {
      await equipamentosService.excluir(confirmDelete.equipamento.id);
      setConfirmDelete({ isOpen: false, equipamento: null });
      carregarDados();
    } catch (error) {
      alert('Erro ao excluir equipamento: ' + error.message);
    }
  };

  const handleBuscar = () => {
    setPaginacao(prev => ({ ...prev, page: 1 }));
    carregarDados();
  };

  const limparFiltros = () => {
    setFiltros({ busca: '' });
    setPaginacao(prev => ({ ...prev, page: 1 }));
    setTimeout(carregarDados, 100);
  };

  const handlePaginaAnterior = () => {
    if (paginacao.page > 1) {
      setPaginacao(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const handleProximaPagina = () => {
    if (paginacao.page < paginacao.totalPages) {
      setPaginacao(prev => ({ ...prev, page: prev.page + 1 }));
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
            <div className="p-2 bg-blue-100 rounded-lg">
              <Wrench className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Gestão de Equipamentos</h2>
              <p className="text-sm text-gray-600">Total: {paginacao.total} equipamentos cadastrados</p>
            </div>
          </div>
          <BotaoPermissao
            modulo="equipamentos"
            acao="criar"
            onClick={handleNovoEquipamento}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-semibold shadow-md transition-colors"
          >
            <Plus size={20} />
            Novo Equipamento
          </BotaoPermissao>
        </div>

        {/* Filtros */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={18} className="text-gray-600" />
            <h3 className="font-semibold text-gray-800">Filtros de Busca</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar por nome ou código..."
                value={filtros.busca}
                onChange={(e) => setFiltros(prev => ({ ...prev, busca: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleBuscar}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium"
            >
              <Search size={18} />
              Buscar
            </button>
            {filtros.busca && (
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Nome</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Cadastrado em</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {equipamentos.map((equipamento) => (
                <tr key={equipamento.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 text-xs font-mono font-semibold bg-blue-100 text-blue-800 rounded-full">
                      {equipamento.codigo}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Wrench className="text-blue-600" size={18} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {equipamento.nome}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-gray-600">
                      {new Date(equipamento.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <BotaoPermissao
                        modulo="equipamentos"
                        acao="editar"
                        onClick={() => handleEditarEquipamento(equipamento)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Editar equipamento"
                      >
                        <Edit size={18} />
                      </BotaoPermissao>
                      <BotaoPermissao
                        modulo="equipamentos"
                        acao="excluir"
                        onClick={() => handleConfirmarExclusao(equipamento)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Excluir equipamento"
                      >
                        <Trash2 size={18} />
                      </BotaoPermissao>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {paginacao.totalPages > 1 && (
          <div className="p-6 border-t flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Página {paginacao.page} de {paginacao.totalPages} • Total: {paginacao.total} equipamentos
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePaginaAnterior}
                disabled={paginacao.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={handleProximaPagina}
                disabled={paginacao.page === paginacao.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </div>
          </div>
        )}

        {equipamentos.length === 0 && !erro && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Wrench className="text-gray-400" size={32} />
            </div>
            <p className="text-gray-600 font-medium mb-1">
              {filtros.busca
                ? 'Nenhum equipamento encontrado com os filtros aplicados'
                : 'Nenhum equipamento cadastrado'}
            </p>
            <p className="text-sm text-gray-500">
              {!filtros.busca && 'Clique em "Novo Equipamento" para começar'}
            </p>
          </div>
        )}
      </div>

      {/* Formulário */}
      {mostrarForm && (
        <EquipamentoForm
          equipamento={equipamentoSelecionado}
          onSalvar={handleSalvarEquipamento}
          onCancelar={() => {
            setMostrarForm(false);
            setEquipamentoSelecionado(null);
          }}
          salvando={salvando}
        />
      )}

      {/* Diálogo de Confirmação */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        titulo="Confirmar Exclusão"
        mensagem={`Tem certeza que deseja excluir o equipamento "${confirmDelete.equipamento?.nome}" (${confirmDelete.equipamento?.codigo})? Esta ação não poderá ser desfeita.`}
        onConfirmar={handleExcluirEquipamento}
        onCancelar={() => setConfirmDelete({ isOpen: false, equipamento: null })}
      />
    </div>
  );
}

export default Equipamentos;