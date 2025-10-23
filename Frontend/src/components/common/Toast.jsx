import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

/**
 * Componente de Notificação Toast
 * Exibe mensagens de sucesso, erro, warning ou info
 */
function Toast({ 
  tipo = 'info', 
  mensagem, 
  duracao = 3000, 
  onClose 
}) {
  const [visivel, setVisivel] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisivel(false);
      setTimeout(() => onClose && onClose(), 300);
    }, duracao);

    return () => clearTimeout(timer);
  }, [duracao, onClose]);

  const configuracoes = {
    success: {
      icon: CheckCircle,
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      iconColor: 'text-green-600'
    },
    error: {
      icon: AlertCircle,
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      iconColor: 'text-red-600'
    },
    warning: {
      icon: AlertCircle,
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      iconColor: 'text-yellow-600'
    },
    info: {
      icon: Info,
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      iconColor: 'text-blue-600'
    }
  };

  const config = configuracoes[tipo] || configuracoes.info;
  const Icon = config.icon;

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        visivel ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
    >
      <div
        className={`flex items-center gap-3 p-4 rounded-lg shadow-lg border ${config.bg} ${config.border} min-w-[300px] max-w-md`}
      >
        <Icon className={config.iconColor} size={24} />
        <p className={`flex-1 font-medium ${config.text}`}>{mensagem}</p>
        <button
          onClick={() => {
            setVisivel(false);
            setTimeout(() => onClose && onClose(), 300);
          }}
          className={`${config.iconColor} hover:opacity-70 transition-opacity`}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

/**
 * Hook para gerenciar toasts
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const mostrarToast = (tipo, mensagem, duracao = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, tipo, mensagem, duracao }]);
  };

  const removerToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return {
    toasts,
    sucesso: (mensagem, duracao) => mostrarToast('success', mensagem, duracao),
    erro: (mensagem, duracao) => mostrarToast('error', mensagem, duracao),
    aviso: (mensagem, duracao) => mostrarToast('warning', mensagem, duracao),
    info: (mensagem, duracao) => mostrarToast('info', mensagem, duracao),
    removerToast
  };
}

/**
 * Container de Toasts
 * Renderiza múltiplos toasts empilhados
 */
export function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{ transform: `translateY(${index * 10}px)` }}
        >
          <Toast
            tipo={toast.tipo}
            mensagem={toast.mensagem}
            duracao={toast.duracao}
            onClose={() => onRemove(toast.id)}
          />
        </div>
      ))}
    </div>
  );
}

export default Toast;