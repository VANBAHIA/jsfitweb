import React, { useState, useEffect } from 'react';
import { Plus, Trash2, UserCheck, Search } from 'lucide-react';
import { funcionariosService } from '../../../../services/api/funcionariosService';
import FuncionarioForm from '../../../Pessoas/Funcionarios/FuncionarioForm';

function InstrutoresTab({ instrutores, onChange }) {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loadingFuncionarios, setLoadingFuncionarios] = useState(true);
  const [busca, setBusca] = useState('');
  const [mostrarLista, setMostrarLista] = useState(false);
  const [mostrarFormFuncionario, setMostrarFormFuncionario] = useState(false);

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const carregarFuncionarios = async () => {
    try {
      const resposta = await funcionariosService.listarTodos({ situacao: 'ATIVO' });
      // ✅ CORRIGIDO: Estrutura correta da resposta
      const funcArray = resposta.data?.data || resposta.data || [];
      setFuncionarios(funcArray);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
    } finally {
      setLoadingFuncionarios(false);
    }
  };

  const adicionarInstrutor = (funcionario) => {
    // Verifica se já foi adicionado
    if (instrutores.some(i => i.funcionarioId === funcionario.id)) {
      alert('Este instrutor já está adicionado à turma');
      return;
    }

    const novoInstrutor = {
      funcionarioId: funcionario.id,
      nome: funcionario.pessoa?.nome1 || funcionario.nome || 'Nome não disponível',
      matricula: funcionario.matricula,
      funcao: funcionario.funcao?.funcao || 'Instrutor'
    };

    onChange([...instrutores, novoInstrutor]);
    setBusca('');
    setMostrarLista(false);
  };

  const removerInstrutor = (funcionarioId) => {
    onChange(instrutores.filter(i => i.funcionarioId !== funcionarioId));
  };

  const funcionariosFiltrados = funcionarios.filter(func => {
    const nome = func.pessoa?.nome1?.toLowerCase() || '';
    const matricula = func.matricula?.toLowerCase() || '';
    const buscaLower = busca.toLowerCase();
    return nome.includes(buscaLower) || matricula.includes(buscaLower);
  });

  // Filtra funcionários que já não estão na lista
  const funcionariosDisponiveis = funcionariosFiltrados.filter(
    func => !instrutores.some(i => i.funcionarioId === func.id)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-800">Instrutores da Turma</h4>
          <p className="text-sm text-gray-600">
            Adicione os funcionários responsáveis por essa turma
          </p>
        </div>
      </div>

      {/* Campo de Busca com Botão Novo Funcionário */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar funcionário por nome ou matrícula..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onFocus={() => setMostrarLista(true)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={loadingFuncionarios}
            />
          </div>

          {/* Lista de Sugestões */}
          {mostrarLista && busca && funcionariosDisponiveis.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {funcionariosDisponiveis.map(func => (
                <button
                  key={func.id}
                  type="button"
                  onClick={() => adicionarInstrutor(func)}
                  className="w-full px-4 py-3 hover:bg-gray-50 text-left transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      {func.pessoa?.nome1 || 'Nome não disponível'}
                    </div>
                    <div className="text-sm text-gray-500">
                      Matrícula: {func.matricula} | {func.funcao?.funcao || 'Sem função'}
                    </div>
                  </div>
                  <Plus size={18} className="text-blue-600" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Botão Novo Funcionário */}
        <button
          type="button"
          onClick={() => setMostrarFormFuncionario(true)}
          className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 whitespace-nowrap shadow-md transition-colors"
          title="Cadastrar novo funcionário"
        >
          <Plus size={18} />
          Novo Funcionário
        </button>
      </div>

      {/* Lista de Instrutores Adicionados */}
      {instrutores.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <UserCheck className="mx-auto text-gray-400 mb-3" size={48} />
          <p className="text-gray-600 font-medium mb-2">Nenhum instrutor adicionado</p>
          <p className="text-sm text-gray-500">
            Use o campo de busca acima para adicionar instrutores à turma
          </p>
        </div>
      ) : (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h5 className="font-semibold text-gray-800">
              Instrutores Adicionados ({instrutores.length})
            </h5>
          </div>
          <div className="space-y-2">
            {instrutores.map((instrutor) => (
              <div
                key={instrutor.funcionarioId}
                className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <UserCheck className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{instrutor.nome}</div>
                    <div className="text-sm text-gray-500">
                      Matrícula: {instrutor.matricula} | {instrutor.funcao}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removerInstrutor(instrutor.funcionarioId)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  title="Remover instrutor"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
        <div className="flex items-start gap-3">
          <div className="text-xl">💡</div>
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Dica:</p>
            <p>
              Você pode adicionar múltiplos instrutores para a mesma turma. 
              Apenas funcionários ativos serão exibidos na lista de busca.
            </p>
          </div>
        </div>
      </div>

      {/* Modal Novo Funcionário */}
      {mostrarFormFuncionario && (
        <FuncionarioForm
          funcionario={null}
          onSalvar={async (dados) => {
            try {
              await funcionariosService.criar(dados);
              setMostrarFormFuncionario(false);
              await carregarFuncionarios(); // Recarrega lista
              alert('Funcionário cadastrado com sucesso!');
            } catch (error) {
              alert('Erro ao cadastrar funcionário: ' + error.message);
            }
          }}
          onCancelar={() => setMostrarFormFuncionario(false)}
        />
      )}
    </div>
  );
}

export default InstrutoresTab;