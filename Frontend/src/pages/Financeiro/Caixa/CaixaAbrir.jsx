import React, { useState } from 'react';
import { X, Unlock } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';


function CaixaAbrir({ onAbrir, onCancelar }) {
  const { usuario } = useAuth(); 
  const [formData, setFormData] = useState({
    valorAbertura: '', // ⬅️ Mudei de 0 para string vazia
    observacoes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validação: valor deve ser maior ou igual a 0
    const valor = parseFloat(formData.valorAbertura) || 0;
    
    if (valor < 0) {
      alert('O valor de abertura não pode ser negativo!');
      return;
    }

    // Pegar usuário logado
    const usuarioLogado = usuario?.nome || 'Sistema';

    
    // Preparar dados no formato correto
    const dados = {
      valorAbertura: valor,
      dataAbertura: new Date().toISOString().split('T')[0], // ⬅️ YYYY-MM-DD
      horaAbertura: new Date().toTimeString().split(' ')[0].substring(0, 5), // ⬅️ HH:MM
      usuarioAbertura: usuarioLogado,
      observacoes: formData.observacoes || ''
    };

    console.log('📤 Enviando dados para abrir caixa:', dados);
    onAbrir(dados);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4">
        <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-green-600 to-green-700">
          <div className="flex items-center gap-3">
            <Unlock className="text-white" size={24} />
            <h3 className="text-2xl font-bold text-white">Abrir Caixa</h3>
          </div>
          <button onClick={onCancelar} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-800">
              ℹ️ <strong>Atenção:</strong> O caixa será aberto com a data e hora atuais.
              Certifique-se de informar o valor correto de abertura.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor de Abertura *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-500">R$</span>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.valorAbertura}
                onChange={(e) => setFormData({ ...formData, valorAbertura: e.target.value })}
                className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-lg font-semibold"
                placeholder="0,00"
                autoFocus
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Valor em dinheiro disponível no início do expediente (pode ser 0)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Informações adicionais sobre a abertura..."
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Data:</span>
              <span className="font-semibold">{new Date().toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Hora:</span>
              <span className="font-semibold">
                {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

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
              className="flex-1 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold flex items-center justify-center gap-2 shadow-md"
            >
              <Unlock size={18} />
              Abrir Caixa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CaixaAbrir;