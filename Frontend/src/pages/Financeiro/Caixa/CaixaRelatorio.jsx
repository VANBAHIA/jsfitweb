import React from 'react';
import { X, Download, Printer, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

function CaixaRelatorio({ caixa, onFechar }) {

  // ✅ Validações e valores padrão
  const dadosCaixa = caixa?.caixa || caixa || {};
  const valores = caixa?.valores || {
    valorAbertura: 0,
    totalEntradas: 0,
    totalSaidas: 0
  };
  const movimentos = caixa?.movimentos || [];

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0);
  };

  const formatarData = (data) => {
    if (!data) return '--/--/----';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarHora = (hora) => {
    return hora || '--:--';
  };

  const saldoFinal = valores.valorAbertura + valores.totalEntradas - valores.totalSaidas;

  // Agrupar movimentos por forma de pagamento
  const movimentosPorForma = movimentos.reduce((acc, mov) => {
    const forma = mov.formaPagamento || 'NÃO INFORMADO';
    if (!acc[forma]) {
      acc[forma] = { entradas: 0, saidas: 0 };
    }
    if (mov.tipo === 'ENTRADA') {
      acc[forma].entradas += mov.valor;
    } else {
      acc[forma].saidas += mov.valor;
    }
    return acc;
  }, {});


  const handleImprimir = () => {
    window.print();
  };

  const handleExportar = () => {
    // TODO: Implementar exportação para PDF/Excel
    alert('Funcionalidade de exportação em desenvolvimento');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto py-8 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl mx-4">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-purple-600 to-purple-700 print:bg-white print:text-black">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg print:hidden">
              <DollarSign className="text-white" size={28} />
            </div>
            <div className="text-white print:text-black">
              <h3 className="text-2xl font-bold">Relatório de Caixa</h3>
              <p className="text-sm opacity-90">Caixa #{caixa.numero}</p>
            </div>
          </div>
          <div className="flex gap-2 print:hidden">
            <button
              onClick={handleImprimir}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg"
              title="Imprimir"
            >
              <Printer size={20} />
            </button>
            <button
              onClick={handleExportar}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg"
              title="Exportar"
            >
              <Download size={20} />
            </button>
            <button
              onClick={onFechar}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Informações do Caixa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-700 mb-3">📅 INFORMAÇÕES</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Número:</span>
                  <span className="font-semibold">{caixa.caixa?.numero}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${caixa.caixa?.status === 'ABERTO'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                    }`}>
                    {caixa.caixa?.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Abertura:</span>
                  <span className="font-semibold">
                    {formatarData(caixa.caixa?.dataAbertura)} às {formatarHora(caixa.caixa?.horaAbertura)}
                  </span>
                </div>
                {caixa.caixa?.dataFechamento && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fechamento:</span>
                    <span className="font-semibold">
                      {formatarData(caixa.caixa?.dataFechamento)} às {formatarHora(caixa.caixa?.horaFechamento)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Operador Abertura:</span>
                  <span className="font-semibold">{caixa.caixa?.usuarioAbertura}</span>
                </div>
                {caixa.caixa?.usuarioFechamento && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Operador Fechamento:</span>
                    <span className="font-semibold">{caixa.caixa?.usuarioFechamento}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="text-sm font-semibold text-green-700 mb-3">💰 RESUMO FINANCEIRO</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Abertura:</span>
                  <span className="font-bold text-lg">{formatarMoeda(caixa.valores.valorAbertura)}</span>
                </div>
                <div className="flex justify-between items-center text-green-600">
                  <span className="flex items-center gap-1">
                    <TrendingUp size={16} />
                    Entradas:
                  </span>
                  <span className="font-bold text-lg">+ {formatarMoeda(caixa.valores.totalEntradas)}</span>
                </div>
                <div className="flex justify-between items-center text-red-600">
                  <span className="flex items-center gap-1">
                    <TrendingDown size={16} />
                    Saídas:
                  </span>
                  <span className="font-bold text-lg">- {formatarMoeda(caixa.valores.totalSaidas)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t-2 border-green-300">
                  <span className="font-semibold text-green-800">Saldo Final:</span>
                  <span className="font-bold text-2xl text-green-700">
                    {formatarMoeda(saldoFinal)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Movimentos por Forma de Pagamento */}
          {movimentosPorForma && Object.keys(movimentosPorForma).length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 bg-gray-50 border-b">
                <h4 className="font-semibold text-gray-800">💳 Resumo por Forma de Pagamento</h4>
              </div>
              <div className="p-4">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-semibold text-gray-600 uppercase border-b">
                      <th className="pb-2">Forma de Pagamento</th>
                      <th className="pb-2 text-right">Entradas</th>
                      <th className="pb-2 text-right">Saídas</th>
                      <th className="pb-2 text-right">Saldo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Object.entries(movimentosPorForma).map(([forma, valores]) => (
                      <tr key={forma}>
                        <td className="py-2 text-sm font-medium">{forma}</td>
                        <td className="py-2 text-sm text-right text-green-600 font-semibold">
                          {formatarMoeda(valores.entradas)}
                        </td>
                        <td className="py-2 text-sm text-right text-red-600 font-semibold">
                          {formatarMoeda(valores.saidas)}
                        </td>
                        <td className="py-2 text-sm text-right font-bold">
                          {formatarMoeda(valores.entradas - valores.saidas)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Lista de Movimentos */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 bg-gray-50 border-b">
              <h4 className="font-semibold text-gray-800">📋 Movimentos Detalhados</h4>
              <p className="text-xs text-gray-600 mt-1">
                Total de {caixa.movimentos?.length || 0} movimento(s)
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr className="text-xs font-semibold text-gray-600 uppercase">
                    <th className="px-4 py-3 text-left">Data/Hora</th>
                    <th className="px-4 py-3 text-left">Tipo</th>
                    <th className="px-4 py-3 text-left">Descrição</th>
                    <th className="px-4 py-3 text-left">Categoria</th>
                    <th className="px-4 py-3 text-left">Forma</th>
                    <th className="px-4 py-3 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {caixa.movimentos?.map((mov, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(mov.dataHora).toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${mov.tipo === 'ENTRADA'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                          {mov.tipo === 'ENTRADA' ? '⬆️ ENTRADA' : '⬇️ SAÍDA'}
                        </span>
                      </td>
                      <td className="px-4 py-3">{mov.descricao}</td>
                      <td className="px-4 py-3 text-gray-600">{mov.categoria || '--'}</td>
                      <td className="px-4 py-3 text-gray-600">{mov.formaPagamento}</td>
                      <td className={`px-4 py-3 text-right font-bold ${mov.tipo === 'ENTRADA' ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {mov.tipo === 'ENTRADA' ? '+' : '-'} {formatarMoeda(mov.valor)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {(!caixa.movimentos || caixa.movimentos.length === 0) && (
              <div className="p-8 text-center text-gray-500">
                Nenhum movimento registrado neste caixa
              </div>
            )}
          </div>

          {/* Observações */}
          {caixa.observacoes && (
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <h4 className="text-sm font-semibold text-yellow-800 mb-2">📝 Observações</h4>
              <p className="text-sm text-gray-700">{caixa.observacoes}</p>
            </div>
          )}

          {/* Rodapé do Relatório */}
          <div className="text-center text-xs text-gray-500 pt-4 border-t print:block hidden">
            <p>Relatório gerado em {new Date().toLocaleString('pt-BR')}</p>
            <p className="mt-1">Sistema de Gestão - JSFitGestão v1.0.0</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 print:hidden">
          <button
            onClick={handleImprimir}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
          >
            <Printer size={18} />
            Imprimir
          </button>
          <button
            onClick={handleExportar}
            className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
          >
            <Download size={18} />
            Exportar
          </button>
          <button
            onClick={onFechar}
            className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default CaixaRelatorio;