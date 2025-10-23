import React, { useState, useEffect } from 'react';
import { Calendar, Search, Loader, Edit, Trash2, Plus, CheckCircle, XCircle } from 'lucide-react';
import { frequenciaService } from '../../../services/api/frequenciaService';
import { alunosService } from '../../../services/api/alunosService';
import FrequenciaForm from './FrequenciaForm';
import RegistroPresenca from './RegistroPresenca';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { usePermissoes } from '../../../hooks/usePermissoes';
import BotaoPermissao from '../../../components/common/BotaoPermissao';

function Frequencia() {
  const [frequencias, setFrequencias] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [mostrarRegistroRapido, setMostrarRegistroRapido] = useState(false);
  const [frequenciaSelecionada, setFrequenciaSelecionada] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, item: null });
  
  const { temPermissao } = usePermissoes();

  // Filtros
  const [filtros, setFiltros] = useState({
    dataInicio: new Date().toISOString().split('T')[0],
    dataFim: new Date().toISOString().split('T')[0],
    alunoId: '',
    presente: ''
  });

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    if (filtros.dataInicio || filtros.dataFim) {
      carregarFrequencias();
    }
  }, [filtros]);

const carregarDados = async () => {
  try {
    setLoading(true);
    const [resAlunos, resFreq] = await Promise.all([
      alunosService.listarTodos(),
      frequenciaService.listarTodos(filtros)
    ]);

    setAlunos(resAlunos.data?.data || []);
    
    // ✅ CORREÇÃO: Acessar o caminho correto
    setFrequencias(resFreq.data?.data?.frequencias || []);
    
    setErro(null);
  } catch (error) {
    setErro('Erro ao carregar dados');
    console.error('❌ Erro:', error);
  } finally {
    setLoading(false);
  }
};

const carregarFrequencias = async () => {
  try {
    const resposta = await frequenciaService.listarTodos(filtros);
    console.log('📦 Resposta frequências:', resposta.data);
    
    // ✅ CORREÇÃO: Acessar o caminho correto
    setFrequencias(resposta.data?.data?.frequencias || []);
    
  } catch (error) {
    console.error('Erro ao carregar frequências:', error);
  }
};

  const handleNovaFrequencia = () => {
    setFrequenciaSelecionada(null);
    setMostrarForm(true);
  };

  const handleEditarFrequencia = async (freq) => {
    try {
      const resposta = await frequenciaService.buscarPorId(freq.id);
      setFrequenciaSelecionada(resposta.data.data);
      setMostrarForm(true);
    } catch (error) {
      alert('Erro ao carregar frequência: ' + error.message);
    }
  };

  const handleSalvarFrequencia = async (dados) => {
    try {
      if (frequenciaSelecionada) {
        await frequenciaService.atualizar(frequenciaSelecionada.id, dados);
      } else {
        await frequenciaService.registrar(dados);
      }

      setMostrarForm(false);
      setFrequenciaSelecionada(null);
      await carregarFrequencias();
    } catch (error) {
      alert('Erro ao salvar: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleConfirmarExclusao = (freq) => {
    setConfirmDelete({ isOpen: true, item: freq });
  };

  const handleExcluirFrequencia = async () => {
    try {
      await frequenciaService.excluir(confirmDelete.item.id);
      setConfirmDelete({ isOpen: false, item: null });
      await carregarFrequencias();
    } catch (error) {
      alert('Erro ao excluir: ' + error.message);
    }
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarHora = (data) => {
    return new Date(data).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
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
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="text-blue-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Controle de Frequência</h2>
                <p className="text-sm text-gray-600">
                  {frequencias.length} registros encontrados
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setMostrarRegistroRapido(true)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-semibold shadow-md"
              >
                <CheckCircle size={20} />
                Registro Rápido
              </button>
              <button
                onClick={handleNovaFrequencia}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-semibold shadow-md"
              >
                <Plus size={20} />
                Registrar Frequência
              </button>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Início
              </label>
              <input
                type="date"
                value={filtros.dataInicio}
                onChange={(e) => setFiltros(prev => ({ ...prev, dataInicio: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Fim
              </label>
              <input
                type="date"
                value={filtros.dataFim}
                onChange={(e) => setFiltros(prev => ({ ...prev, dataFim: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aluno
              </label>
              <select
                value={filtros.alunoId}
                onChange={(e) => setFiltros(prev => ({ ...prev, alunoId: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos os alunos</option>
                {alunos.map(aluno => (
                  <option key={aluno.id} value={aluno.id}>
                    {aluno.pessoa?.nome1}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Situação
              </label>
              <select
                value={filtros.presente}
                onChange={(e) => setFiltros(prev => ({ ...prev, presente: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="true">Presentes</option>
                <option value="false">Faltas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Data
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Aluno
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Horário
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Tipo
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                  Situação
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {frequencias.map((freq) => (
                <tr key={freq.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatarData(freq.data)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {freq.aluno?.pessoa?.nome1 || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatarHora(freq.horarioInicio)}
                    {freq.horarioFim && ` - ${formatarHora(freq.horarioFim)}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                      {freq.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {freq.presente ? (
                      <CheckCircle className="inline text-green-600" size={20} />
                    ) : (
                      <XCircle className="inline text-red-600" size={20} />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                                            {/* ✅ BOTÃO EDITAR - Só aparece se tiver permissão */}
                      <BotaoPermissao
                        modulo="alunos"
                        acao="editar"
                        onClick={() => handleEditarFrequencia(freq)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Editar aluno"
                      >
                        <Edit size={18} />
                      </BotaoPermissao>

                      {/* ✅ BOTÃO EXCLUIR - Só aparece se tiver permissão */}
                      <BotaoPermissao
                        modulo="alunos"
                        acao="excluir"
                        onClick={() => handleConfirmarExclusao(freq)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Excluir aluno"
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

        {frequencias.length === 0 && !erro && (
          <div className="p-8 text-center text-gray-500">
            <Calendar size={48} className="mx-auto mb-3 text-gray-400" />
            <p className="font-medium">Nenhuma frequência registrada</p>
            <p className="text-sm mt-1">
              Ajuste os filtros ou registre uma nova frequência
            </p>
          </div>
        )}
      </div>

      {/* Modais */}
      {mostrarForm && (
        <FrequenciaForm
          frequencia={frequenciaSelecionada}
          alunos={alunos}
          onSalvar={handleSalvarFrequencia}
          onCancelar={() => {
            setMostrarForm(false);
            setFrequenciaSelecionada(null);
          }}
        />
      )}

      {mostrarRegistroRapido && (
        <RegistroPresenca
          onSucesso={() => {
            setMostrarRegistroRapido(false);
            carregarFrequencias();
          }}
          onCancelar={() => setMostrarRegistroRapido(false)}
        />
      )}

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        titulo="Confirmar Exclusão"
        mensagem={`Tem certeza que deseja excluir este registro de frequência?`}
        onConfirmar={handleExcluirFrequencia}
        onCancelar={() => setConfirmDelete({ isOpen: false, item: null })}
      />
    </div>
  );
}

export default Frequencia;