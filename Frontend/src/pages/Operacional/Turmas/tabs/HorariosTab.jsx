import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Clock, MapPin } from 'lucide-react';
import { locaisService } from '../../../../services/api/locaisService';

function HorariosTab({ horarios, onChange }) {
  const [locais, setLocais] = useState([]);
  const [loadingLocais, setLoadingLocais] = useState(true);

  useEffect(() => {
    carregarLocais();
  }, []);

  const carregarLocais = async () => {
    try {
      const resposta = await locaisService.listarAtivos();
      const locaisData = resposta.data?.data || resposta.data || {};
      const locaisArray = locaisData.locais || [];
      setLocais(locaisArray);
    } catch (error) {
      console.error('Erro ao carregar locais:', error);
    } finally {
      setLoadingLocais(false);
    }
  };

  const adicionarHorario = () => {
    const novoHorario = {
      id: Date.now().toString(),
      localId: '',
      local: '',
      diasSemana: [],
      horaEntrada: '',
      horaSaida: ''
    };
    onChange([...horarios, novoHorario]);
  };

  const removerHorario = (id) => {
    onChange(horarios.filter(h => h.id !== id));
  };

  const atualizarHorario = (id, campo, valor) => {
    const horariosAtualizados = horarios.map(h => {
      if (h.id === id) {
        const atualizado = { ...h, [campo]: valor };
        
        // Se mudou o local, atualiza o nome do local também
        if (campo === 'localId') {
          const localSelecionado = locais.find(l => l.id === valor);
          atualizado.local = localSelecionado?.nome || '';
        }
        
        return atualizado;
      }
      return h;
    });
    onChange(horariosAtualizados);
  };

  const toggleDiaSemana = (horarioId, dia) => {
    const horariosAtualizados = horarios.map(h => {
      if (h.id === horarioId) {
        const diasAtuais = h.diasSemana || [];
        const novoDias = diasAtuais.includes(dia)
          ? diasAtuais.filter(d => d !== dia)
          : [...diasAtuais, dia];
        return { ...h, diasSemana: novoDias };
      }
      return h;
    });
    onChange(horariosAtualizados);
  };

  const diasSemana = [
    { valor: 'DOMINGO', label: 'Dom', cor: 'bg-red-100 text-red-700' },
    { valor: 'SEGUNDA', label: 'Seg', cor: 'bg-blue-100 text-blue-700' },
    { valor: 'TERCA', label: 'Ter', cor: 'bg-green-100 text-green-700' },
    { valor: 'QUARTA', label: 'Qua', cor: 'bg-yellow-100 text-yellow-700' },
    { valor: 'QUINTA', label: 'Qui', cor: 'bg-purple-100 text-purple-700' },
    { valor: 'SEXTA', label: 'Sex', cor: 'bg-pink-100 text-pink-700' },
    { valor: 'SABADO', label: 'Sáb', cor: 'bg-orange-100 text-orange-700' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-800">Horários de Funcionamento</h4>
          <p className="text-sm text-gray-600">
            Defina os dias e horários em que a turma funciona
          </p>
        </div>
        <button
          type="button"
          onClick={adicionarHorario}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium shadow-sm"
        >
          <Plus size={18} />
          Adicionar Horário
        </button>
      </div>

      {horarios.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Clock className="mx-auto text-gray-400 mb-3" size={48} />
          <p className="text-gray-600 font-medium mb-2">Nenhum horário definido</p>
          <p className="text-sm text-gray-500 mb-4">
            Adicione os horários de funcionamento desta turma
          </p>
          <button
            type="button"
            onClick={adicionarHorario}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Adicionar Primeiro Horário
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {horarios.map((horario, index) => (
            <div key={horario.id} className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Clock size={18} className="text-blue-600" />
                  Horário {index + 1}
                </h5>
                <button
                  type="button"
                  onClick={() => removerHorario(horario.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  title="Remover horário"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Local */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline mr-1" size={14} />
                    Local *
                  </label>
                  <select
                    value={horario.localId}
                    onChange={(e) => atualizarHorario(horario.id, 'localId', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={loadingLocais}
                  >
                    <option value="">Selecione o local</option>
                    {locais.map(local => (
                      <option key={local.id} value={local.id}>{local.nome}</option>
                    ))}
                  </select>
                </div>

                {/* Dias da Semana */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dias da Semana *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {diasSemana.map(dia => {
                      const selecionado = horario.diasSemana?.includes(dia.valor);
                      return (
                        <button
                          key={dia.valor}
                          type="button"
                          onClick={() => toggleDiaSemana(horario.id, dia.valor)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            selecionado
                              ? dia.cor + ' border-2 border-current'
                              : 'bg-white border-2 border-gray-300 text-gray-600 hover:border-gray-400'
                          }`}
                        >
                          {dia.label}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {horario.diasSemana?.length > 0 
                      ? `${horario.diasSemana.length} dia(s) selecionado(s)`
                      : 'Selecione pelo menos um dia'}
                  </p>
                </div>

                {/* Horários */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hora Entrada *
                    </label>
                    <input
                      type="time"
                      value={horario.horaEntrada}
                      onChange={(e) => atualizarHorario(horario.id, 'horaEntrada', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hora Saída *
                    </label>
                    <input
                      type="time"
                      value={horario.horaSaida}
                      onChange={(e) => atualizarHorario(horario.id, 'horaSaida', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
        <div className="flex items-start gap-3">
          <div className="text-xl">⚠️</div>
          <div className="text-sm text-yellow-800">
            <p className="font-semibold mb-1">Importante:</p>
            <p>
              Os horários definidos aqui serão usados para controle de acesso e presença dos alunos. 
              Certifique-se de que os horários e locais estão corretos antes de salvar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HorariosTab;