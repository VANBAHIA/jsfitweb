const prisma = require('../config/database');

class AlunoRepository {
  async criar(data) {
    return prisma.aluno.create({
      data,
      include: { pessoa: true, avaliacoesFisicas: true }
    });
  }

  async buscarTodos(filtros = {}) {
    const { skip = 0, take = 10 } = filtros;
    const [total, alunos] = await Promise.all([
      prisma.aluno.count(),
      prisma.aluno.findMany({
        skip: Number(skip),
        take: Number(take),
        include: {
          pessoa: { select: { nome1: true, doc1: true, contatos: true, situacao: true } },
          avaliacoesFisicas: true
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);
    return { total, alunos };
  }

  async buscarPorId(id) {
    return prisma.aluno.findUnique({
      where: { id },
      include: { pessoa: true, avaliacoesFisicas: true }
    });
  }

  async buscarPorPessoaId(pessoaId) {
    return prisma.aluno.findFirst({
      where: { pessoaId },
      include: { pessoa: true, avaliacoesFisicas: true }
    });
  }

  async atualizar(id, data) {
    return prisma.aluno.update({
      where: { id },
      data,
      include: { pessoa: true, avaliacoesFisicas: true }
    });
  }

  async deletar(id) {
    return prisma.aluno.delete({ where: { id } });
  }
}

module.exports = new AlunoRepository();
