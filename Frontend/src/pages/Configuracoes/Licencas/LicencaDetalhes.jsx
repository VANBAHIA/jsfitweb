import React from 'react';
import { X, Key, Building2, Calendar, Zap, AlertCircle, Copy } from 'lucide-react';

function LicencaDetalhes({ licenca, onFechar }) {
  const copiarChave = (chave) => {
    navigator.clipboard.writeText(chave);
    alert('Chave copiada!');
  };

  const diasRestantes = Math.ceil((new Date(licenca.dataExpiracao) - new Date()) / (1000 * 60 * 60 * 24));
  const percentualUso = licenca.maxUsuarios > 0 ? (licenca.usuariosAtivos || 0) / licenca.maxUsuarios * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 my-8">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700">
          <h3 className="text-2xl font-bold text-white">Detalhes da Licença</h3>
          <button onClick={onFechar} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 max-h-[calc(100vh-150px)] overflow-y-auto">
          {/* Empresa */}
          <div className="mb-6 pb-6 border-b">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Building2 size={20} className="text-blue-600" />
              Empresa
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Razão Social</p>
                <p className="font-semibold text-gray-900">{licenca.empresa?.razaoSocial}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Nome Fantasia</p>
                <p className="font-semibold text-gray-900">{licenca.empresa?.nomeFantasia}</p>
              </div>
            </div>
          </div>

          {/* Chave */}
          <div className="mb-6 pb-6 border-b">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Key size={20} className="text-blue-600" />
              Chave de Licença
            </h4>
            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <code className="flex-1 font-mono text-sm text-gray-800">{licenca.chave}</code>
              <button
                onClick={() => copiarChave(licenca.chave)}
                className="p-2 hover:bg-gray-100 rounded"
                title="Copiar chave"
              >
                <Copy size={18} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Validade */}
          <div className="mb-6 pb-6 border-b">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-blue-600" />
              Validade
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Tipo de Licença</p>
                <p className="font-semibold text-gray-900">{licenca.tipo}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Início</p>
                <p className="font-semibold text-gray-900">
                  {new Date(licenca.dataInicio).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className={`p-4 rounded-lg border ${
                diasRestantes > 30 ? 'bg-green-50 border-green-200' :
                diasRestantes > 0 ? 'bg-yellow-50 border-yellow-200' :
                'bg-red-50 border-red-200'
              }`}>
                <p className={`text-sm mb-1 ${
                  diasRestantes > 30 ? 'text-green-600' :
                  diasRestantes > 0 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>Dias Restantes</p>
                <p className={`text-2xl font-bold ${
                  diasRestantes > 30 ? 'text-green-900' :
                  diasRestantes > 0 ? 'text-yellow-900' :
                  'text-red-900'
                }`}>{diasRestantes}</p>
              </div>
            </div>
          </div>

          {/* Limites */}
          <div className="mb-6 pb-6 border-b">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Zap size={20} className="text-blue-600" />
              Limites de Uso
            </h4>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">Usuários</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {licenca.usuariosAtivos || 0} / {licenca.maxUsuarios}
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all ${
                      percentualUso > 80 ? 'bg-red-600' : 
                      percentualUso > 60 ? 'bg-yellow-600' : 'bg-green-600'
                    }`}
                    style={{ width: `${Math.min(percentualUso, 100)}%` }}
                  />
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Máximo de Alunos</p>
                <p className="font-semibold text-gray-900">{licenca.maxAlunos}</p>
              </div>
            </div>
          </div>

          {/* Funcionalidades */}
          <div className="mb-6 pb-6 border-b">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Funcionalidades</h4>
            <div className="flex flex-wrap gap-2">
              {licenca.funcionalidades?.map((func, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                >
                  ✓ {func}
                </span>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Status</h4>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className={`w-3 h-3 rounded-full ${
                licenca.situacao === 'ATIVA' ? 'bg-green-600' :
                licenca.situacao === 'SUSPENSA' ? 'bg-yellow-600' :
                licenca.situacao === 'EXPIRADA' ? 'bg-red-600' :
                'bg-gray-600'
              }`} />
              <span className="font-semibold text-gray-900">{licenca.situacao}</span>
            </div>
          </div>

          {/* Observações */}
          {licenca.observacoes && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex gap-3">
                <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900 mb-1">Observações</p>
                  <p className="text-blue-800">{licenca.observacoes}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onFechar}
            className="px-6 py-2.5 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default LicencaDetalhes;