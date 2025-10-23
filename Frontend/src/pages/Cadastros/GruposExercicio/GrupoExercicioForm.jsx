import React, { useState, useEffect } from 'react';
import { X, Save, Dumbbell } from 'lucide-react';

function GrupoExercicioForm({ grupo, onSalvar, onCancelar, salvando }) {
  const [formData, setFormData] = useState({
    nome: ''
  });

  const [erros, setErros] = useState({});

  // Grupos musculares sugeridos
  const gruposSugeridos = [
    'ANTEBRAÇO', 'ABDOME', 'BÍCEPS', 'TRÍCEPS', 'PEITO', 'PERNA',
    'GLÚTEO', 'COSTAS', 'OMBRO', 'CORPO', 'PANTURRILHA', 'POSTERIOR',
    'QUADRÍCEPS', 'LOMBAR', 'TRAPÉZIO', 'DELTOIDE', 'CARDIO'
  ];

  useEffect(() => {
    if (grupo) {
      const dadosGrupo = grupo.data || grupo;
      
      setFormData({
        nome: dadosGrupo.nome || ''
      });
    }
  }, [grupo]);

  const validarFormulario = () => {
    const novosErros = {};

    if (!formData.nome.trim()) {
      novosErros.nome = 'Nome do grupo é obrigatório';
    } else if (formData.nome.trim().length < 3) {
      novosErros.nome = 'Nome deve ter pelo menos 3 caracteres';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    const dadosParaSalvar = {
      nome: formData.nome.trim().toUpperCase()
    };

    onSalvar(dadosParaSalvar);
  };

  const handleChange = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
    
    // Limpa o erro do campo ao começar a digitar
    if (erros[campo]) {
      setErros(prev => {
        const novosErros = { ...prev };
        delete novosErros[campo];
        return novosErros;
      });
    }
  };

  const handleSelecionarSugerido = (nome) => {
    handleChange('nome', nome);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-purple-600 to-purple-700 sticky top-0 z-10">
          <h3 className="text-2xl font-bold text-white">
            {grupo ? 'Editar Grupo de Exercício' : 'Novo Grupo de Exercício'}
          </h3>
          <button 
            onClick={onCancelar} 
            disabled={salvando}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="space-y-5">
              {/* Nome do Grupo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Grupo Muscular *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => handleChange('nome', e.target.value.toUpperCase())}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase font-semibold ${
                    erros.nome ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: BÍCEPS, ABDOME, COSTAS"
                  maxLength={50}
                />
                {erros.nome && (
                  <p className="text-red-500 text-xs mt-1">{erros.nome}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Digite o nome do grupo muscular (mínimo 3 caracteres) - será salvo em MAIÚSCULAS
                </p>
              </div>

              {/* Preview */}
              {formData.nome.trim().length >= 3 && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">💪</div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Preview do grupo:</div>
                      <div className="inline-flex px-4 py-2 bg-purple-100 text-purple-900 rounded-lg font-bold text-lg">
                        {formData.nome.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Grupos Sugeridos */}
              {!grupo && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Grupos Sugeridos (clique para selecionar)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {gruposSugeridos.map((sugestao) => (
                      <button
                        key={sugestao}
                        type="button"
                        onClick={() => handleSelecionarSugerido(sugestao)}
                        className={`px-3 py-2 text-sm rounded-lg border-2 transition-all ${
                          formData.nome.toUpperCase() === sugestao
                            ? 'bg-purple-100 border-purple-500 text-purple-900 font-bold'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                        }`}
                      >
                        {sugestao}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Informativo */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💡</div>
                  <div>
                    <h6 className="font-semibold text-blue-900 mb-1">Dicas</h6>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Use nomes padronizados para facilitar a organização</li>
                      <li>• Grupos serão usados para categorizar exercícios</li>
                      <li>• Evite criar grupos duplicados ou muito parecidos</li>
                      <li>• Você pode criar grupos personalizados além dos sugeridos</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Exemplos de Categorização */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h6 className="font-semibold text-gray-800 mb-3">Exemplos de Categorização:</h6>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="font-semibold text-purple-700 mb-1">👆 Membros Superiores:</div>
                    <div className="text-gray-600 space-y-1">
                      <div>• BÍCEPS, TRÍCEPS</div>
                      <div>• OMBRO, DELTOIDE</div>
                      <div>• PEITO, COSTAS</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-purple-700 mb-1">🦵 Membros Inferiores:</div>
                    <div className="text-gray-600 space-y-1">
                      <div>• QUADRÍCEPS, POSTERIOR</div>
                      <div>• GLÚTEO, PANTURRILHA</div>
                      <div>• PERNA (geral)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 sticky bottom-0">
            <button
              type="button"
              onClick={onCancelar}
              disabled={salvando}
              className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center gap-2 shadow-md transition-colors disabled:opacity-50"
            >
              {salvando ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  {grupo ? 'Atualizar' : 'Salvar'} Grupo
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GrupoExercicioForm;