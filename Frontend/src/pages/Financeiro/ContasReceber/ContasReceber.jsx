import React, { useState, useEffect } from 'react';
import { DollarSign, Search, Filter, Plus, Edit, Eye, Ban, Loader, Download } from 'lucide-react';
import { contasReceberService } from '../../../services/api/contasReceberService';
import ContaReceberForm from './ContaReceberForm';
import ContaReceberDetalhes from './ContaReceberDetalhes';
import ConfirmDialog from '../../../components/common/ConfirmDialog';

function ContasReceber() {
    const [contas, setContas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtros, setFiltros] = useState({
        status: '',
        dataInicio: '',
        dataFim: '',
        busca: ''
    });
    const [mostrarForm, setMostrarForm] = useState(false);
    const [mostrarDetalhes, setMostrarDetalhes] = useState(false);
    const [contaSelecionada, setContaSelecionada] = useState(null);
    const [confirmCancel, setConfirmCancel] = useState({ isOpen: false, conta: null });

    // Estatísticas
    const [stats, setStats] = useState({
        total: 0,
        pendentes: 0,
        recebidas: 0,
        vencidas: 0,
        valorTotal: 0,
        valorRecebido: 0,
        valorPendente: 0
    });

    useEffect(() => {
       

        carregarContas();
    }, [filtros]);
    
    const carregarContas = async () => {
        try {
            setLoading(true);
            const resposta = await contasReceberService.listarTodos(filtros);

            // ✅ A API retorna: { statusCode, success, data: { total, contas: [...] } }
            const listaContas = resposta.data?.data?.contas || [];

            setContas(listaContas);
            calcularEstatisticas(listaContas);
        } catch (error) {
            console.error('❌ Erro ao carregar contas:', error);
            console.error('❌ Detalhes:', error.response?.data);
            setContas([]); // ✅ Importante: garantir array vazio em caso de erro
            calcularEstatisticas([]); // ✅ Calcular stats com array vazio
        } finally {
            setLoading(false);
        }
    };

    const calcularEstatisticas = (listaContas) => {
        // ✅ VALIDAÇÃO: Garantir que é um array
        if (!Array.isArray(listaContas)) {
            console.error('❌ calcularEstatisticas recebeu algo que não é array:', listaContas);
            listaContas = [];
        }

        const stats = {
            total: listaContas.length,
            pendentes: listaContas.filter(c => c.status === 'PENDENTE').length,
            recebidas: listaContas.filter(c => c.status === 'PAGO').length,
            vencidas: listaContas.filter(c => c.status === 'VENCIDO').length,
            valorTotal: listaContas.reduce((acc, c) => acc + (c.valorFinal || 0), 0),
            valorRecebido: listaContas.filter(c => c.status === 'PAGO').reduce((acc, c) => acc + (c.valorPago || 0), 0),
            valorPendente: listaContas.filter(c => c.status === 'PENDENTE').reduce((acc, c) => acc + (c.valorRestante || 0), 0)
        };
        setStats(stats);
    };

    const handleNovaConta = () => {
        setContaSelecionada(null);
        setMostrarForm(true);
    };

    const handleEditarConta = async (conta) => {
        try {
            const resposta = await contasReceberService.buscarPorId(conta.id);
            setContaSelecionada(resposta.data.data);
            console.log('📦 buscarPorId resposta:', resposta);
            console.log('📦 resposta.data:', resposta.data);
            setMostrarForm(true);
        } catch (error) {
            alert('Erro ao carregar dados da conta: ' + error.message);
        }
    };

    const handleVisualizarConta = async (conta) => {
        try {
            const resposta = await contasReceberService.buscarPorId(conta.id);
            console.log('📦 buscarPorId resposta:', resposta);
            console.log('📦 resposta.data:', resposta.data);
            setContaSelecionada(resposta.data.data);
            setMostrarDetalhes(true);
        } catch (error) {
            alert('Erro ao carregar detalhes: ' + error.message);
        }
    };

    const handleRegistrarPagamento = async (contaId, dadosPagamento) => {
        try {
            await contasReceberService.registrarPagamento(contaId, dadosPagamento);
            setMostrarDetalhes(false);
            await carregarContas();
            alert('Pagamento registrado com sucesso!');
        } catch (error) {
            alert('Erro ao registrar pagamento: ' + error.message);
        }
    };

    const handleCancelarConta = async () => {
        try {
            await contasReceberService.cancelar(confirmCancel.conta.id, 'Cancelado pelo usuário');
            setConfirmCancel({ isOpen: false, conta: null });
            await carregarContas();
        } catch (error) {
            alert('Erro ao cancelar conta: ' + error.message);
        }
    };

    const formatarMoeda = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    };

    const formatarData = (data) => {
        return new Date(data).toLocaleDateString('pt-BR');
    };

    const getStatusBadge = (status) => {
        const badges = {
            PENDENTE: 'bg-yellow-100 text-yellow-800',
            PAGO: 'bg-green-100 text-green-800',
            VENCIDO: 'bg-red-100 text-red-800',
            CANCELADO: 'bg-gray-100 text-gray-800'
        };
        return badges[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total de Contas</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <DollarSign className="text-blue-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Valor Total</p>
                            <p className="text-2xl font-bold text-gray-800">{formatarMoeda(stats.valorTotal)}</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <DollarSign className="text-purple-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Recebido</p>
                            <p className="text-2xl font-bold text-green-600">{formatarMoeda(stats.valorRecebido)}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <DollarSign className="text-green-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">A Receber</p>
                            <p className="text-2xl font-bold text-yellow-600">{formatarMoeda(stats.valorPendente)}</p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <DollarSign className="text-yellow-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtros e Ações */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Search size={16} className="inline mr-1" />
                            Buscar
                        </label>
                        <input
                            type="text"
                            value={filtros.busca}
                            onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
                            placeholder="Número, aluno..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                            value={filtros.status}
                            onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todos</option>
                            <option value="PENDENTE">Pendente</option>
                            <option value="PAGO">Pago</option>
                            <option value="VENCIDO">Vencido</option>
                            <option value="CANCELADO">Cancelado</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Data Início</label>
                        <input
                            type="date"
                            value={filtros.dataInicio}
                            onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Data Fim</label>
                        <input
                            type="date"
                            value={filtros.dataFim}
                            onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        onClick={handleNovaConta}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-semibold shadow-md"
                    >
                        <Plus size={20} />
                        Nova Conta
                    </button>
                </div>
            </div>

            {/* Tabela de Contas */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Número</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Aluno</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Vencimento</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Valor</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Pago</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Restante</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {contas.map((conta) => (
                                <tr key={conta.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{conta.numero}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {conta.aluno?.pessoa?.nome1 || 'N/A'}
                                        
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {formatarData(conta.dataVencimento)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right font-medium text-gray-900">
                                        {formatarMoeda(conta.valorFinal)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right text-green-600 font-medium">
                                        {formatarMoeda(conta.valorPago)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right text-yellow-600 font-medium">
                                        {formatarMoeda(conta.valorRestante)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(conta.status)}`}>
                                            {conta.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleVisualizarConta(conta)}
                                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                                                title="Visualizar"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            {conta.status === 'PENDENTE' && (
                                                <>
                                                    <button
                                                        onClick={() => handleEditarConta(conta)}
                                                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                                                        title="Editar"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmCancel({ isOpen: true, conta })}
                                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                                                        title="Cancelar"
                                                    >
                                                        <Ban size={18} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {contas.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        Nenhuma conta a receber encontrada
                    </div>
                )}
            </div>

            {/* Modais */}
            {mostrarForm && (
                <ContaReceberForm
                    conta={contaSelecionada}
                    onSalvar={async () => {
                        setMostrarForm(false);
                        await carregarContas();
                    }}
                    onCancelar={() => {
                        setMostrarForm(false);
                        setContaSelecionada(null);
                    }}
                />
            )}

            {mostrarDetalhes && (
                <ContaReceberDetalhes
                    conta={contaSelecionada}
                    onRegistrarPagamento={handleRegistrarPagamento}
                    onFechar={() => {
                        setMostrarDetalhes(false);
                        setContaSelecionada(null);
                    }}
                />
            )}

            <ConfirmDialog
                isOpen={confirmCancel.isOpen}
                titulo="Confirmar Cancelamento"
                mensagem={`Tem certeza que deseja cancelar a conta ${confirmCancel.conta?.numero}?`}
                onConfirmar={handleCancelarConta}
                onCancelar={() => setConfirmCancel({ isOpen: false, conta: null })}
            />
        </div>
    );
}

export default ContasReceber;