import React, { useState, useEffect } from 'react';
import { Users, Search, Loader, Edit, Trash2, Plus } from 'lucide-react';
import { alunosService } from '../../../services/api/alunosService';
import AlunoForm from './AlunoForm';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { usePermissoes } from '../../../hooks/usePermissoes';
import BotaoPermissao from '../../../components/common/BotaoPermissao';
import { useAuth } from '../../../context/AuthContext'; // 👈 IMPORTANTE

function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, aluno: null });
  const [salvando, setSalvando] = useState(false);

  // ✅ Hooks
  const { temPermissao } = usePermissoes();
  const { usuario } = useAuth(); // 👈 PEGA O USUÁRIO LOGADO

  useEffect(() => {
    if (usuario?.empresa?.id) {
      carregarAlunos();
    }
  }, [usuario]);

  const carregarAlunos = async () => {
    try {
      setLoading(true);
      const resposta = await alunosService.listarTodos({
        empresaId: usuario?.empresa?.id, // 👈 EMPRESA DO USUÁRIO LOGADO
        page: 1,
        limit: 20,
      });
      console.log('📦 Resposta da API:', resposta);

      setAlunos(resposta.data?.data || resposta.data || []);
      setErro(null);
    } catch (error) {
      setErro('Erro ao carregar alunos');
      console.error('❌ Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNovoAluno = () => {
    setAlunoSelecionado(null);
    setMostrarForm(true);
  };

const handleEditarAluno = async (aluno) => {
  try {
    const resposta = await alunosService.buscarPorId(aluno.id);
    console.log('📥 Aluno completo:', resposta);
    
    setAlunoSelecionado(resposta); // 👈 REMOVA O .data
    setMostrarForm(true);
  } catch (error) {
    console.error('❌ Erro completo:', error);
    alert('Erro ao carregar dados do aluno: ' + error.message);
  }
};

  const handleSalvarAluno = async (dados) => {
    try {
      setSalvando(true);

      if (alunoSelecionado) {
        // ✅ Envia o objeto completo, preservando avaliacaoFisica e outros campos
        await alunosService.atualizar(alunoSelecionado.id, dados);
      } else {
        await alunosService.criar(dados);
      }

      setMostrarForm(false);
      setAlunoSelecionado(null);
      await carregarAlunos();
    } catch (error) {
      console.error('❌ Erro:', error.response?.data || error.message);
      alert('Erro ao salvar: ' + (error.response?.data?.message || error.message));
    } finally {
      setSalvando(false);
    }
  };

  const handleConfirmarExclusao = (aluno) => {
    setConfirmDelete({ isOpen: true, aluno });
  };

  const handleExcluirAluno = async () => {
    try {
      await alunosService.excluir(confirmDelete.aluno.id);
      setConfirmDelete({ isOpen: false, aluno: null });
      carregarAlunos();
    } catch (error) {
      alert('Erro ao excluir aluno: ' + error.message);
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
        {/* HEADER */}
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Gestão de Alunos</h2>
              <p className="text-sm text-gray-600">Total: {alunos.length} alunos</p>
            </div>
          </div>

          <BotaoPermissao
            modulo="alunos"
            acao="criar"
            onClick={handleNovoAluno}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-semibold shadow-md transition-colors"
          >
            <Plus size={20} />
            Novo Aluno
          </BotaoPermissao>
        </div>

        {/* ERRO */}
        {erro && (
          <div className="m-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {erro}
          </div>
        )}

        {/* TABELA */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Matrícula
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Nome
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  CPF
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Situação
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {alunos.map((aluno) => (
                <tr key={aluno.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">{aluno.matricula}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {aluno.pessoa?.nome1 || 'Sem nome'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{aluno.pessoa?.doc1 || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${aluno.pessoa?.situacao === 'Ativo'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {aluno.pessoa?.situacao || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <BotaoPermissao
                        modulo="alunos"
                        acao="editar"
                        onClick={() => handleEditarAluno(aluno)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Editar aluno"
                      >
                        <Edit size={18} />
                      </BotaoPermissao>

                      <BotaoPermissao
                        modulo="alunos"
                        acao="excluir"
                        onClick={() => handleConfirmarExclusao(aluno)}
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

        {/* LISTA VAZIA */}
        {alunos.length === 0 && !erro && (
          <div className="p-8 text-center text-gray-500">
            <Users className="mx-auto mb-3 text-gray-400" size={48} />
            <p className="text-lg font-medium">Nenhum aluno cadastrado</p>
            <p className="text-sm mt-1">
              {temPermissao('alunos', 'criar')
                ? 'Clique em "Novo Aluno" para começar'
                : 'Você não tem permissão para cadastrar alunos'}
            </p>
          </div>
        )}
      </div>

      {/* FORM */}
      {mostrarForm && (
        <AlunoForm
          aluno={alunoSelecionado}
          onSalvar={handleSalvarAluno}
          onCancelar={() => {
            setMostrarForm(false);
            setAlunoSelecionado(null);
          }}
          salvando={salvando}
        />
      )}

      {/* CONFIRMAÇÃO DE EXCLUSÃO */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        titulo="Confirmar Exclusão"
        mensagem={`Tem certeza que deseja excluir o aluno ${confirmDelete.aluno?.pessoa?.nome1}?`}
        onConfirmar={handleExcluirAluno}
        onCancelar={() => setConfirmDelete({ isOpen: false, aluno: null })}
      />
    </div>
  );
}

export default Alunos;
