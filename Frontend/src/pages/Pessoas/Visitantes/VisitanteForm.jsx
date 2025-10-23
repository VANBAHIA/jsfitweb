// src/pages/Controle/Visitantes/VisitanteForm.jsx

import React, { useState, useEffect } from 'react';
import { X, Save, User } from 'lucide-react';
import { funcionariosService } from '../../../services/api/funcionariosService';

function VisitanteForm({ visitante, onSalvar, onCancelar }) {
  const [funcionarios, setFuncionarios] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    bairro: '',
    cidade: '',
    uf: '',
    cep: '',
    telefone: '',
    celular: '',
    email: '',
    sexo: '',
    dataNascimento: '',
    dataVisita: new Date().toISOString().split('T')[0],
    funcionarioId: '',
    observacoes: ''
  });

  // Carregar funcionários ativos
  useEffect(() => {
    const carregarFuncionarios = async () => {
      try {
        const resposta = await funcionariosService.listarTodos({ situacao: 'ATIVO' });
        const listaFuncionarios = resposta.data?.data || resposta.data || [];
        setFuncionarios(listaFuncionarios);
       
      } catch (error) {
        console.error('❌ Erro ao carregar funcionários:', error);
      }
    };
    carregarFuncionarios();
  }, []);

  // Preencher formulário ao editar
  useEffect(() => {
    if (visitante) {
      const formatarData = (data) => {
        if (!data) return '';
        return data.split('T')[0];
      };

      const dadosVisitante = visitante.data || visitante;

      setFormData({
        nome: dadosVisitante.nome || '',
        endereco: dadosVisitante.endereco || '',
        bairro: dadosVisitante.bairro || '',
        cidade: dadosVisitante.cidade || '',
        uf: dadosVisitante.uf || '',
        cep: dadosVisitante.cep || '',
        telefone: dadosVisitante.telefone || '',
        celular: dadosVisitante.celular || '',
        email: dadosVisitante.email || '',
        sexo: dadosVisitante.sexo || '',
        dataNascimento: formatarData(dadosVisitante.dataNascimento),
        dataVisita: formatarData(dadosVisitante.dataVisita),
        funcionarioId: dadosVisitante.funcionarioId || '',
        observacoes: dadosVisitante.observacoes || ''
      });
    }
  }, [visitante]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSalvar(formData);
  };

  const handleChange = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
  };

  const UFs = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center overflow-y-auto py-8 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl mx-4">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <User size={28} />
            {visitante ? 'Editar Visitante' : 'Novo Visitante'}
          </h3>
          <button onClick={onCancelar} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 max-h-[calc(100vh-250px)] overflow-y-auto">
            {/* Dados Cadastrais */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                📋 Dados Cadastrais
              </h4>

              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Nome completo do visitante"
                />
              </div>

              {/* Endereço e Bairro */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                  <input
                    type="text"
                    value={formData.endereco}
                    onChange={(e) => handleChange('endereco', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Rua, Avenida..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                  <input
                    type="text"
                    value={formData.bairro}
                    onChange={(e) => handleChange('bairro', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Bairro"
                  />
                </div>
              </div>

              {/* Cidade, UF e CEP */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                  <input
                    type="text"
                    value={formData.cidade}
                    onChange={(e) => handleChange('cidade', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="CIDADE"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">UF</label>
                  <select
                    value={formData.uf}
                    onChange={(e) => handleChange('uf', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione</option>
                    {UFs.map(uf => (
                      <option key={uf} value={uf}>{uf}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                  <input
                    type="text"
                    value={formData.cep}
                    onChange={(e) => handleChange('cep', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="00000-000"
                    maxLength="9"
                  />
                </div>
              </div>

              {/* Contatos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                  <input
                    type="text"
                    value={formData.telefone}
                    onChange={(e) => handleChange('telefone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="(00) 0000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Celular</label>
                  <input
                    type="text"
                    value={formData.celular}
                    onChange={(e) => handleChange('celular', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>

              {/* Sexo e Data de Nascimento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sexo</label>
                  <select
                    value={formData.sexo}
                    onChange={(e) => handleChange('sexo', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecione</option>
                    <option value="MASCULINO">Masculino</option>
                    <option value="FEMININO">Feminino</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento</label>
                  <input
                    type="date"
                    value={formData.dataNascimento}
                    onChange={(e) => handleChange('dataNascimento', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Dados da Visita */}
              <div className="pt-6 border-t mt-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  📅 Dados da Visita
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data da Visita *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dataVisita}
                      onChange={(e) => handleChange('dataVisita', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Funcionário Responsável
                    </label>
                    <select
                      value={formData.funcionarioId}
                      onChange={(e) => handleChange('funcionarioId', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecione o funcionário</option>
                      {funcionarios.map(func => (
                        <option key={func.id} value={func.id}>
                          {func.pessoa?.nome1} - {func.funcao?.funcao}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Observações */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => handleChange('observacoes', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Observações sobre a visita..."
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancelar}
              className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
            >
              <Save size={18} />
              Salvar Visitante
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VisitanteForm;