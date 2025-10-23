import React, { useState, useEffect } from 'react';
import { Dumbbell, Search, Loader, Edit, Trash2, Plus, Filter, X, Image as ImageIcon } from 'lucide-react';
import { exerciciosService } from '../../../services/api/exerciciosService';
import { gruposExercicioService } from '../../../services/api/gruposExercicioService';
import ExercicioForm from './ExercicioForm';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { usePermissoes } from '../../../hooks/usePermissoes';
import BotaoPermissao from '../../../components/common/BotaoPermissao';

function Exercicios() {
  const [exercicios, setExercicios] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [exercicioSelecionado, setExercicioSelecionado] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, exercicio: null });
  const [salvando, setSalvando] = useState(false);
  const { temPermissao } = usePermissoes();

  const [filtros, setFiltros] = useState({
    busca: '',
    grupoId: ''
  });

  const [paginacao, setPaginacao] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    carregarGrupos();
  }, []);

  useEffect(() => {
    carregarDados();
  }, [paginacao.page]);

  const carregarGrupos = async () => {
    try {
      const resposta = await gruposExercicioService.listarTodos({ limit: 100 });
      const dados = resposta.data?.data || resposta.data || {};
      const gruposArray = dados.data || [];
      setGrupos(gruposArray);
    } catch (error) {
      console.error('❌ Erro ao carregar grupos:', error);
    }
  };

  const carregarDados = async () => {
    try {
      setLoading(true);
      const resposta = await exerciciosService.listarTodos({
        page: paginacao.page,
        limit: paginacao.limit,
        busca: filtros.busca,
        grupoId: filtros.grupoId
      });

      const dados = resposta.data?.data || resposta.data || {};
      const exerciciosArray = dados.data || [];
      const paginacaoData = dados.pagination || {};

      setExercicios(exerciciosArray);
      setPaginacao(prev => ({
        ...prev,
        total: paginacaoData.total || 0,
        totalPages: paginacaoData.totalPages || 1
      }));
      setErro(null);
    } catch (error) {
      setErro('Erro ao carregar exercícios');
      console.error('❌ Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNovoExercicio = () => {
    setExercicioSelecionado(null);
    setMostrarForm(true);
  };

  const handleEditarExercicio = async (exercicio) => {
    try {
      const resposta = await exerciciosService.buscarPorId(exercicio.id);
      setExercicioSelecionado(resposta.data?.data || resposta.data);
      setMostrarForm(true);
    } catch (error) {
      alert('Erro ao carregar dados do exercício: ' + error.message);
    }
  };

  const handleSalvarExercicio = async (dados) => {
    try {
      setSalvando(true);

      if (exercicioSelecionado) {
        await exerciciosService.atualizar(exercicioSelecionado.id, dados);
      } else {
        await exerciciosService.criar(dados);
      }

      setMostrarForm(false);
      setExercicioSelecionado(null);
      await carregarDados();
    } catch (error) {
      console.error('❌ Erro:', error.response?.data || error.message);
      alert('Erro ao salvar: ' + (error.response?.data?.message || error.message));
    } finally {
      setSalvando(false);
    }
  };

  const handleConfirmarExclusao = (exercicio) => {
    setConfirmDelete({ isOpen: true, exercicio });
  };

  const handleExcluirExercicio = async () => {
    try {
      await exerciciosService.excluir(confirmDelete.exercicio.id);
      setConfirmDelete({ isOpen: false, exercicio: null });
      carregarDados();
    } catch (error) {
      alert('Erro ao excluir exercício: ' + error.message);
    }
  };

  const handleBuscar = () => {
    setPaginacao(prev => ({ ...prev, page: 1 }));
    carregarDados();
  };

  const limparFiltros = () => {
    setFiltros({ busca: '', grupoId: '' });
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

  const getNomeGrupo = (grupoId) => {
    const grupo = grupos.find(g => g.id === grupoId);
    return grupo?.nome || 'Sem grupo';
  };

  const getCorGrupo = (grupoId) => {
    const grupo = grupos.find(g => g.id === grupoId);
    if (!grupo) return 'bg-gray-100 text-gray-800';

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
    return cores[grupo.nome] || 'bg-gray-100 text-gray-800';
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
              <h2 className="text-2xl font-bold text-gray-800">Exercícios</h2>
              <p className="text-sm text-gray-600">Total: {paginacao.total} exercícios cadastrados</p>
            </div>
          </div>
          <BotaoPermissao
            modulo="exercicios"
            acao="criar"
            onClick={handleNovoExercicio}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 font-semibold shadow-md transition-colors"
          >
            <Plus size={20} />
            Novo Exercício
          </BotaoPermissao>
        </div>

        {/* Filtros */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={18} className="text-gray-600" />
            <h3 className="font-semibold text-gray-800">Filtros de Busca</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar exercício..."
                value={filtros.busca}
                onChange={(e) => setFiltros(prev => ({ ...prev, busca: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <select
              value={filtros.grupoId}
              onChange={(e) => setFiltros(prev => ({ ...prev, grupoId: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Todos os grupos</option>
              {grupos.map(grupo => (
                <option key={grupo.id} value={grupo.id}>{grupo.nome}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={handleBuscar}
                className="flex-1 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2 font-medium"
              >
                <Search size={18} />
                Buscar
              </button>
              {(filtros.busca || filtros.grupoId) && (
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

        {/* Grid de Cards */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {exercicios.map((exercicio) => (
              <div
                key={exercicio.id}
                className="border-2 border-gray-200 rounded-lg hover:shadow-lg transition-all hover:border-purple-300 bg-white overflow-hidden"
              >
                {/* Imagem/GIF do exercício */}
                <div className="h-[250px] bg-white flex items-center justify-center relative overflow-hidden">
                  {exercicio.imagemUrl ? (
                    <img
                      src={exercicio.imagemUrl}
                      alt={exercicio.nome}
                      className="w-[250px] h-[250px] object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.querySelector('.fallback-icon').style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`fallback-icon absolute inset-0 items-center justify-center ${exercicio.imagemUrl ? 'hidden' : 'flex'}`}>
                    <ImageIcon className="text-gray-300" size={64} />
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">{exercicio.nome}</h3>

                  {exercicio.descricao && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{exercicio.descricao}</p>
                  )}

                  {/* Grupo */}
                  {exercicio.grupoId && (
                    <div className="mb-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCorGrupo(exercicio.grupoId)}`}>
                        {getNomeGrupo(exercicio.grupoId)}
                      </span>
                    </div>
                  )}

                  {/* Músculos */}
                  {exercicio.musculos && exercicio.musculos.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {exercicio.musculos.slice(0, 3).map((musculo, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {musculo}
                          </span>
                        ))}
                        {exercicio.musculos.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            +{exercicio.musculos.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Ações */}
                  <div className="flex gap-2 pt-3 border-t">
                    <BotaoPermissao
                      modulo="exercicios"
                      acao="editar"
                      onClick={() => handleEditarExercicio(exercicio)}
                      className="flex-1 p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center gap-1 text-sm"
                      title="Editar"
                    >
                      <Edit size={16} />
                      Editar
                    </BotaoPermissao>
                    <BotaoPermissao
                      modulo="exercicios"
                      acao="excluir"
                      onClick={() => handleConfirmarExclusao(exercicio)}
                      className="flex-1 p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex items-center justify-center gap-1 text-sm"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                      Excluir
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
              Página {paginacao.page} de {paginacao.totalPages} • Total: {paginacao.total} exercícios
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

        {exercicios.length === 0 && !erro && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Dumbbell className="text-gray-400" size={32} />
            </div>
            <p className="text-gray-600 font-medium mb-1">
              {filtros.busca || filtros.grupoId
                ? 'Nenhum exercício encontrado com os filtros aplicados'
                : 'Nenhum exercício cadastrado'}
            </p>
            <p className="text-sm text-gray-500">
              {!filtros.busca && !filtros.grupoId && 'Clique em "Novo Exercício" para começar'}
            </p>
          </div>
        )}
      </div>

      {/* Formulário */}
      {mostrarForm && (
        <ExercicioForm
          exercicio={exercicioSelecionado}
          grupos={grupos}
          onSalvar={handleSalvarExercicio}
          onCancelar={() => {
            setMostrarForm(false);
            setExercicioSelecionado(null);
          }}
          salvando={salvando}
        />
      )}

      {/* Diálogo de Confirmação */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        titulo="Confirmar Exclusão"
        mensagem={`Tem certeza que deseja excluir o exercício "${confirmDelete.exercicio?.nome}"? Esta ação não poderá ser desfeita.`}
        onConfirmar={handleExcluirExercicio}
        onCancelar={() => setConfirmDelete({ isOpen: false, exercicio: null })}
      />
    </div>
  );
}

export default Exercicios;