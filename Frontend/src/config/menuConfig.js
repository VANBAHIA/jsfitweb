// src/config/menuConfig.js

import {
  Users,
  UserCheck,
  UserCog,
  GraduationCap,
  FileText,
  Dumbbell,
  Wrench,
  DollarSign,
  CreditCard,
  TrendingUp,
  BarChart3,
  Calendar,
  Settings,
  Building2,
  Briefcase,
  MapPin,
  FolderOpen,
  Percent,
  UserPlus,
  Key,
  AlertCircle,
  TrendingDown,
  PieChart,
  Link2,
  Activity // Novo ícone para Exercícios
} from 'lucide-react';



/**
 * Configuração da estrutura de menus do sistema com permissões integradas
 * Seguindo padrão de academias brasileiras
 * VERSÃO MELHORADA: Organização em 6 seções principais para melhor intuitividade
 * Suporta 2 níveis: Menu > Submenu > Sub-submenu
 * 
 * Estrutura de Permissões:
 * - permissao: { modulo: 'nome_modulo', acao: 'acao_especifica' }
 * - Se não tiver permissão definida, o item é visível para todos
 */
export const menuConfig = [
  // ============================================
  // 1. PESSOAS - Gerenciamento de pessoas
  // ============================================
  {
    id: 'pessoas',
    label: 'Pessoas',
    icon: Users,
    descricao: 'Gerenciamento de alunos, funcionários e instrutores',
    submenus: [
      {
        id: 'alunos',
        label: 'Alunos',
        icon: Users,
        rota: '/pessoas/alunos',
        descricao: 'Cadastro e controle de alunos',
        permissao: { modulo: 'alunos', acao: 'acessar' }
      },
      {
        id: 'funcionarios',
        label: 'Funcionários',
        icon: UserCheck,
        rota: '/pessoas/funcionarios',
        descricao: 'Gestão de funcionários da academia',
        permissao: { modulo: 'funcionarios', acao: 'acessar' }
      },
      {
        id: 'instrutores',
        label: 'Instrutores',
        icon: GraduationCap,
        rota: '/pessoas/instrutores',
        descricao: 'Gestão de instrutores e personal trainers',
        permissao: { modulo: 'instrutores', acao: 'acessar' }
      },
      {
        id: 'visitantes',
        label: 'Visitantes',
        icon: UserPlus,
        rota: '/pessoas/visitantes',
        descricao: 'Controle de visitantes da academia',
        permissao: { modulo: 'visitantes', acao: 'acessar' }
      }
    ]
  },

  // ============================================
  // 2. OPERACIONAL - Operações diárias
  // ============================================
  {
    id: 'operacional',
    label: 'Operacional',
    icon: Briefcase,
    descricao: 'Operações diárias e gerenciamento de turmas',
    submenus: [
      {
        id: 'matriculas',
        label: 'Matrículas',
        icon: FileText,
        rota: '/operacional/matriculas',
        descricao: 'Gestão de matrículas de alunos',
        permissao: { modulo: 'matriculas', acao: 'acessar' }
      },
      {
        id: 'turmas',
        label: 'Turmas',
        icon: Users,
        rota: '/operacional/turmas',
        descricao: 'Cadastro e gestão de turmas',
        permissao: { modulo: 'turmas', acao: 'acessar' }
      },
      {
        id: 'frequencia',
        label: 'Frequência',
        icon: Calendar,
        rota: '/operacional/frequencia',
        descricao: 'Controle de frequência dos alunos',
        permissao: { modulo: 'frequencia', acao: 'acessar' }
      },
      {
        id: 'equipamentos',
        label: 'Equipamentos',
        icon: Wrench,
        rota: '/operacional/equipamentos',
        descricao: 'Controle de equipamentos da academia',
        permissao: { modulo: 'equipamentos', acao: 'acessar' }
      },
      {
        id: 'exercicio-equipamento',
        label: 'Exercício-Equipamento',
        icon: Link2,  // Importe no topo
        rota: '/cadastros/exercicio-equipamento',
        descricao: 'Vincular exercícios a equipamentos',
        permissao: { modulo: 'exercicioEquipamentos', acao: 'acessar' }
      }
    ]
  },

  // ============================================
  // 3. CADASTROS & REFERÊNCIA - Dados configuráveis
  // ============================================
  {
    id: 'cadastros',
    label: 'Cadastros',
    icon: FolderOpen,
    descricao: 'Dados de referência e configurações operacionais',
    submenus: [
      {
        id: 'descontos',
        label: 'Descontos',
        icon: Percent,
        rota: '/cadastros/descontos',
        descricao: 'Cadastro de descontos e promoções',
        permissao: { modulo: 'descontos', acao: 'acessar' }
      },
      {
        id: 'exercicios',
        label: 'Exercícios',
        icon: Activity,
        rota: '/cadastros/exercicios',
        descricao: 'Biblioteca de exercícios e movimentos',
        permissao: { modulo: 'exercicios', acao: 'acessar' }
      },
      {
        id: 'funcoes',
        label: 'Funções & Cargos',
        icon: Briefcase,
        rota: '/cadastros/funcoes',
        descricao: 'Cadastro de funções e cargos',
        permissao: { modulo: 'funcoes', acao: 'acessar' }
      },
      {
        id: 'gruposexercicio',
        label: 'Grupos de Exercício',
        icon: Dumbbell,
        rota: '/cadastros/gruposexercicio',
        descricao: 'Grupos musculares e categorias de exercícios',
        permissao: { modulo: 'gruposexercicio', acao: 'acessar' }
      },
      {
        id: 'locais',
        label: 'Locais',
        icon: MapPin,
        rota: '/cadastros/locais',
        descricao: 'Cadastro de locais e espaços da academia',
        permissao: { modulo: 'locais', acao: 'acessar' }
      },
      {
        id: 'planos',
        label: 'Planos',
        icon: FileText,
        rota: '/cadastros/planos',
        descricao: 'Cadastro de planos e modalidades',
        permissao: { modulo: 'planos', acao: 'acessar' }
      }


    ]
  },

  // ============================================
  // 4. FINANCEIRO - Gestão financeira
  // ============================================
  {
    id: 'financeiro',
    label: 'Financeiro',
    icon: DollarSign,
    descricao: 'Controle financeiro e fluxo de caixa',
    submenus: [
      {
        id: 'mensalidades',
        label: 'Mensalidades',
        icon: CreditCard,
        rota: '/financeiro/mensalidades',
        descricao: 'Controle de pagamentos de alunos',
        permissao: { modulo: 'mensalidades', acao: 'acessar' }
      },
      {
        id: 'contas-receber',
        label: 'Contas a Receber',
        icon: TrendingUp,
        rota: '/financeiro/contas-receber',
        descricao: 'Receitas e recebimentos',
        permissao: { modulo: 'contasReceber', acao: 'acessar' }
      },
      {
        id: 'contas-pagar',
        label: 'Contas a Pagar',
        icon: TrendingDown,
        rota: '/financeiro/contas-pagar',
        descricao: 'Despesas e fornecedores',
        permissao: { modulo: 'contasPagar', acao: 'acessar' }
      },
      {
        id: 'caixa',
        label: 'Controle de Caixa',
        icon: CreditCard,
        rota: '/financeiro/caixa',
        descricao: 'Abertura, fechamento e movimentações de caixa',
        permissao: { modulo: 'caixa', acao: 'acessar' }
      }
    ]
  },

  // ============================================
  // 5. RELATÓRIOS & ANALYTICS - Análises e insights
  // ============================================
  {
    id: 'relatorios',
    label: 'Relatórios',
    icon: BarChart3,
    descricao: 'Relatórios, análises e dashboards',
    submenus: [
      {
        id: 'frequencia-relatorio',
        label: 'Frequência',
        icon: Calendar,
        rota: '/relatorios/frequencia',
        descricao: 'Relatório de frequência de alunos',
        permissao: { modulo: 'relatorioFrequencia', acao: 'acessar' }
      },
      {
        id: 'financeiro-relatorio',
        label: 'Financeiro',
        icon: BarChart3,
        rota: '/relatorios/financeiro',
        descricao: 'Relatórios e dashboards financeiros',
        permissao: { modulo: 'relatorioFinanceiro', acao: 'acessar' }
      },
      {
        id: 'inadimplencia-relatorio',
        label: 'Inadimplência',
        icon: AlertCircle,
        rota: '/relatorios/inadimplencia',
        descricao: 'Análise de alunos inadimplentes',
        permissao: { modulo: 'relatorioInadimplencia', acao: 'acessar' }
      },
      {
        id: 'desempenho-relatorio',
        label: 'Desempenho',
        icon: TrendingUp,
        rota: '/relatorios/desempenho',
        descricao: 'Métricas de desempenho operacional',
        permissao: { modulo: 'relatorioDesempenho', acao: 'acessar' }
      },
      {
        id: 'gerencial-relatorio',
        label: 'Gerencial',
        icon: PieChart,
        rota: '/relatorios/gerencial',
        descricao: 'Relatórios gerenciais e executivos',
        permissao: { modulo: 'relatorioGerencial', acao: 'acessar' }
      }
    ]
  },

  // ============================================
  // 6. CONFIGURAÇÕES - Administração do sistema
  // ============================================
  {
    id: 'configuracoes',
    label: 'Configurações',
    icon: Settings,
    descricao: 'Administração e configurações do sistema',
    submenus: [
      {
        id: 'dados-academia',
        label: 'Dados da Academia',
        icon: Building2,
        rota: '/configuracoes/empresa',
        descricao: 'Informações cadastrais da academia',
        permissao: { modulo: 'dadosAcademia', acao: 'acessar' }
      },
      {
        id: 'usuarios',
        label: 'Usuários do Sistema',
        icon: UserCog,
        rota: '/configuracoes/usuarios',
        descricao: 'Gestão de usuários e permissões',
        permissao: { modulo: 'usuarios', acao: 'acessar' }
      },
      {
        id: 'licencas',
        label: 'Controle de Licenças',
        icon: Key,
        rota: '/configuracoes/licencas',
        descricao: 'Gestão de licenças do sistema',
        permissao: { modulo: 'licencas', acao: 'acessar' }
      },
      {
        id: 'sistema',
        label: 'Sistema',
        icon: Settings,
        rota: '/configuracoes/sistema',
        descricao: 'Configurações gerais do sistema',
        permissao: { modulo: 'sistema', acao: 'acessar' }
      }
    ]
  }
];

/**
 * Função para filtrar menus baseado nas permissões do usuário
 * @param {Array} menus - Array de menus
 * @param {Function} verificarPermissao - Função para verificar permissão (temPermissao)
 * @returns {Array} Menus filtrados
 */
export const filtrarMenusPorPermissao = (menus, verificarPermissao) => {
  return menus
    .map(menu => {
      // Filtrar submenus
      const submenusPermitidos = menu.submenus
        .filter(submenu => {
          // Se não tem permissão definida, mostra para todos
          if (!submenu.permissao) return true;

          // Se tem submenus (segundo nível)
          if (submenu.hasSubmenus && submenu.submenus) {
            // Verifica se tem pelo menos um sub-submenu permitido
            const subSubmenusPermitidos = submenu.submenus.filter(subSub => {
              if (!subSub.permissao) return true;
              return verificarPermissao(subSub.permissao.modulo, subSub.permissao.acao);
            });
            return subSubmenusPermitidos.length > 0;
          }

          // Verifica permissão do submenu
          return verificarPermissao(submenu.permissao.modulo, submenu.permissao.acao);
        })
        .map(submenu => {
          // Se tem submenus (segundo nível), filtra eles também
          if (submenu.hasSubmenus && submenu.submenus) {
            return {
              ...submenu,
              submenus: submenu.submenus.filter(subSub => {
                if (!subSub.permissao) return true;
                return verificarPermissao(subSub.permissao.modulo, subSub.permissao.acao);
              })
            };
          }
          return submenu;
        });

      return {
        ...menu,
        submenus: submenusPermitidos
      };
    })
    // Remove menus que ficaram sem submenus
    .filter(menu => menu.submenus.length > 0);
};

/**
 * Mapeamento de IDs de submenu para nome do módulo de permissão
 * Útil para verificações rápidas
 * ATUALIZADO: Inclui novos módulos de relatórios e exercícios
 */
export const MAPA_SUBMENU_MODULO = {
  // Pessoas
  'alunos': 'alunos',
  'funcionarios': 'funcionarios',
  'instrutores': 'instrutores',
  'visitantes': 'visitantes',
  // Operacional
  'matriculas': 'matriculas',
  'turmas': 'turmas',
  'frequencia': 'frequencia',
  'equipamentos': 'equipamentos',
  // Cadastros & Referência
  'planos': 'planos',
  'modalidades': 'modalidades',
  'gruposexercicio': 'gruposexercicio',
  'exercicios': 'exercicios',
  'descontos': 'descontos',
  'locais': 'locais',
  'funcoes': 'funcoes',
  // Financeiro
  'mensalidades': 'mensalidades',
  'contas-receber': 'contasReceber',
  'contas-pagar': 'contasPagar',
  'caixa': 'caixa',
  // Relatórios & Analytics
  'frequencia-relatorio': 'relatorioFrequencia',
  'financeiro-relatorio': 'relatorioFinanceiro',
  'inadimplencia-relatorio': 'relatorioInadimplencia',
  'desempenho-relatorio': 'relatorioDesempenho',
  'gerencial-relatorio': 'relatorioGerencial',
  // Configurações
  'dados-academia': 'dadosAcademia',
  'usuarios': 'usuarios',
  'licencas': 'licencas',
  'sistema': 'sistema'
};

export default menuConfig;