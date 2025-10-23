import React, { useState, useEffect } from 'react';
import { X, Save, CreditCard, DollarSign, Calendar, FileText } from 'lucide-react';

function PlanoForm({ plano, onSalvar, onCancelar }) {
  // src/pages/Cadastros/Planos/PlanoForm.jsx

  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    periodicidade: 'MENSAL',
    tipoCobranca: 'RECORRENTE',
    numeroMeses: '',
    numeroDias: '',
    valorMensalidade: '',
    descricao: '',
    status: 'ATIVO'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (plano) {
      const dadosPlano = plano.data || plano;

      setFormData({
        codigo: dadosPlano.codigo || '',
        nome: dadosPlano.nome || '',
        periodicidade: dadosPlano.periodicidade || 'MENSAL',
        tipoCobranca: dadosPlano.tipoCobranca || 'RECORRENTE', // ✅ NOVO
        numeroMeses: dadosPlano.numeroMeses || '',
        numeroDias: dadosPlano.numeroDias || '',
        valorMensalidade: dadosPlano.valorMensalidade || '',
        descricao: dadosPlano.descricao || '',
        status: dadosPlano.status || 'ATIVO'
      });
    } else {
      gerarCodigo();
    }
  }, [plano]);

  const gerarCodigo = () => {
    const timestamp = Date.now().toString().slice(-6);
    const codigo = `PL${timestamp}`;
    setFormData(prev => ({ ...prev, codigo }));
  };

  const validarFormulario = () => {
    const novosErros = {};

    // ... validações existentes

    // ✅ NOVA VALIDAÇÃO
    if (!formData.tipoCobranca) {
      novosErros.tipoCobranca = 'Tipo de cobrança é obrigatório';
    }

    // ✅ VALIDAÇÃO: Plano único não pode ser MENSAL
    if (formData.tipoCobranca === 'UNICA' && formData.periodicidade === 'MENSAL') {
      novosErros.periodicidade = 'Plano com cobrança única não pode ter periodicidade MENSAL';
    }

    // ✅ VALIDAÇÃO: Plano recorrente personalizado precisa de duração
    if (formData.tipoCobranca === 'RECORRENTE') {
      if (formData.periodicidade === 'MESES' && (!formData.numeroMeses || formData.numeroMeses <= 0)) {
        novosErros.numeroMeses = 'Informe o número de meses';
      }
      if (formData.periodicidade === 'DIAS' && (!formData.numeroDias || formData.numeroDias <= 0)) {
        novosErros.numeroDias = 'Informe o número de dias';
      }
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    const dadosParaSalvar = {
      codigo: formData.codigo.trim(),
      nome: formData.nome.trim(),
      periodicidade: formData.periodicidade,
      tipoCobranca: formData.tipoCobranca, // ✅ NOVO
      valorMensalidade: parseFloat(formData.valorMensalidade),
      status: formData.status,
      descricao: formData.descricao.trim() || undefined
    };

    // Adiciona campos específicos conforme periodicidade
    if (formData.periodicidade === 'MESES') {
      dadosParaSalvar.numeroMeses = parseInt(formData.numeroMeses);
      dadosParaSalvar.numeroDias = null;
    } else if (formData.periodicidade === 'DIAS') {
      dadosParaSalvar.numeroDias = parseInt(formData.numeroDias);
      dadosParaSalvar.numeroMeses = null;
    } else {
      dadosParaSalvar.numeroMeses = null;
      dadosParaSalvar.numeroDias = null;
    }

    onSalvar(dadosParaSalvar);
  };

  const handleChange = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));

    if (errors[campo]) {
      setErrors(prev => ({ ...prev, [campo]: null }));
    }

    // Limpa campos não utilizados ao mudar periodicidade
    if (campo === 'periodicidade') {
      if (valor !== 'MESES') {
        setFormData(prev => ({ ...prev, numeroMeses: '' }));
        setErrors(prev => ({ ...prev, numeroMeses: null }));
      }
      if (valor !== 'DIAS') {
        setFormData(prev => ({ ...prev, numeroDias: '' }));
        setErrors(prev => ({ ...prev, numeroDias: null }));
      }
    }
  };

  const formatarValorMonetario = (valor) => {
    const numero = parseFloat(valor);
    if (isNaN(numero)) return '';
    return numero.toFixed(2);
  };

  const periodicidades = [
    { value: 'MENSAL', label: 'Mensal' },
    { value: 'BIMESTRAL', label: 'Bimestral (2 meses)' },
    { value: 'TRIMESTRAL', label: 'Trimestral (3 meses)' },
    { value: 'QUADRIMESTRAL', label: 'Quadrimestral (4 meses)' },
    { value: 'SEMESTRAL', label: 'Semestral (6 meses)' },
    { value: 'ANUAL', label: 'Anual (12 meses)' },
    { value: 'MESES', label: 'Personalizado (Meses)' },
    { value: 'DIAS', label: 'Personalizado (Dias)' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 p-6 border-b flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <CreditCard className="text-white" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white">
              {plano ? 'Editar Plano' : 'Novo Plano'}
            </h3>
          </div>
          <button
            onClick={onCancelar}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            title="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="space-y-5">
              {/* Código e Nome */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.codigo}
                    onChange={(e) => handleChange('codigo', e.target.value.toUpperCase())}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.codigo ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="Ex: PL001"
                    maxLength={20}
                  />
                  {errors.codigo && (
                    <p className="text-xs text-red-600 mt-1">⚠️ {errors.codigo}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Plano *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => handleChange('nome', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.nome ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="Ex: Plano Mensal Premium"
                    maxLength={100}
                  />
                  {errors.nome && (
                    <p className="text-xs text-red-600 mt-1">⚠️ {errors.nome}</p>
                  )}
                </div>
              </div>

              {/* Periodicidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline mr-2" size={16} />
                  Periodicidade *
                </label>
                <select
                  value={formData.periodicidade}
                  onChange={(e) => handleChange('periodicidade', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {periodicidades.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              {/* ✅ NOVO CAMPO: Tipo de Cobrança */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CreditCard className="inline mr-2" size={16} />
                  Tipo de Cobrança *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleChange('tipoCobranca', 'RECORRENTE')}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${formData.tipoCobranca === 'RECORRENTE'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl">🔄</span>
                      <span className="text-sm font-semibold">Recorrente</span>
                      <span className="text-xs">Renovação automática</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChange('tipoCobranca', 'UNICA')}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${formData.tipoCobranca === 'UNICA'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-2xl">💰</span>
                      <span className="text-sm font-semibold">Única</span>
                      <span className="text-xs">Pagamento único</span>
                    </div>
                  </button>
                </div>
                {errors.tipoCobranca && (
                  <p className="text-xs text-red-600 mt-2">⚠️ {errors.tipoCobranca}</p>
                )}

                {/* Dica contextual */}
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800">
                    {formData.tipoCobranca === 'RECORRENTE' ? (
                      <>
                        <strong>Recorrente:</strong> O sistema gerará cobranças automaticamente
                        todo mês/período até o cancelamento da matrícula.
                        <br />
                        <em className="text-blue-600">Exemplo: Mensalidades, assinaturas</em>
                      </>
                    ) : (
                      <>
                        <strong>Única:</strong> Será gerada apenas 1 cobrança no valor total.
                        Ideal para planos de período fixo pagos à vista.
                        <br />
                        <em className="text-green-600">Exemplo: Trimestral à vista, Semestral à vista</em>
                      </>
                    )}
                  </p>
                </div>
              </div>
              {/* Campos Condicionais */}
              {formData.periodicidade === 'MESES' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Meses *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    required
                    value={formData.numeroMeses}
                    onChange={(e) => handleChange('numeroMeses', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.numeroMeses ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="Informe a quantidade de meses"
                  />
                  {errors.numeroMeses && (
                    <p className="text-xs text-red-600 mt-1">⚠️ {errors.numeroMeses}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Informe quantos meses o plano terá de duração
                  </p>
                </div>
              )}

              {formData.periodicidade === 'DIAS' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Dias *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="3650"
                    required
                    value={formData.numeroDias}
                    onChange={(e) => handleChange('numeroDias', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.numeroDias ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="Informe a quantidade de dias"
                  />
                  {errors.numeroDias && (
                    <p className="text-xs text-red-600 mt-1">⚠️ {errors.numeroDias}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Informe quantos dias o plano terá de duração
                  </p>
                </div>
              )}

              {/* Valor da Mensalidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline mr-2" size={16} />
                  Valor da Mensalidade *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    R$
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={formData.valorMensalidade}
                    onChange={(e) => handleChange('valorMensalidade', e.target.value)}
                    onBlur={(e) => handleChange('valorMensalidade', formatarValorMonetario(e.target.value))}
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.valorMensalidade ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="0,00"
                  />
                </div>
                {errors.valorMensalidade && (
                  <p className="text-xs text-red-600 mt-1">⚠️ {errors.valorMensalidade}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Valor mensal que será cobrado do aluno
                </p>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="inline mr-2" size={16} />
                  Descrição (Opcional)
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => handleChange('descricao', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="3"
                  placeholder="Descreva os benefícios e características deste plano..."
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.descricao.length}/500 caracteres
                </p>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ATIVO">✅ Ativo</option>
                  <option value="INATIVO">🚫 Inativo</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Planos inativos não estarão disponíveis para novas matrículas
                </p>
              </div>

              {/* Card Informativo Atualizado */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0">💡</div>
                  <div>
                    <h6 className="font-semibold text-blue-900 mb-2">Como Configurar Planos</h6>
                    <div className="text-sm text-blue-800 space-y-3">
                      <div>
                        <p className="font-semibold mb-1">🔄 Planos Recorrentes (Renovação Automática):</p>
                        <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                          <li><strong>Mensal:</strong> R$ 150/mês - Gera cobrança todo mês</li>
                          <li><strong>Trimestral:</strong> R$ 130/mês - Gera 3 cobranças mensais</li>
                          <li><strong>Semestral:</strong> R$ 120/mês - Gera 6 cobranças mensais</li>
                          <li><strong>Anual:</strong> R$ 100/mês - Gera 12 cobranças mensais</li>
                        </ul>
                      </div>

                      <div>
                        <p className="font-semibold mb-1">💰 Planos com Cobrança Única (À Vista):</p>
                        <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                          <li><strong>Trimestral:</strong> R$ 390 - 1 cobrança única (3 meses)</li>
                          <li><strong>Semestral:</strong> R$ 720 - 1 cobrança única (6 meses)</li>
                          <li><strong>Anual:</strong> R$ 1.200 - 1 cobrança única (12 meses)</li>
                          <li><strong>Day Use:</strong> R$ 30 - 1 cobrança (1 dia de acesso)</li>
                        </ul>
                      </div>

                      <div className="pt-2 border-t border-blue-300">
                        <p className="text-xs font-semibold text-blue-900">
                          ⚠️ Importante: O tipo de cobrança define se haverá renovação automática ou pagamento único!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 p-6 border-t bg-gray-50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancelar}
              className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 shadow-md transition-colors"
            >
              <Save size={18} />
              {plano ? 'Atualizar Plano' : 'Salvar Plano'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PlanoForm;