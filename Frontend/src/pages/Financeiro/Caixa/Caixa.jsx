import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, TrendingUp, TrendingDown, Loader, Eye, Lock, Unlock, Plus, Minus } from 'lucide-react';
import { caixaService } from '../../../services/api/caixaService';
import CaixaAbrir from './CaixaAbrir';
import CaixaMovimento from './CaixaMovimento';
import CaixaRelatorio from './CaixaRelatorio';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { useAuth } from '../../../context/AuthContext';
import CaixaSangria from './CaixaSangria';
import CaixaSuprimento from './CaixaSuprimento';


function Caixa() {
  const { usuario } = useAuth();
  const [caixaAberto, setCaixaAberto] = useState(null);
  const [historicoCaixas, setHistoricoCaixas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarFormAbrir, setMostrarFormAbrir] = useState(false);
  const [mostrarMovimento, setMostrarMovimento] = useState(false);
  const [mostrarRelatorio, setMostrarRelatorio] = useState(false);
  const [tipoMovimento, setTipoMovimento] = useState('ENTRADA'); // ENTRADA ou SAIDA
  const [caixaSelecionado, setCaixaSelecionado] = useState(null);
  const [confirmFechar, setConfirmFechar] = useState({ isOpen: false });
  const [mostrarSangria, setMostrarSangria] = useState(false);
  const [mostrarSuprimento, setMostrarSuprimento] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

const carregarDados = async () => {
  try {
    setLoading(true);
    const [resCaixaAberto, resHistorico] = await Promise.all([
      caixaService.buscarAberto().catch(() => ({ data: null })),
      caixaService.listarTodos({ limit: 10 })
    ]);

    setCaixaAberto(resCaixaAberto.data);
    
    // ✅ Ajustado para estrutura correta da API
    const caixasArray = resHistorico?.data?.caixas || resHistorico?.caixas || [];
      setHistoricoCaixas(caixasArray);
    
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  } finally {
    setLoading(false);
  }
};

  const handleAbrirCaixa = async (dados) => {
    try {
      await caixaService.abrir(dados);
      setMostrarFormAbrir(false);
      await carregarDados();
    } catch (error) {
      alert('Erro ao abrir caixa: ' + error.message);
    }
  };

  const handleFecharCaixa = async () => {
    try {
      // Pegar do contexto ou localStorage
      const usuarioLogado = usuario?.nome || 'Sistema';


      const dados = {
        valorFechamento: caixaAberto.valorAbertura + caixaAberto.totalEntradas - caixaAberto.totalSaidas,
        usuarioFechamento: usuarioLogado,
        observacoes: 'Fechamento normal'
      };

      await caixaService.fechar(caixaAberto.id, dados);
      setConfirmFechar({ isOpen: false });
      await carregarDados();
      alert('Caixa fechado com sucesso!');
    } catch (error) {
      console.error('Erro:', error.response?.data);
      alert('Erro: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleRegistrarMovimento = async (dados) => {
    try {
      await caixaService.registrarMovimento(caixaAberto.id, dados);
      setMostrarMovimento(false);
      await carregarDados();
    } catch (error) {
      alert('Erro ao registrar movimento: ' + error.message);
    }
  };

  const handleSangria = async (dados) => {
    try {
      await caixaService.sangria(caixaAberto.id, dados);
      setMostrarSangria(false);
      await carregarDados();
      alert('Sangria realizada com sucesso!');
    } catch (error) {
      throw error; // Propagar erro para o componente filho mostrar
    }
  };

  const handleSuprimento = async (dados) => {
    try {
      await caixaService.suprimento(caixaAberto.id, dados);
      setMostrarSuprimento(false);
      await carregarDados();
      alert('Suprimento realizado com sucesso!');
    } catch (error) {
      throw error;
    }
  };

  const handleVisualizarRelatorio = async (caixa) => {
    try {
      const resposta = await caixaService.relatorio(caixa.id);
      setCaixaSelecionado(resposta.data);
      setMostrarRelatorio(true);
    } catch (error) {
      alert('Erro ao carregar relatório: ' + error.message);
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

  const formatarHora = (hora) => {
    return hora || '--:--';
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
      {/* Status do Caixa */}
      {caixaAberto ? (
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <Unlock size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Caixa Aberto</h2>
                <p className="text-green-100">Caixa #{caixaAberto.numero}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-100">Aberto em {formatarData(caixaAberto.dataAbertura)}</p>
              <p className="text-sm text-green-100">às {formatarHora(caixaAberto.horaAbertura)}</p>
            </div>
          </div>

          {/* Cards de Valores */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm text-green-100 mb-1">Abertura</p>
              <p className="text-2xl font-bold">{formatarMoeda(caixaAberto.valorAbertura)}</p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm text-green-100 mb-1">Entradas</p>
              <p className="text-2xl font-bold text-green-200">
                + {formatarMoeda(caixaAberto.totalEntradas)}
              </p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm text-green-100 mb-1">Saídas</p>
              <p className="text-2xl font-bold text-red-200">
                - {formatarMoeda(caixaAberto.totalSaidas)}
              </p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border-2 border-white border-opacity-30">
              <p className="text-sm text-green-100 mb-1">Saldo Atual</p>
              <p className="text-2xl font-bold">
                {formatarMoeda(caixaAberto.valorAbertura + caixaAberto.totalEntradas - caixaAberto.totalSaidas)}
              </p>
            </div>
          </div>

          {/* Ações */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                setTipoMovimento('ENTRADA');
                setMostrarMovimento(true);
              }}
              className="px-6 py-2.5 bg-white text-green-700 rounded-lg hover:bg-green-50 font-semibold flex items-center gap-2 shadow-md"
            >
              <TrendingUp size={20} />
              Nova Entrada
            </button>

            <button
              onClick={() => {
                setTipoMovimento('SAIDA');
                setMostrarMovimento(true);
              }}
              className="px-6 py-2.5 bg-white text-red-700 rounded-lg hover:bg-red-50 font-semibold flex items-center gap-2 shadow-md"
            >
              <TrendingDown size={20} />
              Nova Saída
            </button>

            <button
              onClick={() => setMostrarSuprimento(true)}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2 shadow-md"
            >
              <Plus size={20} />
              Suprimento
            </button>

            <button
              onClick={() => setMostrarSangria(true)}
              className="px-6 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold flex items-center gap-2 shadow-md"
            >
              <Minus size={20} />
              Sangria
            </button>

            <button
              onClick={() => handleVisualizarRelatorio(caixaAberto)}
              className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold flex items-center gap-2 shadow-md"
            >
              <Eye size={20} />
              Relatório
            </button>

            <button
              onClick={() => setConfirmFechar({ isOpen: true })}
              className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold flex items-center gap-2 shadow-md ml-auto"
            >
              <Lock size={20} />
              Fechar Caixa
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg shadow-lg p-8 text-white text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-white bg-opacity-20 rounded-full">
              <Lock size={48} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Caixa Fechado</h2>
              <p className="text-gray-200 mb-6">Nenhum caixa está aberto no momento</p>
            </div>
            <button
              onClick={() => setMostrarFormAbrir(true)}
              className="px-8 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-100 font-semibold flex items-center gap-2 shadow-lg"
            >
              <Unlock size={20} />
              Abrir Caixa
            </button>
          </div>
        </div>
      )}

      {/* Últimos Movimentos do Caixa Aberto */}
      {caixaAberto && caixaAberto.movimentos?.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold text-gray-800">Últimos Movimentos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Data/Hora</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Descrição</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Forma</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {caixaAberto.movimentos.slice(-10).reverse().map((movimento, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {new Date(movimento.dataHora).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${movimento.tipo === 'ENTRADA'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {movimento.tipo === 'ENTRADA' ? '⬆️ ENTRADA' : '⬇️ SAÍDA'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900">{movimento.descricao}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{movimento.formaPagamento}</td>
                    <td className={`px-6 py-3 text-sm text-right font-bold ${movimento.tipo === 'ENTRADA' ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {movimento.tipo === 'ENTRADA' ? '+' : '-'} {formatarMoeda(movimento.valor)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Histórico de Caixas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold text-gray-800">Histórico de Caixas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Número</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Abertura</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Fechamento</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Valor Inicial</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Valor Final</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {historicoCaixas.map((caixa) => (
                <tr key={caixa.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">{caixa.numero}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {formatarData(caixa.dataAbertura)} às {formatarHora(caixa.horaAbertura)}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {caixa.dataFechamento
                      ? `${formatarData(caixa.dataFechamento)} às ${formatarHora(caixa.horaFechamento)}`
                      : 'Em aberto'
                    }
                  </td>
                  <td className="px-6 py-3 text-sm text-right font-medium">
                    {formatarMoeda(caixa.valorAbertura)}
                  </td>
                  <td className="px-6 py-3 text-sm text-right font-bold text-green-600">
                    {caixa.valorFechamento ? formatarMoeda(caixa.valorFechamento) : '--'}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${caixa.status === 'ABERTO'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                      }`}>
                      {caixa.status === 'ABERTO' ? '🔓 ABERTO' : '🔒 FECHADO'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button
                      onClick={() => handleVisualizarRelatorio(caixa)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                      title="Ver Relatório"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {historicoCaixas.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Nenhum caixa encontrado no histórico
          </div>
        )}
      </div>

      {/* Modais */}
      {mostrarFormAbrir && (
        <CaixaAbrir
          onAbrir={handleAbrirCaixa}
          onCancelar={() => setMostrarFormAbrir(false)}
        />
      )}

      {mostrarMovimento && (
        <CaixaMovimento
          tipo={tipoMovimento}
          onSalvar={handleRegistrarMovimento}
          onCancelar={() => setMostrarMovimento(false)}
        />
      )}

      {mostrarRelatorio && (
        <CaixaRelatorio
          caixa={caixaSelecionado}
          onFechar={() => {
            setMostrarRelatorio(false);
            setCaixaSelecionado(null);
          }}
        />
      )}
      {mostrarSangria && (
        <CaixaSangria
          caixaId={caixaAberto.id}
          saldoDisponivel={caixaAberto.valorAbertura + caixaAberto.totalEntradas - caixaAberto.totalSaidas}
          usuarioResponsavel={usuario?.nome || 'Sistema'} 
          onSalvar={handleSangria}
          onCancelar={() => setMostrarSangria(false)}
        />
      )}

      {mostrarSuprimento && (
        <CaixaSuprimento
          caixaId={caixaAberto.id}
          onSalvar={handleSuprimento}
          usuarioResponsavel={usuario?.nome || 'Sistema'} 
          onCancelar={() => setMostrarSuprimento(false)}
        />
      )}


      <ConfirmDialog
        isOpen={confirmFechar.isOpen}
        titulo="Confirmar Fechamento de Caixa"
        mensagem="Tem certeza que deseja fechar o caixa? Esta ação não pode ser desfeita."
        onConfirmar={handleFecharCaixa}
        onCancelar={() => setConfirmFechar({ isOpen: false })}
      />
    </div>
  );
}

export default Caixa;