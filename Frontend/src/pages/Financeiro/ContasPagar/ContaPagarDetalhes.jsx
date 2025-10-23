import React, { useState } from 'react';
import { X, DollarSign, Calendar, FileText, AlertCircle } from 'lucide-react';

function ContaPagarDetalhes({ conta, onRegistrarPagamento, onFechar }) {
    const [mostrarFormPagamento, setMostrarFormPagamento] = useState(false);
    const [dadosPagamento, setDadosPagamento] = useState({
        valorPago: conta.valorRestante,
        dataPagamento: new Date().toISOString().split('T')[0],
        formaPagamento: '',
        observacoes: ''
    });

    const formatarMoeda = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    const formatarData = (data) => {
        return new Date(data).toLocaleDateString('pt-BR');
    };

    const handleSubmitPagamento = (e) => {
        e.preventDefault();
        onRegistrarPagamento(conta.id, dadosPagamento);
    };

    const getCategoriaIcon = (categoria) => {
        const icons = {
            FORNECEDOR: '🏪',
            SALARIO: '💰',
            ALUGUEL: '🏠',
            ENERGIA: '💡',
            AGUA: '💧',
            TELEFONE: '📞',
            INTERNET: '🌐',
            EQUIPAMENTO: '🔧',
            MANUTENCAO: '🛠️',
            OUTROS: '📋'
        };
        return icons[categoria] || '📋';
    };

    const getStatusColor = (status) => {
        const colors = {
            PENDENTE: 'yellow',
            PAGO: 'green',
            VENCIDO: 'red',
            CANCELADO: 'gray'
        };
        return colors[status] || 'gray';
    };

    const statusColor = getStatusColor(conta.status);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto py-8 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl mx-4">
                {/* Header */}
                <div className={`p-6 border-b flex items-center justify-between bg-gradient-to-r from-${statusColor}-600 to-${statusColor}-700`}>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                            <FileText className="text-white" size={28} />
                        </div>
                        <div className="text-white">
                            <h3 className="text-2xl font-bold">Conta a Pagar #{conta.numero}</h3>
                            <p className="text-sm opacity-90">Detalhes e pagamento</p>
                        </div>
                    </div>
                    <button onClick={onFechar} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Informações Principais */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Coluna 1 */}
                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-gray-600 mb-3">
                                    {getCategoriaIcon(conta.categoria)} DADOS DA CONTA
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Número:</span>
                                        <span className="font-semibold">{conta.numero}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Categoria:</span>
                                        <span className="font-semibold">{getCategoriaIcon(conta.categoria)} {conta.categoria}</span>
                                    </div>
                                    {conta.fornecedorNome && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Fornecedor:</span>
                                            <span className="font-semibold">{conta.fornecedorNome}</span>
                                        </div>
                                    )}
                                    {conta.fornecedorDoc && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">CNPJ/CPF:</span>
                                            <span className="font-semibold">{conta.fornecedorDoc}</span>
                                        </div>
                                    )}
                                    {conta.documento && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Documento:</span>
                                            <span className="font-semibold">{conta.documento}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Status:</span>
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-${statusColor}-100 text-${statusColor}-800`}>
                                            {conta.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-blue-600 mb-3">📅 DATAS</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Emissão:</span>
                                        <span className="font-semibold">{formatarData(conta.dataEmissao)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Vencimento:</span>
                                        <span className="font-semibold">{formatarData(conta.dataVencimento)}</span>
                                    </div>
                                    {conta.dataPagamento && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Pagamento:</span>
                                            <span className="font-semibold text-green-600">{formatarData(conta.dataPagamento)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Coluna 2 */}
                        <div className="space-y-4">
                            <div className="bg-red-50 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-red-600 mb-3">💰 VALORES</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Valor Original:</span>
                                        <span className="font-bold text-lg">{formatarMoeda(conta.valorOriginal)}</span>
                                    </div>
                                    {conta.valorDesconto > 0 && (
                                        <div className="flex justify-between items-center text-green-600">
                                            <span>Desconto:</span>
                                            <span className="font-semibold">- {formatarMoeda(conta.valorDesconto)}</span>
                                        </div>
                                    )}
                                    {conta.valorJuros > 0 && (
                                        <div className="flex justify-between items-center text-orange-600">
                                            <span>Juros:</span>
                                            <span className="font-semibold">+ {formatarMoeda(conta.valorJuros)}</span>
                                        </div>
                                    )}
                                    {conta.valorMulta > 0 && (
                                        <div className="flex justify-between items-center text-red-600">
                                            <span>Multa:</span>
                                            <span className="font-semibold">+ {formatarMoeda(conta.valorMulta)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center pt-2 border-t border-red-200">
                                        <span className="font-semibold">Valor Final:</span>
                                        <span className="font-bold text-xl text-red-700">{formatarMoeda(conta.valorFinal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-green-600">
                                        <span>Valor Pago:</span>
                                        <span className="font-semibold">{formatarMoeda(conta.valorPago)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-yellow-600">
                                        <span>Valor Restante:</span>
                                        <span className="font-bold text-lg">{formatarMoeda(conta.valorRestante)}</span>
                                    </div>
                                </div>
                            </div>

                            {conta.formaPagamento && (
                                <div className="bg-purple-50 rounded-lg p-4">
                                    <h4 className="text-sm font-semibold text-purple-600 mb-3">💳 FORMA DE PAGAMENTO</h4>
                                    <p className="font-semibold">{conta.formaPagamento.replace('_', ' ')}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Descrição */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-600 mb-2">📋 DESCRIÇÃO</h4>
                        <p className="text-gray-700">{conta.descricao}</p>
                    </div>

                    {/* Parcelamento */}
                    {conta.totalParcelas > 1 && (
                        <div className="bg-orange-50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-orange-600 mb-2">📊 PARCELAMENTO</h4>
                            <p className="text-gray-700">
                                Parcela <span className="font-bold">{conta.numeroParcela}</span> de <span className="font-bold">{conta.totalParcelas}</span>
                            </p>
                        </div>
                    )}

                    {/* Observações */}
                    {conta.observacoes && (
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-600 mb-2">📝 OBSERVAÇÕES</h4>
                            <p className="text-gray-700">{conta.observacoes}</p>
                        </div>
                    )}

                    {/* Formulário de Pagamento */}
                    {conta.status === 'PENDENTE' && !mostrarFormPagamento && (
                        <div className="flex justify-center pt-4">
                            <button
                                onClick={() => setMostrarFormPagamento(true)}
                                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold flex items-center gap-2 shadow-lg"
                            >
                                <DollarSign size={20} />
                                Registrar Pagamento
                            </button>
                        </div>
                    )}

                    {mostrarFormPagamento && (
                        <form onSubmit={handleSubmitPagamento} className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                            <h4 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2">
                                <DollarSign size={20} />
                                Registrar Pagamento
                            </h4>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Valor Pago *</label>
                                        <input
                                            type="number"
                                            required
                                            step="0.01"
                                            min="0"
                                            max={conta.valorRestante}
                                            value={dadosPagamento.valorPago}
                                            onChange={(e) => setDadosPagamento({ ...dadosPagamento, valorPago: parseFloat(e.target.value) })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Data do Pagamento *</label>
                                        <input
                                            type="date"
                                            required
                                            value={dadosPagamento.dataPagamento}
                                            onChange={(e) => setDadosPagamento({ ...dadosPagamento, dataPagamento: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Forma de Pagamento *</label>
                                    <select
                                        required
                                        value={dadosPagamento.formaPagamento}
                                        onChange={(e) => setDadosPagamento({ ...dadosPagamento, formaPagamento: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="DINHEIRO">Dinheiro</option>
                                        <option value="TRANSFERENCIA">Transferência</option>
                                        <option value="BOLETO">Boleto</option>
                                        <option value="CHEQUE">Cheque</option>
                                        <option value="CARTAO">Cartão</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                                    <textarea
                                        value={dadosPagamento.observacoes}
                                        onChange={(e) => setDadosPagamento({ ...dadosPagamento, observacoes: e.target.value })}
                                        rows="2"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                        placeholder="Informações adicionais sobre o pagamento..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setMostrarFormPagamento(false)}
                                        className="flex-1 px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold shadow-md"
                                    >
                                        Confirmar Pagamento
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-gray-50 flex justify-end">
                    <button
                        onClick={onFechar}
                        className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ContaPagarDetalhes;