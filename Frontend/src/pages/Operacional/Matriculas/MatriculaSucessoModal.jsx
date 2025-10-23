import React, { useState, useEffect } from 'react';
import { CheckCircle, DollarSign, Calendar, X, CreditCard } from 'lucide-react';
import ContaReceberDetalhes from '../../Financeiro/ContasReceber/ContaReceberDetalhes';
import { contasReceberService } from '../../../services/api/contasReceberService';

function MatriculaSucessoModal({ matricula, contaReceber, onFechar, onAtualizarLista }) {
  const [mostrarPagamento, setMostrarPagamento] = useState(false);
  const [contaCompleta, setContaCompleta] = useState(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (contaReceber?.id) {
      carregarContaCompleta();
    } else if (contaReceber) {
      // Se não tem ID mas tem dados básicos, usa diretamente
      setContaCompleta(contaReceber);
    }
  }, [contaReceber]);

  const carregarContaCompleta = async () => {
    try {
      setCarregando(true);
      const response = await contasReceberService.buscarPorId(contaReceber.id);
      
      // A API retorna: { data: { statusCode, success, data: {...} } }
      const conta = response.data?.data || response.data;
      setContaCompleta(conta);
    } catch (error) {
      console.error('❌ Erro ao carregar conta completa:', error);
      // Se falhar, usa os dados básicos da contaReceber
      setContaCompleta(contaReceber);
    } finally {
      setCarregando(false);
    }
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0);
  };

  const formatarData = (data) => {
    if (!data) return 'N/A';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const handleRealizarPagamento = () => {
    setMostrarPagamento(true);
  };

  const handlePagamentoRealizado = async (contaId, dadosPagamento) => {
    try {
      await contasReceberService.registrarPagamento(contaId, dadosPagamento);
      setMostrarPagamento(false);
      
      // Atualizar lista e fechar tudo
      if (onAtualizarLista) {
        onAtualizarLista();
      }
      
      alert('✅ Pagamento realizado com sucesso!');
      onFechar();
    } catch (error) {
      alert('Erro ao registrar pagamento: ' + (error.response?.data?.message || error.message));
    }
  };

  if (mostrarPagamento && contaCompleta) {
    return (
      <ContaReceberDetalhes
        conta={contaCompleta}
        onRegistrarPagamento={handlePagamentoRealizado}
        onFechar={() => setMostrarPagamento(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header de Sucesso */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white relative">
          <button
            onClick={onFechar}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
          >
            <X size={24} />
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-white bg-opacity-20 rounded-full">
              <CheckCircle size={48} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Matrícula Confirmada! 🎉</h2>
              <p className="text-green-100 text-sm mt-1">
                A matrícula foi criada com sucesso
              </p>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-6">
          {/* Informações do Aluno */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <CheckCircle size={20} className="text-blue-600" />
              Dados da Matrícula
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Aluno:</span>
                <span className="font-semibold text-gray-900">
                  {matricula?.aluno?.pessoa?.nome1}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Plano:</span>
                <span className="font-semibold text-gray-900">
                  {matricula?.plano?.nome}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Data de Início:</span>
                <span className="font-semibold text-gray-900">
                  {formatarData(matricula?.dataInicio)}
                </span>
              </div>
            </div>
          </div>

          {/* Informações da Conta a Receber */}
          {contaReceber ? (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="text-green-600" size={24} />
                <h3 className="font-bold text-green-900 text-lg">
                  Conta a Receber Gerada Automaticamente
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-green-200">
                  <span className="text-gray-700 flex items-center gap-2">
                    <CreditCard size={16} />
                    Número da Conta:
                  </span>
                  <span className="font-bold text-gray-900 font-mono">
                    #{contaReceber.numero || 'Aguardando...'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-green-200">
                  <span className="text-gray-700 flex items-center gap-2">
                    <Calendar size={16} />
                    Data de Vencimento:
                  </span>
                  <span className="font-bold text-gray-900">
                    {formatarData(contaReceber.dataVencimento)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 bg-white rounded-lg px-4 mt-2">
                  <span className="text-gray-700 font-semibold text-lg">
                    Valor a Receber:
                  </span>
                  <span className="font-bold text-green-700 text-2xl">
                    {formatarMoeda(contaReceber.valorFinal || contaReceber.valorOriginal)}
                  </span>
                </div>

                {contaReceber.valorDesconto > 0 && (
                  <div className="bg-blue-50 rounded-lg p-3 mt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-700">Valor Original:</span>
                      <span className="font-semibold">
                        {formatarMoeda(contaReceber.valorOriginal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-blue-700">Desconto Aplicado:</span>
                      <span className="font-semibold text-green-600">
                        - {formatarMoeda(contaReceber.valorDesconto)}
                      </span>
                    </div>
                  </div>
                )}

                {contaReceber.totalParcelas > 1 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-orange-700 text-sm font-semibold">
                        📊 Parcelamento:
                      </span>
                      <span className="text-orange-900">
                        Parcela {contaReceber.numeroParcela || 1} de {contaReceber.totalParcelas}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⏳</span>
                <div>
                  <h4 className="font-bold text-yellow-900">Processando...</h4>
                  <p className="text-sm text-yellow-800">
                    A conta a receber está sendo gerada pelo sistema.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Pergunta sobre Pagamento */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <span className="text-3xl">💰</span>
              <div className="flex-1">
                <h4 className="font-bold text-yellow-900 mb-2">
                  Deseja realizar o pagamento agora?
                </h4>
                <p className="text-sm text-yellow-800 mb-4">
                  Você pode efetuar o recebimento desta parcela imediatamente ou deixar para depois.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={handleRealizarPagamento}
                    disabled={carregando || !contaCompleta}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <DollarSign size={20} />
                    {carregando ? 'Carregando...' : 'Sim, Realizar Pagamento'}
                  </button>

                  <button
                    onClick={onFechar}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-semibold transition-colors"
                  >
                    Não, Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Informação Adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 flex items-start gap-2">
              <span className="text-lg">ℹ️</span>
              <span>
                <strong>Importante:</strong> Mesmo que não realize o pagamento agora, 
                a conta ficará registrada no sistema e pode ser paga posteriormente 
                através do módulo <strong>Financeiro → Contas a Receber</strong>.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatriculaSucessoModal;