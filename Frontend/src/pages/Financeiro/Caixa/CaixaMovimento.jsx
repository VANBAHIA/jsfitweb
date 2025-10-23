import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';

function CaixaMovimento({ tipo, onSalvar, onCancelar }) {
    const [formData, setFormData] = useState({
        tipo: tipo, // ENTRADA ou SAIDA
        valor: 0,
        descricao: '',
        formaPagamento: tipo === 'ENTRADA' ? 'DINHEIRO' : '',
        categoria: '',
        observacoes: ''
    });

    const isEntrada = tipo === 'ENTRADA';

    const formasPagamentoEntrada = [
        'DINHEIRO',
        'PIX',
        'CARTAO_DEBITO',
        'CARTAO_CREDITO',
        'BOLETO'
    ];

    const formasPagamentoSaida = [
        'DINHEIRO',
        'TRANSFERENCIA',
        'BOLETO',
        'CHEQUE'
    ];

    const categoriasEntrada = [
        'MENSALIDADE',
        'MATRICULA',
        'AVALIACAO',
        'PRODUTO',
        'SERVICO',
        'OUTROS'
    ];

    const categoriasSaida = [
        'SANGRIA',
        'FORNECEDOR',
        'SALARIO',
        'DESPESA',
        'OUTROS'
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        const dados = {
            ...formData,
            dataHora: new Date().toISOString()
        };

        onSalvar(dados);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4">
                <div className={`p-6 border-b flex items-center justify-between bg-gradient-to-r ${isEntrada ? 'from-green-600 to-green-700' : 'from-red-600 to-red-700'
                    }`}>
                    <div className="flex items-center gap-3">
                        {isEntrada ? (
                            <TrendingUp className="text-white" size={24} />
                        ) : (
                            <TrendingDown className="text-white" size={24} />
                        )}
                        <h3 className="text-2xl font-bold text-white">
                            {isEntrada ? 'Registrar Entrada' : 'Registrar Saída'}
                        </h3>
                    </div>
                    <button onClick={onCancelar} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className={`rounded-lg p-4 border-2 ${isEntrada ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                        }`}>
                        <p className={`text-sm ${isEntrada ? 'text-green-800' : 'text-red-800'}`}>
                            {isEntrada ? '⬆️' : '⬇️'} <strong>Tipo de Movimento:</strong> {isEntrada ? 'ENTRADA' : 'SAÍDA'}
                        </p>
                    </div>

                    {/* Valor */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Valor *
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-3 text-gray-500">R$</span>
                            <input
                                type="number"
                                required
                                step="0.01"
                                min="0.01"
                                value={formData.valor}
                                onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) || 0 })}
                                className={`w-full pl-12 pr-4 py-2 border-2 rounded-lg focus:ring-2 text-lg font-semibold ${isEntrada
                                        ? 'border-green-300 focus:ring-green-500 text-green-700'
                                        : 'border-red-300 focus:ring-red-500 text-red-700'
                                    }`}
                                placeholder="0,00"
                            />
                        </div>
                    </div>

                    {/* Descrição */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descrição *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.descricao}
                            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder={isEntrada ? 'Ex: Mensalidade João Silva' : 'Ex: Pagamento fornecedor'}
                        />
                    </div>

                    {/* Forma de Pagamento e Categoria */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Forma de Pagamento *
                            </label>
                            <select
                                required
                                value={formData.formaPagamento}
                                onChange={(e) => setFormData({ ...formData, formaPagamento: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Selecione...</option>
                                {(isEntrada ? formasPagamentoEntrada : formasPagamentoSaida).map(forma => (
                                    <option key={forma} value={forma}>
                                        {forma.replace('_', ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Categoria
                            </label>
                            <select
                                value={formData.categoria}
                                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Selecione...</option>
                                {(isEntrada ? categoriasEntrada : categoriasSaida).map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Observações */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Observações
                        </label>
                        <textarea
                            value={formData.observacoes}
                            onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Informações adicionais..."
                        />
                    </div>

                    {/* Resumo */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <h4 className="font-semibold text-gray-800 mb-2">📋 Resumo do Movimento</h4>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tipo:</span>
                            <span className={`font-semibold ${isEntrada ? 'text-green-600' : 'text-red-600'}`}>
                                {isEntrada ? '⬆️ ENTRADA' : '⬇️ SAÍDA'}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Valor:</span>
                            <span className={`font-bold text-lg ${isEntrada ? 'text-green-600' : 'text-red-600'}`}>
                                {isEntrada ? '+' : '-'} R$ {formData.valor.toFixed(2).replace('.', ',')}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Data/Hora:</span>
                            <span className="font-semibold">
                                {new Date().toLocaleString('pt-BR')}
                            </span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancelar}
                            className="flex-1 px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={`flex-1 px-6 py-2.5 text-white rounded-lg hover:opacity-90 font-semibold flex items-center justify-center gap-2 shadow-md ${isEntrada ? 'bg-green-600' : 'bg-red-600'
                                }`}
                        >
                            {isEntrada ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                            Confirmar {isEntrada ? 'Entrada' : 'Saída'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CaixaMovimento;