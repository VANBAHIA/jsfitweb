import React, { useState, useEffect } from 'react';
import { X, Save, Wrench } from 'lucide-react';

function EquipamentoForm({ equipamento, onSalvar, onCancelar, salvando }) {
  const [formData, setFormData] = useState({
    nome: ''
  });

  const [erros, setErros] = useState({});

  useEffect(() => {
    if (equipamento) {
      const dadosEquipamento = equipamento.data || equipamento;
      
      setFormData({
        nome: dadosEquipamento.nome || ''
      });
    }
  }, [equipamento]);

  const validarFormulario = () => {
    const novosErros = {};

    if (!formData.nome.trim()) {
      novosErros.nome = 'Nome do equipamento é obrigatório';
    } else if (formData.nome.trim().length < 3) {
      novosErros.nome = 'Nome deve ter pelo menos 3 caracteres';
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
      nome: formData.nome.trim()
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 sticky top-0 z-10">
          <h3 className="text-2xl font-bold text-white">
            {equipamento ? 'Editar Equipamento' : 'Novo Equipamento'}
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
              {/* Código (somente exibição ao editar) */}
              {equipamento && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código do Equipamento
                  </label>
                  <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Wrench className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <span className="text-lg font-mono font-bold text-blue-900">
                        {equipamento.codigo || equipamento.data?.codigo}
                      </span>
                      <p className="text-xs text-blue-700 mt-1">
                        Código gerado automaticamente pelo sistema
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Nome do Equipamento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Equipamento *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    erros.nome ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Esteira Ergométrica, Leg Press, Bicicleta"
                  maxLength={100}
                />
                {erros.nome && (
                  <p className="text-red-500 text-xs mt-1">{erros.nome}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Digite o nome identificador do equipamento (mínimo 3 caracteres)
                </p>
              </div>

              {/* Preview */}
              {formData.nome.trim().length >= 3 && (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🏋️</div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Preview do equipamento:</div>
                      <div className="flex items-center gap-2">
                        {!equipamento && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-mono font-bold rounded">
                            EQ#####
                          </span>
                        )}
                        <div className="text-lg font-bold text-blue-900">
                          {formData.nome}
                        </div>
                      </div>
                      {!equipamento && (
                        <p className="text-xs text-gray-600 mt-1">
                          O código será gerado automaticamente ao salvar
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Informativo */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💡</div>
                  <div>
                    <h6 className="font-semibold text-blue-900 mb-1">Dicas</h6>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Use nomes descritivos e claros para facilitar a identificação</li>
                      <li>• Cada equipamento recebe um código único automaticamente (EQ00001, EQ00002...)</li>
                      <li>• O código não pode ser alterado após a criação</li>
                      <li>• Você pode cadastrar múltiplas unidades do mesmo tipo de equipamento</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Exemplos */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h6 className="font-semibold text-gray-800 mb-3">Exemplos de equipamentos:</h6>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">✓</span>
                    <span className="text-gray-700">Esteira Ergométrica 01</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">✓</span>
                    <span className="text-gray-700">Bicicleta Vertical</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">✓</span>
                    <span className="text-gray-700">Leg Press 45°</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">✓</span>
                    <span className="text-gray-700">Supino Reto</span>
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
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 shadow-md transition-colors disabled:opacity-50"
            >
              {salvando ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  {equipamento ? 'Atualizar' : 'Salvar'} Equipamento
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EquipamentoForm;