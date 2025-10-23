import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { contasPagarService } from '../../../services/api/contasPagarService';

function ContaPagarForm({ conta, onSalvar, onCancelar }) {
  const [formData, setFormData] = useState({
    categoria: 'FORNECEDOR',
    fornecedorNome: '',
    fornecedorDoc: '',
    descricao: '',
    valorOriginal: 0,
    valorDesconto: 0,
    valorJuros: 0,
    valorMulta: 0,
    valorFinal: 0,
    dataVencimento: '',
    formaPagamento: '',
    documento: '',
    numeroParcela: 1,
    totalParcelas: 1,
    observacoes: ''
  });

  const [salvando, setSalvando] = useState(false);
  const [modoParcelado, setModoParcelado] = useState(false);

  const categorias = [
    { value: 'FORNECEDOR', label: '🏪 Fornecedor', icon: '🏪' },
    { value: 'SALARIO', label: '💰 Salário', icon: '💰' },
    { value: 'ALUGUEL', label: '🏠 Aluguel', icon: '🏠' },
    { value: 'ENERGIA', label: '💡 Energia', icon: '💡' },
    { value: 'AGUA', label: '💧 Água', icon: '💧' },
    { value: 'TELEFONE', label: '📞 Telefone', icon: '📞' },
    { value: 'INTERNET', label: '🌐 Internet', icon: '🌐' },
    { value: 'EQUIPAMENTO', label: '🔧 Equipamento', icon: '🔧' },
    { value: 'MANUTENCAO', label: '🛠️ Manutenção', icon: '🛠️' },
    { value: 'OUTROS', label: '📋 Outros', icon: '📋' }
  ];

  useEffect(() => {
    if (conta) {
      setFormData({
        categoria: conta.categoria || 'FORNECEDOR',
        fornecedorNome: conta.fornecedorNome || '',
        fornecedorDoc: conta.fornecedorDoc || '',
        descricao: conta.descricao || '',
        valorOriginal: conta.valorOriginal || 0,
        valorDesconto: conta.valorDesconto || 0,
        valorJuros: conta.valorJuros || 0,
        valorMulta: conta.valorMulta || 0,
        valorFinal: conta.valorFinal || 0,
        dataVencimento: conta.dataVencimento?.split('T')[0] || '',
        formaPagamento: conta.formaPagamento || '',
        documento: conta.documento || '',
        numeroParcela: conta.numeroParcela || 1,
        totalParcelas: conta.totalParcelas || 1,
        observacoes: conta.observacoes || ''
      });
    }
  }, [conta]);

  const handleChange = (campo, valor) => {
    setFormData(prev => {
      const novo = { ...prev, [campo]: valor };

      // Recalcular valor final
      if (['valorOriginal', 'valorDesconto', 'valorJuros', 'valorMulta'].includes(campo)) {
        novo.valorFinal = novo.valorOriginal - novo.valorDesconto + novo.valorJuros + novo.valorMulta;
      }

      return novo;
    });
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.descricao) {
        alert('Preencha a descrição da conta');
        return;
    }

    try {
        setSalvando(true);
        
        // ✅ Converter data para ISO-8601 completo
        const dataVencimentoISO = new Date(formData.dataVencimento + 'T12:00:00.000Z').toISOString();
        
        // ✅ Preparar dados LIMPOS
        const dadosEnvio = {
            categoria: formData.categoria,
            descricao: formData.descricao,
            valorOriginal: Number(formData.valorOriginal),
            valorDesconto: Number(formData.valorDesconto) || 0,
            valorJuros: Number(formData.valorJuros) || 0,
            valorMulta: Number(formData.valorMulta) || 0,
            dataVencimento: dataVencimentoISO,
        };

        // Adicionar campos opcionais apenas se preenchidos
        if (formData.documento) dadosEnvio.documento = formData.documento;
        if (formData.observacoes) dadosEnvio.observacoes = formData.observacoes;
        
        // FormaPagamento: APENAS se estiver CRIANDO (não editando)
        if (!conta && formData.formaPagamento) {
            dadosEnvio.formaPagamento = formData.formaPagamento;
        }
        
        // Campos de fornecedor (APENAS se categoria for FORNECEDOR)
        if (dadosEnvio.categoria === 'FORNECEDOR') {
            if (formData.fornecedorNome) dadosEnvio.fornecedorNome = formData.fornecedorNome;
            if (formData.fornecedorDoc) dadosEnvio.fornecedorDoc = formData.fornecedorDoc;
        }
        
        console.log('📤 Dados LIMPOS que serão enviados:', dadosEnvio);
        console.log('📅 Data convertida:', formData.dataVencimento, '→', dataVencimentoISO);
        
        if (conta) {
            // =============== EDITANDO ===============
            console.log('🔄 ATUALIZANDO conta:', conta.id);
            const resultado = await contasPagarService.atualizar(conta.id, dadosEnvio);
            console.log('✅ Resultado atualização:', resultado);
        } else {
            // =============== CRIANDO ===============
            if (modoParcelado && formData.totalParcelas > 1) {
                // 📊 CRIAR PARCELADO
                console.log('📊 CRIANDO PARCELADO com', formData.totalParcelas, 'parcelas');
                
                const dadosParcelado = {
                    categoria: dadosEnvio.categoria,
                    descricao: dadosEnvio.descricao,
                    valorTotal: dadosEnvio.valorOriginal, // ✅ Backend espera "valorTotal"
                    totalParcelas: Number(formData.totalParcelas),
                    dataVencimentoPrimeira: dataVencimentoISO, // ✅ Backend espera "dataVencimentoPrimeira"
                    documento: dadosEnvio.documento,
                    observacoes: dadosEnvio.observacoes,
                };
                
                // Adicionar campos de fornecedor se categoria for FORNECEDOR
                if (dadosEnvio.categoria === 'FORNECEDOR') {
                    dadosParcelado.fornecedorNome = dadosEnvio.fornecedorNome;
                    dadosParcelado.fornecedorDoc = dadosEnvio.fornecedorDoc;
                }
                
                console.log('📊 Dados parcelado:', dadosParcelado);
                const resultado = await contasPagarService.criarParcelado(dadosParcelado);
                console.log('✅ Resultado parcelado:', resultado);
            } else {
                // ➕ CRIAR SIMPLES
                console.log('➕ CRIANDO conta simples');
                dadosEnvio.numeroParcela = 1;
                dadosEnvio.totalParcelas = 1;
                const resultado = await contasPagarService.criar(dadosEnvio);
                console.log('✅ Resultado criação:', resultado);
            }
        }
        
        alert('Conta salva com sucesso!');
        onSalvar();
    } catch (error) {
        console.error('❌ ERRO COMPLETO:', error);
        console.error('❌ Resposta do servidor:', error.response?.data);
        console.error('❌ Status:', error.response?.status);
        
        // Tentar extrair mensagem de erro mais específica
        let mensagemErro = 'Erro desconhecido';
        
        if (error.response?.data) {
            const resposta = error.response.data;
            mensagemErro = resposta.message 
                || resposta.error 
                || resposta.details 
                || JSON.stringify(resposta);
        } else {
            mensagemErro = error.message;
        }
            
        alert('Erro ao salvar conta:\n' + mensagemErro + '\n\nVerifique o console para mais detalhes.');
    } finally {
        setSalvando(false);
    }
};
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto py-8 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl mx-4">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-red-600 to-red-700">
          <h3 className="text-2xl font-bold text-white">
            {conta ? 'Editar Conta a Pagar' : 'Nova Conta a Pagar'}
          </h3>
          <button onClick={onCancelar} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
            <select
              required
              value={formData.categoria}
              onChange={(e) => handleChange('categoria', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              {categorias.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Fornecedor (se categoria for FORNECEDOR) */}
          {formData.categoria === 'FORNECEDOR' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Fornecedor</label>
                <input
                  type="text"
                  value={formData.fornecedorNome}
                  onChange={(e) => handleChange('fornecedorNome', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="Razão social ou nome"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ/CPF</label>
                <input
                  type="text"
                  value={formData.fornecedorDoc}
                  onChange={(e) => handleChange('fornecedorDoc', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="00.000.000/0000-00"
                />
              </div>
            </div>
          )}

          {/* Descrição e Documento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrição *</label>
              <input
                type="text"
                required
                value={formData.descricao}
                onChange={(e) => handleChange('descricao', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                placeholder="Ex: Conta de luz janeiro/2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nº Documento/NF</label>
              <input
                type="text"
                value={formData.documento}
                onChange={(e) => handleChange('documento', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                placeholder="Número da nota fiscal"
              />
            </div>
          </div>

          {/* Valores */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valor Original *</label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.valorOriginal}
                onChange={(e) => handleChange('valorOriginal', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Desconto</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.valorDesconto}
                onChange={(e) => handleChange('valorDesconto', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Juros</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.valorJuros}
                onChange={(e) => handleChange('valorJuros', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Multa</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.valorMulta}
                onChange={(e) => handleChange('valorMulta', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Valor Final */}
          <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-red-700">Valor Final:</span>
              <span className="text-2xl font-bold text-red-700">
                R$ {formData.valorFinal.toFixed(2).replace('.', ',')}
              </span>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Forma de Pagamento</label>
              <select
                value={formData.formaPagamento}
                onChange={(e) => handleChange('formaPagamento', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="">Selecione...</option>
                <option value="DINHEIRO">Dinheiro</option>
                <option value="TRANSFERENCIA">Transferência</option>
                <option value="BOLETO">Boleto</option>
                <option value="CHEQUE">Cheque</option>
                <option value="CARTAO">Cartão</option>
              </select>
            </div>
          </div>

          {/* Parcelamento */}
          {!conta && (
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <label className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={modoParcelado}
                  onChange={(e) => setModoParcelado(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded focus:ring-2 focus:ring-red-500"
                />
                <span className="font-semibold text-gray-700">Criar conta parcelada</span>
              </label>

              {modoParcelado && (
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Número de Parcelas *</label>
                    <input
                      type="number"
                      min="2"
                      value={formData.totalParcelas}
                      onChange={(e) => handleChange('totalParcelas', parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="text-sm text-gray-600 p-2 bg-white rounded border">
                      Valor por parcela: <strong>R$ {(formData.valorFinal / formData.totalParcelas).toFixed(2).replace('.', ',')}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => handleChange('observacoes', e.target.value)}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="Informações adicionais sobre a conta..."
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
              className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center gap-2 shadow-md disabled:opacity-50"
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

export default ContaPagarForm;