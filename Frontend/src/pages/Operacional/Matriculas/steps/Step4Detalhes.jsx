import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, Percent, CreditCard, FileText, Tag } from 'lucide-react';
import { descontosService } from '../../../../services/api/descontosService';

function Step4Detalhes({ dados, onAtualizarDados }) {
  const [descontos, setDescontos] = useState([]);
  const [loadingDescontos, setLoadingDescontos] = useState(true);

  useEffect(() => {
    carregarDescontos();
  }, []);

  useEffect(() => {
    calcularValores();
  }, [dados.plano, dados.desconto]);

  const carregarDescontos = async () => {
    try {
      setLoadingDescontos(true);
      const response = await descontosService.listarAtivos();
      const descontosArray = response.data?.data?.descontos || [];
      setDescontos(descontosArray);
    } catch (error) {
      console.error('❌ Erro ao carregar descontos:', error);
    } finally {
      setLoadingDescontos(false);
    }
  };

  const calcularValores = () => {
    if (!dados.plano) return;

    let valorBase = dados.plano.valorMensalidade;
    let valorDesconto = 0;

    if (dados.desconto) {
      if (dados.desconto.tipo === 'PERCENTUAL') {
        valorDesconto = (valorBase * dados.desconto.valor) / 100;
      } else {
        valorDesconto = dados.desconto.valor;
      }
    }

    const valorFinal = valorBase - valorDesconto;

    // ✅ CORRIGIR - Usar os nomes corretos
    onAtualizarDados('valorMatricula', valorBase);
    onAtualizarDados('valorDesconto', valorDesconto);
    onAtualizarDados('valorFinal', valorFinal);
  };

  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0);
  };

  const handleDescontoChange = (descontoId) => {
    if (!descontoId) {
      onAtualizarDados('desconto', null);
      return;
    }

    const desconto = descontos.find(d => d.id === descontoId);
    onAtualizarDados('desconto', desconto);
  };

  // Data mínima é hoje
  const hoje = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 rounded-lg">
            <DollarSign className="text-green-600" size={28} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-green-900">
              💰 Detalhes da Matrícula
            </h3>
            <p className="text-green-700 text-sm">
              Configure valores, datas e forma de pagamento
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coluna Esquerda - Datas e Pagamento */}
        <div className="space-y-6">
          {/* Data de Início */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Calendar size={18} className="text-blue-600" />
              Data de Início *
            </label>
            <input
              type="date"
              required
              min={hoje}
              value={dados.dataInicio}
              onChange={(e) => onAtualizarDados('dataInicio', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Data em que a matrícula entrará em vigor
            </p>
          </div>

          {/* Dia de Vencimento (apenas para planos mensais) */}
          {dados.plano?.periodicidade === 'MENSAL' && (
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar size={18} className="text-purple-600" />
                Dia do Vencimento *
              </label>
              <select
                required
                value={dados.diaVencimento}
                onChange={(e) => onAtualizarDados('diaVencimento', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Selecione o dia</option>
                {[...Array(28)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Dia {i + 1}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Dia do mês em que a mensalidade vence
              </p>
            </div>
          )}

          {/* Forma de Pagamento */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <CreditCard size={18} className="text-green-600" />
              Forma de Pagamento
            </label>
            <select
              value={dados.formaPagamento}
              onChange={(e) => onAtualizarDados('formaPagamento', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="DINHEIRO">💵 Dinheiro</option>
              <option value="PIX">📱 PIX</option>
              <option value="CARTAO_CREDITO">💳 Cartão de Crédito</option>
              <option value="CARTAO_DEBITO">💳 Cartão de Débito</option>
              <option value="BOLETO">🧾 Boleto</option>
            </select>
          </div>

          {/* Parcelamento */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Tag size={18} className="text-orange-600" />
              Número de Parcelas
            </label>
            <select
              value={dados.parcelamento}
              onChange={(e) => onAtualizarDados('parcelamento', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                <option key={n} value={n}>
                  {n}x {n === 1 ? '(À vista)' : ''}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Número de vezes que a matrícula será dividida
            </p>
          </div>
        </div>

        {/* Coluna Direita - Desconto e Valores */}
        <div className="space-y-6">
          {/* Desconto */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Percent size={18} className="text-blue-600" />
              Desconto (Opcional)
            </label>
            <select
              value={dados.desconto?.id || ''}
              onChange={(e) => handleDescontoChange(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loadingDescontos}
            >
              <option value="">Nenhum desconto</option>
              {descontos.map(desconto => (
                <option key={desconto.id} value={desconto.id}>
                  {desconto.descricao} - {
                    desconto.tipo === 'PERCENTUAL'
                      ? `${desconto.valor}%`
                      : formatarValor(desconto.valor)
                  }
                </option>
              ))}
            </select>
          </div>

          {/* Card de Valores */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-white">
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <DollarSign size={22} />
              Resumo de Valores
            </h4>

            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-white border-opacity-30">
                <span className="text-sm opacity-90">Valor do Plano:</span>
                <span className="text-xl font-bold">
                  {formatarValor(dados.plano?.valorMensalidade)}
                </span>
              </div>

              {dados.desconto && (
                <div className="flex justify-between items-center pb-3 border-b border-white border-opacity-30">
                  <span className="text-sm opacity-90">
                    Desconto ({dados.desconto.descricao}):
                  </span>
                  <span className="text-lg font-semibold text-yellow-300">
                    - {formatarValor(dados.valorDesconto)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <span className="text-base font-semibold">VALOR FINAL:</span>
                <span className="text-3xl font-bold">
                  {formatarValor(dados.valorFinal || dados.plano?.valorMensalidade)}
                </span>
              </div>

              {dados.parcelamento > 1 && (
                <div className="bg-white bg-opacity-20 rounded-lg p-3 mt-3">
                  <div className="text-xs opacity-90 mb-1">Valor por parcela:</div>
                  <div className="text-xl font-bold">
                    {dados.parcelamento}x de {formatarValor((dados.valorFinal || dados.plano?.valorMensalidade) / dados.parcelamento)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Economia (se houver desconto) */}
          {dados.desconto && dados.valorDesconto > 0 && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-2xl">🎉</div>
                <span className="font-bold text-green-900">Economia Aplicada!</span>
              </div>
              <p className="text-sm text-green-800">
                O aluno está economizando <strong>{formatarValor(dados.valorDesconto)}</strong> nesta matrícula.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Observações */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <FileText size={18} className="text-gray-600" />
          Observações (Opcional)
        </label>
        <textarea
          value={dados.observacoes}
          onChange={(e) => onAtualizarDados('observacoes', e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows="4"
          placeholder="Adicione informações adicionais sobre esta matrícula..."
          maxLength={500}
        />
        <p className="text-xs text-gray-500 mt-1">
          {dados.observacoes?.length || 0}/500 caracteres
        </p>
      </div>

      {/* Alerta */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <p className="text-sm text-blue-800">
              <strong>Atenção:</strong> Confira todos os dados antes de avançar.
              Na próxima etapa você verá um resumo completo para confirmação final.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step4Detalhes;