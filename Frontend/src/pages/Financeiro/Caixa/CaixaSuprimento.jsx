import React, { useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';

function CaixaSuprimento({ caixaId, usuarioResponsavel, onSalvar, onCancelar }) {
  const [formData, setFormData] = useState({
    valor: '',
    descricao: '',
    usuarioResponsavel: usuarioResponsavel || 'Sistema'
  });
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    const valor = parseFloat(formData.valor);

    // Validações
    if (!valor || valor <= 0) {
      setErro('Valor deve ser maior que zero');
      return;
    }

    if (!formData.descricao.trim()) {
      setErro('Descrição é obrigatória');
      return;
    }

    try {
      await onSalvar({
        valor: valor,
        descricao: formData.descricao,
        usuarioResponsavel: formData.usuarioResponsavel
      });
    } catch (error) {
      setErro(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4">
        <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center gap-3">
            <Plus className="text-white" size={24} />
            <h3 className="text-2xl font-bold text-white">Realizar Suprimento</h3>
          </div>
          <button onClick={onCancelar} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Alerta Informativo */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-800">
              💵 <strong>Suprimento de Caixa</strong>
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Adiciona dinheiro ao caixa para troco ou reforço de capital
            </p>
          </div>

          {/* Mensagem de Erro */}
          {erro && (
            <div className="bg-red-50 rounded-lg p-4 border border-red-200 flex items-start gap-2">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-red-800">{erro}</p>
            </div>
          )}

          {/* Valor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor do Suprimento *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-500">R$</span>
              <input
                type="number"
                required
                step="0.01"
                min="0.01"
                value={formData.valor}
                onChange={(e) => {
                  setFormData({ ...formData, valor: e.target.value });
                  setErro('');
                }}
                className="w-full pl-12 pr-4 py-2 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg font-semibold text-blue-700"
                placeholder="0,00"
                autoFocus
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo do Suprimento *
            </label>
            <textarea
              required
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Troco para início do expediente, Reforço de capital..."
            />
          </div>

          {/* Responsável */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Responsável
            </label>
            <input
              type="text"
              value={formData.usuarioResponsavel}
              onChange={(e) => setFormData({ ...formData, usuarioResponsavel: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
              readOnly
            />
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">📋 Resumo</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Valor a adicionar:</span>
                <span className="font-bold text-green-600">
                  + R$ {(parseFloat(formData.valor) || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Data/Hora:</span>
                <span className="font-semibold">
                  {new Date().toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancelar}
              className="flex-1 px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2 shadow-md"
            >
              <Plus size={18} />
              Confirmar Suprimento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CaixaSuprimento;