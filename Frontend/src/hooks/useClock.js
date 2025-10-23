import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Hook customizado para exibir data e hora atualizadas em tempo real
 * Atualiza a cada segundo
 * 
 * @returns {Object} Objeto contendo data e hora formatadas
 */
export function useClock() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    // Atualiza a cada segundo
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    // Cleanup: limpa o intervalo quando o componente desmontar
    return () => clearInterval(timer);
  }, []);

  return {
    date: format(dateTime, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }),
    time: format(dateTime, 'HH:mm:ss'),
    dayOfWeek: format(dateTime, 'EEEE', { locale: ptBR }),
    shortDate: format(dateTime, 'dd/MM/yyyy'),
    dateTime
  };
}