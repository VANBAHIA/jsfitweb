📘 GUIA COMPLETO DE FLUXO OPERACIONAL - JSFlexWeb
Sistema de Gestão para Academia
Versão 2.0 | Novembro 2025

📋 ÍNDICE

Configuração Inicial
Cadastros Básicos
Operações Diárias
Gestão Financeira
Relatórios e Consultas
Rotinas Mensais
Casos Especiais
Troubleshooting


1. CONFIGURAÇÃO INICIAL
1.1 - Primeiro Acesso ao Sistema
📌 Criar Usuário Administrador
httpPOST /api/users/register
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@academia.com",
  "password": "Senha@123",
  "dtNasc": "1985-05-15"
}
Resposta Esperada:
json{
  "id": "673abc123...",
  "nome": "João Silva",
  "email": "joao@academia.com",
  "createdAt": "2025-11-10T08:00:00.000Z"
}

📌 Fazer Login
httpPOST /api/users/login
Content-Type: application/json

{
  "email": "joao@academia.com",
  "password": "Senha@123"
}
Resposta:
json{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "673abc123...",
    "nome": "João Silva",
    "email": "joao@academia.com"
  }
}
💡 IMPORTANTE: Guarde o token - Será usado em todas as requisições futuras no header:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

2. CADASTROS BÁSICOS
2.1 - Cadastrar Locais (Salas/Áreas)
Sala de Musculação
httpPOST /api/locais
Content-Type: application/json

{
  "nome": "Sala de Musculação",
  "status": "ATIVO"
}
Sala de CrossFit
httpPOST /api/locais

{
  "nome": "Sala de CrossFit",
  "status": "ATIVO"
}
Piscina
httpPOST /api/locais

{
  "nome": "Piscina",
  "status": "ATIVO"
}
Sala de Spinning
httpPOST /api/locais

{
  "nome": "Sala de Spinning",
  "status": "ATIVO"
}

2.2 - Cadastrar Funções
Instrutor
httpPOST /api/funcoes

{
  "funcao": "Instrutor",
  "status": "ATIVO"
}
Recepcionista
httpPOST /api/funcoes

{
  "funcao": "Recepcionista",
  "status": "ATIVO"
}
Personal Trainer
httpPOST /api/funcoes

{
  "funcao": "Personal Trainer",
  "status": "ATIVO"
}
Gerente
httpPOST /api/funcoes

{
  "funcao": "Gerente",
  "status": "ATIVO"
}

2.3 - Cadastrar Planos
Plano Mensal
httpPOST /api/planos

{
  "nome": "Plano Mensal",
  "periodicidade": "MESES",
  "numeroMeses": 1,
  "valorMensalidade": 150.00,
  "descricao": "Acesso ilimitado durante 1 mês",
  "status": "ATIVO"
}
Plano Trimestral
httpPOST /api/planos

{
  "nome": "Plano Trimestral",
  "periodicidade": "MESES",
  "numeroMeses": 3,
  "valorMensalidade": 130.00,
  "descricao": "Acesso ilimitado durante 3 meses - Economia de R$ 60",
  "status": "ATIVO"
}
Plano Semestral
httpPOST /api/planos

{
  "nome": "Plano Semestral",
  "periodicidade": "MESES",
  "numeroMeses": 6,
  "valorMensalidade": 120.00,
  "descricao": "Acesso ilimitado durante 6 meses - Economia de R$ 180",
  "status": "ATIVO"
}
Plano Anual
httpPOST /api/planos

{
  "nome": "Plano Anual",
  "periodicidade": "MESES",
  "numeroMeses": 12,
  "valorMensalidade": 100.00,
  "descricao": "Acesso ilimitado durante 12 meses - Economia de R$ 600",
  "status": "ATIVO"
}
Day Use
httpPOST /api/planos

{
  "nome": "Day Use",
  "periodicidade": "DIAS",
  "numeroDias": 1,
  "valorMensalidade": 30.00,
  "descricao": "Acesso por 1 dia",
  "status": "ATIVO"
}

2.4 - Cadastrar Descontos
Desconto Estudante (Percentual)
httpPOST /api/descontos

{
  "descricao": "Desconto Estudante",
  "tipo": "PERCENTUAL",
  "valor": 20,
  "status": "ATIVO"
}
Desconto Idoso (Percentual)
httpPOST /api/descontos

{
  "descricao": "Desconto Terceira Idade",
  "tipo": "PERCENTUAL",
  "valor": 15,
  "status": "ATIVO"
}
Desconto Funcionário (Percentual)
httpPOST /api/descontos

{
  "descricao": "Desconto Funcionário",
  "tipo": "PERCENTUAL",
  "valor": 50,
  "status": "ATIVO"
}
Promoção Black Friday (Monetário)
httpPOST /api/descontos

{
  "descricao": "Black Friday",
  "tipo": "MONETARIO",
  "valor": 50.00,
  "status": "ATIVO"
}

2.5 - Cadastrar Funcionários
Cadastrar Instrutor
httpPOST /api/funcionarios

{
  "pessoa": {
    "tipo": "FISICA",
    "nome1": "Pedro",
    "nome2": "Santos Silva",
    "doc1": "12345678900",
    "doc2": "MG1234567",
    "dtNsc": "1990-03-15",
    "situacao": "ATIVO",
    "contatos": [
      {
        "tipo": "CELULAR",
        "valor": "(31) 98765-4321",
        "principal": true
      },
      {
        "tipo": "EMAIL",
        "valor": "pedro.santos@email.com",
        "principal": false
      }
    ],
    "enderecos": [
      {
        "tipo": "RESIDENCIAL",
        "logradouro": "Rua das Flores",
        "numero": "123",
        "complemento": "Apto 201",
        "bairro": "Centro",
        "cidade": "Belo Horizonte",
        "estado": "MG",
        "cep": "30100-000",
        "principal": true
      }
    ]
  },
  "funcionario": {
    "funcaoId": "673funcao123...",
    "dataAdmissao": "2025-01-15",
    "salario": 2500.00,
    "situacao": "ATIVO"
  }
}
Cadastrar Recepcionista
httpPOST /api/funcionarios

{
  "pessoa": {
    "tipo": "FISICA",
    "nome1": "Maria",
    "nome2": "Oliveira Costa",
    "doc1": "98765432100",
    "doc2": "MG9876543",
    "dtNsc": "1995-07-20",
    "contatos": [
      {
        "tipo": "CELULAR",
        "valor": "(31) 99876-5432",
        "principal": true
      }
    ]
  },
  "funcionario": {
    "funcaoId": "673funcao456...",
    "dataAdmissao": "2025-02-01",
    "salario": 1800.00,
    "situacao": "ATIVO"
  }
}

2.6 - Cadastrar Turmas
Turma de Musculação Masculina
httpPOST /api/turmas

{
  "nome": "Musculação Manhã - Masculino",
  "sexo": "MASCULINO",
  "observacoes": "Turma para iniciantes e intermediários",
  "status": "ATIVO",
  "horarios": [
    {
      "localId": "673local123...",
      "diasSemana": ["SEGUNDA", "QUARTA", "SEXTA"],
      "horaEntrada": "06:00",
      "horaSaida": "07:30"
    }
  ],
  "instrutores": [
    {
      "funcionarioId": "673func123..."
    }
  ]
}
Turma de CrossFit Mista
httpPOST /api/turmas

{
  "nome": "CrossFit Noite - Misto",
  "sexo": "AMBOS",
  "observacoes": "Alto rendimento",
  "status": "ATIVO",
  "horarios": [
    {
      "localId": "673local456...",
      "diasSemana": ["TERÇA", "QUINTA"],
      "horaEntrada": "19:00",
      "horaSaida": "20:00"
    }
  ],
  "instrutores": [
    {
      "funcionarioId": "673func123..."
    }
  ]
}

3. OPERAÇÕES DIÁRIAS
3.1 - ABERTURA DO DIA
⏰ 08:00 - Abrir Caixa
httpPOST /api/caixas/abrir

{
  "valorAbertura": 200.00,
  "usuarioAbertura": "Maria Recepcionista",
  "observacoes": "Abertura normal - Segunda-feira"
}
Resposta:
json{
  "statusCode": 201,
  "success": true,
  "message": "Caixa aberto com sucesso",
  "data": {
    "id": "673caixa123...",
    "numero": "CX00015",
    "status": "ABERTO",
    "valorAbertura": 200.00,
    "dataAbertura": "2025-11-10T08:00:00.000Z",
    "horaAbertura": "08:00:00",
    "totalEntradas": 0,
    "totalSaidas": 0
  }
}
💡 Anote o ID do caixa: 673caixa123... - Será usado durante o dia.

3.2 - MATRÍCULA DE NOVO ALUNO
📝 Passo 1: Cadastrar Aluno
httpPOST /api/alunos

{
  "pessoa": {
    "tipo": "FISICA",
    "nome1": "Carlos",
    "nome2": "Eduardo Souza",
    "doc1": "11122233344",
    "doc2": "MG1122334",
    "dtNsc": "1998-08-10",
    "situacao": "ATIVO",
    "contatos": [
      {
        "tipo": "CELULAR",
        "valor": "(31) 91234-5678",
        "principal": true
      },
      {
        "tipo": "EMAIL",
        "valor": "carlos.souza@email.com",
        "principal": false
      }
    ],
    "enderecos": [
      {
        "tipo": "RESIDENCIAL",
        "logradouro": "Av. Principal",
        "numero": "456",
        "bairro": "Savassi",
        "cidade": "Belo Horizonte",
        "estado": "MG",
        "cep": "30112-000",
        "principal": true
      }
    ]
  },
  "aluno": {
    "vldExameMedico": "2026-11-10",
    "vldAvaliacao": "2025-12-10",
    "objetivo": "Hipertrofia",
    "profissao": "Engenheiro",
    "empresa": "Tech Solutions LTDA",
    "horarios": [
      {
        "local": "Sala de Musculação",
        "diasSemana": ["SEGUNDA", "QUARTA", "SEXTA"],
        "horarioEntrada": "18:00",
        "horarioSaida": "19:30"
      }
    ],
    "controleAcesso": {
      "senha": "1234"
    }
  }
}
Resposta:
json{
  "statusCode": 201,
  "success": true,
  "message": "Aluno criado com sucesso",
  "data": {
    "id": "673aluno123...",
    "matricula": "00015",
    "pessoaId": "673pessoa123...",
    "pessoa": {
      "codigo": "0015",
      "nome1": "Carlos",
      "nome2": "Eduardo Souza",
      "doc1": "11122233344"
    }
  }
}
💡 Anote: alunoId: 673aluno123... e matricula: 00015

💰 Passo 2: Gerar Conta a Receber
httpPOST /api/contas-receber

{
  "alunoId": "673aluno123...",
  "planoId": "673plano123...",
  "descontoId": "673desconto123...",
  "dataVencimento": "2025-11-10",
  "observacoes": "Primeira mensalidade - Matrícula"
}
Resposta:
json{
  "statusCode": 201,
  "success": true,
  "data": {
    "id": "673conta123...",
    "numero": "CR00050",
    "valorOriginal": 150.00,
    "valorDesconto": 30.00,
    "valorFinal": 120.00,
    "valorRestante": 120.00,
    "status": "PENDENTE"
  }
}

💳 Passo 3: Registrar Pagamento
httpPOST /api/contas-receber/673conta123.../pagar

{
  "valorPago": 120.00,
  "formaPagamento": "PIX",
  "dataPagamento": "2025-11-10",
  "caixaId": "673caixa123..."
}
Resposta:
json{
  "statusCode": 200,
  "success": true,
  "message": "Pagamento registrado com sucesso",
  "data": {
    "numero": "CR00050",
    "valorPago": 120.00,
    "valorRestante": 0,
    "status": "PAGO",
    "dataPagamento": "2025-11-10T09:30:00.000Z"
  }
}
✅ Movimento automaticamente registrado no caixa!

3.3 - RENOVAÇÃO DE MENSALIDADE
📋 Listar Contas a Vencer Hoje
httpGET /api/dashboard/contas-vencer
Resposta mostra alunos com vencimento hoje:
json{
  "contasReceber": {
    "quantidade": 15,
    "total": 2250.00,
    "contas": [
      {
        "numero": "CR00051",
        "valorRestante": 150.00,
        "dataVencimento": "2025-11-10",
        "aluno": {
          "matricula": "00010",
          "pessoa": {
            "nome1": "Ana",
            "nome2": "Paula Santos"
          }
        }
      }
    ]
  }
}

💳 Registrar Pagamento da Renovação
httpPOST /api/contas-receber/CR00051/pagar

{
  "valorPago": 150.00,
  "formaPagamento": "CARTAO_CREDITO",
  "caixaId": "673caixa123..."
}

3.4 - VENDA DE PRODUTOS (Day Use, Bebidas, etc)
🥤 Venda de Produto no Caixa
httpPOST /api/caixas/673caixa123.../movimento

{
  "tipo": "ENTRADA",
  "valor": 35.00,
  "descricao": "Venda: 1 Whey Protein",
  "formaPagamento": "DINHEIRO",
  "categoria": "VENDA_PRODUTOS"
}
🎫 Venda de Day Use
httpPOST /api/contas-receber

{
  "alunoId": "673visitante123...",
  "planoId": "673planoDayUse...",
  "dataVencimento": "2025-11-10",
  "observacoes": "Day Use - Visitante"
}
httpPOST /api/contas-receber/673conta456.../pagar

{
  "valorPago": 30.00,
  "formaPagamento": "DINHEIRO",
  "caixaId": "673caixa123..."
}

3.5 - PAGAMENTO DE DESPESAS
💡 Pagar Conta de Luz
httpPOST /api/contas-pagar

{
  "categoria": "ENERGIA",
  "descricao": "Conta de luz CEMIG - Novembro/2025",
  "valorOriginal": 650.00,
  "dataVencimento": "2025-11-10",
  "documento": "NF-87654321"
}
Resposta:
json{
  "id": "673contaPagar123...",
  "numero": "CP00030",
  "valorFinal": 650.00,
  "status": "PENDENTE"
}

💸 Efetuar Pagamento
httpPOST /api/contas-pagar/673contaPagar123.../pagar

{
  "valorPago": 650.00,
  "formaPagamento": "TRANSFERENCIA",
  "dataPagamento": "2025-11-10",
  "caixaId": "673caixa123..."
}
✅ Saída registrada automaticamente no caixa!

3.6 - SANGRIA DO CAIXA
💰 Retirar Dinheiro para Banco
httpPOST /api/caixas/673caixa123.../sangria

{
  "valor": 500.00,
  "descricao": "Depósito bancário - Bradesco",
  "usuarioResponsavel": "João Gerente"
}
Use quando: Houver muito dinheiro no caixa (segurança).

3.7 - SUPRIMENTO DO CAIXA
💵 Adicionar Dinheiro ao Caixa
httpPOST /api/caixas/673caixa123.../suprimento

{
  "valor": 300.00,
  "descricao": "Suprimento para troco",
  "usuarioResponsavel": "João Gerente"
}
Use quando: Faltar troco no caixa.

3.8 - FECHAMENTO DO DIA
📊 Passo 1: Gerar Relatório do Caixa
httpGET /api/caixas/673caixa123.../relatorio
Resposta Detalhada:
json{
  "caixa": {
    "numero": "CX00015",
    "status": "ABERTO",
    "dataAbertura": "2025-11-10T08:00:00.000Z",
    "usuarioAbertura": "Maria Recepcionista"
  },
  "valores": {
    "valorAbertura": 200.00,
    "totalEntradas": 2450.00,
    "totalSaidas": 1850.00,
    "saldoEsperado": 800.00
  },
  "resumo": {
    "totalMovimentos": 45,
    "quantidadeEntradas": 30,
    "quantidadeSaidas": 15
  },
  "detalhes": {
    "saidasPorCategoria": {
      "ENERGIA": { "total": 650.00, "quantidade": 1 },
      "SALARIO": { "total": 700.00, "quantidade": 2 },
      "SANGRIA": { "total": 500.00, "quantidade": 1 }
    },
    "entradasPorFormaPagamento": {
      "PIX": { "total": 1500.00, "quantidade": 15 },
      "DINHEIRO": { "total": 650.00, "quantidade": 10 },
      "CARTAO_CREDITO": { "total": 300.00, "quantidade": 5 }
    }
  },
  "movimentos": [...]
}

💵 Passo 2: Conferir Dinheiro Físico
Conte o dinheiro no caixa:

Notas de R$ 100: 5 = R$ 500,00
Notas de R$ 50: 4 = R$ 200,00
Notas de R$ 20: 5 = R$ 100,00
Total Contado: R$ 800,00


🔒 Passo 3: Fechar Caixa
httpPOST /api/caixas/673caixa123.../fechar

{
  "valorFechamento": 800.00,
  "usuarioFechamento": "Maria Recepcionista",
  "observacoes": "Fechamento normal - Caixa bateu certinho"
}
Se houver diferença:
httpPOST /api/caixas/673caixa123.../fechar

{
  "valorFechamento": 795.00,
  "usuarioFechamento": "Maria Recepcionista",
  "observacoes": "Falta de R$ 5,00 - Provável erro de troco"
}

4. GESTÃO FINANCEIRA
4.1 - CONTAS A RECEBER
📋 Listar Todas as Contas Pendentes
httpGET /api/contas-receber?status=PENDENTE&page=1&limit=20
📋 Contas de um Aluno Específico
httpGET /api/contas-receber?alunoId=673aluno123...&status=PENDENTE
📋 Contas Vencidas
httpGET /api/contas-receber?status=VENCIDO
📋 Contas por Período
httpGET /api/contas-receber?dataInicio=2025-11-01&dataFim=2025-11-30

4.2 - CONTAS A PAGAR
💰 Criar Conta de Fornecedor
httpPOST /api/contas-pagar

{
  "categoria": "FORNECEDOR",
  "fornecedorNome": "Equipamentos Fitness LTDA",
  "fornecedorDoc": "12.345.678/0001-90",
  "descricao": "Compra de 5 esteiras ergométricas",
  "valorOriginal": 25000.00,
  "dataVencimento": "2025-12-15",
  "documento": "NF-456789"
}

💼 Criar Folha de Pagamento
httpPOST /api/contas-pagar

{
  "categoria": "SALARIO",
  "funcionarioId": "673func123...",
  "descricao": "Salário Pedro Santos - Novembro/2025",
  "valorOriginal": 2500.00,
  "dataVencimento": "2025-11-05"
}

🏢 Criar Conta de Aluguel
httpPOST /api/contas-pagar

{
  "categoria": "ALUGUEL",
  "descricao": "Aluguel do imóvel - Novembro/2025",
  "valorOriginal": 5000.00,
  "dataVencimento": "2025-11-10",
  "fornecedorNome": "Imobiliária XYZ",
  "documento": "Recibo-001"
}

💸 Pagar com Juros e Multa (Atrasado)
httpPOST /api/contas-pagar/673contaPagar456.../pagar

{
  "valorPago": 5150.00,
  "valorJuros": 100.00,
  "valorMulta": 50.00,
  "formaPagamento": "TRANSFERENCIA",
  "caixaId": "673caixa123..."
}

📊 Parcelar Compra de Equipamento
httpPOST /api/contas-pagar/parcelado

{
  "categoria": "EQUIPAMENTO",
  "descricao": "Compra de equipamentos CrossFit",
  "valorTotal": 18000.00,
  "totalParcelas": 6,
  "dataVencimentoPrimeira": "2025-12-10",
  "fornecedorNome": "CrossFit Equipment Inc",
  "fornecedorDoc": "98.765.432/0001-10",
  "documento": "NF-999888"
}
Resultado: Sistema cria 6 contas automaticamente:

CP00100: R$ 3.000,00 - Vencimento: 10/12/2025
CP00101: R$ 3.000,00 - Vencimento: 10/01/2026
CP00102: R$ 3.000,00 - Vencimento: 10/02/2026
...e assim por diante


4.3 - CANCELAMENTO DE CONTAS
❌ Cancelar Conta a Receber
httpPATCH /api/contas-receber/673conta789.../cancelar

{
  "motivo": "Aluno cancelou matrícula antes do vencimento"
}
❌ Cancelar Conta a Pagar
httpPATCH /api/contas-pagar/673contaPagar789.../cancelar

{
  "motivo": "Serviço não foi prestado conforme contrato"
}

5. RELATÓRIOS E CONSULTAS
5.1 - DASHBOARD PRINCIPAL
📊 Resumo Geral
httpGET /api/dashboard/resumo
Retorna:
json{
  "periodo": {
    "mes": 11,
    "ano": 2025
  },
  "contasReceber": {
    "pendentes": 45,
    "vencidas": 8,
    "totalRecebidoMes": 18500.00,
    "projecaoMes": 6750.00
  },
  "contasPagar": {
    "pendentes": 12,
    "vencidas": 2,
    "totalPagoMes": 12300.00,
    "projecaoMes": 8500.00
  },
  "caixa": {
    "status": "FECHADO",
    "saldoAtual": 0
  },
  "academia": {
    "alunosAtivos": 120,
    "receitaLiquidaMes": 6200.00,
    "projecaoLucro": -1750.00
  }
}

5.2 - FLUXO DE CAIXA
💰 Fluxo do Mês Atual
httpGET /api/dashboard/fluxo-caixa?dataInicio=2025-11-01&dataFim=2025-11-30
Retorna:
json{
  "periodo": {
    "inicio": "2025-11-01",
    "fim": "2025-11-30"
  },
  "resumo": {
    "totalEntradas": 25500.00,
    "totalSaidas": 18300.00,
    "saldoPeriodo": 7200.00
  },
  "fluxoDiario": [
    {
      "data": "2025-11-01",
      "entradas": 1200.00,
      "saidas": 800.00,
      "saldo": 400.00,
      "saldoAcumulado": 400.00
    },
    {
      "data": "2025-11-02",
      "entradas": 1500.00,
      "saidas": 650.00,
      "saldo": 850.00,
      "saldoAcumulado": 1250.00
    }
  ]
}

5.3 - CONTAS A VENCER
📅 Próximos 7 Dias
httpGET /api/dashboard/contas-vencer
Use para: Planejar pagamentos e cobranças da semana.

5.4 - TOP DESPESAS
📊 Despesas por Categoria
httpGET /api/dashboard/top-despesas?mes=11&ano=2025
Retorna:
Tentar novamenteClaude ainda não tem a capacidade de executar o código que gera.PContinuarjson{
  "periodo": {
    "mes": 11,
    "ano": 2025
  },
  "totalGeral": 18300.00,
  "despesas": [
    {
      "categoria": "SALARIO",
      "total": 8500.00,
      "quantidade": 5,
      "percentual": "46.45"
    },
    {
      "categoria": "ALUGUEL",
      "total": 5000.00,
      "quantidade": 1,
      "percentual": "27.32"
    },
    {
      "categoria": "ENERGIA",
      "total": 2100.00,
      "quantidade": 1,
      "percentual": "11.48"
    },
    {
      "categoria": "EQUIPAMENTO",
      "total": 1500.00,
      "quantidade": 2,
      "percentual": "8.20"
    },
    {
      "categoria": "INTERNET",
      "total": 800.00,
      "quantidade": 1,
      "percentual": "4.37"
    },
    {
      "categoria": "OUTROS",
      "total": 400.00,
      "quantidade": 3,
      "percentual": "2.19"
    }
  ]
}

5.5 - INADIMPLÊNCIA
🚨 Relatório de Inadimplentes
httpGET /api/dashboard/inadimplencia
Retorna:
json{
  "resumo": {
    "totalInadimplentes": 12,
    "totalContasVencidas": 18,
    "valorTotal": 2700.00
  },
  "inadimplentes": [
    {
      "aluno": {
        "matricula": "00045",
        "pessoa": {
          "nome1": "Roberto",
          "nome2": "Silva",
          "doc1": "12345678900",
          "contatos": [
            {
              "tipo": "CELULAR",
              "valor": "(31) 98888-7777"
            }
          ]
        }
      },
      "contas": [
        {
          "numero": "CR00150",
          "valorRestante": 150.00,
          "dataVencimento": "2025-10-10",
          "diasAtraso": 31
        },
        {
          "numero": "CR00180",
          "valorRestante": 150.00,
          "dataVencimento": "2025-09-10",
          "diasAtraso": 61
        }
      ],
      "totalDevido": 300.00,
      "diasAtraso": 61
    }
  ]
}
💡 Use este relatório para:

Enviar cobranças via WhatsApp
Bloquear acesso de inadimplentes
Negociar pagamentos atrasados


5.6 - HISTÓRICO DE CAIXAS
📋 Caixas do Mês
httpGET /api/caixas?dataInicio=2025-11-01&dataFim=2025-11-30&status=FECHADO
📋 Caixa Específico
httpGET /api/caixas/673caixa123...

5.7 - CONSULTAS DE ALUNOS
👤 Buscar Aluno por Nome
httpGET /api/alunos?busca=Carlos&page=1&limit=10
👤 Buscar Aluno por CPF
httpGET /api/alunos?busca=11122233344
👤 Alunos Ativos
httpGET /api/alunos?situacao=ATIVO
👤 Dados Completos do Aluno
httpGET /api/alunos/673aluno123...

5.8 - CONSULTAS DE FUNCIONÁRIOS
👥 Listar Todos os Funcionários
httpGET /api/funcionarios?page=1&limit=10
👥 Funcionários Ativos
httpGET /api/funcionarios?situacao=ATIVO
👥 Instrutores
httpGET /api/funcionarios/instrutores/lista
👥 Por Função
httpGET /api/funcionarios?funcao=Recepcionista

6. ROTINAS MENSAIS
6.1 - INÍCIO DO MÊS
📅 Dia 01 - Gerar Contas a Receber do Mês
Para cada aluno ativo, criar mensalidade:
httpPOST /api/contas-receber

{
  "alunoId": "673aluno001...",
  "planoId": "673plano123...",
  "dataVencimento": "2025-12-10",
  "observacoes": "Mensalidade Dezembro/2025"
}
💡 Dica: Crie um script ou rotina para automatizar isso.

📅 Dia 05 - Gerar Folha de Pagamento
Para cada funcionário:
httpPOST /api/contas-pagar

{
  "categoria": "SALARIO",
  "funcionarioId": "673func123...",
  "descricao": "Salário Pedro Santos - Dezembro/2025",
  "valorOriginal": 2500.00,
  "dataVencimento": "2025-12-05"
}

📅 Dia 10 - Gerar Contas Fixas
Aluguel:
httpPOST /api/contas-pagar

{
  "categoria": "ALUGUEL",
  "descricao": "Aluguel - Dezembro/2025",
  "valorOriginal": 5000.00,
  "dataVencimento": "2025-12-10"
}
Internet:
httpPOST /api/contas-pagar

{
  "categoria": "INTERNET",
  "descricao": "Internet - Dezembro/2025",
  "valorOriginal": 300.00,
  "dataVencimento": "2025-12-15"
}

6.2 - MEIO DO MÊS
📊 Dia 15 - Análise Financeira
1. Verificar Inadimplência:
httpGET /api/dashboard/inadimplencia
2. Verificar Fluxo de Caixa:
httpGET /api/dashboard/fluxo-caixa?dataInicio=2025-12-01&dataFim=2025-12-15
3. Atualizar Status de Contas Vencidas:
httpPATCH /api/contas-receber/atualizar-vencidas
httpPATCH /api/contas-pagar/atualizar-vencidas

6.3 - FINAL DO MÊS
📊 Dia 30 - Fechamento Mensal
1. Relatório Completo de Receitas:
httpGET /api/contas-receber?dataInicio=2025-12-01&dataFim=2025-12-31&status=PAGO
2. Relatório Completo de Despesas:
httpGET /api/dashboard/top-despesas?mes=12&ano=2025
3. Resumo Geral:
httpGET /api/dashboard/resumo
4. Exportar Dados (para contabilidade):

Gerar planilha com todas as receitas pagas
Gerar planilha com todas as despesas pagas
Calcular lucro líquido do mês


7. CASOS ESPECIAIS
7.1 - ALUNO DESISTIU ANTES DO VENCIMENTO
❌ Cenário: Aluno matriculado no dia 05, desiste no dia 08
1. Cancelar conta a receber:
httpPATCH /api/contas-receber/673conta123.../cancelar

{
  "motivo": "Aluno desistiu da matrícula - Data: 08/11/2025"
}
2. Se houve pagamento, registrar estorno no caixa:
httpPOST /api/caixas/673caixa123.../movimento

{
  "tipo": "SAIDA",
  "valor": 120.00,
  "descricao": "Estorno - Cancelamento matrícula Carlos Eduardo",
  "formaPagamento": "DINHEIRO",
  "categoria": "ESTORNO"
}

7.2 - PAGAMENTO PARCIAL
💰 Aluno paga apenas parte da mensalidade
Conta original: R$ 150,00
Primeiro pagamento (R$ 80,00):
httpPOST /api/contas-receber/673conta456.../pagar

{
  "valorPago": 80.00,
  "formaPagamento": "DINHEIRO",
  "caixaId": "673caixa123..."
}
Status: Conta fica PENDENTE com valorRestante: 70.00
Segundo pagamento (R$ 70,00):
httpPOST /api/contas-receber/673conta456.../pagar

{
  "valorPago": 70.00,
  "formaPagamento": "PIX",
  "caixaId": "673caixa123..."
}
Status: Conta muda para PAGO

7.3 - DESCONTO PÓS-VENCIMENTO (NEGOCIAÇÃO)
🤝 Aluno inadimplente negocia desconto
Conta original:

Valor: R$ 150,00
Vencimento: 10/10/2025
Status: VENCIDO
Dias de atraso: 30

Negociação: Academia oferece desconto de R$ 30 para pagamento imediato
1. Atualizar conta com desconto:
httpPUT /api/contas-receber/673conta789...

{
  "valorDesconto": 30.00
}
Sistema recalcula:

Valor Final: R$ 120,00

2. Registrar pagamento:
httpPOST /api/contas-receber/673conta789.../pagar

{
  "valorPago": 120.00,
  "formaPagamento": "PIX",
  "caixaId": "673caixa123..."
}

7.4 - TROCA DE PLANO
🔄 Aluno quer mudar de Mensal para Trimestral
1. Verificar conta atual:
httpGET /api/contas-receber?alunoId=673aluno123...&status=PENDENTE
2. Se houver conta pendente, cancelar:
httpPATCH /api/contas-receber/673contaAtual.../cancelar

{
  "motivo": "Troca de plano - De Mensal para Trimestral"
}
3. Criar nova conta com novo plano:
httpPOST /api/contas-receber

{
  "alunoId": "673aluno123...",
  "planoId": "673planoTrimestral...",
  "dataVencimento": "2025-11-15",
  "observacoes": "Troca de plano - Mensal → Trimestral"
}

7.5 - FUNCIONÁRIO DEMITIDO
👋 Demitir Funcionário
httpPATCH /api/funcionarios/673func123.../demitir

{
  "dataDemissao": "2025-11-30"
}
Importante: Não esquecer de gerar rescisão nas contas a pagar!
httpPOST /api/contas-pagar

{
  "categoria": "SALARIO",
  "funcionarioId": "673func123...",
  "descricao": "Rescisão - Pedro Santos",
  "valorOriginal": 3200.00,
  "dataVencimento": "2025-12-05",
  "observacoes": "Saldo salário + férias + 13º proporcional"
}

7.6 - ERRO NO LANÇAMENTO
⚠️ Registrou movimento errado no caixa
Remover movimento:
httpDELETE /api/caixas/673caixa123.../movimento/MOV1699876543210
Depois registrar correto:
httpPOST /api/caixas/673caixa123.../movimento

{
  "tipo": "ENTRADA",
  "valor": 150.00,
  "descricao": "Valor correto da mensalidade",
  "formaPagamento": "PIX"
}

7.7 - REATIVAR ALUNO INATIVO
🔄 Aluno que estava inativo volta
1. Buscar aluno:
httpGET /api/alunos?busca=11122233344
2. Atualizar situação:
httpPUT /api/alunos/673aluno123...

{
  "pessoa": {
    "situacao": "ATIVO"
  },
  "aluno": {
    "vldExameMedico": "2026-11-10",
    "vldAvaliacao": "2025-12-10"
  }
}
3. Gerar nova mensalidade:
httpPOST /api/contas-receber

{
  "alunoId": "673aluno123...",
  "planoId": "673plano123...",
  "dataVencimento": "2025-11-15",
  "observacoes": "Reativação - Retorno do aluno"
}

8. TROUBLESHOOTING
8.1 - PROBLEMAS COMUNS
❌ Erro: "Já existe um caixa aberto"
Causa: Caixa anterior não foi fechado.
Solução:
httpGET /api/caixas/aberto
Anote o ID e feche-o:
httpPOST /api/caixas/{id}/fechar

{
  "valorFechamento": 0,
  "usuarioFechamento": "Sistema",
  "observacoes": "Fechamento forçado - Caixa esquecido aberto"
}

❌ Erro: "Conta já está paga"
Causa: Tentativa de pagar conta duas vezes.
Solução:

Verificar status da conta:

httpGET /api/contas-receber/673conta123...

Se foi erro, cancelar e criar nova:

httpPATCH /api/contas-receber/673conta123.../cancelar

{
  "motivo": "Duplicidade - Criar nova conta"
}

❌ Erro: "Caixa não está aberto"
Causa: Tentativa de registrar movimento sem caixa aberto.
Solução:
httpPOST /api/caixas/abrir

{
  "valorAbertura": 200.00,
  "usuarioAbertura": "Seu Nome"
}

❌ Diferença no Fechamento de Caixa
Cenário:

Saldo Esperado: R$ 800,00
Dinheiro Contado: R$ 795,00
Diferença: -R$ 5,00 (FALTA)

Solução:

Verificar todas as transações do dia:

httpGET /api/caixas/673caixa123.../relatorio

Revisar movimentos em dinheiro:

Pode ter dado troco errado
Pode ter esquecido de lançar venda


Fechar com diferença documentada:

httpPOST /api/caixas/673caixa123.../fechar

{
  "valorFechamento": 795.00,
  "usuarioFechamento": "Maria",
  "observacoes": "FALTA R$ 5,00 - Possível erro de troco - Verificar câmeras"
}

❌ Aluno reclama que não consegue entrar (Senha)
Verificar senha de acesso:
httpPOST /api/alunos/673aluno123.../validar-senha

{
  "senha": "1234"
}
Se esqueceu a senha, alterar:
httpPUT /api/alunos/673aluno123...

{
  "aluno": {
    "controleAcesso": {
      "senha": "nova_senha"
    }
  }
}

8.2 - BACKUP E SEGURANÇA
💾 Rotina de Backup Diário
Recomendado:

Backup automático diário às 23:00
Guardar últimos 30 dias
Backup semanal arquivado

MongoDB Export:
bashmongodump --uri="mongodb://localhost:27017/jsflexweb" --out=/backup/$(date +%Y%m%d)

🔐 Logs de Auditoria
Criar campo de auditoria em operações críticas:

Quem criou a conta
Quem recebeu o pagamento
Quem fechou o caixa
IP de acesso


9. GLOSSÁRIO
TermoSignificadoMatrículaNúmero único do aluno (00001, 00002...)Código PessoaNúmero único da pessoa (0001, 0002...)CRConta a Receber (CR00001, CR00002...)CPConta a Pagar (CP00001, CP00002...)CXCaixa (CX00001, CX00002...)SangriaRetirada de dinheiro do caixaSuprimentoAdição de dinheiro ao caixaDay UseAcesso por 1 dia apenasInadimplenteAluno com pagamento atrasadoPeriodicidadeFrequência do plano (mensal, trimestral...)

10. ATALHOS E DICAS
⚡ Consultas Rápidas Diárias
bash# Ver caixa aberto
GET /api/caixas/aberto

# Ver resumo do dia
GET /api/dashboard/resumo

# Ver contas vencendo hoje
GET /api/dashboard/contas-vencer

# Ver inadimplentes
GET /api/dashboard/inadimplencia

📊 Consultas para Gerência
bash# Fluxo de caixa do mês
GET /api/dashboard/fluxo-caixa?dataInicio=2025-11-01&dataFim=2025-11-30

# Top despesas
GET /api/dashboard/top-despesas?mes=11&ano=2025

# Total de alunos ativos
GET /api/alunos?situacao=ATIVO&limit=1

# Total de funcionários
GET /api/funcionarios?situacao=ATIVO&limit=1

🎯 Metas e KPIs
Indicadores Importantes:

Taxa de Inadimplência:

Meta: < 5%
Calcular: (Inadimplentes / Total Alunos) × 100


Ticket Médio:

Meta: R$ 150,00
Calcular: Total Receitas / Número de Alunos


Taxa de Renovação:

Meta: > 85%
Acompanhar mensalmente


Lucro Líquido:

Meta: > 30% da receita
Calcular: (Receitas - Despesas) / Receitas × 100




11. CHECKLIST DIÁRIO
✅ MANHÃ (Abertura)

 Abrir caixa com valor correto
 Verificar contas vencendo hoje
 Conferir inadimplentes para contato
 Revisar agendamentos do dia

✅ TARDE (Operação)

 Processar matrículas
 Receber mensalidades
 Registrar vendas
 Pagar contas do dia

✅ NOITE (Fechamento)

 Gerar relatório do caixa
 Contar dinheiro físico
 Fechar caixa
 Fazer sangria se necessário
 Backup dos dados


12. SUPORTE E CONTATOS
📞 Em caso de dúvidas:
Suporte Técnico:

Email: suporte@jsflexweb.com
WhatsApp: (31) 99999-9999
Horário: Segunda a Sexta, 8h às 18h

Documentação:

API: https://api.jsflexweb.com/docs
Portal: https://portal.jsflexweb.com


📝 NOTAS FINAIS
Atualizações deste Guia

Versão 2.0 - Novembro 2025
Incluído módulo financeiro completo
Adicionados exemplos práticos
Casos especiais documentados

Próximas Implementações

 Notificações automáticas por WhatsApp
 Relatórios em PDF
 Dashboard web
 App mobile para check-in
 Integração com catracas


FIM DO GUIA
💪 Boa gestão e bons treinos!

📥 DOWNLOAD DESTE GUIA
Para salvar este guia:

Como Markdown (.md):

Copie todo o conteúdo
Cole em um arquivo guia-jsflexweb.md
Use editor Markdown (VS Code, Typora, etc)


Como PDF:

Use ferramentas online:

https://www.markdowntopdf.com
https://md2pdf.netlify.app


Ou use Typora (File → Export → PDF)


Como HTML:

Use Pandoc: pandoc guia.md -o guia.html
Ou copie em editor que suporte Markdown