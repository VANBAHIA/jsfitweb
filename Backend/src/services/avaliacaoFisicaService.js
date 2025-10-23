// src/services/avaliacaoFisicaService.js
const avaliacaoFisicaRepository = require('../repositories/avaliacaoFisicaRepository');
const alunoRepository = require('../repositories/alunoRepository');
const ApiError = require('../utils/apiError');

class AvaliacaoFisicaService {
  /**
   * 🧮 Gera o próximo código sequencial (AV00001 → AV00002)
   */
  async gerarProximoCodigo(empresaId) {
    const ultima = await avaliacaoFisicaRepository.buscarUltimaCodigo(empresaId);
    if (!ultima || !ultima.codigo) return 'AV00001';

    const numero = parseInt(ultima.codigo.replace('AV', '')) + 1;
    return `AV${numero.toString().padStart(5, '0')}`;
  }

  /**
   * ⚖️ Calcula IMC (peso / altura²)
   */
  calcularIMC(peso, altura) {
    const alturaM = altura > 10 ? altura / 100 : altura;
    return +(peso / (alturaM * alturaM)).toFixed(2);
  }

  /**
   * 📊 Classificação IMC segundo OMS
   */
  classificarIMC(imc) {
    if (imc < 18.5) return 'ABAIXO_DO_PESO';
    if (imc < 25) return 'NORMAL';
    if (imc < 30) return 'SOBREPESO';
    if (imc < 35) return 'OBESIDADE_I';
    if (imc < 40) return 'OBESIDADE_II';
    return 'OBESIDADE_III';
  }

  /**
   * 💪 Calcula composição corporal
   */
  calcularComposicaoCorporal(peso, percentualGordura) {
    const massaGorda = +(peso * (percentualGordura / 100)).toFixed(2);
    const massaMagra = +(peso - massaGorda).toFixed(2);
    return { massaMagra, massaGorda };
  }

  /**
   * 🧠 Calcula peso ideal (IMC = 22)
   */
  calcularPesoIdeal(altura) {
    const alturaM = altura > 10 ? altura / 100 : altura;
    return +(22 * (alturaM * alturaM)).toFixed(2);
  }

  /**
   * 🆕 Criar nova avaliação física
   */
  async criar(dados, alunoId, empresaId) {
    if (!empresaId) throw new ApiError(400, 'empresaId é obrigatório');
    if (!alunoId) throw new ApiError(400, 'alunoId é obrigatório');

    const { peso, altura, dataAvaliacao } = dados;
    if (!peso || !altura || !dataAvaliacao)
      throw new ApiError(400, 'Peso, altura e dataAvaliacao são obrigatórios');

    const aluno = await alunoRepository.buscarPorId(alunoId, empresaId);
    if (!aluno) throw new ApiError(404, 'Aluno não encontrado');

    const codigo = await this.gerarProximoCodigo(empresaId);
    const imc = this.calcularIMC(peso, altura);
    const classificacaoIMC = this.classificarIMC(imc);
    const pesoIdeal = this.calcularPesoIdeal(altura);

    // Composição corporal (se houver percentual de gordura)
    let massaMagra = null, massaGorda = null;
    if (dados.percentualGordura) {
      const comp = this.calcularComposicaoCorporal(peso, dados.percentualGordura);
      massaMagra = comp.massaMagra;
      massaGorda = comp.massaGorda;
    }

    const novaAvaliacao = {
      ...dados,
      codigo,
      empresaId,
      alunoId,
      peso: +peso,
      altura: +altura,
      imc,
      classificacaoIMC,
      pesoIdeal,
      massaMagra,
      massaGorda,
      dataAvaliacao: new Date(dataAvaliacao),
      proximaAvaliacao: dados.proximaAvaliacao
        ? new Date(dados.proximaAvaliacao)
        : new Date(new Date(dataAvaliacao).setDate(new Date(dataAvaliacao).getDate() + 90)),
      status: 'ATIVA'
    };

    return avaliacaoFisicaRepository.criar(novaAvaliacao);
  }

  /**
   * 📋 Listar avaliações
   */
  async listarTodos(filtros) {
    if (!filtros.empresaId) throw new ApiError(400, 'empresaId é obrigatório');
    return avaliacaoFisicaRepository.buscarTodos(filtros);
  }

  /**
   * 🔍 Buscar avaliação por ID
   */
  async buscarPorId(id, empresaId) {
    if (!empresaId) throw new ApiError(400, 'empresaId é obrigatório');
    const avaliacao = await avaliacaoFisicaRepository.buscarPorId(id, empresaId);
    if (!avaliacao) throw new ApiError(404, 'Avaliação física não encontrada');
    return avaliacao;
  }

  /**
   * 🧾 Buscar histórico por aluno
   */
  async buscarPorAluno(alunoId, empresaId) {
    if (!empresaId) throw new ApiError(400, 'empresaId é obrigatório');
    return avaliacaoFisicaRepository.buscarPorAluno(alunoId, empresaId);
  }

  /**
   * ✏️ Atualizar avaliação
   */
  async atualizar(id, dados, empresaId) {
    if (!empresaId) throw new ApiError(400, 'empresaId é obrigatório');

    const existente = await avaliacaoFisicaRepository.buscarPorId(id, empresaId);
    if (!existente) throw new ApiError(404, 'Avaliação física não encontrada');

    const atualizacao = { ...dados };

    // Recalcular IMC e peso ideal se altura ou peso mudarem
    const peso = dados.peso ?? existente.peso;
    const altura = dados.altura ?? existente.altura;

    if (dados.peso || dados.altura) {
      atualizacao.imc = this.calcularIMC(peso, altura);
      atualizacao.classificacaoIMC = this.classificarIMC(atualizacao.imc);
      atualizacao.pesoIdeal = this.calcularPesoIdeal(altura);
    }

    return avaliacaoFisicaRepository.atualizar(id, atualizacao, empresaId);
  }

  /**
   * 🗑️ Deletar avaliação
   */
  async deletar(id, empresaId) {
    if (!empresaId) throw new ApiError(400, 'empresaId é obrigatório');

    const avaliacao = await avaliacaoFisicaRepository.buscarPorId(id, empresaId);
    if (!avaliacao) throw new ApiError(404, 'Avaliação física não encontrada');

    await avaliacaoFisicaRepository.deletar(id, empresaId);
    return { message: 'Avaliação física deletada com sucesso' };
  }

  /**
   * 📈 Buscar evolução do aluno
   */
  async buscarEvolucao(alunoId, empresaId, parametros = ['peso', 'imc', 'percentualGordura']) {
    if (!empresaId) throw new ApiError(400, 'empresaId é obrigatório');

    const aluno = await alunoRepository.buscarPorId(alunoId, empresaId);
    if (!aluno) throw new ApiError(404, 'Aluno não encontrado');

    const evolucao = await avaliacaoFisicaRepository.buscarEvolucao(alunoId, empresaId, parametros);
    return {
      aluno: {
        id: aluno.id,
        nome: aluno.pessoa.nome1 + (aluno.pessoa.nome2 ? ' ' + aluno.pessoa.nome2 : ''),
        matricula: aluno.matricula
      },
      totalAvaliacoes: evolucao.length,
      evolucao
    };
  }

  /**
   * ⚖️ Comparar duas avaliações
   */
  async compararAvaliacoes(avaliacaoAnteriorId, avaliacaoAtualId, empresaId) {
    if (!empresaId) throw new ApiError(400, 'empresaId é obrigatório');

    const anterior = await avaliacaoFisicaRepository.buscarPorId(avaliacaoAnteriorId, empresaId);
    const atual = await avaliacaoFisicaRepository.buscarPorId(avaliacaoAtualId, empresaId);
    if (!anterior || !atual) throw new ApiError(404, 'Avaliações não encontradas');

    return {
      aluno: anterior.aluno.pessoa.nome1,
      dataAnterior: anterior.dataAvaliacao,
      dataAtual: atual.dataAvaliacao,
      diferencas: {
        peso: +(atual.peso - anterior.peso).toFixed(2),
        imc: +(atual.imc - anterior.imc).toFixed(2),
        percentualGordura: anterior.percentualGordura && atual.percentualGordura
          ? +(atual.percentualGordura - anterior.percentualGordura).toFixed(2)
          : null,
        massaMagra: anterior.massaMagra && atual.massaMagra
          ? +(atual.massaMagra - anterior.massaMagra).toFixed(2)
          : null,
        massaGorda: anterior.massaGorda && atual.massaGorda
          ? +(atual.massaGorda - anterior.massaGorda).toFixed(2)
          : null,
      },
    };
  }
}

module.exports = new AvaliacaoFisicaService();
