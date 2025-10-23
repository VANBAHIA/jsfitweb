import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import Step1Aluno from './steps/Step1Aluno';
import Step2Plano from './steps/Step2Plano';
import Step3Turma from './steps/Step3Turma';
import Step4Detalhes from './steps/Step4Detalhes';
import Step5Resumo from './steps/Step5Resumo';
import MatriculaSucessoModal from './MatriculaSucessoModal';
import { matriculasService } from '../../../services/api/matriculasService';

function MatriculaWizard({ onCancelar, onSucesso }) {
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [salvando, setSalvando] = useState(false);
  const [mostrarSucesso, setMostrarSucesso] = useState(false);
  const [dadosResposta, setDadosResposta] = useState(null);

  // Estado dos dados da matrícula
  const [dadosMatricula, setDadosMatricula] = useState({
    aluno: null,
    plano: null,
    turma: null,
    desconto: null,
    dataInicio: '',
    diaVencimento: '',
    formaPagamento: 'DINHEIRO',
    parcelamento: 1,
    observacoes: '',
    valorMatricula: 0,
    valorDesconto: 0,
    valorFinal: 0
  });

  const etapas = [
    { numero: 1, titulo: 'Aluno', descricao: 'Selecione ou cadastre o aluno' },
    { numero: 2, titulo: 'Plano', descricao: 'Escolha o plano de matrícula' },
    { numero: 3, titulo: 'Turma', descricao: 'Associe a uma turma (opcional)' },
    { numero: 4, titulo: 'Detalhes', descricao: 'Configure valores e datas' },
    { numero: 5, titulo: 'Resumo', descricao: 'Confirme as informações' }
  ];

  const atualizarDados = (campo, valor) => {
    setDadosMatricula(prev => ({ ...prev, [campo]: valor }));
  };

  const podeAvancar = () => {
    switch (etapaAtual) {
      case 1: return dadosMatricula.aluno !== null;
      case 2: return dadosMatricula.plano !== null;
      case 3: return true; // Turma é opcional
      case 4:
        return dadosMatricula.dataInicio !== '' &&
          (dadosMatricula.plano?.periodicidade !== 'MENSAL' || dadosMatricula.diaVencimento !== '');
      case 5: return true;
      default: return false;
    }
  };

  const proximaEtapa = () => {
    if (podeAvancar() && etapaAtual < 5) {
      setEtapaAtual(etapaAtual + 1);
    }
  };

  const etapaAnterior = () => {
    if (etapaAtual > 1) {
      setEtapaAtual(etapaAtual - 1);
    }
  };

 const handleFinalizar = async () => {
  try {
    setSalvando(true);

    const payload = {
      alunoId: dadosMatricula.aluno.id,
      planoId: dadosMatricula.plano.id,
      turmaId: dadosMatricula.turma?.id || null,
      descontoId: dadosMatricula.desconto?.id || null,
      dataInicio: dadosMatricula.dataInicio,
      diaVencimento: parseInt(dadosMatricula.diaVencimento) || null,
      formaPagamento: dadosMatricula.formaPagamento,
      parcelamento: parseInt(dadosMatricula.parcelamento),
      observacoes: dadosMatricula.observacoes || null,
      valorMatricula: dadosMatricula.valorMatricula,
      valorDesconto: dadosMatricula.valorDesconto,
      valorFinal: dadosMatricula.valorFinal
    };

    const response = await matriculasService.criar(payload);
    
    // ✅ CORREÇÃO: usar primeiraCobranca ao invés de contaReceber
    const matriculaCriada = response.data?.matricula || response.data;
    const contaReceber = response.data?.primeiraCobranca || null; // ⭐ MUDANÇA AQUI

    setDadosResposta({
      matricula: matriculaCriada,
      contaReceber: contaReceber
    });
    
    setMostrarSucesso(true);

  } catch (error) {
    console.error('❌ Erro ao criar matrícula:', error);
    alert('Erro ao criar matrícula: ' + (error.response?.data?.message || error.message));
  } finally {
    setSalvando(false);
  }
};

  const handleFecharSucesso = () => {
    setMostrarSucesso(false);
    if (onSucesso) {
      onSucesso();
    }
  };

  const renderEtapa = () => {
    switch (etapaAtual) {
      case 1:
        return (
          <Step1Aluno
            alunoSelecionado={dadosMatricula.aluno}
            onSelecionarAluno={(aluno) => atualizarDados('aluno', aluno)}
          />
        );
      case 2:
        return (
          <Step2Plano
            planoSelecionado={dadosMatricula.plano}
            onSelecionarPlano={(plano) => atualizarDados('plano', plano)}
          />
        );
      case 3:
        return (
          <Step3Turma
            turmaSelecionada={dadosMatricula.turma}
            onSelecionarTurma={(turma) => atualizarDados('turma', turma)}
          />
        );
      case 4:
        return (
          <Step4Detalhes
            dados={dadosMatricula}
            onAtualizarDados={atualizarDados}
          />
        );
      case 5:
        return (
          <Step5Resumo
            dados={dadosMatricula}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col">
          {/* Header */}
          <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  ✨ Assistente de Matrícula
                </h2>
                <p className="text-blue-100 text-sm">
                  Etapa {etapaAtual} de {etapas.length}: {etapas[etapaAtual - 1].descricao}
                </p>
              </div>
              <button
                onClick={onCancelar}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="flex items-center justify-between">
              {etapas.map((etapa, index) => (
                <React.Fragment key={etapa.numero}>
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${etapa.numero < etapaAtual
                      ? 'bg-green-500 text-white'
                      : etapa.numero === etapaAtual
                        ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                        : 'bg-gray-300 text-gray-600'
                      }`}>
                      {etapa.numero < etapaAtual ? <Check size={20} /> : etapa.numero}
                    </div>
                    <span className={`text-xs mt-2 font-medium text-center ${etapa.numero === etapaAtual ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                      {etapa.titulo}
                    </span>
                  </div>
                  {index < etapas.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 rounded transition-all ${etapa.numero < etapaAtual ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Conteúdo da Etapa */}
          <div className="flex-1 overflow-y-auto p-6">
            {renderEtapa()}
          </div>

          {/* Footer - Botões de Navegação */}
          <div className="p-6 border-t bg-gray-50 flex items-center justify-between">
            <button
              onClick={etapaAnterior}
              disabled={etapaAtual === 1}
              className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors ${etapaAtual === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              <ChevronLeft size={20} />
              Voltar
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={onCancelar}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
              >
                Cancelar
              </button>

              {etapaAtual < 5 ? (
                <button
                  onClick={proximaEtapa}
                  disabled={!podeAvancar()}
                  className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors ${podeAvancar()
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  Avançar
                  <ChevronRight size={20} />
                </button>
              ) : (
                <button
                  onClick={handleFinalizar}
                  disabled={salvando}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold flex items-center gap-2 shadow-lg transition-colors disabled:bg-gray-400"
                >
                  {salvando ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Check size={20} />
                      Confirmar Matrícula
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Sucesso */}
      {mostrarSucesso && dadosResposta && (
        <MatriculaSucessoModal
          matricula={dadosResposta.matricula}
          contaReceber={dadosResposta.contaReceber}
          onFechar={handleFecharSucesso}
          onAtualizarLista={onSucesso}
        />
      )}
    </>
  );
}

export default MatriculaWizard;