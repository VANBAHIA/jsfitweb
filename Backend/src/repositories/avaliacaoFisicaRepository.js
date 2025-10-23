// src/repositories/avaliacaoFisicaRepository.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AvaliacaoFisicaRepository {
  /**
   * Criar nova avaliação física
   */
  async criar(data) {
    return prisma.avaliacaoFisica.create({
      data,
    });
  }

  /**
   * Buscar última avaliação cadastrada (para gerar código sequencial)
   */
  async buscarUltimaCodigo(empresaId) {
    return prisma.avaliacaoFisica.findFirst({
      where: { empresaId },
      orderBy: { codigo: 'desc' },
      select: { codigo: true },
    });
  }

  /**
   * Buscar todas as avaliações com filtros opcionais
   */
  async buscarTodos(filtros = {}) {
    const { empresaId, alunoId } = filtros;

    return prisma.avaliacaoFisica.findMany({
      where: {
        empresaId,
        ...(alunoId && { alunoId }),
      },
      include: {
        aluno: {
          include: {
            pessoa: true,
          },
        },
      },
      orderBy: {
        dataAvaliacao: 'desc',
      },
    });
  }

  /**
   * Buscar avaliação por ID
   */
  async buscarPorId(id, empresaId) {
    return prisma.avaliacaoFisica.findFirst({
      where: { id, empresaId },
      include: {
        aluno: {
          include: {
            pessoa: true,
          },
        },
      },
    });
  }

  /**
   * Buscar avaliações de um aluno
   */
  async buscarPorAluno(alunoId, empresaId) {
    return prisma.avaliacaoFisica.findMany({
      where: { alunoId, empresaId },
      orderBy: { dataAvaliacao: 'desc' },
      include: {
        aluno: {
          include: {
            pessoa: true,
          },
        },
      },
    });
  }

  /**
   * Atualizar avaliação
   */
  async atualizar(id, data, empresaId) {
    return prisma.avaliacaoFisica.updateMany({
      where: { id, empresaId },
      data,
    });
  }

  /**
   * Deletar avaliação
   */
  async deletar(id, empresaId) {
    return prisma.avaliacaoFisica.deleteMany({
      where: { id, empresaId },
    });
  }

  /**
   * Buscar evolução do aluno (peso, imc, percentualGordura etc.)
   */
  async buscarEvolucao(alunoId, empresaId, parametros = ['peso', 'imc', 'percentualGordura']) {
    return prisma.avaliacaoFisica.findMany({
      where: { alunoId, empresaId },
      orderBy: { dataAvaliacao: 'asc' },
      select: {
        dataAvaliacao: true,
        ...parametros.reduce((acc, param) => {
          acc[param] = true;
          return acc;
        }, {}),
      },
    });
  }
}

module.exports = new AvaliacaoFisicaRepository();
