import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * Componente de Diálogo de Confirmação
 * Usado para confirmar ações críticas como exclusões
 */
function ConfirmDialog({
  isOpen,
  titulo = 'Confirmar Ação',
  mensagem = 'Tem certeza que deseja continuar?',
  textoBotaoConfirmar = 'Confirmar',
  textoBotaoCancelar = 'Cancelar',
  onConfirmar,
  onCancelar,
  tipo = 'danger' // 'danger', 'warning', 'info'
}) {
  if (!isOpen) return null;

  const estilos = {
    danger: {
      icon: 'bg-red-100',
      iconColor: 'text-red-600',
      botao: 'bg-red-600 hover:bg-red-700'
    },
    warning: {
      icon: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      botao: 'bg-yellow-600 hover:bg-yellow-700'
    },
    info: {
      icon: 'bg-blue-100',
      iconColor: 'text-blue-600',
      botao: 'bg-blue-600 hover:bg-blue-700'
    },
    success: {
      icon: 'bg-green-100',
      iconColor: 'text-green-600',
      botao: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
      borda: 'border-green-200',
      titulo: 'text-green-900',
      mensagem: 'text-green-700',
      overlay: 'bg-green-900/10'
    },

    // 🟣 Primary - Ações principais do sistema
    primary: {
      icon: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      botao: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
      borda: 'border-indigo-200',
      titulo: 'text-indigo-900',
      mensagem: 'text-indigo-700',
      overlay: 'bg-indigo-900/10'
    },

    // 🟠 Alert - Alertas críticos (atenção, cuidado)
    alert: {
      icon: 'bg-orange-100',
      iconColor: 'text-orange-600',
      botao: 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500',
      borda: 'border-orange-200',
      titulo: 'text-orange-900',
      mensagem: 'text-orange-700',
      overlay: 'bg-orange-900/10'
    },

    // 🟪 Purple - Ações premium/especiais
    purple: {
      icon: 'bg-purple-100',
      iconColor: 'text-purple-600',
      botao: 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500',
      borda: 'border-purple-200',
      titulo: 'text-purple-900',
      mensagem: 'text-purple-700',
      overlay: 'bg-purple-900/10'
    },

    // ⚫ Dark - Tema escuro/neutro
    dark: {
      icon: 'bg-gray-100',
      iconColor: 'text-gray-600',
      botao: 'bg-gray-800 hover:bg-gray-900 focus:ring-gray-500',
      borda: 'border-gray-300',
      titulo: 'text-gray-900',
      mensagem: 'text-gray-700',
      overlay: 'bg-gray-900/10'
    },

    // 🔵 Cyan - Ações relacionadas a dados/informações
    cyan: {
      icon: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
      botao: 'bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-500',
      borda: 'border-cyan-200',
      titulo: 'text-cyan-900',
      mensagem: 'text-cyan-700',
      overlay: 'bg-cyan-900/10'
    },

    // 🟢 Teal - Ações de aprovação/verificação
    teal: {
      icon: 'bg-teal-100',
      iconColor: 'text-teal-600',
      botao: 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-500',
      borda: 'border-teal-200',
      titulo: 'text-teal-900',
      mensagem: 'text-teal-700',
      overlay: 'bg-teal-900/10'
    },

    // 🌸 Pink - Ações relacionadas a usuários/perfis
    pink: {
      icon: 'bg-pink-100',
      iconColor: 'text-pink-600',
      botao: 'bg-pink-600 hover:bg-pink-700 focus:ring-pink-500',
      borda: 'border-pink-200',
      titulo: 'text-pink-900',
      mensagem: 'text-pink-700',
      overlay: 'bg-pink-900/10'
    },

    // 🔴 Error - Erros do sistema
    error: {
      icon: 'bg-rose-100',
      iconColor: 'text-rose-600',
      botao: 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500',
      borda: 'border-rose-200',
      titulo: 'text-rose-900',
      mensagem: 'text-rose-700',
      overlay: 'bg-rose-900/10'
    }
  };

  const estilo = estilos[tipo] || estilos.danger;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full animate-fade-in">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">{titulo}</h3>
          <button
            onClick={onCancelar}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${estilo.icon} flex-shrink-0`}>
              <AlertTriangle className={estilo.iconColor} size={24} />
            </div>
            <div className="flex-1">
              <p className="text-gray-700 leading-relaxed">{mensagem}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onCancelar}
            className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
          >
            {textoBotaoCancelar}
          </button>
          <button
            onClick={onConfirmar}
            className={`px-6 py-2.5 text-white rounded-lg font-medium shadow-md transition-colors ${estilo.botao}`}
          >
            {textoBotaoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;