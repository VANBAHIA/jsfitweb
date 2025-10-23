import React, { useState, useEffect } from 'react';
import { Dumbbell, Search, Loader, Edit, Trash2, Plus, Filter, X } from 'lucide-react';
import { gruposExercicioService } from '../../../services/api/gruposExercicioService';
import GrupoExercicioForm from './GrupoExercicioForm';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { usePermissoes } from '../../../hooks/usePermissoes';
import BotaoPermissao from '../../../components/common/BotaoPermissao';

function GruposExercicio() {
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [grupoSelecionado, setGrupoSelecionado] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, grupo: null });
  const [salvando, setSalvando] = useState(false);
  const { temPermissao } = usePermissoes();

  const [filtros, setFiltros] = useState({
    busca: ''
  });

  const [paginacao, setPaginacao] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    carregarDados();
  }, [paginacao.page]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const resposta = await gruposExercicioService.listarTodos({
        page: paginacao.page,
        limit: paginacao.limit,
        busca: filtros.busca
      });

      const dados = resposta.data?.data || resposta.data || {};
      const gruposArray = dados.data || [];
      const paginacaoData = dados.pagination || {};

      setGrupos(gruposArray);
      setPaginacao(prev => ({
        ...prev,
        total: paginacaoData.total || 0,
        totalPages: paginacaoData.totalPages || 1
      }));
      setErro(null);
    } catch (error) {
      setErro('Erro ao carregar grupos de exercício');
      console.error('❌ Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNovoGrupo = () => {
    setGrupoSelecionado(null);
    setMostrarForm(true);
  };

  const handleEditarGrupo = async (grupo) => {
    try {
      const resposta = await gruposExercicioService.buscarPorId(grupo.id);
      setGrupoSelecionado(resposta.data?.data || resposta.data);
      setMostrarForm(true);
    } catch (error) {
      alert('Erro ao carregar dados do grupo: ' + error.message);
    }
  };

  const handleSalvarGrupo = async (dados) => {
    try {
      setSalvando(true);

      if (grupoSelecionado) {
        await gruposExercicioService.atualizar(grupoSelecionado.id, dados);
      } else {
        await gruposExercicioService.criar(dados);
      }

      setMostrarForm(false);
      setGrupoSelecionado(null);
      await carregarDados();
    } catch (error) {
      console.error('❌ Erro:', error.response?.data || error.message);
      alert('Erro ao salvar: ' + (error.response?.data?.message || error.message));
    } finally {
      setSalvando(false);
    }
  };

  const handleConfirmarExclusao = (grupo) => {
    setConfirmDelete({ isOpen: true, grupo });
  };

  const handleExcluirGrupo = async () => {
    try {
      await gruposExercicioService.excluir(confirmDelete.grupo.id);
      setConfirmDelete({ isOpen: false, grupo: null });
      carregarDados();
    } catch (error) {
      alert('Erro ao excluir grupo: ' + error.message);
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

  const getCorGrupo = (nome) => {
    const cores = {
      'ANTEBRAÇO': 'bg-blue-100 text-blue-800',
      'ABDOME': 'bg-green-100 text-green-800',
      'BÍCEPS': 'bg-purple-100 text-purple-800',
      'TRÍCEPS': 'bg-pink-100 text-pink-800',
      'PEITO': 'bg-red-100 text-red-800',
      'PERNA': 'bg-orange-100 text-orange-800',
      'GLÚTEO': 'bg-yellow-100 text-yellow-800',
      'COSTAS': 'bg-indigo-100 text-indigo-800',
      'OMBRO': 'bg-cyan-100 text-cyan-800',
      'CORPO': 'bg-teal-100 text-teal-800',
      'PANTURRILHA': 'bg-lime-100 text-lime-800',
      'POSTERIOR': 'bg-amber-100 text-amber-800',
      'QUADRÍCEPS': 'bg-emerald-100 text-emerald-800',
      'LOMBAR': 'bg-rose-100 text-rose-800',
      'TRAPÉZIO': 'bg-violet-100 text-violet-800',
      'DELTOIDE': 'bg-fuchsia-100 text-fuchsia-800',
      'CARDIO': 'bg-sky-100 text-sky-800'
    };
    return cores[nome] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-purple-600" size={40} />
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
              <Dumbbell className="text-purple-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Grupos de Exercício</h2>
              <p className="text-sm text-gray-600">Total: {paginacao.total} grupos cadastrados</p>
            </div>
          </div>
          <BotaoPermissao
            modulo="modalidades"
            acao="criar"
            onClick={handleNovoGrupo}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 font-semibold shadow-md transition-colors"
          >
            <Plus size={20} />
            Novo Grupo
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
                placeholder="Buscar grupo muscular..."
                value={filtros.busca}
                onChange={(e) => setFiltros(prev => ({ ...prev, busca: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={handleBuscar}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 font-medium"
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

        {/* Grid de Cards */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {grupos.map((grupo) => (
              <div
                key={grupo.id}
                className="border-2 border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all hover:border-purple-300 bg-gradient-to-br from-white to-gray-50"
              >
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-full py-3 px-4 rounded-lg text-center font-bold text-sm ${getCorGrupo(grupo.nome)}`}>
                    {grupo.nome}
                  </div>
                  <div className="flex gap-2 w-full">
                    <BotaoPermissao
                      modulo="modalidades"
                      acao="editar"
                      onClick={() => handleEditarGrupo(grupo)}
                      className="flex-1 p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center gap-1 text-sm"
                      title="Editar"
                    >
                      <Edit size={16} />
                      <span className="hidden sm:inline">Editar</span>
                    </BotaoPermissao>
                    <BotaoPermissao
                      modulo="modalidades"
                      acao="excluir"
                      onClick={() => handleConfirmarExclusao(grupo)}
                      className="flex-1 p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex items-center justify-center gap-1 text-sm"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                      <span className="hidden sm:inline">Excluir</span>
                    </BotaoPermissao>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Paginação */}
        {paginacao.totalPages > 1 && (
          <div className="p-6 border-t flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Página {paginacao.page} de {paginacao.totalPages} • Total: {paginacao.total} grupos
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

        {grupos.length === 0 && !erro && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Dumbbell className="text-gray-400" size={32} />
            </div>
            <p className="text-gray-600 font-medium mb-1">
              {filtros.busca
                ? 'Nenhum grupo encontrado com os filtros aplicados'
                : 'Nenhum grupo de exercício cadastrado'}
            </p>
            <p className="text-sm text-gray-500">
              {!filtros.busca && 'Clique em "Novo Grupo" para começar'}
            </p>
          </div>
        )}
      </div>

      {/* Formulário */}
      {mostrarForm && (
        <GrupoExercicioForm
          grupo={grupoSelecionado}
          onSalvar={handleSalvarGrupo}
          onCancelar={() => {
            setMostrarForm(false);
            setGrupoSelecionado(null);
          }}
          salvando={salvando}
        />
      )}

      {/* Diálogo de Confirmação */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        titulo="Confirmar Exclusão"
        mensagem={`Tem certeza que deseja excluir o grupo "${confirmDelete.grupo?.nome}"? Esta ação não poderá ser desfeita.`}
        onConfirmar={handleExcluirGrupo}
        onCancelar={() => setConfirmDelete({ isOpen: false, grupo: null })}
      />
    </div>
  );
}

export default GruposExercicio;