import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { frequenciaService } from '../../../services/api/frequenciaService';
import { alunosService } from '../../../services/api/alunosService';

function RegistroPresenca({ onSucesso, onCancelar }) {
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      // Buscar aluno pela matrícula
      const resAlunos = await alunosService.listarTodos({ busca: matricula });
      const aluno = resAlunos.data?.find(a => a.matricula === matricula);

      if (!aluno) {
        setErro('Matrícula não encontrada');
        setLoading(false);
        return;
      }

      // Registrar presença
      await frequenciaService.registrarPresenca(aluno.id, senha);

      setSucesso(true);
      setTimeout(() => {
        onSucesso();
      }, 2000);
    } catch (error) {
      setErro(error.response?.data?.message || 'Erro ao registrar presença');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-green-600 to-green-700">
          <h3 className="text-2xl font-bold text-white">Registro Rápido</h3>
          <button
            onClick={onCancelar}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {sucesso ? (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto text-green-600 mb-4" size={64} />
              <h4 className="text-2xl font-bold text-gray-800 mb-2">
                Presença Registrada!
              </h4>
              <p className="text-gray-600">
                Bem-vindo(a) à academia! 💪
              </p>
            </div>
          ) : (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  🔐 Informe sua matrícula e senha de acesso para registrar sua presença
                </p>
              </div>

              {erro && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-red-800">❌ {erro}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Matrícula *
                  </label>
                  <input
                    type="text"
                    required
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-lg text-center font-mono"
                    placeholder="Digite sua matrícula"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Senha de Acesso *
                  </label>
                  <input
                    type="password"
                    required
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-lg text-center font-mono"
                    placeholder="••••"
                    minLength="4"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={onCancelar}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <>Registrando...</>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      Registrar Presença
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default RegistroPresenca;