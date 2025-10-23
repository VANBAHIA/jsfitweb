import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Users, Loader, Check } from 'lucide-react';
import { alunosService } from '../../../../services/api/alunosService';
import AlunoForm from '../../../Pessoas/Alunos/AlunoForm';

function Step1Aluno({ alunoSelecionado, onSelecionarAluno }) {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [mostrarFormNovoAluno, setMostrarFormNovoAluno] = useState(false);

  useEffect(() => {
    carregarAlunos();
  }, []);

  const carregarAlunos = async () => {
    try {
      setLoading(true);
      const response = await alunosService.listarTodos({ limit: 100 });
      const alunosArray = response.data?.data || [];
      setAlunos(alunosArray);
    } catch (error) {
      console.error('❌ Erro ao carregar alunos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSalvarNovoAluno = async (dados) => {
    try {
              await alunosService.criar({
                pessoa: dados.pessoa,
                aluno: {
                  vldExameMedico: dados.vldExameMedico,
                  vldAvaliacao: dados.vldAvaliacao,
                  objetivo: dados.objetivo,
                  profissao: dados.profissao,
                  empresa: dados.empresa,
                  responsavel: dados.responsavel,
                  horarios: dados.horarios,
                  controleAcesso: dados.controleAcesso
                }
              });
      await carregarAlunos();
      setMostrarFormNovoAluno(false);
    } catch (error) {
      console.error('❌ Erro ao criar aluno:', error);
      alert('Erro ao criar aluno: ' + (error.response?.data?.message || error.message));
    }
  };

  const alunosFiltrados = alunos.filter(aluno => {
    const termoBusca = busca.toLowerCase();
    const nome = aluno.pessoa?.nome1?.toLowerCase() || '';
    const cpf = aluno.pessoa?.doc1 || '';
    const matricula = aluno.matricula || '';

    return nome.includes(termoBusca) || 
           cpf.includes(termoBusca) || 
           matricula.includes(termoBusca);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Card de Ação Principal */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-blue-900 mb-2">
              👤 Selecione ou Cadastre um Aluno
            </h3>
            <p className="text-blue-700 text-sm">
              {alunoSelecionado 
                ? `Aluno selecionado: ${alunoSelecionado.pessoa?.nome1}`
                : 'Busque na lista ou crie um novo aluno para continuar'
              }
            </p>
          </div>
          <button
            onClick={() => setMostrarFormNovoAluno(true)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold flex items-center gap-2 shadow-lg transition-colors"
          >
            <UserPlus size={20} />
            Novo Aluno
          </button>
        </div>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar por nome, CPF ou matrícula..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
        />
      </div>

      {/* Lista de Alunos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
        {alunosFiltrados.length === 0 ? (
          <div className="col-span-2 text-center py-12">
            <Users className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 font-medium">
              {busca ? 'Nenhum aluno encontrado' : 'Nenhum aluno cadastrado'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Clique em "Novo Aluno" para cadastrar
            </p>
          </div>
        ) : (
          alunosFiltrados.map(aluno => (
            <button
              key={aluno.id}
              onClick={() => onSelecionarAluno(aluno)}
              className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-lg ${
                alunoSelecionado?.id === aluno.id
                  ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-gray-900 text-lg">
                      {aluno.pessoa?.nome1} {aluno.pessoa?.nome2 || ''}
                    </span>
                    {alunoSelecionado?.id === aluno.id && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded">
                        <Check size={14} />
                        SELECIONADO
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>
                      <span className="font-semibold">Matrícula:</span> {aluno.matricula}
                    </div>
                    <div>
                      <span className="font-semibold">CPF:</span> {aluno.pessoa?.doc1 || 'Não informado'}
                    </div>
                    {aluno.pessoa?.contatos && aluno.pessoa.contatos.length > 0 && (
                      <div>
                        <span className="font-semibold">Telefone:</span> {aluno.pessoa.contatos[0].valor}
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      aluno.pessoa?.situacao === 'ATIVO'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {aluno.pessoa?.situacao}
                    </span>
                  </div>
                </div>

                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  alunoSelecionado?.id === aluno.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  <Check size={18} />
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Informação */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="text-sm text-yellow-800">
              <strong>Dica:</strong> Selecione um aluno da lista ou crie um novo cadastro. 
              Apenas alunos ativos podem ser matriculados.
            </p>
          </div>
        </div>
      </div>

      {/* Modal Novo Aluno */}
      {mostrarFormNovoAluno && (
        <AlunoForm
          onSalvar={handleSalvarNovoAluno}
          onCancelar={() => setMostrarFormNovoAluno(false)}
        />
      )}
    </div>
  );
}

export default Step1Aluno;