// src/App.jsx - Com Sistema de Permissões Integrado

import React, { useState, useMemo } from 'react';
import { X, ChevronDown, ChevronRight, Clock, LogOut, User as UserIcon, Shield } from 'lucide-react';
import { menuConfig, filtrarMenusPorPermissao } from './config/menuConfig';
import { useClock } from './hooks/useClock';
import { useTabs } from './hooks/useTabs';
import { useAuth } from './context/AuthContext';
import { usePermissoes } from './hooks/usePermissoes';
import LoginPage from './components/auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ConfirmDialog from './components/common/ConfirmDialog';


// Importação dos componentes de páginas
import Alunos from './pages/Pessoas/Alunos/Alunos';
import Funcionarios from './pages/Pessoas/Funcionarios/Funcionarios';
import Visitantes from './pages/Pessoas/Visitantes/Visitantes';
import Descontos from './pages/Cadastros/Descontos/Descontos';
import Funcoes from './pages/Cadastros/Funcoes/Funcoes';
import GruposExercicio from './pages/Cadastros/GruposExercicio/GruposExercicio';
import Locais from './pages/Cadastros/Locais/Locais';
import Planos from './pages/Cadastros/Planos/Planos';

import Empresa from './pages/Configuracoes/Empresa/Empresa';
import Usuarios from './pages/Configuracoes/Usuarios/Usuarios';
import Licencas from './pages/Configuracoes/Licencas/Licencas';

import ContasReceber from './pages/Financeiro/ContasReceber/ContasReceber';
import ContasPagar from './pages/Financeiro/ContasPagar/ContasPagar';
import Caixa from './pages/Financeiro/Caixa/Caixa';
import Equipamentos from './pages/Operacional/Equipamentos/Equipamentos';
import Frequencia from './pages/Operacional/Frequencia/Frequencia';
import FrequenciaRelatorio from './pages/Operacional/Frequencia/FrequenciaRelatorio';
import Matriculas from './pages/Operacional/Matriculas/Matriculas';
import Turmas from './pages/Operacional/Turmas/Turmas';

import RelatorioFinanceiro from './pages/Relatorios/RelatorioFinanceiro/RelatorioFinanceiro';
import Exercicios from './pages/Cadastros/Exercicios/Exercicios';
import ExercicioEquipamento from './pages/Cadastros/ExercicioEquipamento/ExercicioEquipamento'; 
import Instrutores from './pages/Pessoas/Instrutores/Instrutores'; 

function App() {
  const { autenticado, loading, usuario, logout } = useAuth();
  const { temPermissao, podeAcessarModulo } = usePermissoes();
  const [mostrarDialogoSair, setMostrarDialogoSair] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [mostrarMenuUsuario, setMostrarMenuUsuario] = useState(false);

  const { date, time, dayOfWeek } = useClock();
  const { activeTab, openTabs, openTab, closeTab, setActiveTab } = useTabs();

  // ✅ FILTRAR MENUS BASEADO NAS PERMISSÕES DO USUÁRIO
  const menusFiltrados = useMemo(() => {
    if (!autenticado) return [];
    return filtrarMenusPorPermissao(menuConfig, temPermissao);
  }, [autenticado, temPermissao]);



  // Se está carregando, mostra loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white font-semibold text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, mostra tela de login
  if (!autenticado) {
    return <LoginPage />;
  }

  // Funções do sistema
  const toggleMenu = (menuId) => {
    setOpenMenus(prev => {
      if (prev[menuId]) {
        return { ...prev, [menuId]: false };
      }
      return { [menuId]: true };
    });
  };

  const toggleSubmenu = (submenuId, event) => {
    event.stopPropagation();
    setOpenSubmenus(prev => {
      if (prev[submenuId]) {
        return { ...prev, [submenuId]: false };
      }
      return { [submenuId]: true };
    });
  };

  const handleSubmenuClick = (menu, submenu) => {
    // ✅ VERIFICAR PERMISSÃO ANTES DE ABRIR ABA
    if (submenu.permissao) {
      const { modulo, acao } = submenu.permissao;
      if (!temPermissao(modulo, acao)) {
        alert(`Você não tem permissão para acessar ${submenu.label}`);
        return;
      }
    }

    setOpenSubmenus({});
    openTab({
      menuId: menu.id,
      submenuId: submenu.id,
      label: submenu.label,
      icon: submenu.icon,
      descricao: submenu.descricao
    });
    toggleMenu(menu.id);
  };

  const handleLogout = () => {
    setMostrarDialogoSair(true);
  };

  const renderTabContent = (tab) => {
    if (!tab) return null;

    // ✅ PROTEÇÃO ESPECIAL PARA LICENÇAS
    if (tab.submenuId === 'licencas' && usuario?.perfil !== 'SUPER_ADMIN') {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Acesso Negado</h2>
            <p className="text-gray-600">Apenas o Suporte Técnico pode acessar este módulo.</p>
          </div>
        </div>
      );
    }

    const IconComponent = tab.icon;

    // Mapeamento de componentes por submenuId
    const componentMap = {
      'alunos': <Alunos />,
      'funcionarios': <Funcionarios />,
      'instrutores': <Instrutores/>,
      'visitantes': < Visitantes />,
      'funcoes': <Funcoes />,
      'locais': <Locais />,
      'planos': <Planos />,
      'turmas': <Turmas />,
      'descontos': <Descontos />,
      'matriculas': <Matriculas />,
      'frequencia': <Frequencia />,
      'equipamentos': <Equipamentos />,
      'exercicios': <Exercicios />, 
      'gruposexercicio': <GruposExercicio />,
      'exercicio-equipamento': <ExercicioEquipamento />,
      'contas-receber': <ContasReceber />,
      'contas-pagar': <ContasPagar />,
      'caixa': <Caixa />,
      'dados-academia': <Empresa />,
      'usuarios': <Usuarios />,
      'licencas': <Licencas />,
      'frequencia-relatorio': <FrequenciaRelatorio />,
      'financeiro-relatorio': <RelatorioFinanceiro />
    };


    // Retorna o componente específico ou o padrão
    return componentMap[tab.submenuId] || (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <IconComponent className="text-blue-600" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{tab.label}</h2>
              <p className="text-gray-600 text-sm">{tab.descricao}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                📋 Módulo em Desenvolvimento
              </h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                Este módulo está preparado para receber as funcionalidades de <strong>{tab.label}</strong>.
              </p>
            </div>

            <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3">Recursos Planejados</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Formulários de cadastro completos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Tabelas com paginação e filtros</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <div className="h-screen flex flex-col bg-gray-100">
        {/* Header Principal */}
        <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white shadow-lg">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white text-blue-600 px-4 py-2 rounded-lg font-bold text-2xl shadow-md">
                JS
              </div>
              <div>
                <h1 className="text-2xl font-bold">FitGestão</h1>
                <p className="text-blue-100 text-sm">Sistema de Gestão para Academias</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Informações da Licença */}
              {usuario?.licenca && (
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                  <div className="flex items-center gap-2 text-xs">
                    <Shield size={16} />
                    <div>
                      <span className="font-semibold">Licença: {usuario.licenca.tipo}</span>
                      <span className="ml-2 opacity-80">
                        ({usuario.licenca.diasRestantes} dias restantes)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Relógio com Data e Hora */}
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/20">
                <div className="flex items-center gap-3">
                  <Clock size={24} />
                  <div className="text-right">
                    <div className="font-bold text-lg">{time}</div>
                    <div className="text-xs text-blue-100 capitalize">
                      {dayOfWeek}, {date}
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu do Usuário */}
              <div className="relative">
                <button
                  onClick={() => setMostrarMenuUsuario(!mostrarMenuUsuario)}
                  className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/20 hover:bg-white/20 transition-colors flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <UserIcon className="text-blue-600" size={18} />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm">{usuario?.nome}</div>
                    <div className="text-xs text-blue-100">{usuario?.perfil}</div>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${mostrarMenuUsuario ? 'rotate-180' : ''}`}
                  />
                </button>

                {mostrarMenuUsuario && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-4 border-b bg-gray-50">
                      <p className="font-semibold text-gray-800">{usuario?.nome}</p>
                      <p className="text-sm text-gray-600">{usuario?.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {usuario?.empresa?.nomeFantasia}
                      </p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setMostrarMenuUsuario(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg text-gray-700 flex items-center gap-2"
                      >
                        <UserIcon size={16} />
                        Meu Perfil
                      </button>
                      <button
                        onClick={() => {
                          setMostrarMenuUsuario(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 rounded-lg text-red-600 flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        Sair do Sistema
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Barra de Menu Horizontal - ✅ USANDO MENUS FILTRADOS */}
        <nav className="bg-white border-b shadow-sm">
          <div className="flex items-center px-6 py-2">
            {menusFiltrados.map((menu) => {
              const MenuIcon = menu.icon;
              return (
                <div key={menu.id} className="relative">
                  <button
                    onClick={() => toggleMenu(menu.id)}
                    className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-700 font-medium"
                  >
                    <MenuIcon size={18} />
                    {menu.label}
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${openMenus[menu.id] ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Dropdown do Menu */}
                  {openMenus[menu.id] && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[220px]">
                      {menu.submenus.map((submenu) => {
                        const SubmenuIcon = submenu.icon;

                        // Se o submenu tem sub-submenus (segundo nível)
                        if (submenu.hasSubmenus) {
                          return (
                            <div key={submenu.id} className="relative">
                              <button
                                onClick={(e) => toggleSubmenu(submenu.id, e)}
                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 text-left text-gray-700 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <SubmenuIcon size={16} className="text-gray-500" />
                                  <span>{submenu.label}</span>
                                </div>
                                <ChevronRight
                                  size={14}
                                  className={`transition-transform ${openSubmenus[submenu.id] ? 'rotate-90' : ''}`}
                                />
                              </button>

                              {/* Sub-submenu (segundo nível) */}
                              {openSubmenus[submenu.id] && (
                                <div className="absolute left-full top-0 ml-1 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[200px]">
                                  {submenu.submenus.map((subSubmenu) => {
                                    const SubSubmenuIcon = subSubmenu.icon;
                                    return (
                                      <button
                                        key={subSubmenu.id}
                                        onClick={() => handleSubmenuClick(menu, subSubmenu)}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left text-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
                                      >
                                        <SubSubmenuIcon size={14} className="text-gray-400" />
                                        <span>{subSubmenu.label}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        }

                        // Submenu normal (sem segundo nível)
                        return (
                          <button
                            key={submenu.id}
                            onClick={() => handleSubmenuClick(menu, submenu)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left text-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
                          >
                            <SubmenuIcon size={16} className="text-gray-500" />
                            <span>{submenu.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Sistema de Abas */}
          {openTabs.length > 0 && (
            <div className="flex items-center px-6 border-t bg-gray-50 overflow-x-auto">
              {openTabs.map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 border-r border-gray-200 transition-all whitespace-nowrap ${activeTab === tab.id
                      ? 'bg-white text-blue-600 font-semibold border-t-2 border-t-blue-600 -mt-[2px]'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    <TabIcon size={16} />
                    <span className="text-sm">{tab.label}</span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTab(tab.id);
                      }}
                      className="ml-2 hover:bg-red-100 rounded p-1 transition-colors cursor-pointer"
                      title="Fechar aba"
                      role="button"
                    >
                      <X size={14} />
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </nav>

        {/* Área de Conteúdo Principal */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {activeTab && openTabs.length > 0 ? (
            (() => {
              const currentTab = openTabs.find(tab => tab.id === activeTab);
              if (!currentTab) {
                setActiveTab(null);
                return null;
              }
              return renderTabContent(currentTab);
            })()
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-5xl">🏋️</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  Bem-vindo ao JSFitGestão
                </h2>
                <p className="text-gray-600 mb-2">
                  Olá, <strong>{usuario?.nome}</strong>!
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  Perfil: <strong className="text-blue-600">{usuario?.perfil}</strong>
                </p>
                <p className="text-gray-500 mb-6 text-sm">
                  Selecione um módulo no menu acima para começar
                </p>

                {/* Cards de Acesso Rápido - Baseado em Permissões */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  {/* PESSOAS */}
                  {podeAcessarModulo('alunos') && (
                    <div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" title="Clique para acessar Alunos">
                      <div className="font-semibold text-blue-600 mb-1">👥 Alunos</div>
                      <div className="text-gray-600 text-xs">Gestão de pessoas</div>
                    </div>
                  )}

                  {/* OPERACIONAL */}
                  {podeAcessarModulo('matriculas') && (
                    <div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" title="Clique para acessar Matrículas">
                      <div className="font-semibold text-cyan-600 mb-1">📋 Matrículas</div>
                      <div className="text-gray-600 text-xs">Operações diárias</div>
                    </div>
                  )}

                  {/* CADASTROS & REFERÊNCIA */}
                  {podeAcessarModulo('planos') && (
                    <div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" title="Clique para acessar Planos">
                      <div className="font-semibold text-purple-600 mb-1">📁 Planos</div>
                      <div className="text-gray-600 text-xs">Cadastros & Referência</div>
                    </div>
                  )}

                  {/* FINANCEIRO */}
                  {podeAcessarModulo('mensalidades') && (
                    <div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" title="Clique para acessar Mensalidades">
                      <div className="font-semibold text-rose-600 mb-1">💰 Mensalidades</div>
                      <div className="text-gray-600 text-xs">Gestão financeira</div>
                    </div>
                  )}

                  {/* RELATÓRIOS - Frequência */}
                  {podeAcessarModulo('relatorioFrequencia') && (
                    <div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" title="Clique para acessar Relatório de Frequência">
                      <div className="font-semibold text-amber-600 mb-1">📅 Frequência</div>
                      <div className="text-gray-600 text-xs">Relatórios & Analytics</div>
                    </div>
                  )}

                  {/* RELATÓRIOS - Inadimplência (NOVO) */}
                  {podeAcessarModulo('relatorioInadimplencia') && (
                    <div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" title="Clique para acessar Inadimplência">
                      <div className="font-semibold text-red-600 mb-1">⚠️ Inadimplência</div>
                      <div className="text-gray-600 text-xs">Análise de débitos</div>
                    </div>
                  )}

                  {/* RELATÓRIOS - Desempenho (NOVO) */}
                  {podeAcessarModulo('relatorioDesempenho') && (
                    <div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" title="Clique para acessar Desempenho">
                      <div className="font-semibold text-teal-600 mb-1">📊 Desempenho</div>
                      <div className="text-gray-600 text-xs">Métricas operacionais</div>
                    </div>
                  )}

                  {/* RELATÓRIOS - Gerencial (NOVO) */}
                  {podeAcessarModulo('relatorioGerencial') && (
                    <div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" title="Clique para acessar Relatórios Gerenciais">
                      <div className="font-semibold text-indigo-600 mb-1">📈 Gerencial</div>
                      <div className="text-gray-600 text-xs">Relatórios executivos</div>
                    </div>
                  )}
                </div>

                {/* Informação sobre Permissões - Atualizada */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800 leading-relaxed">
                    <strong>💡 Dica:</strong> A tela mostra apenas os módulos disponíveis para seu perfil.
                    O sistema está organizado em <strong>6 seções principais: Pessoas, Operacional, Cadastros, Financeiro, Relatórios e Configurações</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white px-6 py-3 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span>© 2024 JSFitGestão v1.0.0</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-400">{usuario?.empresa?.nomeFantasia}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400">
                Usuário: <strong className="text-white">{usuario?.nome}</strong>
              </span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-400">
                Perfil: <strong className="text-white">{usuario?.perfil}</strong>
              </span>
            </div>
          </div>
        </footer>
      </div>
      <ConfirmDialog
        isOpen={mostrarDialogoSair}
        titulo="Sair do Sistema"
        mensagem="Deseja realmente sair do sistema?"
        textoBotaoConfirmar="Sair"
        textoBotaoCancelar="Cancelar"
        tipo="warning"
        onConfirmar={() => {
          setMostrarDialogoSair(false);
          logout();
        }}
        onCancelar={() => setMostrarDialogoSair(false)}
      />
    </ProtectedRoute>
  );
}

export default App;