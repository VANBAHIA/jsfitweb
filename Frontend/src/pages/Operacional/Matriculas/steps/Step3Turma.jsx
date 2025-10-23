import React, { useState, useEffect } from 'react';
import { Users, Loader, Check, Clock, MapPin, X } from 'lucide-react';
import { turmasService } from '../../../../services/api/turmasService';

function Step3Turma({ turmaSelecionada, onSelecionarTurma }) {
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroSexo, setFiltroSexo] = useState('');

  useEffect(() => {
    carregarTurmas();
  }, []);

  const carregarTurmas = async () => {
    try {
      setLoading(true);
      const response = await turmasService.listarAtivas();
      const turmasArray = response.data?.turmas || [];
      setTurmas(turmasArray);
    } catch (error) {
      console.error('❌ Erro ao carregar turmas:', error);
    } finally {
      setLoading(false);
    }
  };

  const turmasFiltradas = turmas.filter(turma => {
    if (!filtroSexo) return true;
    return turma.sexo === filtroSexo;
  });

  const handleRemoverTurma = () => {
    onSelecionarTurma(null);
  };

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
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="text-orange-600" size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-orange-900">
                👥 Associar a uma Turma (Opcional)
              </h3>
              <p className="text-orange-700 text-sm">
                {turmaSelecionada 
                  ? `Turma selecionada: ${turmaSelecionada.nome}`
                  : 'Você pode pular esta etapa se o aluno não fizer parte de nenhuma turma'
                }
              </p>
            </div>
          </div>
          {turmaSelecionada && (
            <button
              onClick={handleRemoverTurma}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2 font-semibold transition-colors"
            >
              <X size={18} />
              Remover Turma
            </button>
          )}
        </div>
      </div>

      {/* Filtro */}
      <div className="flex items-center gap-3">
        <label className="font-semibold text-gray-700">Filtrar por sexo:</label>
        <select
          value={filtroSexo}
          onChange={(e) => setFiltroSexo(e.target.value)}
          className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="">Todas as Turmas</option>
          <option value="MASCULINO">Masculino</option>
          <option value="FEMININO">Feminino</option>
          <option value="AMBOS">Misto (Ambos)</option>
        </select>
        <span className="text-sm text-gray-600">
          {turmasFiltradas.length} turma(s) encontrada(s)
        </span>
      </div>

      {/* Grid de Turmas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
        {turmasFiltradas.length === 0 ? (
          <div className="col-span-2 text-center py-12">
            <Users className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 font-medium">
              Nenhuma turma disponível
            </p>
          </div>
        ) : (
          turmasFiltradas.map(turma => (
            <button
              key={turma.id}
              onClick={() => onSelecionarTurma(turma)}
              className={`p-5 border-2 rounded-lg text-left transition-all hover:shadow-lg ${
                turmaSelecionada?.id === turma.id
                  ? 'border-orange-600 bg-orange-50 ring-2 ring-orange-200'
                  : 'border-gray-200 hover:border-orange-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900 mb-1">
                    {turma.nome}
                  </h4>
                  
                  {/* Badge de Sexo */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      turma.sexo === 'MASCULINO' 
                        ? 'bg-blue-100 text-blue-800'
                        : turma.sexo === 'FEMININO'
                        ? 'bg-pink-100 text-pink-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {turma.sexo === 'MASCULINO' ? '♂️ Masculino' 
                        : turma.sexo === 'FEMININO' ? '♀️ Feminino' 
                        : '⚥ Misto'}
                    </span>
                  </div>

                  {/* Horários */}
                  {turma.horarios && turma.horarios.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {turma.horarios.slice(0, 2).map((horario, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock size={14} className="text-orange-600" />
                          <span>
                            {horario.diasSemana?.join(', ')} - {horario.horaEntrada} às {horario.horaSaida}
                          </span>
                        </div>
                      ))}
                      {turma.horarios.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{turma.horarios.length - 2} horário(s)
                        </span>
                      )}
                    </div>
                  )}

                  {/* Observações */}
                  {turma.observacoes && (
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                      {turma.observacoes}
                    </p>
                  )}
                </div>

                {/* Ícone de Check */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ml-3 transition-all ${
                  turmaSelecionada?.id === turma.id
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  <Check size={20} />
                </div>
              </div>

              {/* Badge de Selecionado */}
              {turmaSelecionada?.id === turma.id && (
                <div className="pt-3 border-t border-orange-200">
                  <div className="flex items-center gap-1 px-3 py-1 bg-orange-600 text-white text-xs font-bold rounded-full inline-flex">
                    <Check size={14} />
                    TURMA SELECIONADA
                  </div>
                </div>
              )}
            </button>
          ))
        )}
      </div>

      {/* Informação */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="text-sm text-yellow-800 mb-2">
              <strong>Turmas são opcionais!</strong>
            </p>
            <ul className="text-sm text-yellow-800 space-y-1 ml-4">
              <li>• Se o aluno participará de aulas em grupo, selecione uma turma</li>
              <li>• Para treinos individuais ou personal trainer, você pode pular esta etapa</li>
              <li>• Você poderá adicionar o aluno a uma turma depois, se necessário</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step3Turma;