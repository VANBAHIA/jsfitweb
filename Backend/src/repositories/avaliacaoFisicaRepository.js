// src/repositories/avaliacaoFisicaRepository.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AvaliacaoFisicaRepository {
  /**
   * Criar nova avaliação física
   */
  async criar(data) {
    return prisma.avaliacaoFisica.create({ data });
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
        aluno: { include: { pessoa: true } },
      },
      orderBy: { dataAvaliacao: 'desc' },
    });
  }

  /**
   * Buscar avaliação por ID
   */
  async buscarPorId(id, empresaId) {
    return prisma.avaliacaoFisica.findFirst({
      where: { id, empresaId },
      include: {
        aluno: { include: { pessoa: true } },
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
        aluno: { include: { pessoa: true } },
      },
    });
  }

  /**
   * Atualizar avaliação
   */
  async atualizar(id, data, empresaId) {
    if (!empresaId) throw new Error('empresaId é obrigatório');
    if (!id) throw new Error('id é obrigatório');

    // Remove campos que não devem ser atualizados
    const { id: _, empresaId: __, ...dadosLimpos } = data;

    // 🧠 Tratamento da data da avaliação
    let dataAvaliacao = dadosLimpos.dataAvaliacao;
    if (!dataAvaliacao) {
      dataAvaliacao = new Date();
    } else if (typeof dataAvaliacao === 'string') {
      dataAvaliacao = new Date(dataAvaliacao);
    }

    // Garante que a data é válida
    if (isNaN(dataAvaliacao)) {
      throw new Error('dataAvaliacao inválida');
    }

    // 🗓️ Define proximaAvaliacao (+90 dias, se não vier informada)
    let proximaAvaliacao = dadosLimpos.proximaAvaliacao
      ? new Date(dadosLimpos.proximaAvaliacao)
      : new Date(new Date(dataAvaliacao).setDate(dataAvaliacao.getDate() + 90));

    // Garante que a próxima avaliação também seja válida
    if (isNaN(proximaAvaliacao)) {
      proximaAvaliacao = new Date(dataAvaliacao.getTime() + 90 * 24 * 60 * 60 * 1000);
    }

    return prisma.avaliacaoFisica.update({
      where: { id },
      data: {
        ...dadosLimpos,
        dataAvaliacao,
        proximaAvaliacao,
        empresaId,
        updatedAt: new Date(),
      },
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
   * Buscar evolução do aluno
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
