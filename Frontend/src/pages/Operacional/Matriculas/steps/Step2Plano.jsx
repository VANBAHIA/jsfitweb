import React, { useState, useEffect } from 'react';
import { CreditCard, Loader, Check, DollarSign, Calendar } from 'lucide-react';
import { planosService } from '../../../../services/api/planosService';

function Step2Plano({ planoSelecionado, onSelecionarPlano }) {
  const [planos, setPlanos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroPeriodicidade, setFiltroPeriodicidade] = useState('');

  useEffect(() => {
    carregarPlanos();
  }, []);

  const carregarPlanos = async () => {
    try {
      setLoading(true);
      const response = await planosService.listarAtivos();
      const planosArray = response.data?.planos || [];
      setPlanos(planosArray);
    } catch (error) {
      console.error('❌ Erro ao carregar planos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const obterTextoPeriodicidade = (plano) => {
    const { periodicidade, numeroMeses, numeroDias } = plano;
    
    switch (periodicidade) {
      case 'MENSAL': return 'Mensal';
      case 'BIMESTRAL': return 'Bimestral';
      case 'TRIMESTRAL': return 'Trimestral';
      case 'QUADRIMESTRAL': return 'Quadrimestral';
      case 'SEMESTRAL': return 'Semestral';
      case 'ANUAL': return 'Anual';
      case 'MESES': return `${numeroMeses} ${numeroMeses === 1 ? 'Mês' : 'Meses'}`;
      case 'DIAS': return `${numeroDias} ${numeroDias === 1 ? 'Dia' : 'Dias'}`;
      default: return periodicidade;
    }
  };

  const planosFiltrados = planos.filter(plano => {
    if (!filtroPeriodicidade) return true;
    return plano.periodicidade === filtroPeriodicidade;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-purple-100 rounded-lg">
            <CreditCard className="text-purple-600" size={28} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-purple-900">
              💳 Escolha o Plano de Matrícula
            </h3>
            <p className="text-purple-700 text-sm">
              {planoSelecionado 
                ? `Plano selecionado: ${planoSelecionado.nome} - ${formatarValor(planoSelecionado.valorMensalidade)}`
                : 'Selecione um dos planos disponíveis abaixo'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Filtro */}
      <div className="flex items-center gap-3">
        <label className="font-semibold text-gray-700">Filtrar por:</label>
        <select
          value={filtroPeriodicidade}
          onChange={(e) => setFiltroPeriodicidade(e.target.value)}
          className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">Todas as Periodicidades</option>
          <option value="MENSAL">Mensal</option>
          <option value="BIMESTRAL">Bimestral</option>
          <option value="TRIMESTRAL">Trimestral</option>
          <option value="SEMESTRAL">Semestral</option>
          <option value="ANUAL">Anual</option>
        </select>
        <span className="text-sm text-gray-600">
          {planosFiltrados.length} plano(s) encontrado(s)
        </span>
      </div>

      {/* Grid de Planos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[450px] overflow-y-auto">
        {planosFiltrados.length === 0 ? (
          <div className="col-span-3 text-center py-12">
            <CreditCard className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 font-medium">
              Nenhum plano disponível
            </p>
          </div>
        ) : (
          planosFiltrados.map(plano => (
            <button
              key={plano.id}
              onClick={() => onSelecionarPlano(plano)}
              className={`p-6 border-2 rounded-xl text-left transition-all hover:shadow-xl transform hover:-translate-y-1 ${
                planoSelecionado?.id === plano.id
                  ? 'border-purple-600 bg-purple-50 ring-4 ring-purple-200'
                  : 'border-gray-200 hover:border-purple-300 bg-white'
              }`}
            >
              {/* Badge de Selecionado */}
              {planoSelecionado?.id === plano.id && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
                    <Check size={14} />
                    SELECIONADO
                  </div>
                </div>
              )}

              {/* Código e Nome */}
              <div className="mb-4">
                <span className="text-xs font-mono text-gray-500 block mb-1">
                  {plano.codigo}
                </span>
                <h4 className="text-lg font-bold text-gray-900">
                  {plano.nome}
                </h4>
              </div>

              {/* Valor Destaque */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign size={18} />
                  <span className="text-xs font-semibold uppercase">Valor</span>
                </div>
                <div className="text-3xl font-bold">
                  {formatarValor(plano.valorMensalidade)}
                </div>
                <div className="text-xs opacity-90 mt-1">
                  por mês
                </div>
              </div>

              {/* Periodicidade */}
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={16} className="text-purple-600" />
                <span className="text-sm font-semibold text-gray-700">
                  {obterTextoPeriodicidade(plano)}
                </span>
              </div>

              {/* Descrição */}
              {plano.descricao && (
                <p className="text-xs text-gray-600 mt-3 line-clamp-2">
                  {plano.descricao}
                </p>
              )}

              {/* Ícone de Check */}
              <div className={`mt-4 pt-4 border-t flex items-center justify-center ${
                planoSelecionado?.id === plano.id
                  ? 'border-purple-200'
                  : 'border-gray-200'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  planoSelecionado?.id === plano.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  <Check size={20} />
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Informação */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📋</span>
          <div>
            <p className="text-sm text-blue-800">
              <strong>Importante:</strong> O valor exibido é a mensalidade que será cobrada do aluno.
              Na próxima etapa você poderá aplicar descontos e configurar a forma de pagamento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step2Plano;