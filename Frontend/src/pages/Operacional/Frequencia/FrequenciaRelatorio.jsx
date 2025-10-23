import React, { useState } from 'react';
import { BarChart3, Download, Loader } from 'lucide-react';
import { frequenciaService } from '../../../services/api/frequenciaService';

function FrequenciaRelatorio() {
  const [loading, setLoading] = useState(false);
  const [relatorio, setRelatorio] = useState(null);
  const [filtros, setFiltros] = useState({
    dataInicio: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    dataFim: new Date().toISOString().split('T')[0]
  });

  const gerarRelatorio = async () => {
    try {
      setLoading(true);
      const resposta = await frequenciaService.gerarRelatorio(filtros);
      setRelatorio(resposta.data.data);
    } catch (error) {
      alert('Erro ao gerar relatório: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const exportarCSV = () => {
    if (!relatorio) return;

    const headers = ['Aluno', 'CPF', 'Total Aulas', 'Presenças', 'Faltas', '% Presença'];
    const rows = relatorio.map(item => [
      item.nome1,
      item.cpf,
      item.totalAulas,
      item.presencas,
      item.faltas,
      item.percentualPresenca + '%'
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio-frequencia-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="text-purple-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Relatório de Frequência
              </h2>
              <p className="text-sm text-gray-600">
                Análise detalhada de presença por aluno
              </p>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Início *
              </label>
              <input
                type="date"
                required
                value={filtros.dataInicio}
                onChange={(e) => setFiltros(prev => ({ ...prev, dataInicio: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Fim *
              </label>
              <input
                type="date"
                required
                value={filtros.dataFim}
                onChange={(e) => setFiltros(prev => ({ ...prev, dataFim: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={gerarRelatorio}
                disabled={loading}
                className="w-full px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={18} />
                    Gerando...
                  </>
                ) : (
                  <>
                    <BarChart3 size={18} />
                    Gerar Relatório
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tabela de Resultados */}
        {relatorio && (
          <>
            <div className="p-6 bg-blue-50 border-b flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">
                  📊 Relatório gerado com sucesso
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Período: {new Date(filtros.dataInicio).toLocaleDateString('pt-BR')} até {new Date(filtros.dataFim).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <button
                onClick={exportarCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm font-medium"
              >
                <Download size={16} />
                Exportar CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Aluno
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      CPF
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                      Total Aulas
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                      Presenças
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                      Faltas
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                      % Presença
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {relatorio.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.nome1}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.cpf}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 text-center font-semibold">
                        {item.totalAulas}
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
                          {item.presencas}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full font-semibold">
                          {item.faltas}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                item.percentualPresenca >= 75
                                  ? 'bg-green-600'
                                  : item.percentualPresenca >= 50
                                  ? 'bg-yellow-600'
                                  : 'bg-red-600'
                              }`}
                              style={{ width: `${item.percentualPresenca}%` }}
                            />
                          </div>
                          <span className="font-semibold text-gray-800">
                            {item.percentualPresenca}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Resumo Estatístico */}
            <div className="p-6 bg-gray-50 border-t">
              <h5 className="font-semibold text-gray-800 mb-4">📈 Resumo Estatístico</h5>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Total de Alunos</p>
                  <p className="text-2xl font-bold text-gray-800">{relatorio.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Média de Presença</p>
                  <p className="text-2xl font-bold text-green-600">
                    {(relatorio.reduce((acc, item) => acc + parseFloat(item.percentualPresenca), 0) / relatorio.length).toFixed(1)}%
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Total Presenças</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {relatorio.reduce((acc, item) => acc + item.presencas, 0)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Total Faltas</p>
                  <p className="text-2xl font-bold text-red-600">
                    {relatorio.reduce((acc, item) => acc + item.faltas, 0)}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {!relatorio && (
          <div className="p-12 text-center text-gray-500">
            <BarChart3 size={64} className="mx-auto mb-4 text-gray-400" />
            <p className="font-medium text-lg">Nenhum relatório gerado</p>
            <p className="text-sm mt-2">
              Selecione o período e clique em "Gerar Relatório"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FrequenciaRelatorio;