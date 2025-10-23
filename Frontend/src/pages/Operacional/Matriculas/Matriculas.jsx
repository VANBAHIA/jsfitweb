import React, { useState, useEffect } from 'react';
import { FileText, Search, Loader, Trash2, Plus, CheckCircle, XCircle, AlertCircle, X, DollarSign } from 'lucide-react';
import { matriculasService } from '../../../services/api/matriculasService';
import MatriculaWizard from './MatriculaWizard';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { jobsService } from '../../../services/api/jobsService';
import { usePermissoes } from '../../../hooks/usePermissoes';
import BotaoPermissao from '../../../components/common/BotaoPermissao';



function Matriculas() {
  // Estados de dados
  const [matriculas, setMatriculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const { temPermissao } = usePermissoes();


  // Estados de UI
  const [mostrarWizard, setMostrarWizard] = useState(false);
  const [busca, setBusca] = useState('');
  const [erroToast, setErroToast] = useState(null);
  // Estados para geração de cobranças
  const [gerandoCobrancas, setGerandoCobrancas] = useState(false);
  const [resultadoCobrancas, setResultadoCobrancas] = useState(null);

  // Estados de confirmação
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    matricula: null,
    acao: null
  });

  // Carregar matrículas ao montar componente
  useEffect(() => {
    carregarMatriculas();
  }, []);

  /**
   * Carrega a lista de matrículas da API
   */
  const carregarMatriculas = async () => {
    try {
      setLoading(true);
      setErro(null);

      const resposta = await matriculasService.listarTodos();
      const matriculasArray = resposta.data?.matriculas || [];

      setMatriculas(matriculasArray);
    } catch (error) {
      const mensagem = error.response?.data?.mensagem || 'Erro ao carregar matrículas';
      setErro(mensagem);
      console.error('❌ Erro ao carregar matrículas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGerarCobrancas = async () => {
    try {
      // Confirmar ação
      const confirmar = window.confirm(
        '🔄 Deseja gerar as cobranças mensais agora?\n\n' +
        'Esta ação criará contas a receber para todas as matrículas ativas que estão com cobranças pendentes.'
      );

      if (!confirmar) return;

      setGerandoCobrancas(true);
      setResultadoCobrancas(null);

      const resposta = await jobsService.gerarCobrancas();

      // ✅ CORRIGIDO: Acessar dados corretamente
      const resultado = resposta.data || resposta;

      // Exibir resultado
      const mensagem = `
✅ Cobranças geradas com sucesso!

📊 Resumo:
• Total processado: ${resultado.total || 0}
• Criadas: ${resultado.geradas || 0}
• Já existiam ou não se aplicam: ${resultado.jaExistiam || 0}
• Erros: ${resultado.erros || 0}
    `;

      setResultadoCobrancas({
        sucesso: true,
        ...resultado
      });

      alert(mensagem);

      // Recarregar lista de matrículas
      await carregarMatriculas();

    } catch (error) {
      const mensagemErro = error.response?.data?.message
        || error.response?.data?.mensagem
        || error.message
        || 'Erro desconhecido ao gerar cobranças';

      console.error('❌ Erro na geração de cobranças:', error);

      setResultadoCobrancas({
        sucesso: false,
        mensagem: mensagemErro

      });
      setErroToast(mensagemErro);




    } finally {
      setGerandoCobrancas(false);

      // Limpar resultado após 5 segundos
      setTimeout(() => {
        setResultadoCobrancas(null);
      }, 5000);
    }
  };
  /**
   * Abre o wizard para criar nova matrícula
   */
  const handleNovaMatricula = () => {
    setMostrarWizard(true);
  };

  /**
   * Callback quando matrícula é criada com sucesso
   */
  const handleSucessoMatricula = () => {
    setMostrarWizard(false);
    carregarMatriculas();
  };

  /**
   * Abre o dialog de confirmação para uma ação
   */
  const handleConfirmarAcao = (matricula, acao) => {
    if (!matricula?.id) {
      setErroToast('Erro: Matrícula inválida');
      return;
    }

    setConfirmDialog({
      isOpen: true,
      matricula,
      acao
    });
  };

  /**
   * Executa a ação confirmada (excluir, inativar, reativar)
   */
  const handleExecutarAcao = async () => {
    const { matricula, acao } = confirmDialog;

    try {
      if (!matricula?.id) {
        throw new Error('ID da matrícula não encontrado');
      }

      console.log(`📋 Executando ação: ${acao} | ID: ${matricula.id}`);

      if (acao === 'excluir') {
        await matriculasService.excluir(matricula.id);
        console.log('✅ Matrícula excluída com sucesso');

      } else if (acao === 'inativar') {
        await matriculasService.inativar(matricula.id, 'Inativada pelo usuário');
        console.log('✅ Matrícula inativada com sucesso');

      } else if (acao === 'reativar') {
        await matriculasService.reativar(matricula.id);
        console.log('✅ Matrícula reativada com sucesso');
      }

      // Fechar dialog e recarregar lista
      setConfirmDialog({ isOpen: false, matricula: null, acao: null });
      await carregarMatriculas();

    } catch (error) {
      // ✅ Capturar mensagem da API
      const mensagemErro = error.response?.data?.mensagem
        || error.response?.data?.message
        || error.message
        || 'Erro desconhecido';

      console.error('❌ Erro ao executar ação:', {
        acao: confirmDialog.acao,
        matriculaId: confirmDialog.matricula?.id,
        mensagem: mensagemErro,
        detalhes: error.response?.data
      });

      setErroToast(mensagemErro);
    }
  };

  /**
   * Gera a mensagem de confirmação baseada na ação
   */
  const obterMensagemConfirmacao = () => {
    const { matricula, acao } = confirmDialog;
    const nomeAluno = matricula?.aluno?.pessoa?.nome1 || 'Desconhecido';

    switch (acao) {
      case 'excluir':
        return `Tem certeza que deseja excluir a matrícula do aluno ${nomeAluno}? Esta ação não pode ser desfeita.`;
      case 'inativar':
        return `Deseja inativar a matrícula do aluno ${nomeAluno}? O aluno não terá mais acesso à academia.`;
      case 'reativar':
        return `Deseja reativar a matrícula do aluno ${nomeAluno}? O aluno voltará a ter acesso à academia.`;
      default:
        return '';
    }
  };

  /**
   * Formata valores em moeda BRL
   */
  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0);
  };

  /**
   * Formata datas em formato BR
   */
  const formatarData = (data) => {
    if (!data) return 'N/A';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  /**
   * Filtra matrículas baseado na busca
   */
  const matriculasFiltradas = matriculas.filter(matricula => {
    if (!busca) return true;

    const termoBusca = busca.toLowerCase();
    const nomeAluno = matricula.aluno?.pessoa?.nome1?.toLowerCase() || '';
    const cpfAluno = matricula.aluno?.pessoa?.doc1 || '';
    const nomePlano = matricula.plano?.nome?.toLowerCase() || '';

    return nomeAluno.includes(termoBusca)
      || cpfAluno.includes(termoBusca)
      || nomePlano.includes(termoBusca);
  });

  /**
   * Obtém o badge de situação com cores apropriadas
   */
  const obterBadgeSituacao = (situacao) => {
    const badges = {
      'ATIVA': { bg: 'bg-green-100', text: 'text-green-800' },
      'INATIVA': { bg: 'bg-red-100', text: 'text-red-800' },
      'CANCELADA': { bg: 'bg-gray-100', text: 'text-gray-800' },
      'SUSPENSA': { bg: 'bg-yellow-100', text: 'text-yellow-800' }
    };

    const badge = badges[situacao] || badges['CANCELADA'];
    return badge;
  };

  // Estado de carregamento
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Card Principal */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">

        {/* Header */}
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="text-purple-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Gestão de Matrículas</h2>
              <p className="text-sm text-gray-600">
                Total: {matriculas.length} matrícula(s)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 🆕 Botão Gerar Cobranças */}
            <BotaoPermissao
              modulo="matriculas"
              acao="gerarCobr"

              onClick={handleGerarCobrancas}
              disabled={gerandoCobrancas}
              className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-semibold shadow-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              title="Gerar cobranças mensais manualmente"
            >
              {gerandoCobrancas ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  Gerando...
                </>
              ) : (
                <>
                  <DollarSign size={20} />
                  Gerar Cobranças
                </>
              )}
            </BotaoPermissao>

            {/* Botão Nova Matrícula (já existente) */}
            <BotaoPermissao
              modulo="matriculas"
              acao="criar"

              onClick={handleNovaMatricula}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 font-semibold shadow-md transition-colors"
            >
              <Plus size={20} />
              Nova Matrícula
            </BotaoPermissao>
          </div>
        </div>

        {/* Busca */}
        <div className="p-6 border-b">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar por aluno, CPF ou plano..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Mensagem de Erro */}
        {erro && (
          <div className="m-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-start gap-3">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <div>
              <strong>Erro ao carregar matrículas:</strong>
              <p className="text-sm">{erro}</p>
            </div>
          </div>
        )}

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Aluno
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Plano
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Valor
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Data Início
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Data Fim
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                  Vencimento
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
              {matriculasFiltradas.map((matricula) => {
                const badgeSituacao = obterBadgeSituacao(matricula.situacao);

                return (
                  <tr key={matricula.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {matricula.aluno?.pessoa?.nome1 || 'Sem nome'}
                        </div>
                        <div className="text-xs text-gray-500">
                          Mat: {matricula.codigo}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {matricula.plano?.nome || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {matricula.plano?.periodicidade}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                      {formatarValor(matricula.valorFinal || matricula.valorMatricula)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatarData(matricula.dataInicio)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatarData(matricula.dataFim)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {matricula.diaVencimento ? `Dia ${matricula.diaVencimento}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${badgeSituacao.bg} ${badgeSituacao.text}`}>
                        {matricula.situacao || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {matricula.situacao === 'ATIVA' ? (
                          <BotaoPermissao
                            modulo="matriculas"
                            acao="inativar"

                            onClick={() => handleConfirmarAcao(matricula, 'inativar')}
                            className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
                            title="Inativar matrícula"
                          >
                            <XCircle size={18} />
                          </BotaoPermissao>
                        ) : (
                          <BotaoPermissao
                            modulo="matriculas"
                            acao="reativar"

                            onClick={() => handleConfirmarAcao(matricula, 'reativar')}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            title="Reativar matrícula"
                          >
                            <CheckCircle size={18} />
                          </BotaoPermissao>
                        )}
                        <BotaoPermissao
                          modulo="matriculas"
                          acao="excluir"
                          onClick={() => handleConfirmarAcao(matricula, 'excluir')}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Excluir matrícula"
                        >
                          <Trash2 size={18} />
                        </BotaoPermissao>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mensagem de vazio */}
        {matriculasFiltradas.length === 0 && !erro && (
          <div className="p-8 text-center text-gray-500">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p className="font-medium">
              {busca ? 'Nenhuma matrícula encontrada' : 'Nenhuma matrícula cadastrada'}
            </p>
          </div>
        )}
      </div>

      {/* Toast de Erro */}
      {erroToast && (
        <div className="fixed top-4 right-4 bg-red-50 border-2 border-red-300 rounded-lg p-4 max-w-md shadow-lg z-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <h4 className="font-bold text-red-900 mb-1">Erro</h4>
              <p className="text-sm text-red-800">{erroToast}</p>
            </div>
            <button
              onClick={() => setErroToast(null)}
              className="text-red-600 hover:bg-red-100 rounded p-1 flex-shrink-0"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Wizard para nova matrícula */}
      {mostrarWizard && (
        <MatriculaWizard
          onCancelar={() => setMostrarWizard(false)}
          onSucesso={handleSucessoMatricula}
        />
      )}

      {/* Dialog de confirmação */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        titulo={`Confirmar ${confirmDialog.acao === 'excluir'
          ? 'Exclusão'
          : confirmDialog.acao === 'inativar'
            ? 'Inativação'
            : 'Reativação'
          }`}
        mensagem={obterMensagemConfirmacao()}
        onConfirmar={handleExecutarAcao}
        onCancelar={() => setConfirmDialog({ isOpen: false, matricula: null, acao: null })}
      />
    </div>
  );
}

export default Matriculas;