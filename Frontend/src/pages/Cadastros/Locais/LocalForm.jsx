import React, { useState, useEffect } from 'react';
import { X, Save, MapPin } from 'lucide-react';

/**
 * Formulário para cadastro e edição de Locais
 * @param {Object} local - Dados do local para edição (opcional)
 * @param {Function} onSalvar - Callback ao salvar
 * @param {Function} onCancelar - Callback ao cancelar
 */
function LocalForm({ local, onSalvar, onCancelar }) {
  const [formData, setFormData] = useState({
    nome: '',
    status: 'ATIVO'
  });

  const [errors, setErrors] = useState({});

  // Preenche o formulário quando está editando
  useEffect(() => {
    if (local) {
      const dadosLocal = local.data || local;
      
      setFormData({
        nome: dadosLocal.nome || '',
        status: dadosLocal.status || 'ATIVO'
      });
    }
  }, [local]);

  /**
   * Valida os campos do formulário
   */
  const validarFormulario = () => {
    const novosErros = {};

    // Valida nome
    if (!formData.nome.trim()) {
      novosErros.nome = 'O nome do local é obrigatório';
    } else if (formData.nome.trim().length < 3) {
      novosErros.nome = 'O nome deve ter pelo menos 3 caracteres';
    } else if (formData.nome.trim().length > 100) {
      novosErros.nome = 'O nome não pode ter mais de 100 caracteres';
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  /**
   * Submete o formulário
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    const dadosParaSalvar = {
      nome: formData.nome.trim(),
      status: formData.status
    };

    onSalvar(dadosParaSalvar);
  };

  /**
   * Atualiza um campo do formulário
   */
  const handleChange = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
    
    // Remove erro do campo quando usuário começa a digitar
    if (errors[campo]) {
      setErrors(prev => ({ ...prev, [campo]: null }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <MapPin className="text-white" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white">
              {local ? 'Editar Local' : 'Novo Local'}
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
            <div className="space-y-4">
              {/* Nome do Local */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Local *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <MapPin size={20} />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => handleChange('nome', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.nome 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300'
                    }`}
                    placeholder="Ex: Sala de Musculação, Piscina, Quadra"
                    maxLength={100}
                  />
                </div>
                {errors.nome && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <span>⚠️</span> {errors.nome}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Digite o nome do local ou espaço da academia
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="ATIVO">✅ Ativo</option>
                  <option value="INATIVO">🚫 Inativo</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Locais inativos não aparecerão para agendamento de horários
                </p>
              </div>

              {/* Informativo */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0">💡</div>
                  <div>
                    <h6 className="font-semibold text-blue-900 mb-1">Dica de Uso</h6>
                    <p className="text-sm text-blue-800 mb-2">
                      Os locais cadastrados aqui serão utilizados para definir onde acontecem 
                      as aulas, treinos e atividades da academia.
                    </p>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Exemplos de locais:</p>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <span>• Sala de Musculação</span>
                        <span>• Piscina</span>
                        <span>• Sala de Spinning</span>
                        <span>• Quadra Poliesportiva</span>
                        <span>• Sala de Pilates</span>
                        <span>• Área de Funcional</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
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
              {local ? 'Atualizar Local' : 'Salvar Local'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LocalForm;