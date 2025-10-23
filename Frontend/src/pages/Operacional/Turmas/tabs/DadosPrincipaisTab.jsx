import React from 'react';
import { Users, FileText } from 'lucide-react';

function DadosPrincipaisTab({ formData, errors, onChange }) {
  return (
    <div className="space-y-5">
      {/* Nome da Turma */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nome da Turma *
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Users size={20} />
          </div>
          <input
            type="text"
            required
            value={formData.nome}
            onChange={(e) => onChange('nome', e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.nome ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Ex: Turma Iniciante Manhã, Turma Avançado Tarde"
            maxLength={100}
          />
        </div>
        {errors.nome && (
          <p className="text-xs text-red-600 mt-1">⚠️ {errors.nome}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Digite um nome descritivo para identificar a turma
        </p>
      </div>

      {/* Sexo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sexo da Turma *
        </label>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => onChange('sexo', 'MASCULINO')}
            className={`p-4 border-2 rounded-lg transition-all ${
              formData.sexo === 'MASCULINO'
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">♂️</div>
              <div className="font-semibold">Masculino</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onChange('sexo', 'FEMININO')}
            className={`p-4 border-2 rounded-lg transition-all ${
              formData.sexo === 'FEMININO'
                ? 'border-pink-600 bg-pink-50 text-pink-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">♀️</div>
              <div className="font-semibold">Feminino</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onChange('sexo', 'AMBOS')}
            className={`p-4 border-2 rounded-lg transition-all ${
              formData.sexo === 'AMBOS'
                ? 'border-purple-600 bg-purple-50 text-purple-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">⚥</div>
              <div className="font-semibold">Ambos</div>
            </div>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Defina se a turma é exclusiva para homens, mulheres ou mista
        </p>
      </div>

      {/* Observações */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="inline mr-2" size={16} />
          Observações (Opcional)
        </label>
        <textarea
          value={formData.observacoes}
          onChange={(e) => onChange('observacoes', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows="4"
          placeholder="Digite observações gerais sobre a turma, requisitos, nível, etc..."
          maxLength={500}
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.observacoes.length}/500 caracteres
        </p>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) => onChange('status', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="ATIVO">✅ Ativa</option>
          <option value="INATIVO">🚫 Inativa</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Turmas inativas não estarão disponíveis para novas matrículas
        </p>
      </div>

      {/* Card Informativo */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <div className="flex items-start gap-3">
          <div className="text-2xl flex-shrink-0">💡</div>
          <div>
            <h6 className="font-semibold text-blue-900 mb-2">Dica sobre Turmas</h6>
            <p className="text-sm text-blue-800 mb-2">
              As turmas organizam os alunos por horários, níveis ou modalidades. 
              Configure os dados principais aqui e use as outras abas para:
            </p>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Definir os horários de funcionamento da turma</li>
              <li>Associar instrutores responsáveis</li>
              <li>Vincular os planos que dão acesso à turma</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DadosPrincipaisTab;