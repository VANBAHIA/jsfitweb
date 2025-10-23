const bcrypt = require('bcryptjs');
const ApiError = require('../utils/apiError');
const prisma = require('../config/database');

class AlunoService {
  async criarComPessoa(dadosCompletos, empresaId) {
    const { pessoa, aluno } = dadosCompletos;
    if (!pessoa || !pessoa.nome1 || !pessoa.doc1) throw new ApiError(400, 'Dados da pessoa são obrigatórios');
    if (!aluno || !aluno.controleAcesso?.senha) throw new ApiError(400, 'Senha de controle de acesso é obrigatória');
    if (!empresaId) throw new ApiError(400, 'empresaId é obrigatório');

    try {
      // Verifica existência da pessoa
      let pessoaExistente = await prisma.pessoa.findFirst({ where: { doc1: pessoa.doc1, empresaId } });
      let pessoaId;

      if (pessoaExistente) {
        const alunoExistente = await prisma.aluno.findFirst({ where: { pessoaId: pessoaExistente.id, empresaId } });
        if (alunoExistente) throw new ApiError(400, 'Já existe um aluno com este CPF nesta empresa');

        pessoaExistente = await prisma.pessoa.update({
          where: { id: pessoaExistente.id },
          data: {
            nome1: pessoa.nome1, nome2: pessoa.nome2 || null, doc2: pessoa.doc2 || null,
            dtNsc: pessoa.dtNsc ? new Date(pessoa.dtNsc) : null,
            situacao: pessoa.situacao || pessoaExistente.situacao,
            enderecos: pessoa.enderecos || [], contatos: pessoa.contatos || []
          }
        });
        pessoaId = pessoaExistente.id;
      } else {
        const pessoaCriada = await prisma.pessoa.create({
          data: {
            empresaId, tipo: pessoa.tipo || 'FISICA', nome1: pessoa.nome1,
            nome2: pessoa.nome2 || null, doc1: pessoa.doc1, doc2: pessoa.doc2 || null,
            dtNsc: pessoa.dtNsc ? new Date(pessoa.dtNsc) : null, situacao: pessoa.situacao || 'ATIVO',
            enderecos: pessoa.enderecos || [], contatos: pessoa.contatos || []
          }
        });
        pessoaId = pessoaCriada.id;
      }

      const senhaHash = await bcrypt.hash(aluno.controleAcesso.senha, 10);
      const matricula = await this._gerarProximaMatricula(prisma, empresaId);

      const alunoCriado = await prisma.aluno.create({
        data: {
          empresaId, matricula, pessoaId,
          vldExameMedico: aluno.vldExameMedico ? new Date(aluno.vldExameMedico) : null,
          vldAvaliacao: aluno.vldAvaliacao ? new Date(aluno.vldAvaliacao) : null,
          objetivo: aluno.objetivo || null, profissao: aluno.profissao || null,
          empresa_nome: aluno.empresa_nome || null, responsavel: aluno.responsavel || null,
          horarios: aluno.horarios || [],
          controleAcesso: {
            senha: senhaHash,
            impressaoDigital1: aluno.controleAcesso.impressaoDigital1 || null,
            impressaoDigital2: aluno.controleAcesso.impressaoDigital2 || null
          }
        },
        include: { pessoa: true }
      });

      return alunoCriado;
    } catch (error) {
      console.error('❌ Erro ao criar aluno:', error);
      throw new ApiError(500, `Erro ao criar aluno: ${error.message}`);
    }
  }

  async _gerarProximaMatricula(prismaClient, empresaId) {
    const ultimo = await prismaClient.aluno.findFirst({
      where: { empresaId },
      orderBy: { matricula: 'desc' },
      select: { matricula: true }
    });
    const prox = ultimo ? parseInt(ultimo.matricula) + 1 : 1;
    return prox.toString().padStart(5, '0');
  }

  async listarTodos(filtros = {}) {
    const { situacao, page = 1, limit = 10, busca, empresaId } = filtros;
    if (!empresaId) throw new ApiError(400, 'empresaId é obrigatório');
    const skip = (Number(page) - 1) * Number(limit);
    const where = { empresaId };
    if (situacao) where.pessoa = { situacao };
    if (busca)
      where.pessoa = {
        ...where.pessoa,
        OR: [
          { nome1: { contains: busca, mode: 'insensitive' } },
          { nome2: { contains: busca, mode: 'insensitive' } },
          { doc1: { contains: busca } }
        ]
      };

    const [alunos, total] = await Promise.all([
      prisma.aluno.findMany({
        where,
        include: { pessoa: true },
        skip, take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.aluno.count({ where })
    ]);
    return { data: alunos, pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) } };
  }

  async buscarPorId(id, empresaId) {
    if (!empresaId) throw new ApiError(400, 'empresaId é obrigatório');
    const aluno = await prisma.aluno.findUnique({
      where: { id },
      include: {
        pessoa: true,
        avaliacoesFisicas: {
          orderBy: { dataAvaliacao: 'desc' },
          select: {
            id: true, peso: true, altura: true, imc: true, percentualGordura: true,
            massaMagra: true, massaGorda: true,
            torax: true, cintura: true, abdomen: true, quadril: true,
            bracoDireito: true, bracoEsquerdo: true,
            antebracoDireito: true, antebracoEsquerdo: true,
            coxaDireita: true, coxaEsquerda: true,
            panturrilhaDireita: true, panturrilhaEsquerda: true,
            observacoes: true, dataAvaliacao: true
          }
        }
      }
    });
    if (!aluno) throw new ApiError(404, 'Aluno não encontrado');
    if (aluno.empresaId !== empresaId) throw new ApiError(403, 'Acesso negado');
    return aluno;
  }

  async atualizarComPessoa(id, dadosCompletos, empresaId) {
    const { pessoa, aluno } = dadosCompletos;
    if (!empresaId) throw new ApiError(400, 'empresaId é obrigatório');

    const alunoExistente = await prisma.aluno.findUnique({ where: { id }, select: { pessoaId: true, empresaId: true } });
    if (!alunoExistente) throw new ApiError(404, 'Aluno não encontrado');
    if (alunoExistente.empresaId !== empresaId) throw new ApiError(403, 'Acesso negado');

    return await prisma.$transaction(async (tx) => {
      if (pessoa) {
        await tx.pessoa.update({
          where: { id: alunoExistente.pessoaId },
          data: {
            nome1: pessoa.nome1,
            nome2: pessoa.nome2 || null,
            doc1: pessoa.doc1,
            doc2: pessoa.doc2 || null,
            situacao: pessoa.situacao || 'ATIVO',
            dtNsc: pessoa.dtNsc ? new Date(pessoa.dtNsc) : null,
            enderecos: pessoa.enderecos || [],
            contatos: pessoa.contatos || []
          }
        });
      }

      if (aluno) {
        const dadosAluno = {
          vldExameMedico: aluno.vldExameMedico ? new Date(aluno.vldExameMedico) : undefined,
          vldAvaliacao: aluno.vldAvaliacao ? new Date(aluno.vldAvaliacao) : undefined,
          objetivo: aluno.objetivo,
          profissao: aluno.profissao,
          empresa_nome: aluno.empresa_nome,
          responsavel: aluno.responsavel,
          horarios: aluno.horarios
        };
        if (aluno.controleAcesso?.senha)
          dadosAluno.controleAcesso = {
            senha: await bcrypt.hash(aluno.controleAcesso.senha, 10),
            impressaoDigital1: aluno.controleAcesso.impressaoDigital1 || null,
            impressaoDigital2: aluno.controleAcesso.impressaoDigital2 || null
          };

        await tx.aluno.update({ where: { id }, data: dadosAluno });
      }

      return await tx.aluno.findUnique({ where: { id }, include: { pessoa: true, avaliacoesFisicas: true } });
    });
  }

  async deletar(id, empresaId) {
    if (!empresaId) throw new ApiError(400, 'empresaId é obrigatório');
    const aluno = await prisma.aluno.findUnique({ where: { id }, select: { empresaId: true } });
    if (!aluno) throw new ApiError(404, 'Aluno não encontrado');
    if (aluno.empresaId !== empresaId) throw new ApiError(403, 'Acesso negado');
    await prisma.aluno.delete({ where: { id } });
    return { message: 'Aluno deletado com sucesso' };
  }

  async adicionarHorario(id, horario, empresaId) {
    const { local, diasSemana, horarioEntrada, horarioSaida } = horario;
    if (!empresaId) throw new ApiError(400, 'empresaId é obrigatório');
    if (!local || !diasSemana || !horarioEntrada || !horarioSaida)
      throw new ApiError(400, 'Todos os campos do horário são obrigatórios');

    const aluno = await prisma.aluno.findUnique({ where: { id }, select: { empresaId: true } });
    if (!aluno) throw new ApiError(404, 'Aluno não encontrado');
    if (aluno.empresaId !== empresaId) throw new ApiError(403, 'Acesso negado');

    return await prisma.aluno.update({
      where: { id },
      data: { horarios: { push: { local, diasSemana, horarioEntrada, horarioSaida } } },
      include: { pessoa: true }
    });
  }

  async validarSenha(id, senha, empresaId) {
    if (!empresaId) throw new ApiError(400, 'empresaId é obrigatório');
    const aluno = await prisma.aluno.findUnique({
      where: { id },
      select: { empresaId: true, controleAcesso: true }
    });
    if (!aluno) throw new ApiError(404, 'Aluno não encontrado');
    if (aluno.empresaId !== empresaId) throw new ApiError(403, 'Acesso negado');
    const valido = await bcrypt.compare(senha, aluno.controleAcesso.senha);
    if (!valido) throw new ApiError(401, 'Senha inválida');
    return { valido: true };
  }
}

module.exports = new AlunoService();
