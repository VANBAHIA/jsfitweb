import { useState, useCallback } from 'react';

/**
 * Hook para gerenciamento de abas (tabs)
 * Permite abrir, fechar e alternar entre abas
 * 
 * @returns {Object} Funções e estado para gerenciar abas
 */
export function useTabs() {
  const [activeTab, setActiveTab] = useState(null);
  const [openTabs, setOpenTabs] = useState([]);

  /**
   * Abre uma nova aba ou ativa se já estiver aberta
   */
  const openTab = useCallback((tabInfo) => {
    const tabId = `${tabInfo.menuId}-${tabInfo.submenuId}`;

    setOpenTabs((prev) => {
      // Verifica se a aba já está aberta
      const tabExists = prev.find(tab => tab.id === tabId);

      if (!tabExists) {
        // Adiciona nova aba
        return [...prev, { ...tabInfo, id: tabId }];
      }

      return prev;
    });

    // Ativa a aba
    setActiveTab(tabId);
  }, []);

  /**
   * Fecha uma aba específica
   */
  const closeTab = useCallback((tabId) => {
    setOpenTabs((prev) => {
      const newTabs = prev.filter(tab => tab.id !== tabId);

      // Se fechou a aba ativa, ativa a última aba restante

      if (activeTab === tabId) {
        // Se fechou a aba ativa, ativa a primeira disponível ou null
        if (newTabs.length > 0) {
          setActiveTab(newTabs[0].id);
        } else {
          setActiveTab(null);
        }
      }

      if (activeTab === tabId && newTabs.length > 0) {
        setActiveTab(newTabs[newTabs.length - 1].id);
      } else if (newTabs.length === 0) {
        setActiveTab(null);
      }

      return newTabs;
    });
  }, [activeTab]);

  /**
   * Fecha todas as abas
   */
  const closeAllTabs = useCallback(() => {
    setOpenTabs([]);
    setActiveTab(null);
  }, []);

  return {
    activeTab,
    openTabs,
    openTab,
    closeTab,
    closeAllTabs,
    setActiveTab
  };
}