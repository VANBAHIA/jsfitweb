import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

function FrequenciaForm({ frequencia, alunos, onSalvar, onCancelar }) {
  const [formData, setFormData] = useState({
    alunoId: '',
    data: new Date().toISOString().split('T')[0],
    horarioInicio: new Date().toTimeString().slice(0, 5),
    horarioFim: '',
    presente: true,
    observacao: '',
    tipo: 'MANUAL'
  });

  useEffect(() => {
    if (frequencia) {
      setFormData({
        alunoId: frequencia.alunoId,
        data: frequencia.data?.split('T')[0] || '',
        horarioInicio: new Date(frequencia.horarioInicio).toTimeString().slice(0, 5),
        horarioFim: frequencia.horarioFim 
          ? new Date(frequencia.horarioFim).toTimeString().slice(0, 5) 
          : '',
        presente: frequencia.presente,
        observacao: frequencia.observacao || '',
        tipo: frequencia.tipo
      });
    }
  }, [frequencia]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const dados = {
      alunoId: formData.alunoId,
      data: formData.data,
      horarioInicio: `${formData.data}T${formData.horarioInicio}:00`,
      horarioFim: formData.horarioFim 
        ? `${formData.data}T${formData.horarioFim}:00` 
        : null,
      presente: formData.presente,
      observacao: formData.observacao,
      tipo: formData.tipo
    };

    onSalvar(dados);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700">
          <h3 className="text-2xl font-bold text-white">
            {frequencia ? 'Editar Frequência' : 'Registrar Frequência'}
          </h3>
          <button
            onClick={onCancelar}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Aluno */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aluno *
              </label>
              <select
                required
                value={formData.alunoId}
                onChange={(e) => setFormData(prev => ({ ...prev, alunoId: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={!!frequencia}
              >
                <option value="">Selecione um aluno</option>
                {alunos.map(aluno => (
                  <option key={aluno.id} value={aluno.id}>
                    {aluno.pessoa?.nome1} - {aluno.matricula}
                  </option>
                ))}
              </select>
            </div>

            {/* Data e Horários */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data *
                </label>
                <input
                  type="date"
                  required
                  value={formData.data}
                  onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora Entrada *
                </label>
                <input
                  type="time"
                  required
                  value={formData.horarioInicio}
                  onChange={(e) => setFormData(prev => ({ ...prev, horarioInicio: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora Saída
                </label>
                <input
                  type="time"
                  value={formData.horarioFim}
                  onChange={(e) => setFormData(prev => ({ ...prev, horarioFim: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Presente/Falta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Situação *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.presente === true}
                    onChange={() => setFormData(prev => ({ ...prev, presente: true }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">✅ Presente</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.presente === false}
                    onChange={() => setFormData(prev => ({ ...prev, presente: false }))}
                    className="w-4 h-4 text-red-600"
                  />
                  <span className="text-sm font-medium text-gray-700">❌ Falta</span>
                </label>
              </div>
            </div>

            {/* Observação */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observação
              </label>
              <textarea
                value={formData.observacao}
                onChange={(e) => setFormData(prev => ({ ...prev, observacao: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Informações adicionais..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={onCancelar}
              className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 shadow-md"
            >
              <Save size={18} />
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FrequenciaForm;