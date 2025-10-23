import React, { useState, useEffect } from 'react';
import { X, Save, Key, Building2, Zap, Loader } from 'lucide-react';
import { licencasService } from '../../../services/api/licencasService';

function LicencaForm({ licenca, empresas, onSalvar, onCancelar, salvando }) {
  const [formData, setFormData] = useState({
    empresaId: '',
    tipo: 'ANUAL',
    maxUsuarios: 5,
    maxAlunos: 100,
    funcionalidades: ['ALUNOS', 'BASICO'],
    observacoes: '',
    chave: ''
  });

  const [gerandoChave, setGerandoChave] = useState(false);

  useEffect(() => {
    if (licenca) {
      const dadosLicenca = licenca.data || licenca;
      setFormData({
        empresaId: dadosLicenca.empresaId || '',
        tipo: dadosLicenca.tipo || 'ANUAL',
        maxUsuarios: dadosLicenca.maxUsuarios || 5,
        maxAlunos: dadosLicenca.maxAlunos || 100,
        funcionalidades: dadosLicenca.funcionalidades || ['ALUNOS', 'BASICO'],
        observacoes: dadosLicenca.observacoes || '',
        chave: dadosLicenca.chave || ''
      });
    }
  }, [licenca]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.empresaId) {
      alert('Selecione uma empresa');
      return;
    }

    onSalvar(formData);
  };

  const handleChange = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
  };

  const handleFuncionalidadeChange = (func) => {
    setFormData(prev => {
      const funcionalidades = prev.funcionalidades.includes(func)
        ? prev.funcionalidades.filter(f => f !== func)
        : [...prev.funcionalidades, func];
      return { ...prev, funcionalidades };
    });
  };

  const gerarNovaChave = async () => {
    try {
      setGerandoChave(true);
      const resposta = await licencasService.gerarChave();
      setFormData(prev => ({
        ...prev,
        chave: resposta.data?.data?.chave || ''
      }));
    } catch (error) {
      alert('Erro ao gerar chave: ' + error.message);
    } finally {
      setGerandoChave(false);
    }
  };

  const funcionalidadesDisponiveis = [
    { valor: 'ALUNOS', label: 'Gestão de Alunos' },
    { valor: 'FINANCEIRO', label: 'Gestão Financeira' },
    { valor: 'TREINOS', label: 'Gestão de Treinos' },
    { valor: 'AVALIACOES', label: 'Avaliações Físicas' },
    { valor: 'RELATORIOS', label: 'Relatórios' },
    { valor: 'BASICO', label: 'Acesso Básico' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl mx-4 my-8">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700">
          <h3 className="text-2xl font-bold text-white">
            {licenca ? 'Editar Licença' : 'Nova Licença'}
          </h3>
          <button onClick={onCancelar} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Empresa */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Building2 size={20} className="text-blue-600" />
                Empresa
              </h4>
              <select
                required
                value={formData.empresaId}
                onChange={(e) => handleChange('empresaId', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={!!licenca}
              >
                <option value="">Selecione uma empresa...</option>
                {empresas.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nomeFantasia} - {emp.razaoSocial}
                  </option>
                ))}
              </select>
            </div>

            {/* Chave de Licença */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Key size={20} className="text-blue-600" />
                Chave de Licença
              </h4>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={formData.chave}
                  readOnly
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                  placeholder="A chave será gerada automaticamente"
                />
                <button
                  type="button"
                  onClick={gerarNovaChave}
                  disabled={gerandoChave}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-semibold disabled:opacity-50"
                >
                  {gerandoChave ? <Loader className="animate-spin" size={18} /> : <Zap size={18} />}
                  Gerar Chave
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                A chave é gerada automaticamente como UUID única
              </p>
            </div>

            {/* Tipo e Limites */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Configuração</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Licença *
                  </label>
                  <select
                    required
                    value={formData.tipo}
                    onChange={(e) => handleChange('tipo', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="TRIAL">Trial (30 dias)</option>
                    <option value="MENSAL">Mensal</option>
                    <option value="TRIMESTRAL">Trimestral (3 meses)</option>
                    <option value="SEMESTRAL">Semestral (6 meses)</option>
                    <option value="ANUAL">Anual</option>
                    <option value="VITALICIA">Vitalícia (100 anos)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Máximo de Usuários *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="1000"
                    value={formData.maxUsuarios}
                    onChange={(e) => handleChange('maxUsuarios', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Máximo de Alunos *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="10000"
                    value={formData.maxAlunos}
                    onChange={(e) => handleChange('maxAlunos', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Funcionalidades */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Funcionalidades Liberadas
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {funcionalidadesDisponiveis.map((func) => (
                  <label key={func.valor} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.funcionalidades.includes(func.valor)}
                      onChange={() => handleFuncionalidadeChange(func.valor)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{func.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Observações */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                value={formData.observacoes}
                onChange={(e) => handleChange('observacoes', e.target.value)}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Observações sobre a licença..."
              />
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>💡 Dica:</strong> Após criar a licença, a chave será enviada por e-mail para a empresa.
                O período de validade é calculado automaticamente baseado no tipo selecionado.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancelar}
              className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando || !formData.chave}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 shadow-md transition-colors disabled:opacity-50"
            >
              <Save size={18} />
              {salvando ? 'Salvando...' : 'Salvar Licença'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LicencaForm;