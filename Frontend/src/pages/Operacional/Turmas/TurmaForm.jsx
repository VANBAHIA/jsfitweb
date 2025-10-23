import React, { useState, useEffect } from 'react';
import { X, Save, Users, BookOpen, Clock, CreditCard, UserCheck } from 'lucide-react';
import DadosPrincipaisTab from './tabs/DadosPrincipaisTab';
import HorariosTab from './tabs/HorariosTab';
import InstrutoresTab from './tabs/InstrutoresTab';
import PlanosTab from './tabs/PlanosTab';

function TurmaForm({ turma, onSalvar, onCancelar, salvando }) {
  const [abaAtiva, setAbaAtiva] = useState('dados');
  const [formData, setFormData] = useState({
    nome: '',
    sexo: 'AMBOS',
    observacoes: '',
    horarios: [],
    instrutores: [],
    planos: [],
    status: 'ATIVO'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (turma) {
      const dadosTurma = turma.data || turma;
      
      setFormData({
        nome: dadosTurma.nome || '',
        sexo: dadosTurma.sexo || 'AMBOS',
        observacoes: dadosTurma.observacoes || '',
        horarios: dadosTurma.horarios || [],
        instrutores: dadosTurma.instrutores || [],
        planos: dadosTurma.planos || [],
        status: dadosTurma.status || 'ATIVO'
      });
    }
  }, [turma]);

  const validarFormulario = () => {
    const novosErros = {};

    if (!formData.nome.trim()) {
      novosErros.nome = 'Nome da turma é obrigatório';
      setAbaAtiva('dados');
    } else if (formData.nome.trim().length < 3) {
      novosErros.nome = 'Nome deve ter pelo menos 3 caracteres';
      setAbaAtiva('dados');
    }

    if (!formData.sexo) {
      novosErros.sexo = 'Selecione o sexo da turma';
      setAbaAtiva('dados');
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    const dadosParaSalvar = {
      nome: formData.nome.trim(),
      sexo: formData.sexo,
      observacoes: formData.observacoes.trim() || undefined,
      horarios: formData.horarios,
      instrutores: formData.instrutores,
      planos: formData.planos,
      status: formData.status
    };

    onSalvar(dadosParaSalvar);
  };

  const handleChange = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
    
    if (errors[campo]) {
      setErrors(prev => ({ ...prev, [campo]: null }));
    }
  };

  const abas = [
    {
      id: 'dados',
      label: 'Dados Principais',
      icon: BookOpen,
      badge: null
    },
    {
      id: 'horarios',
      label: 'Horários da Turma',
      icon: Clock,
      badge: formData.horarios.length || null
    },
    {
      id: 'instrutores',
      label: 'Instrutores da Turma',
      icon: UserCheck,
      badge: formData.instrutores.length || null
    },
    {
      id: 'planos',
      label: 'Planos Relacionados',
      icon: CreditCard,
      badge: formData.planos.length || null
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Users className="text-white" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white">
              {turma ? 'Editar Turma' : 'Nova Turma'}
            </h3>
          </div>
          <button 
            onClick={onCancelar} 
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            title="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navegação por Abas */}
        <div className="border-b bg-gray-50">
          <div className="flex overflow-x-auto">
            {abas.map((aba) => {
              const IconeAba = aba.icon;
              return (
                <button
                  key={aba.id}
                  type="button"
                  onClick={() => setAbaAtiva(aba.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-all ${
                    abaAtiva === aba.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  <IconeAba size={18} />
                  <span>{aba.label}</span>
                  {aba.badge !== null && aba.badge > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      {aba.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Conteúdo das Abas */}
        <div className="flex-1 overflow-y-auto p-6">
          {abaAtiva === 'dados' && (
            <DadosPrincipaisTab
              formData={formData}
              errors={errors}
              onChange={handleChange}
            />
          )}

          {abaAtiva === 'horarios' && (
            <HorariosTab
              horarios={formData.horarios}
              onChange={(horarios) => handleChange('horarios', horarios)}
            />
          )}

          {abaAtiva === 'instrutores' && (
            <InstrutoresTab
              instrutores={formData.instrutores}
              onChange={(instrutores) => handleChange('instrutores', instrutores)}
            />
          )}

          {abaAtiva === 'planos' && (
            <PlanosTab
              planos={formData.planos}
              onChange={(planos) => handleChange('planos', planos)}
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {errors.nome && (
              <span className="text-red-600">⚠️ {errors.nome}</span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancelar}
              className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
              disabled={salvando}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={salvando}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {salvando ? 'Salvando...' : (turma ? 'Atualizar Turma' : 'Salvar Turma')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TurmaForm;