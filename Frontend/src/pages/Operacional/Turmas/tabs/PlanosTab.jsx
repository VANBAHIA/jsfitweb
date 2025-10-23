import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CreditCard, Search } from 'lucide-react';
import { planosService } from '../../../../services/api/planosService';

function PlanosTab({ planos, onChange }) {
  const [planosDisponiveis, setPlanosDisponiveis] = useState([]);
  const [loadingPlanos, setLoadingPlanos] = useState(true);
  const [busca, setBusca] = useState('');
  const [mostrarLista, setMostrarLista] = useState(false);

  useEffect(() => {
    carregarPlanos();
  }, []);

  const carregarPlanos = async () => {
    try {
      const resposta = await planosService.listarAtivos();
      const planosData = resposta.data?.data || resposta.data || {};
      const planosArray = planosData.planos || [];
      setPlanosDisponiveis(planosArray);
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
    } finally {
      setLoadingPlanos(false);
    }
  };

  const adicionarPlano = (plano) => {
    // Verifica se já foi adicionado
    if (planos.some(p => p.planoId === plano.id)) {
      alert('Este plano já está relacionado à turma');
      return;
    }

    const novoPlano = {
      planoId: plano.id,
      codigo: plano.codigo,
      nome: plano.nome,
      valorMensalidade: plano.valorMensalidade,
      periodicidade: plano.periodicidade
    };

    onChange([...planos, novoPlano]);
    setBusca('');
    setMostrarLista(false);
  };

  const removerPlano = (planoId) => {
    onChange(planos.filter(p => p.planoId !== planoId));
  };

  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const obterTextoPeriodicidade = (periodicidade) => {
    const tipos = {
      'MENSAL': 'Mensal',
      'BIMESTRAL': 'Bimestral',
      'TRIMESTRAL': 'Trimestral',
      'QUADRIMESTRAL': 'Quadrimestral',
      'SEMESTRAL': 'Semestral',
      'ANUAL': 'Anual'
    };
    return tipos[periodicidade] || periodicidade;
  };

  const planosFiltrados = planosDisponiveis.filter(plano => {
    const nome = plano.nome?.toLowerCase() || '';
    const codigo = plano.codigo?.toLowerCase() || '';
    const buscaLower = busca.toLowerCase();
    return nome.includes(buscaLower) || codigo.includes(buscaLower);
  });

  // Filtra planos que já não estão na lista
  const planosParaMostrar = planosFiltrados.filter(
    plano => !planos.some(p => p.planoId === plano.id)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-800">Planos Relacionados</h4>
          <p className="text-sm text-gray-600">
            Vincule os planos que dão acesso a esta turma
          </p>
        </div>
      </div>

      {/* Campo de Busca */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar plano por nome ou código..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onFocus={() => setMostrarLista(true)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={loadingPlanos}
          />
        </div>

        {/* Lista de Sugestões */}
        {mostrarLista && busca && planosParaMostrar.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {planosParaMostrar.map(plano => (
              <button
                key={plano.id}
                type="button"
                onClick={() => adicionarPlano(plano)}
                className="w-full px-4 py-3 hover:bg-gray-50 text-left transition-colors flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{plano.nome}</span>
                    <span className="text-xs font-mono text-gray-500">({plano.codigo})</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{obterTextoPeriodicidade(plano.periodicidade)}</span>
                    <span>•</span>
                    <span className="font-semibold text-green-600">
                      {formatarValor(plano.valorMensalidade)}
                    </span>
                  </div>
                </div>
                <Plus size={18} className="text-blue-600 flex-shrink-0" />
              </button>
            ))}
          </div>
        )}

        {/* Mensagem quando não há resultados */}
        {mostrarLista && busca && planosParaMostrar.length === 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
            <p className="text-sm text-gray-500 text-center">
              Nenhum plano encontrado
            </p>
          </div>
        )}
      </div>

      {/* Lista de Planos Adicionados */}
      {planos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <CreditCard className="mx-auto text-gray-400 mb-3" size={48} />
          <p className="text-gray-600 font-medium mb-2">Nenhum plano relacionado</p>
          <p className="text-sm text-gray-500">
            Use o campo de busca acima para vincular planos à turma
          </p>
        </div>
      ) : (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h5 className="font-semibold text-gray-800">
              Planos Vinculados ({planos.length})
            </h5>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {planos.map((plano) => (
              <div
                key={plano.planoId}
                className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                      <CreditCard className="text-blue-600" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{plano.nome}</div>
                      <div className="text-xs text-gray-500 font-mono">{plano.codigo}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removerPlano(plano.planoId)}
                    className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
                    title="Remover plano"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                    {obterTextoPeriodicidade(plano.periodicidade)}
                  </span>
                  <span className="font-bold text-green-600">
                    {formatarValor(plano.valorMensalidade)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
        <div className="flex items-start gap-3">
          <div className="text-xl">✅</div>
          <div className="text-sm text-green-800">
            <p className="font-semibold mb-1">Importante:</p>
            <p>
              Apenas alunos com os planos vinculados aqui terão acesso a esta turma. 
              Certifique-se de relacionar todos os planos adequados antes de salvar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlanosTab;