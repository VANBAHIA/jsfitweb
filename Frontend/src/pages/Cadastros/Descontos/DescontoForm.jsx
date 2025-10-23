import React, { useState, useEffect } from 'react';
import { X, Save, Percent, DollarSign } from 'lucide-react';

function DescontoForm({ desconto, onSalvar, onCancelar, salvando }) {
  const [formData, setFormData] = useState({
    descricao: '',
    tipo: 'PERCENTUAL',
    valor: '',
    status: 'ATIVO'
  });

  const [erros, setErros] = useState({});

  useEffect(() => {
    if (desconto) {
      const dadosDesconto = desconto.data || desconto;
      
      setFormData({
        descricao: dadosDesconto.descricao || '',
        tipo: dadosDesconto.tipo || 'PERCENTUAL',
        valor: dadosDesconto.valor?.toString() || '',
        status: dadosDesconto.status || 'ATIVO'
      });
    }
  }, [desconto]);

  const validarFormulario = () => {
    const novosErros = {};

    if (!formData.descricao.trim()) {
      novosErros.descricao = 'Descrição é obrigatória';
    }

    if (!formData.valor || parseFloat(formData.valor) <= 0) {
      novosErros.valor = 'Valor deve ser maior que zero';
    }

    if (formData.tipo === 'PERCENTUAL' && parseFloat(formData.valor) > 100) {
      novosErros.valor = 'Percentual não pode ser maior que 100%';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    const dadosParaSalvar = {
      descricao: formData.descricao.trim(),
      tipo: formData.tipo,
      valor: parseFloat(formData.valor),
      status: formData.status
    };

    onSalvar(dadosParaSalvar);
  };

  const handleChange = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
    
    // Limpa o erro do campo ao começar a digitar
    if (erros[campo]) {
      setErros(prev => {
        const novosErros = { ...prev };
        delete novosErros[campo];
        return novosErros;
      });
    }
  };

  const formatarValor = (valor) => {
    // Remove caracteres não numéricos exceto ponto e vírgula
    return valor.replace(/[^\d.,]/g, '').replace(',', '.');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-green-600 to-green-700 sticky top-0 z-10">
          <h3 className="text-2xl font-bold text-white">
            {desconto ? 'Editar Desconto' : 'Novo Desconto'}
          </h3>
          <button 
            onClick={onCancelar} 
            disabled={salvando}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="space-y-5">
              {/* Descrição do Desconto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição do Desconto *
                </label>
                <input
                  type="text"
                  required
                  value={formData.descricao}
                  onChange={(e) => handleChange('descricao', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    erros.descricao ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Desconto Estudante, Promoção Verão, Black Friday"
                />
                {erros.descricao && (
                  <p className="text-red-500 text-xs mt-1">{erros.descricao}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Nome identificador do desconto
                </p>
              </div>

              {/* Tipo de Desconto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tipo de Desconto *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleChange('tipo', 'PERCENTUAL')}
                    className={`p-4 border-2 rounded-lg flex items-center gap-3 transition-all ${
                      formData.tipo === 'PERCENTUAL'
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      formData.tipo === 'PERCENTUAL' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Percent className={
                        formData.tipo === 'PERCENTUAL' ? 'text-green-600' : 'text-gray-600'
                      } size={24} />
                    </div>
                    <div className="text-left">
                      <div className={`font-semibold ${
                        formData.tipo === 'PERCENTUAL' ? 'text-green-900' : 'text-gray-700'
                      }`}>
                        Percentual
                      </div>
                      <div className="text-xs text-gray-600">Desconto em %</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChange('tipo', 'MONETARIO')}
                    className={`p-4 border-2 rounded-lg flex items-center gap-3 transition-all ${
                      formData.tipo === 'MONETARIO'
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      formData.tipo === 'MONETARIO' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <DollarSign className={
                        formData.tipo === 'MONETARIO' ? 'text-green-600' : 'text-gray-600'
                      } size={24} />
                    </div>
                    <div className="text-left">
                      <div className={`font-semibold ${
                        formData.tipo === 'MONETARIO' ? 'text-green-900' : 'text-gray-700'
                      }`}>
                        Monetário
                      </div>
                      <div className="text-xs text-gray-600">Valor fixo em R$</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Valor do Desconto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor do Desconto *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                    {formData.tipo === 'PERCENTUAL' ? '%' : 'R$'}
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.valor}
                    onChange={(e) => handleChange('valor', formatarValor(e.target.value))}
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      erros.valor ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={formData.tipo === 'PERCENTUAL' ? 'Ex: 10' : 'Ex: 50.00'}
                  />
                </div>
                {erros.valor && (
                  <p className="text-red-500 text-xs mt-1">{erros.valor}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {formData.tipo === 'PERCENTUAL' 
                    ? 'Percentual de 0 a 100%' 
                    : 'Valor fixo em reais'}
                </p>
              </div>

              {/* Preview do Desconto */}
              {formData.valor && parseFloat(formData.valor) > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">💰</div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Preview do desconto:</div>
                      <div className="text-2xl font-bold text-green-700">
                        {formData.tipo === 'PERCENTUAL' 
                          ? `${parseFloat(formData.valor).toFixed(2)}%`
                          : `R$ ${parseFloat(formData.valor).toFixed(2)}`
                        }
                      </div>
                      {formData.tipo === 'PERCENTUAL' && (
                        <div className="text-xs text-gray-600 mt-1">
                          Exemplo: Plano de R$ 100,00 = R$ {(100 - (100 * parseFloat(formData.valor) / 100)).toFixed(2)}
                        </div>
                      )}
                      {formData.tipo === 'MONETARIO' && (
                        <div className="text-xs text-gray-600 mt-1">
                          Exemplo: Plano de R$ 100,00 = R$ {(100 - parseFloat(formData.valor)).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="ATIVO">Ativo</option>
                  <option value="INATIVO">Inativo</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Descontos inativos não aparecerão no sistema de vendas
                </p>
              </div>

              {/* Informativo */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💡</div>
                  <div>
                    <h6 className="font-semibold text-blue-900 mb-1">Dica</h6>
                    <p className="text-sm text-blue-800">
                      <strong>Desconto Percentual:</strong> Ideal para promoções proporcionais (ex: 10% OFF).<br />
                      <strong>Desconto Monetário:</strong> Ideal para valores fixos (ex: R$ 50,00 OFF).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 sticky bottom-0">
            <button
              type="button"
              onClick={onCancelar}
              disabled={salvando}
              className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2 shadow-md transition-colors disabled:opacity-50"
            >
              {salvando ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Salvar Desconto
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DescontoForm;