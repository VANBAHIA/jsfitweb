import React, { useState, useEffect } from 'react';
import { Calendar, Download, Printer, Loader, AlertCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { relatorioFinanceiroService } from '../../../services/api/relatorioFinanceiroService';

function RelatorioFinanceiro() {
  const [dataInicio, setDataInicio] = useState(() => {
    const data = new Date();
    data.setDate(1);
    return data.toISOString().split('T')[0];
  });

  const [dataFim, setDataFim] = useState(new Date().toISOString().split('T')[0]);
  const [resumo, setResumo] = useState(null);
  const [receitasForma, setReceitasForma] = useState([]);
  const [despesasCategoria, setDespesasCategoria] = useState([]);
  const [evolucao, setEvolucao] = useState([]);
  const [vencidas, setVencidas] = useState({ receitasVencidas: [], despesasVencidas: [] });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const cores = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      setErro('');

      const [res1, res2, res3, res4, res5] = await Promise.all([
        relatorioFinanceiroService.resumo(dataInicio, dataFim),
        relatorioFinanceiroService.receitasForma(dataInicio, dataFim),
        relatorioFinanceiroService.despesasCategoria(dataInicio, dataFim),
        relatorioFinanceiroService.evolucao(dataInicio, dataFim),
        relatorioFinanceiroService.contasVencidas()
      ]);

      setResumo(res1.data);
      setReceitasForma(res2.data || []);
      setDespesasCategoria(res3.data || []);
      setEvolucao(res4.data || []);
      setVencidas(res5.data);
    } catch (error) {
      setErro('Erro ao carregar relatório: ' + error.message);
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">📊 Relatório Financeiro</h1>
        <p className="text-purple-100">Análise de receitas, despesas e fluxo de caixa</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="inline mr-2" />
              Data Início
            </label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Fim
            </label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            onClick={carregarDados}
            disabled={carregando}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold disabled:opacity-50 flex items-center gap-2"
          >
            {carregando ? (
              <>
                <Loader className="animate-spin" size={18} />
                Carregando...
              </>
            ) : (
              'Atualizar'
            )}
          </button>

          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2">
            <Printer size={18} />
            Imprimir
          </button>

          <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold flex items-center gap-2">
            <Download size={18} />
            Exportar
          </button>
        </div>
      </div>

      {/* Mensagem de Erro */}
      {erro && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-red-800">{erro}</p>
        </div>
      )}

      {carregando ? (
        <div className="flex items-center justify-center h-64">
          <Loader className="animate-spin text-purple-600" size={40} />
        </div>
      ) : resumo ? (
        <>
          {/* Cards KPI */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-2">Receitas</p>
              <p className="text-3xl font-bold text-green-600">{formatarMoeda(resumo.receitas.total)}</p>
              <p className="text-xs text-gray-500 mt-2">
                {resumo.receitas.quantidade} transações
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                ⏳ Pendente: {formatarMoeda(resumo.receitas.pendente)}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-2">Despesas</p>
              <p className="text-3xl font-bold text-red-600">{formatarMoeda(resumo.despesas.total)}</p>
              <p className="text-xs text-gray-500 mt-2">
                {resumo.despesas.quantidade} transações
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                ⏳ Pendente: {formatarMoeda(resumo.despesas.pendente)}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-2">Saldo Líquido</p>
              <p className={`text-3xl font-bold ${resumo.saldoLiquido >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatarMoeda(resumo.saldoLiquido)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Margem: {resumo.margem}%
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-2">Período</p>
              <p className="text-sm font-semibold text-gray-800">
                {formatarData(resumo.periodo.inicio)}
              </p>
              <p className="text-sm text-gray-600">
                até {formatarData(resumo.periodo.fim)}
              </p>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico Evolução */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Evolução Diária</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={evolucao}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatarMoeda(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="receita" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="despesa" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="saldo" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico Receitas por Forma */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Receitas por Forma de Pagamento</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={receitasForma}
                    dataKey="total"
                    nameKey="formaPagamento"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {receitasForma.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatarMoeda(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico Despesas por Categoria */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Despesas por Categoria</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={despesasCategoria}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categoria" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip formatter={(value) => formatarMoeda(value)} />
                  <Bar dataKey="total" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Tabela Receitas por Forma */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Detalhes - Receitas</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-600 font-semibold">Forma</th>
                      <th className="px-4 py-2 text-right text-gray-600 font-semibold">Total</th>
                      <th className="px-4 py-2 text-right text-gray-600 font-semibold">Qtd</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {receitasForma.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-gray-800">{item.formaPagamento}</td>
                        <td className="px-4 py-2 text-right font-semibold text-green-600">
                          {formatarMoeda(item.total)}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-600">{item.quantidade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Contas Vencidas */}
          {(vencidas.receitasVencidas.length > 0 || vencidas.despesasVencidas.length > 0) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-red-800 mb-4">⚠️ Contas Vencidas</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Receitas Vencidas */}
                {vencidas.receitasVencidas.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-red-700 mb-3">Receitas Vencidas</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {vencidas.receitasVencidas.map((conta, idx) => (
                        <div key={idx} className="bg-white p-3 rounded border border-red-200 text-sm">
                          <div className="flex justify-between">
                            <span className="font-semibold">{conta.numero}</span>
                            <span className="text-red-600 font-bold">{formatarMoeda(conta.valorRestante)}</span>
                          </div>
                          <div className="text-gray-600 text-xs mt-1">
                            {conta.aluno?.pessoa?.nome1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Despesas Vencidas */}
                {vencidas.despesasVencidas.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-red-700 mb-3">Despesas Vencidas</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {vencidas.despesasVencidas.map((conta, idx) => (
                        <div key={idx} className="bg-white p-3 rounded border border-red-200 text-sm">
                          <div className="flex justify-between">
                            <span className="font-semibold">{conta.numero}</span>
                            <span className="text-red-600 font-bold">{formatarMoeda(conta.valorRestante)}</span>
                          </div>
                          <div className="text-gray-600 text-xs mt-1">
                            {conta.categoria}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}

export default RelatorioFinanceiro;