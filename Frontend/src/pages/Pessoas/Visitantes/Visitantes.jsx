// src/pages/Controle/Visitantes/Visitantes.jsx

import React, { useState, useEffect } from 'react';
import { Users, Search, Loader, Edit, Trash2, Plus, Filter, X, Calendar } from 'lucide-react';
import { visitantesService } from '../../../services/api/visitantesService';
import VisitanteForm from './VisitanteForm';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { format } from 'date-fns';
import { usePermissoes } from '../../../hooks/usePermissoes';
import BotaoPermissao from '../../../components/common/BotaoPermissao';



function Visitantes() {
  const [visitantes, setVisitantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [visitanteSelecionado, setVisitanteSelecionado] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, visitante: null });
  const [salvando, setSalvando] = useState(false);
  const { temPermissao } = usePermissoes();

  const [filtros, setFiltros] = useState({
    busca: '',
    dataInicio: '',
    dataFim: '',
    sexo: ''
  });

  useEffect(() => {
    carregarVisitantes();
  }, []);

  const carregarVisitantes = async () => {
    try {
      setLoading(true);
      const resposta = await visitantesService.listarTodos();
      const visitantesArray = resposta.data?.data || resposta.data || [];
      setVisitantes(visitantesArray);
      setErro(null);
    } catch (error) {
      setErro('Erro ao carregar visitantes');
      console.error('❌ Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNovoVisitante = () => {
    setVisitanteSelecionado(null);
    setMostrarForm(true);
  };

  const handleEditarVisitante = async (visitante) => {
    try {
      const resposta = await visitantesService.buscarPorId(visitante.id);
      setVisitanteSelecionado(resposta.data);
      setMostrarForm(true);
    } catch (error) {
      alert('Erro ao carregar dados do visitante: ' + error.message);
    }
  };

  const handleSalvarVisitante = async (dados) => {
    try {
      setSalvando(true);
      if (visitanteSelecionado) {
        await visitantesService.atualizar(visitanteSelecionado.id, dados);
      } else {
        await visitantesService.criar(dados);
      }
      setMostrarForm(false);
      setVisitanteSelecionado(null);
      await carregarVisitantes();
    } catch (error) {
      console.error('❌ Erro:', error.response?.data || error.message);
      alert('Erro ao salvar: ' + (error.response?.data?.error || error.message));
    } finally {
      setSalvando(false);
    }
  };

  const handleConfirmarExclusao = (visitante) => {
    setConfirmDelete({ isOpen: true, visitante });
  };

  const handleExcluirVisitante = async () => {
    try {
      await visitantesService.excluir(confirmDelete.visitante.id);
      setConfirmDelete({ isOpen: false, visitante: null });
      carregarVisitantes();
    } catch (error) {
      alert('Erro ao excluir visitante: ' + error.message);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const limparFiltros = () => {
    setFiltros({ busca: '', dataInicio: '', dataFim: '', sexo: '' });
  };

  const visitantesFiltrados = visitantes.filter(visitante => {
    const busca = filtros.busca.toLowerCase();
    const matchBusca = !filtros.busca ||
      visitante.nome?.toLowerCase().includes(busca) ||
      visitante.telefone?.includes(filtros.busca.replace(/\D/g, '')) ||
      visitante.celular?.includes(filtros.busca.replace(/\D/g, ''));

    const matchSexo = !filtros.sexo || visitante.sexo === filtros.sexo;

    const dataVisita = new Date(visitante.dataVisita);
    const matchDataInicio = !filtros.dataInicio || dataVisita >= new Date(filtros.dataInicio);
    const matchDataFim = !filtros.dataFim || dataVisita <= new Date(filtros.dataFim);

    return matchBusca && matchSexo && matchDataInicio && matchDataFim;
  });

  const formatarData = (data) => {
    if (!data) return 'N/A';
    try {
      return format(new Date(data), 'dd/MM/yyyy');
    } catch {
      return 'Data inválida';
    }
  };

  const formatarTelefone = (telefone) => {
    if (!telefone) return 'N/A';
    const cleaned = telefone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    return telefone;
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
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Controle de Visitantes</h2>
              <p className="text-sm text-gray-600">Total: {visitantesFiltrados.length} visitantes</p>
            </div>
          </div>
          <BotaoPermissao
            modulo="visitantes"
            acao="criar"
            onClick={handleNovoVisitante}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-semibold shadow-md"
            title="Novo Vitante"
          >
            <Plus size={20} />
            Novo Visitante
          </BotaoPermissao>
        </div>

        {/* Filtros */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={18} className="text-gray-600" />
            <h3 className="font-semibold text-gray-800">Filtros de Busca</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar por nome ou telefone..."
                  value={filtros.busca}
                  onChange={(e) => handleFiltroChange('busca', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <input
                type="date"
                value={filtros.dataInicio}
                onChange={(e) => handleFiltroChange('dataInicio', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Data Início"
              />
            </div>
            <div>
              <input
                type="date"
                value={filtros.dataFim}
                onChange={(e) => handleFiltroChange('dataFim', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Data Fim"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filtros.sexo}
                onChange={(e) => handleFiltroChange('sexo', e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos os Sexos</option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMININO">Feminino</option>
              </select>
              {(filtros.busca || filtros.dataInicio || filtros.dataFim || filtros.sexo) && (
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Nome</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Telefone</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Celular</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Data Visita</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Responsável</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {visitantesFiltrados.map((visitante) => (
                <tr key={visitante.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {visitante.nome}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatarTelefone(visitante.telefone)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatarTelefone(visitante.celular)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      {formatarData(visitante.dataVisita)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {visitante.funcionario
                      ? `${visitante.funcionario.pessoa?.nome1}`
                      : 'Não informado'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <BotaoPermissao
                        modulo="visitantes"
                        acao="editar"
                        onClick={() => handleEditarVisitante(visitante)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </BotaoPermissao>
                      <BotaoPermissao
                        modulo="visitantes"
                        acao="excluir"
                        onClick={() => handleConfirmarExclusao(visitante)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                        title="Excluir"
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

        {visitantesFiltrados.length === 0 && !erro && (
          <div className="p-8 text-center text-gray-500">
            {filtros.busca || filtros.dataInicio || filtros.dataFim || filtros.sexo
              ? 'Nenhum visitante encontrado com os filtros aplicados'
              : 'Nenhum visitante cadastrado'}
          </div>
        )}
      </div>

      {/* Formulário */}
      {mostrarForm && (
        <VisitanteForm
          visitante={visitanteSelecionado}
          onSalvar={handleSalvarVisitante}
          onCancelar={() => {
            setMostrarForm(false);
            setVisitanteSelecionado(null);
          }}
          salvando={salvando}
        />
      )}

      {/* Diálogo de Confirmação */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        titulo="Confirmar Exclusão"
        mensagem={`Tem certeza que deseja excluir o visitante ${confirmDelete.visitante?.nome}? Esta ação não pode ser desfeita.`}
        onConfirmar={handleExcluirVisitante}
        onCancelar={() => setConfirmDelete({ isOpen: false, visitante: null })}
      />
    </div>
  );
}

export default Visitantes;