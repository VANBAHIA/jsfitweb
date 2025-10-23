import React, { useState, useEffect } from 'react';


import {
  BarChart3,
  Dumbbell,
  Wrench,
  Link2,
  Unlink2,
  Search,
  Filter,
  X,
  Plus,
  Trash2,
  Loader,
  ChevronDown,
  AlertCircle,
  Copy,
  CheckCircle
} from 'lucide-react';
import { exerciciosService } from '../../../services/api/exerciciosService';
import { equipamentosService } from '../../../services/api/equipamentosService';
import { exercicioEquipamentoService } from '../../../services/api/exercicioEquipamentoService';
import { usePermissoes } from '../../../hooks/usePermissoes';
import BotaoPermissao from '../../../components/common/BotaoPermissao';

function ExercicioEquipamento() {
  const [modo, setModo] = useState('equipamento');
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [exercicios, setExercicios] = useState([]);
  const [equipamentos, setEquipamentos] = useState([]);
  const [vinculos, setVinculos] = useState([]);

  const [buscaExercicio, setBuscaExercicio] = useState('');
  const [buscaEquipamento, setBuscaEquipamento] = useState('');
  const [loading, setLoading] = useState(true);
  const [descricaoUso, setDescricaoUso] = useState('');
  const [messageVinculo, setMessageVinculo] = useState(null);

  const { temPermissao } = usePermissoes();

  // Carregar dados iniciais
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [resExercicios, resEquipamentos] = await Promise.all([
        exerciciosService.listarTodos({ limit: 1000 }),
        equipamentosService.listarTodos({ limit: 1000 })
      ]);

      const exerciciosArray = resExercicios.data?.data?.data || [];
      const equipamentosArray = resEquipamentos.data?.data?.data || [];

      setExercicios(exerciciosArray);
      setEquipamentos(equipamentosArray);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setLoading(false);
    }
  };

  // Carregar vínculos de um item selecionado
  const carregarVinculos = async (itemId, tipo) => {
    try {
      if (tipo === 'exercicio') {
        const res = await exercicioEquipamentoService.listarEquipamentosDoExercicio(itemId);
        const vinculosData = res.data?.data || [];
        setVinculos(vinculosData);
      } else {
        const res = await exercicioEquipamentoService.listarExerciciosDoEquipamento(itemId);
        const vinculosData = res.data?.data || [];
        setVinculos(vinculosData);
      }
    } catch (error) {
      console.error('Erro ao carregar vínculos:', error);
      setVinculos([]);
    }
  };

  // Filtrar itens
  const exerciciosFiltrados = exercicios.filter(ex =>
    ex.nome.toLowerCase().includes(buscaExercicio.toLowerCase())
  );

  const equipamentosFiltrados = equipamentos.filter(eq =>
    eq.nome.toLowerCase().includes(buscaEquipamento.toLowerCase()) ||
    eq.codigo.toLowerCase().includes(buscaEquipamento.toLowerCase())
  );

  // Vincular

  const handleVincular = async (exercicioId, equipamentoId) => {
    try {
      const jaVinculado = vinculos.some(v => {
        if (modo === 'equipamento') {
          // Verifica se o EXERCÍCIO já está vinculado ao equipamento selecionado
          return v.exercicioId === exercicioId;
        } else {
          // Verifica se o EQUIPAMENTO já está vinculado ao exercício selecionado
          return v.equipamentoId === equipamentoId;
        }
      });

      if (jaVinculado) {
        setMessageVinculo({ type: 'error', text: 'Este item já está vinculado' });
        setTimeout(() => setMessageVinculo(null), 3000);
        return;
      }

      await exercicioEquipamentoService.vincular(exercicioId, equipamentoId, {
        descricaoUso: descricaoUso || null
      });

      setMessageVinculo({ type: 'success', text: 'Vínculo criado com sucesso!' });
      setDescricaoUso('');

      // Recarregar vínculos
      if (itemSelecionado) {
        carregarVinculos(itemSelecionado.id, itemSelecionado.tipo);
      }

      setTimeout(() => setMessageVinculo(null), 3000);
    } catch (error) {
      console.error('Erro ao vincular:', error);
      setMessageVinculo({
        type: 'error',
        text: error.response?.data?.message || 'Erro ao criar vínculo'
      });
      setTimeout(() => setMessageVinculo(null), 3000);
    }
  };
  // Desvincular
  const handleDesvincular = async (exercicioId, equipamentoId) => {
    if (!window.confirm('Tem certeza que deseja remover este vínculo?')) return;

    try {
      await exercicioEquipamentoService.desvincular(exercicioId, equipamentoId);
      setMessageVinculo({ type: 'success', text: 'Vínculo removido com sucesso!' });

      // Recarregar vínculos
      if (itemSelecionado) {
        carregarVinculos(itemSelecionado.id, itemSelecionado.tipo);
      }

      setTimeout(() => setMessageVinculo(null), 3000);
    } catch (error) {
      console.error('Erro ao desvincular:', error);
      setMessageVinculo({
        type: 'error',
        text: error.response?.data?.message || 'Erro ao remover vínculo'
      });
      setTimeout(() => setMessageVinculo(null), 3000);
    }
  };

  // Atualizar disponibilidade
  const handleAtualizarDisponibilidade = async (exercicioId, equipamentoId, novaDisponibilidade) => {
    try {
      await exercicioEquipamentoService.atualizarVinculo(
        exercicioId,
        equipamentoId,
        { disponivel: novaDisponibilidade }
      );

      if (itemSelecionado) {
        carregarVinculos(itemSelecionado.id, itemSelecionado.tipo);
      }
    } catch (error) {
      console.error('Erro ao atualizar:', error);
    }
  };

  const handleSelecionarItem = (item, tipo) => {
    setItemSelecionado(prev => {
      if (prev?.id === item.id && prev?.tipo === tipo) {
        setVinculos([]);
        return null;
      }
      carregarVinculos(item.id, tipo);
      return { ...item, tipo };
    });
    setDescricaoUso('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-purple-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg">
              <Link2 className="text-purple-600" size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Vincular Exercícios & Equipamentos</h2>
              <p className="text-sm text-gray-600 mt-1">Gerencie os relacionamentos entre exercícios e equipamentos</p>
            </div>
          </div>
        </div>

        {/* Modo */}
        <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-t flex gap-4">
          <button
            onClick={() => {
              setModo('equipamento');
              setItemSelecionado(null);
              setVinculos([]);
            }}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${modo === 'equipamento'
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-400'
              }`}
          >
            <Wrench size={20} />
            Vincular por Equipamento
          </button>
          <button
            onClick={() => {
              setModo('exercicio');
              setItemSelecionado(null);
              setVinculos([]);
            }}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${modo === 'exercicio'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
              }`}
          >
            <Dumbbell size={20} />
            Vincular por Exercício
          </button>
        </div>
      </div>

      {/* Mensagens */}
      {messageVinculo && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${messageVinculo.type === 'success'
            ? 'bg-green-100 border border-green-300 text-green-800'
            : 'bg-red-100 border border-red-300 text-red-800'
          }`}>
          {messageVinculo.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span>{messageVinculo.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MODO EQUIPAMENTO */}
        {modo === 'equipamento' && (
          <>
            {/* Seleção de Equipamento */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Wrench className="text-purple-600" size={22} />
                  Equipamentos ({equipamentos.length})
                </h3>
              </div>

              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Buscar equipamento..."
                    value={buscaEquipamento}
                    onChange={(e) => setBuscaEquipamento(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="divide-y max-h-[600px] overflow-y-auto">
                {equipamentosFiltrados.map(eq => {
                  const isSelected = itemSelecionado?.id === eq.id && itemSelecionado?.tipo === 'equipamento';

                  return (
                    <div
                      key={eq.id}
                      onClick={() => handleSelecionarItem(eq, 'equipamento')}
                      className={`p-4 cursor-pointer transition-all ${isSelected ? 'bg-purple-50 border-l-4 border-purple-500' : 'hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs font-mono font-bold rounded mb-2">
                            {eq.codigo}
                          </span>
                          <h4 className="text-sm font-semibold text-gray-800">{eq.nome}</h4>
                          {isSelected && (
                            <div className="text-xs text-purple-700 mt-2 font-medium">
                              {vinculos.length} exercício(s) vinculado(s)
                            </div>
                          )}
                        </div>
                        <ChevronDown
                          size={18}
                          className={`text-gray-400 transition-transform ${isSelected ? 'rotate-180' : ''}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Adicionar Exercícios */}
            {itemSelecionado?.tipo === 'equipamento' && (
              <div className="space-y-4">
                {/* Card Adicionar */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b bg-gradient-to-r from-purple-50 to-blue-50">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <Plus className="text-blue-600" size={22} />
                      Vincular Exercícios
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      a: <span className="font-semibold text-gray-800">{itemSelecionado.nome}</span>
                    </p>
                  </div>

                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Buscar Exercício
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          placeholder="Buscar exercício..."
                          value={buscaExercicio}
                          onChange={(e) => setBuscaExercicio(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Descrição de Uso (opcional)
                      </label>
                      <textarea
                        value={descricaoUso}
                        onChange={(e) => setDescricaoUso(e.target.value)}
                        placeholder="Ex: Usar com cuidado, ajustar altura..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                        rows={2}
                        maxLength={200}
                      />
                      <p className="text-xs text-gray-500 mt-1">{descricaoUso.length}/200</p>
                    </div>
                  </div>

                  <div className="px-4 pb-4">
                    <div className="max-h-[300px] overflow-y-auto border rounded-lg divide-y">
                      {exerciciosFiltrados.map(ex => {
                        const jaVinculado = vinculos.some(v => v.exercicioId === ex.id);

                        return (
                          <div key={ex.id} className="p-3 hover:bg-gray-50 transition-colors flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-gray-800">{ex.nome}</h4>
                              {ex.musculos && ex.musculos.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {ex.musculos.slice(0, 2).map((m, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
                                      {m}
                                    </span>
                                  ))}
                                  {ex.musculos.length > 2 && (
                                    <span className="text-xs text-gray-500">+{ex.musculos.length - 2}</span>
                                  )}
                                </div>
                              )}
                            </div>
                            <BotaoPermissao
                              modulo="exercicioEquipamentos"
                              acao="vincular"
                              onClick={() => handleVincular(ex.id, itemSelecionado.id)}
                              disabled={jaVinculado}
                              className={`px-3 py-1.5 rounded transition-all font-medium text-sm flex items-center gap-1.5 flex-shrink-0 ${jaVinculado
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                              <Plus size={16} />
                              {jaVinculado ? 'Vinculado' : 'Vincular'}
                            </BotaoPermissao>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Vínculos Existentes */}
                {vinculos.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b bg-gradient-to-r from-green-50 to-emerald-50">
                      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <CheckCircle className="text-green-600" size={22} />
                        Exercícios Vinculados ({vinculos.length})
                      </h3>
                    </div>

                    <div className="divide-y">
                      {vinculos.map(v => (
                        <div key={v.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-gray-800">{v.exercicio?.nome}</h4>
                              {v.descricaoUso && (
                                <div className="text-xs text-gray-500 mt-1">📝 {v.descricaoUso}</div>
                              )}
                              <div className="flex items-center gap-2 mt-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={v.disponivel}
                                    onChange={() => handleAtualizarDisponibilidade(v.exercicioId, v.equipamentoId, !v.disponivel)}
                                    className="rounded"
                                  />
                                  <span className="text-xs text-gray-600">Disponível</span>
                                </label>
                              </div>
                            </div>
                            <BotaoPermissao
                              modulo="exercicioEquipamentos"
                              acao="desvincular"
                              onClick={() => handleDesvincular(v.exercicioId, v.equipamentoId)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                              title="Remover vínculo"
                            >
                              <Trash2 size={18} />
                            </BotaoPermissao>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!itemSelecionado && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center h-[600px]">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <Wrench className="text-gray-400" size={32} />
                  </div>
                  <p className="text-gray-600 font-medium">Selecione um equipamento</p>
                  <p className="text-sm text-gray-500 mt-1">para começar a vincular exercícios</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* MODO EXERCÍCIO */}
        {modo === 'exercicio' && (
          <>
            {/* Seleção de Exercício */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Dumbbell className="text-blue-600" size={22} />
                  Exercícios ({exercicios.length})
                </h3>
              </div>

              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Buscar exercício..."
                    value={buscaExercicio}
                    onChange={(e) => setBuscaExercicio(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="divide-y max-h-[600px] overflow-y-auto">
                {exerciciosFiltrados.map(ex => {
                  const isSelected = itemSelecionado?.id === ex.id && itemSelecionado?.tipo === 'exercicio';

                  return (
                    <div
                      key={ex.id}
                      onClick={() => handleSelecionarItem(ex, 'exercicio')}
                      className={`p-4 cursor-pointer transition-all ${isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-800">{ex.nome}</h4>
                          {ex.musculos && ex.musculos.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {ex.musculos.slice(0, 2).map((m, i) => (
                                <span key={i} className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                                  {m}
                                </span>
                              ))}
                              {ex.musculos.length > 2 && (
                                <span className="text-xs text-gray-500">+{ex.musculos.length - 2}</span>
                              )}
                            </div>
                          )}
                          {isSelected && (
                            <div className="text-xs text-blue-700 mt-2 font-medium">
                              {vinculos.length} equipamento(s) vinculado(s)
                            </div>
                          )}
                        </div>
                        <ChevronDown
                          size={18}
                          className={`text-gray-400 transition-transform ${isSelected ? 'rotate-180' : ''}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Adicionar Equipamentos */}
            {itemSelecionado?.tipo === 'exercicio' && (
              <div className="space-y-4">
                {/* Card Adicionar */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <Plus className="text-purple-600" size={22} />
                      Vincular Equipamentos
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      a: <span className="font-semibold text-gray-800">{itemSelecionado.nome}</span>
                    </p>
                  </div>

                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Buscar Equipamento
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          placeholder="Buscar equipamento..."
                          value={buscaEquipamento}
                          onChange={(e) => setBuscaEquipamento(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Descrição de Uso (opcional)
                      </label>
                      <textarea
                        value={descricaoUso}
                        onChange={(e) => setDescricaoUso(e.target.value)}
                        placeholder="Ex: Usar com cuidado, ajustar altura..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none text-sm"
                        rows={2}
                        maxLength={200}
                      />
                      <p className="text-xs text-gray-500 mt-1">{descricaoUso.length}/200</p>
                    </div>
                  </div>

                  <div className="px-4 pb-4">
                    <div className="max-h-[300px] overflow-y-auto border rounded-lg divide-y">
                      {equipamentosFiltrados.map(eq => {
                        const jaVinculado = vinculos.some(v => v.equipamentoId === eq.id);

                        return (
                          <div key={eq.id} className="p-3 hover:bg-gray-50 transition-colors flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-mono font-bold rounded mb-1">
                                {eq.codigo}
                              </span>
                              <h4 className="text-sm font-semibold text-gray-800">{eq.nome}</h4>
                            </div>
                            <BotaoPermissao
                              modulo="exercicioEquipamentos"
                              acao="vincular"
                              onClick={() => handleVincular(itemSelecionado.id, eq.id)}
                              disabled={jaVinculado}
                              className={`px-3 py-1.5 rounded transition-all font-medium text-sm flex items-center gap-1.5 flex-shrink-0 ${jaVinculado
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-purple-600 text-white hover:bg-purple-700'
                                }`}
                            >
                              <Plus size={16} />
                              {jaVinculado ? 'Vinculado' : 'Vincular'}
                            </BotaoPermissao>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Vínculos Existentes */}
                {vinculos.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b bg-gradient-to-r from-green-50 to-emerald-50">
                      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <CheckCircle className="text-green-600" size={22} />
                        Equipamentos Vinculados ({vinculos.length})
                      </h3>
                    </div>

                    <div className="divide-y">
                      {vinculos.map(v => (
                        <div key={v.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-mono font-bold rounded mb-2">
                                {v.equipamento?.codigo}
                              </span>
                              <h4 className="text-sm font-semibold text-gray-800">{v.equipamento?.nome}</h4>
                              {v.descricaoUso && (
                                <div className="text-xs text-gray-500 mt-1">📝 {v.descricaoUso}</div>
                              )}
                            </div>
                            <BotaoPermissao
                              modulo="exercicioEquipamentos"
                              acao="desvincular"
                              onClick={() => handleDesvincular(v.exercicioId, v.equipamentoId)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors flex-shrink-0"
                              title="Remover vínculo"
                            >
                              <Trash2 size={18} />
                            </BotaoPermissao>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!itemSelecionado && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center h-[600px]">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <Dumbbell className="text-gray-400" size={32} />
                  </div>
                  <p className="text-gray-600 font-medium">Selecione um exercício</p>
                  <p className="text-sm text-gray-500 mt-1">para começar a vincular equipamentos</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Estatísticas */}
      {exercicios.length > 0 && equipamentos.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <BarChart3 className="text-amber-600" size={22} />
              Resumo
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="text-sm text-purple-700 font-semibold">Total de Exercícios</div>
              <div className="text-3xl font-bold text-purple-900 mt-2">{exercicios.length}</div>
              <p className="text-xs text-purple-600 mt-1">cadastrados no sistema</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="text-sm text-blue-700 font-semibold">Total de Equipamentos</div>
              <div className="text-3xl font-bold text-blue-900 mt-2">{equipamentos.length}</div>
              <p className="text-xs text-blue-600 mt-1">disponíveis na academia</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="text-sm text-green-700 font-semibold">Vínculos Criados</div>
              <div className="text-3xl font-bold text-green-900 mt-2">{vinculos.length}</div>
              <p className="text-xs text-green-600 mt-1">relacionamentos ativos</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExercicioEquipamento;