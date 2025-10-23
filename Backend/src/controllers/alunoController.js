const alunoService = require('../services/alunoService');
const avaliacaoFisicaService = require('../services/avaliacaoFisicaService');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

class AlunoController {
  // Criar aluno + pessoa + avaliações físicas
  async criarComPessoa(req, res) {
    const dadosCompletos = req.body;
    const empresaId = req.empresaId;

    try {
      if (!dadosCompletos.pessoa || !dadosCompletos.aluno)
        throw new ApiError(400, 'Dados da pessoa e do aluno são obrigatórios');
      if (!empresaId)
        throw new ApiError(401, 'Usuário não autenticado ou empresaId ausente');

      const aluno = await alunoService.criarComPessoa(dadosCompletos, empresaId);

      // ✅ Criação múltipla de avaliações físicas
      if (Array.isArray(dadosCompletos.avaliacoesFisicas) && dadosCompletos.avaliacoesFisicas.length > 0) {
        for (const avaliacao of dadosCompletos.avaliacoesFisicas) {
          const payload = { ...avaliacao, alunoId: aluno.id, empresaId };
          await avaliacaoFisicaService.criar(payload, aluno.id, empresaId);
        }
        console.log(`✅ ${dadosCompletos.avaliacoesFisicas.length} avaliações criadas`);
      }

      return res.status(201).json(new ApiResponse(201, aluno, 'Aluno criado com sucesso'));
    } catch (error) {
      console.error('❌ Erro em criarComPessoa:', error.stack || error);
      return res.status(error.statusCode || 500)
        .json(new ApiResponse(error.statusCode || 500, null, error.message));
    }
  }

  // Atualizar aluno + pessoa + avaliações físicas
  async atualizarComPessoa(req, res) {
    const dadosCompletos = req.body;
    const empresaId = req.empresaId;
    const { id } = req.params;

    try {
      const alunoAtualizado = await alunoService.atualizarComPessoa(id, dadosCompletos, empresaId);
      const alunoId = alunoAtualizado?.id || id;

      if (!alunoId) throw new ApiError(500, 'alunoId ausente após atualização');

      // ✅ Atualização múltipla de avaliações
      if (Array.isArray(dadosCompletos.avaliacoesFisicas)) {
        for (const avaliacao of dadosCompletos.avaliacoesFisicas) {
          const payload = { ...avaliacao, alunoId, empresaId };
          if (payload.id)
            await avaliacaoFisicaService.atualizar(payload.id, payload, empresaId);
          else
            await avaliacaoFisicaService.criar(payload, alunoId, empresaId);
        }
      }

      return res.status(200).json(new ApiResponse(200, alunoAtualizado, 'Aluno atualizado com sucesso'));
    } catch (error) {
      console.error('❌ Erro em atualizarComPessoa:', error.stack || error);
      return res.status(error.statusCode || 500)
        .json(new ApiResponse(error.statusCode || 500, null, error.message));
    }
  }

  async listarTodos(req, res) {
    const { situacao, page, limit, busca } = req.query;
    const empresaId = req.empresaId;
    const resultado = await alunoService.listarTodos({ situacao, page, limit, busca, empresaId });
    res.status(200).json(new ApiResponse(200, resultado, 'Alunos listados com sucesso'));
  }

  async buscarPorId(req, res) {
    const { id } = req.params;
    const empresaId = req.empresaId;
    const aluno = await alunoService.buscarPorId(id, empresaId);
    res.status(200).json(new ApiResponse(200, aluno, 'Aluno encontrado'));
  }

  async deletar(req, res) {
    const { id } = req.params;
    const empresaId = req.empresaId;
    await alunoService.deletar(id, empresaId);
    res.status(200).json(new ApiResponse(200, null, 'Aluno deletado com sucesso'));
  }

  async adicionarHorario(req, res) {
    const { id } = req.params;
    const horario = req.body;
    const empresaId = req.empresaId;
    const aluno = await alunoService.adicionarHorario(id, horario, empresaId);
    res.status(200).json(new ApiResponse(200, aluno, 'Horário adicionado com sucesso'));
  }

  async validarSenha(req, res) {
    const { id } = req.params;
    const { senha } = req.body;
    const empresaId = req.empresaId;
    if (!senha) throw new ApiError(400, 'Senha é obrigatória');
    const resultado = await alunoService.validarSenha(id, senha, empresaId);
    res.status(200).json(new ApiResponse(200, resultado, 'Senha validada com sucesso'));
  }
}

module.exports = new AlunoController();
