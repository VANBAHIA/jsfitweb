import React, { useState, useEffect } from 'react';
import { X, Save, Briefcase } from 'lucide-react';

function FuncaoForm({ funcao, onSalvar, onCancelar }) {
  const [formData, setFormData] = useState({
    funcao: '',
    status: 'ATIVO'
  });

  useEffect(() => {
    if (funcao) {
      const dadosFuncao = funcao.data || funcao;
      
      setFormData({
        funcao: dadosFuncao.funcao || '',
        status: dadosFuncao.status || 'ATIVO'
      });
    }
  }, [funcao]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const dadosParaSalvar = {
      funcao: formData.funcao.trim(),
      status: formData.status
    };

    onSalvar(dadosParaSalvar);
  };

  const handleChange = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700">
          <h3 className="text-2xl font-bold text-white">
            {funcao ? 'Editar Função' : 'Nova Função'}
          </h3>
          <button onClick={onCancelar} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="space-y-4">
              {/* Nome da Função */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Função *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Briefcase size={20} />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.funcao}
                    onChange={(e) => handleChange('funcao', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Personal Trainer, Recepcionista, Instrutor"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Digite o nome do cargo ou função
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
                  <option value="ATIVO">Ativo</option>
                  <option value="INATIVO">Inativo</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Funções inativas não aparecerão no cadastro de funcionários
                </p>
              </div>

              {/* Informativo */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💡</div>
                  <div>
                    <h6 className="font-semibold text-blue-900 mb-1">Dica</h6>
                    <p className="text-sm text-blue-800">
                      As funções cadastradas aqui serão utilizadas no cadastro de funcionários. 
                      Exemplos: Personal Trainer, Instrutor, Recepcionista, Gerente, Nutricionista.
                    </p>
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
              Salvar Função
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FuncaoForm;