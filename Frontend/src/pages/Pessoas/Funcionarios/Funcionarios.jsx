import React, { useState, useEffect } from 'react';
import { UserCheck, Search, Loader, Edit, Trash2, Plus, UserX, Filter, X } from 'lucide-react';
import { funcionariosService } from '../../../services/api/funcionariosService';
import { funcoesService } from '../../../services/api/funcoesService';
import FuncionarioForm from './FuncionarioForm';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { format } from 'date-fns';
import { usePermissoes } from '../../../hooks/usePermissoes';
import BotaoPermissao from '../../../components/common/BotaoPermissao';

function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [funcoes, setFuncoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, funcionario: null });
  const [confirmDemissao, setConfirmDemissao] = useState({ isOpen: false, funcionario: null });
  const [confirmReativacao, setConfirmReativacao] = useState({ isOpen: false, funcionario: null });
  const [salvando, setSalvando] = useState(false);

  const [filtros, setFiltros] = useState({
    busca: '',
    funcaoId: '',
    situacao: ''
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [respFuncionarios, respFuncoes] = await Promise.all([
        funcionariosService.listarTodos(),
        funcoesService.listarTodos()
      ]);

      // Funcionários
      const funcionariosArray = respFuncionarios.data?.data || respFuncionarios.data || [];

      // Funções - pega o array de dentro do objeto
      const funcoesData = respFuncoes.data?.data || respFuncoes.data || {};
      const funcoesArray = funcoesData.funcoes || [];

      setFuncionarios(funcionariosArray);
      setFuncoes(funcoesArray); // ← Agora é um array de verdade
      setErro(null);
    } catch (error) {
      setErro('Erro ao carregar dados');
      console.error('❌ Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNovoFuncionario = () => {
    setFuncionarioSelecionado(null);
    setMostrarForm(true);
  };

  const handleEditarFuncionario = async (funcionario) => {
    try {
      const resposta = await funcionariosService.buscarPorId(funcionario.id);
      console.log('🔍 Resposta completa:', resposta);
      // Extrai apenas o objeto data
      setFuncionarioSelecionado(resposta.data?.data || resposta.data);
      setMostrarForm(true);
    } catch (error) {
      alert('Erro ao carregar dados do funcionário: ' + error.message);
    }
  };

  const handleSalvarFuncionario = async (dados) => {
    try {
      setSalvando(true);

      if (funcionarioSelecionado) {
        // ✅ ATUALIZAÇÃO: Também precisa enviar no formato correto
        await funcionariosService.atualizar(funcionarioSelecionado.id, {
          pessoa: dados.pessoa,
          funcionario: {  // ✅ AGRUPADO AQUI
            funcaoId: dados.funcionario.funcaoId,
            dataAdmissao: dados.funcionario.dataAdmissao,
            dataDemissao: dados.funcionario.dataDemissao,
            salario: dados.funcionario.salario,
            situacao: dados.funcionario.situacao,
            ...(dados.funcionario.controleAcesso?.senha && {
              controleAcesso: dados.funcionario.controleAcesso
            })
          }
        });
      } else {
        // ✅ CRIAÇÃO: Já vem no formato correto do form
        await funcionariosService.criar(dados);
      }

      setMostrarForm(false);
      setFuncionarioSelecionado(null);
      await carregarDados();
    } catch (error) {
      console.error('❌ Erro:', error.response?.data || error.message);
      alert('Erro ao salvar: ' + (error.response?.data?.message || error.message));
    } finally {
      setSalvando(false);
    }
  };

  const handleConfirmarExclusao = (funcionario) => {
    setConfirmDelete({ isOpen: true, funcionario });
  };

  const handleExcluirFuncionario = async () => {
    try {
      await funcionariosService.excluir(confirmDelete.funcionario.id);
      setConfirmDelete({ isOpen: false, funcionario: null });
      carregarDados();
    } catch (error) {
      alert('Erro ao excluir funcionário: ' + error.message);
    }
  };

  const handleDemitir = (funcionario) => {
    setConfirmDemissao({ isOpen: true, funcionario });
  };

  const handleConfirmarDemissao = async () => {
    try {
      const dataDemissao = new Date().toISOString().split('T')[0];
      await funcionariosService.demitir(confirmDemissao.funcionario.id, { dtDemissao: dataDemissao });
      setConfirmDemissao({ isOpen: false, funcionario: null });
      carregarDados();
    } catch (error) {
      alert('Erro ao demitir funcionário: ' + error.message);
    }
  };

  const handleReativar = (funcionario) => {
    setConfirmReativacao({ isOpen: true, funcionario });
  };

  const handleConfirmarReativacao = async () => {
    try {
      const dataReadmissao = new Date().toISOString().split('T')[0];
      await funcionariosService.reativar(confirmReativacao.funcionario.id, { dtReadmissao: dataReadmissao });
      setConfirmReativacao({ isOpen: false, funcionario: null });
      carregarDados();
    } catch (error) {
      alert('Erro ao reativar funcionário: ' + error.message);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const limparFiltros = () => {
    setFiltros({ busca: '', funcaoId: '', situacao: '' });
  };

  const funcionariosFiltrados = funcionarios.filter(func => {
    const busca = filtros.busca.toLowerCase();
    const matchBusca = !filtros.busca ||
      func.pessoa?.nome1?.toLowerCase().includes(busca) ||
      func.matricula?.toString().includes(busca);

    const matchFuncao = !filtros.funcaoId || func.funcaoId?.toString() === filtros.funcaoId;

    const situacaoFuncionario = func.dtDemissao ? 'DEMITIDO' : 'ATIVO';
    const matchSituacao = !filtros.situacao || situacaoFuncionario === filtros.situacao;

    return matchBusca && matchFuncao && matchSituacao;
  });

  const formatarData = (data) => {
    if (!data) return 'N/A';
    try {
      return format(new Date(data), 'dd/MM/yyyy');
    } catch {
      return 'Data inválida';
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
              <UserCheck className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Gestão de Funcionários</h2>
              <p className="text-sm text-gray-600">Total: {funcionariosFiltrados.length} funcionários</p>
            </div>
          </div>
          <BotaoPermissao
            modulo="funcionarios"
            acao="criar"
            onClick={handleNovoFuncionario}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-semibold shadow-md">
            <Plus size={20} />
            Novo Funcionário
          </BotaoPermissao>
        </div>

        {/* Filtros */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={18} className="text-gray-600" />
            <h3 className="font-semibold text-gray-800">Filtros de Busca</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar por nome ou matrícula..."
                  value={filtros.busca}
                  onChange={(e) => handleFiltroChange('busca', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <select
                value={filtros.funcaoId}
                onChange={(e) => handleFiltroChange('funcaoId', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Todas as Funções</option>
                {funcoes.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.funcao}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <select
                value={filtros.situacao}
                onChange={(e) => handleFiltroChange('situacao', e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Todas Situações</option>
                <option value="ATIVO">Ativos</option>
                <option value="DEMITIDO">Demitidos</option>
              </select>
              {(filtros.busca || filtros.funcaoId || filtros.situacao) && (
                <button
                  onClick={limparFiltros}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
                  title="Limpar filtros">
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Matrícula</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Nome</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Função</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Data Admissão</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Situação</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {funcionariosFiltrados.map((funcionario) => (
                <tr key={funcionario.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">
                    {funcionario.matricula || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {funcionario.pessoa?.nome1 || 'Sem nome'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {funcionario.funcao?.funcao || funcionario.funcao || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatarData(funcionario.dtAdmissao)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${funcionario.dtDemissao
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                      }`}>
                      {funcionario.dtDemissao ? 'DEMITIDO' : 'ATIVO'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <BotaoPermissao
                        modulo="funcionarios"
                        acao="editar"
                        onClick={() => handleEditarFuncionario(funcionario)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Editar aluno"
                      >
                        <Edit size={18} />
                      </BotaoPermissao>

                      {!funcionario.dtDemissao ? (
                        <BotaoPermissao
                          modulo="funcionarios"
                          acao="demitir"
                          onClick={() => handleDemitir(funcionario)}
                          className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg"
                          title="Demitir"
                        >
                          <UserX size={18} />
                        </BotaoPermissao>


                      ) : (
                        <BotaoPermissao
                          modulo="funcionarios"
                          acao="reativar"
                          onClick={() => handleReativar(funcionario)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                          title="Reativar"
                        >
                          <UserCheck size={18} />
                        </BotaoPermissao>


                      )}
                      <BotaoPermissao
                        modulo="funcionarios"
                        acao="excluir"
                        onClick={() => handleConfirmarExclusao(funcionario)}
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

        {funcionariosFiltrados.length === 0 && !erro && (
          <div className="p-8 text-center text-gray-500">
            {filtros.busca || filtros.funcaoId || filtros.situacao
              ? 'Nenhum funcionário encontrado com os filtros aplicados'
              : 'Nenhum funcionário cadastrado'}
          </div>
        )}
      </div>

      {/* Formulário */}
      {mostrarForm && (
        <FuncionarioForm
          funcionario={funcionarioSelecionado}
          funcoes={funcoes}
          onSalvar={handleSalvarFuncionario}
          onCancelar={() => {
            setMostrarForm(false);
            setFuncionarioSelecionado(null);
          }}
          salvando={salvando}
        />
      )}

      {/* Diálogos de Confirmação */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        titulo="Confirmar Exclusão"
        mensagem={`Tem certeza que deseja excluir o funcionário ${confirmDelete.funcionario?.pessoa?.nome1}? Todos os dados relacionados serão permanentemente removidos.`}
        onConfirmar={handleExcluirFuncionario}
        onCancelar={() => setConfirmDelete({ isOpen: false, funcionario: null })}
      />

      <ConfirmDialog
        isOpen={confirmDemissao.isOpen}
        titulo="Confirmar Demissão"
        mensagem={`Tem certeza que deseja demitir o funcionário ${confirmDemissao.funcionario?.pessoa?.nome1}? A data de demissão será registrada como hoje.`}
        onConfirmar={handleConfirmarDemissao}
        onCancelar={() => setConfirmDemissao({ isOpen: false, funcionario: null })}
      />

      <ConfirmDialog
        isOpen={confirmReativacao.isOpen}
        titulo="Confirmar Reativação"
        mensagem={`Tem certeza que deseja reativar o funcionário ${confirmReativacao.funcionario?.pessoa?.nome1}? A data de readmissão será registrada como hoje.`}
        onConfirmar={handleConfirmarReativacao}
        onCancelar={() => setConfirmReativacao({ isOpen: false, funcionario: null })}
      />
    </div>
  );
}

export default Funcionarios;