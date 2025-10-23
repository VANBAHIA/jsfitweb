import React, { useState, useEffect } from 'react';
import { X, Save, Search } from 'lucide-react';
import { contasReceberService } from '../../../services/api/contasReceberService';
import { alunosService } from '../../../services/api/alunosService';
import { planosService } from '../../../services/api/planosService';
import { descontosService } from '../../../services/api/descontosService';

function ContaReceberForm({ conta, onSalvar, onCancelar }) {
  const [formData, setFormData] = useState({
    alunoId: '',
    planoId: '',
    descontoId: '',
    valorOriginal: 0,
    valorDesconto: 0,
    valorFinal: 0,
    dataVencimento: '',
    numeroParcela: 1,
    totalParcelas: 1,
    formaPagamento: '',
    observacoes: ''
  });

  const [alunos, setAlunos] = useState([]);
  const [planos, setPlanos] = useState([]);
  const [descontos, setDescontos] = useState([]);
  const [salvando, setSalvando] = useState(false);
  const [buscaAluno, setBuscaAluno] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    if (conta) {
      setFormData({
        alunoId: conta.alunoId || '',
        planoId: conta.planoId || '',
        descontoId: conta.descontoId || '',
        valorOriginal: conta.valorOriginal || 0,
        valorDesconto: conta.valorDesconto || 0,
        valorFinal: conta.valorFinal || 0,
        dataVencimento: conta.dataVencimento?.split('T')[0] || '',
        numeroParcela: conta.numeroParcela || 1,
        totalParcelas: conta.totalParcelas || 1,
        formaPagamento: conta.formaPagamento || '',
        observacoes: conta.observacoes || ''
      });
    }
  }, [conta]);


  const carregarDados = async () => {
    try {
      const [resAlunos, resPlanos, resDescontos] = await Promise.all([
        alunosService.listarTodos(),
        planosService.listarTodos(),
        descontosService.listarTodos()
      ]);

      setAlunos(resAlunos.data?.data || []);
      setPlanos(resPlanos.data?.data?.planos || []);
      setDescontos(resDescontos.data?.data?.descontos || []);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setAlunos([]);
      setPlanos([]);
      setDescontos([]);
    }
  };

  const handleChange = (campo, valor) => {
    setFormData(prev => {
      const novo = { ...prev, [campo]: valor };

      // Recalcular valor final
      if (campo === 'valorOriginal' || campo === 'valorDesconto') {
        novo.valorFinal = novo.valorOriginal - novo.valorDesconto;
      }

      // Se selecionou plano, preencher valor
      if (campo === 'planoId') {
        const planoSelecionado = planos.find(p => p.id === valor);
        if (planoSelecionado) {
          novo.valorOriginal = planoSelecionado.valorMensalidade;
          novo.valorFinal = planoSelecionado.valorMensalidade - novo.valorDesconto;
        }
      }

      // Se selecionou desconto, calcular
      if (campo === 'descontoId') {
        const descontoSelecionado = descontos.find(d => d.id === valor);
        if (descontoSelecionado) {
          if (descontoSelecionado.tipo === 'PERCENTUAL') {
            novo.valorDesconto = (novo.valorOriginal * descontoSelecionado.valor) / 100;
          } else {
            novo.valorDesconto = descontoSelecionado.valor;
          }
          novo.valorFinal = novo.valorOriginal - novo.valorDesconto;
        } else {
          novo.valorDesconto = 0;
          novo.valorFinal = novo.valorOriginal;
        }
      }

      return novo;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.alunoId) {
      alert('Selecione um aluno');
      return;
    }

    try {
      setSalvando(true);

      if (conta) {
        await contasReceberService.atualizar(conta.id, formData);
      } else {
        await contasReceberService.criar(formData);
      }

      onSalvar();
    } catch (error) {
      alert('Erro ao salvar: ' + (error.response?.data?.message || error.message));
    } finally {
      setSalvando(false);
    }
  };

  const alunosFiltrados = alunos.filter(aluno =>
    aluno.pessoa?.nome1?.toLowerCase().includes(buscaAluno.toLowerCase()) ||
    aluno.matricula?.includes(buscaAluno)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto py-8 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl mx-4">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-green-600 to-green-700">
          <h3 className="text-2xl font-bold text-white">
            {conta ? 'Editar Conta a Receber' : 'Nova Conta a Receber'}
          </h3>
          <button onClick={onCancelar} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Seleção de Aluno */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Aluno *</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                value={buscaAluno}
                onChange={(e) => setBuscaAluno(e.target.value)}
                placeholder="Buscar aluno..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 mb-2"
              />
            </div>
            <select
              required
              value={formData.alunoId}
              onChange={(e) => handleChange('alunoId', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">Selecione...</option>
              {alunosFiltrados.map(aluno => (
                <option key={aluno.id} value={aluno.id}>
                  {aluno.matricula} - {aluno.pessoa?.nome1}
                </option>
              ))}
            </select>
          </div>

          {/* Plano e Desconto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plano</label>
              <select
                value={formData.planoId}
                onChange={(e) => handleChange('planoId', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Selecione...</option>
                {planos.map(plano => (
                  <option key={plano.id} value={plano.id}>
                    {plano.nome} - R$ {plano.valorMensalidade}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Desconto</label>
              <select
                value={formData.descontoId}
                onChange={(e) => handleChange('descontoId', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Nenhum</option>
                {descontos
                  .filter(d => d.status === 'ATIVO')
                  .map(desconto => (
                    <option key={desconto.id} value={desconto.id}>
                      {desconto.descricao} - {desconto.tipo === 'PERCENTUAL' ? `${desconto.valor}%` : `R$ ${desconto.valor.toFixed(2)}`}
                    </option>
                  ))
                }
              </select>
            </div>
          </div>

          {/* Valores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valor Original *</label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.valorOriginal}
                onChange={(e) => handleChange('valorOriginal', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="0,00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Desconto</label>
              <input
                type="number"
                step="0.01"
                value={formData.valorDesconto}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700 mb-2 font-semibold">Valor Final *</label>
              <input
                type="number"
                step="0.01"
                value={formData.valorFinal}
                readOnly
                className="w-full px-4 py-2 border-2 border-green-500 rounded-lg bg-green-50 font-bold text-green-700"
              />
            </div>
          </div>

          {/* Data de Vencimento e Forma de Pagamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data de Vencimento *</label>
              <input
                type="date"
                required
                value={formData.dataVencimento}
                onChange={(e) => handleChange('dataVencimento', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Forma de Pagamento</label>
              <select
                value={formData.formaPagamento}
                onChange={(e) => handleChange('formaPagamento', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Selecione...</option>
                <option value="DINHEIRO">Dinheiro</option>
                <option value="PIX">PIX</option>
                <option value="CARTAO_CREDITO">Cartão de Crédito</option>
                <option value="CARTAO_DEBITO">Cartão de Débito</option>
                <option value="BOLETO">Boleto</option>
              </select>
            </div>
          </div>

          {/* Parcelamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Parcela Nº</label>
              <input
                type="number"
                min="1"
                value={formData.numeroParcela}
                onChange={(e) => handleChange('numeroParcela', parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total de Parcelas</label>
              <input
                type="number"
                min="1"
                value={formData.totalParcelas}
                onChange={(e) => handleChange('totalParcelas', parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => handleChange('observacoes', e.target.value)}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Informações adicionais..."
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancelar}
              className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2 shadow-md disabled:opacity-50"
            >
              <Save size={18} />
              {salvando ? 'Salvando...' : 'Salvar Conta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContaReceberForm;