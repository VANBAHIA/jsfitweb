import React, { useState, useEffect } from 'react';
import { Building2, Loader, Edit, MapPin, Phone, Mail, Globe, User } from 'lucide-react';
import { empresasService } from '../../../services/api/empresasService';
import EmpresaForm from './EmpresaForm';

function Empresa() {
  const [empresa, setEmpresa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [salvando, setSalvando] = useState(false);
  

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const resposta = await empresasService.listarTodos({ limit: 1 });
      
      const empresasData = resposta.data?.data || resposta.data || {};
      const empresasArray = empresasData.empresas || [];
      
      if (empresasArray.length > 0) {
        setEmpresa(empresasArray[0]);
      }
      
      setErro(null);
    } catch (error) {
      setErro('Erro ao carregar dados da empresa');
      console.error('❌ Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = () => {
    setMostrarForm(true);
  };

  const handleSalvar = async (dados) => {
    try {
      setSalvando(true);

      if (empresa) {
        await empresasService.atualizar(empresa.id, dados);
      } else {
        await empresasService.criar(dados);
      }

      setMostrarForm(false);
      await carregarDados();
    } catch (error) {
      console.error('❌ Erro:', error.response?.data || error.message);
      alert('Erro ao salvar: ' + (error.response?.data?.message || error.message));
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Dados da Academia</h2>
              <p className="text-sm text-gray-600">
                {empresa ? 'Informações cadastrais da sua academia' : 'Nenhuma empresa cadastrada'}
              </p>
            </div>
          </div>
          {empresa && (
            <button
              onClick={handleEditar}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-semibold shadow-md"
            >
              <Edit size={20} />
              Editar Dados
            </button>
          )}
        </div>

        {erro && (
          <div className="m-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {erro}
          </div>
        )}

        {/* Conteúdo */}
        <div className="p-6">
          {!empresa ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-6">
                <Building2 className="text-blue-600" size={48} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Nenhuma empresa cadastrada
              </h3>
              <p className="text-gray-600 mb-6">
                Cadastre os dados da sua academia para começar a utilizar o sistema
              </p>
              <button
                onClick={handleEditar}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-md"
              >
                Cadastrar Academia
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Dados Cadastrais */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Building2 size={20} className="text-blue-600" />
                  Dados Cadastrais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Razão Social</p>
                    <p className="font-semibold text-gray-900">{empresa.razaoSocial}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Nome Fantasia</p>
                    <p className="font-semibold text-gray-900">{empresa.nomeFantasia}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">CNPJ</p>
                    <p className="font-semibold text-gray-900">{empresa.cnpj}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Inscrição Estadual</p>
                    <p className="font-semibold text-gray-900">
                      {empresa.inscricaoEstadual || 'Não informado'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-blue-600" />
                  Endereço
                </h3>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-900">
                    {empresa.endereco?.logradouro}, {empresa.endereco?.numero}
                    {empresa.endereco?.complemento && ` - ${empresa.endereco.complemento}`}
                  </p>
                  <p className="text-gray-900">
                    {empresa.endereco?.bairro} - {empresa.endereco?.cidade}/{empresa.endereco?.estado}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    CEP: {empresa.endereco?.cep}
                  </p>
                </div>
              </div>

              {/* Contatos */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Phone size={20} className="text-blue-600" />
                  Contatos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {empresa.contatos?.map((contato, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        {contato.tipo === 'EMAIL' ? (
                          <Mail size={16} className="text-blue-600" />
                        ) : (
                          <Phone size={16} className="text-blue-600" />
                        )}
                        <p className="text-sm text-gray-600">{contato.tipo}</p>
                        {contato.principal && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                            Principal
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-gray-900">{contato.valor}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Responsável */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User size={20} className="text-blue-600" />
                  Responsável
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Nome</p>
                    <p className="font-semibold text-gray-900">{empresa.responsavel}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">E-mail</p>
                    <p className="font-semibold text-gray-900">{empresa.email}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center gap-2">
                    <Globe size={18} className="text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Site</p>
                      <p className="font-semibold text-gray-900">
                        {empresa.site ? (
                          <a
                            href={empresa.site}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {empresa.site}
                          </a>
                        ) : (
                          'Não informado'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Status da Empresa</h3>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 inline-block">
                  <span
                    className={`px-4 py-2 text-sm font-semibold rounded-full ${
                      empresa.situacao === 'ATIVO'
                        ? 'bg-green-100 text-green-800'
                        : empresa.situacao === 'BLOQUEADO'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {empresa.situacao || 'ATIVO'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Formulário */}
      {mostrarForm && (
        <EmpresaForm
          empresa={empresa}
          onSalvar={handleSalvar}
          onCancelar={() => setMostrarForm(false)}
          salvando={salvando}
        />
      )}
    </div>
  );
}

export default Empresa;