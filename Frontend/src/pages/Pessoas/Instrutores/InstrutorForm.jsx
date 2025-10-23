import React, { useState, useEffect } from 'react';
import { X, Save, Search, UserPlus, Loader, AlertCircle } from 'lucide-react';
import { funcionariosService } from '../../../services/api/funcionariosService';
import FuncionarioForm from '../Funcionarios/FuncionarioForm';

function InstrutorForm({ instrutor, onSalvar, onCancelar, salvando }) {
  const [funcionarios, setFuncionarios] = useState([]);
  const [buscaFuncionario, setBuscaFuncionario] = useState('');
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
  const [carregandoFuncionarios, setCarregandoFuncionarios] = useState(false);
  const [mostrarFormFuncionario, setMostrarFormFuncionario] = useState(false);

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  useEffect(() => {
    if (instrutor) {
      setFuncionarioSelecionado({
        id: instrutor.funcionarioId,
        matricula: instrutor.funcionario?.matricula,
        pessoa: instrutor.funcionario?.pessoa,
        funcao: instrutor.funcionario?.funcao
      });
    }
  }, [instrutor]);

  const carregarFuncionarios = async () => {
    try {
      setCarregandoFuncionarios(true);
      const resposta = await funcionariosService.listarTodos();
      const funcionariosArray = resposta.data?.data || resposta.data || [];
      
      // Filtrar apenas funcionários ativos
      const funcionariosAtivos = funcionariosArray.filter(
        f => !f.dtDemissao && f.situacao === 'ATIVO'
      );
      
      setFuncionarios(funcionariosAtivos);
    } catch (error) {
      console.error('❌ Erro ao carregar funcionários:', error);
      alert('Erro ao carregar lista de funcionários');
    } finally {
      setCarregandoFuncionarios(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!funcionarioSelecionado) {
      alert('Por favor, selecione um funcionário');
      return;
    }

    onSalvar({
      funcionarioId: funcionarioSelecionado.id
    });
  };

  const handleSelecionarFuncionario = (funcionario) => {
    setFuncionarioSelecionado(funcionario);
    setBuscaFuncionario('');
  };

  const handleRemoverSelecao = () => {
    setFuncionarioSelecionado(null);
  };

  const handleSalvarNovoFuncionario = async (dadosFuncionario) => {
    try {
      const resposta = await funcionariosService.criar(dadosFuncionario);
      const novoFuncionario = resposta.data?.data || resposta.data;
      
      // Adiciona o novo funcionário à lista e seleciona automaticamente
      setFuncionarios(prev => [...prev, novoFuncionario]);
      setFuncionarioSelecionado(novoFuncionario);
      setMostrarFormFuncionario(false);
      
      alert('Funcionário cadastrado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao criar funcionário:', error);
      alert('Erro ao cadastrar funcionário: ' + (error.response?.data?.message || error.message));
    }
  };

  const funcionariosFiltrados = funcionarios.filter(func => {
    const busca = buscaFuncionario.toLowerCase();
    return !buscaFuncionario ||
      func.pessoa?.nome1?.toLowerCase().includes(busca) ||
      func.matricula?.toString().includes(busca) ||
      func.pessoa?.doc1?.includes(busca);
  });

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto py-8 z-50">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl mx-4">
          {/* Header */}
          <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-purple-600 to-purple-700">
            <h3 className="text-2xl font-bold text-white">
              {instrutor ? 'Editar Instrutor' : 'Novo Instrutor'}
            </h3>
            <button 
              onClick={onCancelar} 
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2"
              disabled={salvando}>
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
              {/* Informação sobre Instrutores */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">ℹ️ Como funciona?</p>
                    <p>
                      Instrutores são funcionários autorizados a ministrar aulas e treinos.
                      Vincule um funcionário existente ou cadastre um novo clicando no botão abaixo.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botão para cadastrar novo funcionário */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setMostrarFormFuncionario(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium shadow-sm">
                  <UserPlus size={18} />
                  Cadastrar Novo Funcionário
                </button>
              </div>

              {/* Funcionário Selecionado */}
              {funcionarioSelecionado ? (
                <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        ✅ Funcionário Selecionado
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600 font-medium">Nome:</span>
                          <p className="text-gray-900 font-semibold">
                            {funcionarioSelecionado.pessoa?.nome1}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600 font-medium">Matrícula:</span>
                          <p className="text-gray-900 font-mono">
                            {funcionarioSelecionado.matricula || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600 font-medium">CPF:</span>
                          <p className="text-gray-900 font-mono">
                            {funcionarioSelecionado.pessoa?.doc1 || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600 font-medium">Função:</span>
                          <p className="text-gray-900">
                            {funcionarioSelecionado.funcao?.funcao || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                    {!instrutor && (
                      <button
                        type="button"
                        onClick={handleRemoverSelecao}
                        className="ml-4 p-2 text-red-600 hover:bg-red-100 rounded-lg"
                        title="Remover seleção">
                        <X size={20} />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Buscar Funcionário *
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        value={buscaFuncionario}
                        onChange={(e) => setBuscaFuncionario(e.target.value)}
                        placeholder="Digite nome, matrícula ou CPF..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  {/* Lista de Funcionários */}
                  {buscaFuncionario && (
                    <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
                      {carregandoFuncionarios ? (
                        <div className="p-8 text-center">
                          <Loader className="animate-spin mx-auto text-purple-600" size={32} />
                          <p className="text-sm text-gray-600 mt-2">Carregando funcionários...</p>
                        </div>
                      ) : funcionariosFiltrados.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <p className="font-medium">Nenhum funcionário encontrado</p>
                          <p className="text-sm mt-1">Tente outra busca ou cadastre um novo funcionário</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-200">
                          {funcionariosFiltrados.map((func) => (
                            <button
                              key={func.id}
                              type="button"
                              onClick={() => handleSelecionarFuncionario(func)}
                              className="w-full p-4 hover:bg-purple-50 text-left transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-900">
                                    {func.pessoa?.nome1}
                                  </p>
                                  <div className="flex gap-4 mt-1 text-sm text-gray-600">
                                    <span>📋 {func.matricula}</span>
                                    <span>🆔 {func.pessoa?.doc1}</span>
                                    <span>💼 {func.funcao?.funcao}</span>
                                  </div>
                                </div>
                                <div className="text-purple-600">
                                  Selecionar →
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {!buscaFuncionario && funcionarios.length > 0 && (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                      <Search size={48} className="mx-auto mb-3 text-gray-400" />
                      <p className="font-medium">Digite para buscar funcionários</p>
                      <p className="text-sm mt-1">{funcionarios.length} funcionários ativos disponíveis</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={onCancelar}
                disabled={salvando}
                className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors disabled:opacity-50">
                Cancelar
              </button>
              <button 
                type="submit"
                disabled={salvando || !funcionarioSelecionado}
                className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center gap-2 shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {salvando ? (
                  <>
                    <Loader className="animate-spin" size={18} />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Salvar Instrutor
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal para cadastrar novo funcionário */}
      {mostrarFormFuncionario && (
        <FuncionarioForm
          funcionario={null}
          onSalvar={handleSalvarNovoFuncionario}
          onCancelar={() => setMostrarFormFuncionario(false)}
        />
      )}
    </>
  );
}

export default InstrutorForm;