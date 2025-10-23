import React, { useState, useEffect } from 'react';
import { 
  Key, Search, Loader, Edit, Trash2, Plus, Filter, X, 
  RefreshCw, Clock, CheckCircle, AlertCircle, Copy 
} from 'lucide-react';
import { licencasService } from '../../../services/api/licencasService';
import { empresasService } from '../../../services/api/empresasService';
import LicencaForm from './LicencaForm';
import LicencaDetalhes from './LicencaDetalhes';
import ConfirmDialog from '../../../components/common/ConfirmDialog';

function Licencas() {
  const [licencas, setLicencas] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [licencaSelecionada, setLicencaSelecionada] = useState(null);
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, licenca: null });
  const [salvando, setSalvando] = useState(false);

  const [filtros, setFiltros] = useState({
    busca: '',
    empresa: '',
    situacao: '',
    tipo: ''
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [resLicencas, resEmpresas] = await Promise.all([
        licencasService.listarTodos({ take: 100 }),
        empresasService.listarTodos({ limit: 100 })
      ]);

      setLicencas(resLicencas.data?.data?.licencas || []);
      setEmpresas(resEmpresas.data?.data?.empresas || []);
      setErro(null);
    } catch (error) {
      setErro('Erro ao carregar licenças');
      console.error('❌ Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNovaLicenca = () => {
    setLicencaSelecionada(null);
    setMostrarForm(true);
  };

  const handleEditarLicenca = async (licenca) => {
    try {
      const resposta = await licencasService.buscarPorId(licenca.id);
      setLicencaSelecionada(resposta.data?.data);
      setMostrarForm(true);
    } catch (error) {
      alert('Erro ao carregar dados: ' + error.message);
    }
  };

  const handleVisualizarDetalhes = async (licenca) => {
    try {
      const resposta = await licencasService.buscarPorId(licenca.id);
      setLicencaSelecionada(resposta.data?.data);
      setMostrarDetalhes(true);
    } catch (error) {
      alert('Erro ao carregar dados: ' + error.message);
    }
  };

  const handleSalvarLicenca = async (dados) => {
    try {
      setSalvando(true);

      if (licencaSelecionada) {
        await licencasService.atualizar(licencaSelecionada.id, dados);
      } else {
        await licencasService.criar(dados);
      }

      setMostrarForm(false);
      setLicencaSelecionada(null);
      await carregarDados();
    } catch (error) {
      console.error('❌ Erro:', error.response?.data || error.message);
      alert('Erro ao salvar: ' + (error.response?.data?.message || error.message));
    } finally {
      setSalvando(false);
    }
  };

  const handleRenovarLicenca = async (licenca) => {
    const novoTipo = prompt('Tipo de renovação (MENSAL/TRIMESTRAL/SEMESTRAL/ANUAL):', 'ANUAL');
    if (novoTipo) {
      try {
        await licencasService.renovar(licenca.id, novoTipo);
        await carregarDados();
        alert('Licença renovada com sucesso!');
      } catch (error) {
        alert('Erro ao renovar: ' + error.message);
      }
    }
  };

  const handleSuspenderLicenca = async (licenca) => {
    const motivo = prompt('Motivo da suspensão:', 'Motivo não informado');
    if (motivo !== null) {
      try {
        await licencasService.suspender(licenca.id, motivo);
        await carregarDados();
        alert('Licença suspensa com sucesso!');
      } catch (error) {
        alert('Erro ao suspender: ' + error.message);
      }
    }
  };

  const handleReativarLicenca = async (licenca) => {
    try {
      await licencasService.reativar(licenca.id);
      await carregarDados();
      alert('Licença reativada com sucesso!');
    } catch (error) {
      alert('Erro ao reativar: ' + error.message);
    }
  };

  const handleConfirmarCancelamento = (licenca) => {
    setConfirmDelete({ isOpen: true, licenca });
  };

  const handleCancelarLicenca = async () => {
    const motivo = prompt('Motivo do cancelamento:', 'Motivo não informado');
    if (motivo !== null) {
      try {
        await licencasService.cancelar(confirmDelete.licenca.id, motivo);
        setConfirmDelete({ isOpen: false, licenca: null });
        await carregarDados();
        alert('Licença cancelada com sucesso!');
      } catch (error) {
        alert('Erro ao cancelar: ' + error.message);
      }
    }
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const limparFiltros = () => {
    setFiltros({ busca: '', empresa: '', situacao: '', tipo: '' });
  };

  const copiarChave = (chave) => {
    navigator.clipboard.writeText(chave);
    alert('Chave copiada!');
  };

  const licencasFiltradas = licencas.filter(lic => {
    const busca = filtros.busca.toLowerCase();
    const matchBusca = !filtros.busca || 
      lic.chave?.toLowerCase().includes(busca) ||
      lic.empresa?.razaoSocial?.toLowerCase().includes(busca);
    const matchEmpresa = !filtros.empresa || lic.empresaId === filtros.empresa;
    const matchSituacao = !filtros.situacao || lic.situacao === filtros.situacao;
    const matchTipo = !filtros.tipo || lic.tipo === filtros.tipo;

    return matchBusca && matchEmpresa && matchSituacao && matchTipo;
  });

  const getSituacaoBadge = (situacao) => {
    const badges = {
      ATIVA: { bg: 'bg-green-100', text: 'text-green-800', icon: <CheckCircle size={14} /> },
      EXPIRADA: { bg: 'bg-red-100', text: 'text-red-800', icon: <AlertCircle size={14} /> },
      CANCELADA: { bg: 'bg-gray-100', text: 'text-gray-800', icon: <X size={14} /> },
      SUSPENSA: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Clock size={14} /> }
    };
    return badges[situacao] || badges.ATIVA;
  };

  const diasRestantes = (dataExp) => {
    const dias = Math.ceil((new Date(dataExp) - new Date()) / (1000 * 60 * 60 * 24));
    return dias > 0 ? dias : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Key className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Controle de Licenças</h2>
              <p className="text-sm text-gray-600">Total: {licencasFiltradas.length} licenças cadastradas</p>
            </div>
          </div>
          <button 
            onClick={handleNovaLicenca}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-semibold shadow-md"
          >
            <Plus size={20} />
            Nova Licença
          </button>
        </div>

        {/* Filtros */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={18} className="text-gray-600" />
            <h3 className="font-semibold text-gray-800">Filtros</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar por chave ou empresa..."
                  value={filtros.busca}
                  onChange={(e) => handleFiltroChange('busca', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <select
                value={filtros.empresa}
                onChange={(e) => handleFiltroChange('empresa', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas Empresas</option>
                {empresas.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.nomeFantasia}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={filtros.situacao}
                onChange={(e) => handleFiltroChange('situacao', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas Situações</option>
                <option value="ATIVA">Ativa</option>
                <option value="EXPIRADA">Expirada</option>
                <option value="SUSPENSA">Suspensa</option>
                <option value="CANCELADA">Cancelada</option>
              </select>
            </div>
            <div>
              <select
                value={filtros.tipo}
                onChange={(e) => handleFiltroChange('tipo', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos Tipos</option>
                <option value="TRIAL">Trial</option>
                <option value="MENSAL">Mensal</option>
                <option value="TRIMESTRAL">Trimestral</option>
                <option value="SEMESTRAL">Semestral</option>
                <option value="ANUAL">Anual</option>
                <option value="VITALICIA">Vitalícia</option>
              </select>
            </div>
            {(filtros.busca || filtros.empresa || filtros.situacao || filtros.tipo) && (
              <button
                onClick={limparFiltros}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                title="Limpar filtros"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {erro && (
          <div className="m-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {erro}
          </div>
        )}

        {/* Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Chave</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Empresa</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Tipo</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Usuários</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Validade</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {licencasFiltradas.map((licenca) => {
                const situacaoBadge = getSituacaoBadge(licenca.situacao);
                const dias = diasRestantes(licenca.dataExpiracao);
                return (
                  <tr key={licenca.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                          {licenca.chave?.substring(0, 8)}...
                        </code>
                        <button
                          onClick={() => copiarChave(licenca.chave)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Copiar chave completa"
                        >
                          <Copy size={14} className="text-gray-600" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{licenca.empresa?.nomeFantasia}</p>
                        <p className="text-sm text-gray-500">{licenca.empresa?.razaoSocial}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {licenca.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div>
                        <p className="font-semibold text-gray-900">{licenca.maxUsuarios}</p>
                        <p className="text-xs text-gray-500">máximo</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div>
                        <p className="font-semibold text-gray-900">{dias} dias</p>
                        <p className="text-xs text-gray-500">
                          {new Date(licenca.dataExpiracao).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${situacaoBadge.bg} ${situacaoBadge.text}`}>
                        {situacaoBadge.icon}
                        {licenca.situacao}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleVisualizarDetalhes(licenca)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                          title="Visualizar detalhes"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => handleEditarLicenca(licenca)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                          title="Editar licença"
                        >
                          <Edit size={18} />
                        </button>
                        {licenca.situacao === 'SUSPENSA' && (
                          <button
                            onClick={() => handleReativarLicenca(licenca)}
                            className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg"
                            title="Reativar licença"
                          >
                            <RefreshCw size={18} />
                          </button>
                        )}
                        {licenca.situacao === 'ATIVA' && (
                          <button
                            onClick={() => handleRenovarLicenca(licenca)}
                            className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg"
                            title="Renovar licença"
                          >
                            <RefreshCw size={18} />
                          </button>
                        )}
                        {licenca.situacao === 'ATIVA' && (
                          <button
                            onClick={() => handleSuspenderLicenca(licenca)}
                            className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg"
                            title="Suspender licença"
                          >
                            <Clock size={18} />
                          </button>
                        )}
                        {licenca.situacao !== 'CANCELADA' && (
                          <button
                            onClick={() => handleConfirmarCancelamento(licenca)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                            title="Cancelar licença"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {licencasFiltradas.length === 0 && !erro && (
          <div className="p-12 text-center">
            <Key className="inline text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 font-medium">
              {filtros.busca || filtros.empresa || filtros.situacao || filtros.tipo
                ? 'Nenhuma licença encontrada com os filtros aplicados'
                : 'Nenhuma licença cadastrada'}
            </p>
          </div>
        )}
      </div>

      {/* Formulário */}
      {mostrarForm && (
        <LicencaForm
          licenca={licencaSelecionada}
          empresas={empresas}
          onSalvar={handleSalvarLicenca}
          onCancelar={() => {
            setMostrarForm(false);
            setLicencaSelecionada(null);
          }}
          salvando={salvando}
        />
      )}

      {/* Detalhes */}
      {mostrarDetalhes && (
        <LicencaDetalhes
          licenca={licencaSelecionada}
          onFechar={() => {
            setMostrarDetalhes(false);
            setLicencaSelecionada(null);
          }}
        />
      )}

      {/* Diálogo de Confirmação */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        titulo="Confirmar Cancelamento"
        mensagem={`Tem certeza que deseja cancelar a licença da empresa "${confirmDelete.licenca?.empresa?.nomeFantasia}"? Esta ação não poderá ser desfeita.`}
        onConfirmar={handleCancelarLicenca}
        onCancelar={() => setConfirmDelete({ isOpen: false, licenca: null })}
      />
    </div>
  );
}

export default Licencas;