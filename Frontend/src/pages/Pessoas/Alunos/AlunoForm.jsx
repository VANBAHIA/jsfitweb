import React, { useState, useEffect } from 'react';
import { Grid, TextField } from '@mui/material';
import { X, Save, Plus, Trash2, MapPin, Phone } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import InputMask from 'react-input-mask';


function AlunoForm({ aluno, onSalvar, onCancelar }) {
  const { usuario } = useAuth();
  const [abaSelecionada, setAbaSelecionada] = useState('enderecos');

  const handleCepChange = async (e, setFieldValue) => {
    const cep = e.target.value.replace(/\D/g, '');
    setFieldValue('endereco.cep', cep);

    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (!data.erro) {
          setFieldValue('endereco.logradouro', data.logradouro || '');
          setFieldValue('endereco.bairro', data.bairro || '');
          setFieldValue('endereco.cidade', data.localidade || '');
          setFieldValue('endereco.uf', data.uf || '');
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  const [formData, setFormData] = useState({
    pessoaId: '',
    pessoa: {
      codigo: '',
      nome1: '',
      nome2: '',
      doc1: '',
      doc2: '',
      dtNsc: '',
      situacao: 'ATIVO'
    },
    enderecos: [],
    contatos: [],
    avaliacoesFisicas: [],
    vldExameMedico: '',
    vldAvaliacao: '',
    objetivo: '',
    profissao: '',
    empresa: '',
    horarios: [],
    controleAcesso: {
      senha: '',
      senhaAtual: '',
      impressaoDigital1: '',
      impressaoDigital2: ''
    },
    avaliacaoFisica: {
      id: undefined,
      peso: '',
      altura: '',
      imc: '',
      percentualGordura: '',
      massaMagra: '',
      massaGorda: '',
      circunferenciaTorax: '',
      circunferenciaCintura: '',
      circunferenciaQuadril: '',
      circunferenciaBracoDireito: '',
      circunferenciaBracoEsquerdo: '',
      circunferenciaCoxaDireita: '',
      circunferenciaCoxaEsquerda: '',
      circunferenciaPanturrilhaDireita: '',
      circunferenciaPanturrilhaEsquerda: '',
      observacoes: '',
      dataAvaliacao: new Date().toISOString().split('T')[0]
    }
  });



  useEffect(() => {
  if (!aluno) return; // 👈 garante que só roda quando o aluno existe

  const formatarAltura = (altura) => {
    if (!altura) return '';
    const alturaNum = parseFloat(altura);
    return alturaNum > 3 ? (alturaNum / 100).toFixed(2) : alturaNum.toFixed(2);
  };

  const formatarData = (data) => {
    if (!data) return '';
    // Aceita Date, ISO ou string simples
    const d = typeof data === 'string' ? data : new Date(data);
    return d.toISOString().split('T')[0];
  };

  setFormData({
    pessoaId: aluno.pessoaId || aluno.pessoa?.id || '',
    pessoa: {
      codigo: aluno.pessoa?.codigo || '',
      nome1: aluno.pessoa?.nome1 || '',
      nome2: aluno.pessoa?.nome2 || '',
      doc1: aluno.pessoa?.doc1 || '',
      doc2: aluno.pessoa?.doc2 || '',
      dtNsc: formatarData(aluno.pessoa?.dtNsc),
      situacao: aluno.pessoa?.situacao || 'ATIVO',
    },
    enderecos: aluno.pessoa?.enderecos?.map(end => ({
      id: end.id || undefined,
      logradouro: end.logradouro || '',
      cep: end.cep || '',
      cidade: end.cidade || '',
      uf: end.uf || '',
    })) || [],
    contatos: aluno.pessoa?.contatos?.map(cont => ({
      id: cont.id || undefined,
      tipo: cont.tipo || 'CELULAR',
      valor: cont.valor || '',
    })) || [],
    vldExameMedico: formatarData(aluno.vldExameMedico),
    vldAvaliacao: formatarData(aluno.vldAvaliacao),
    objetivo: aluno.objetivo || '',
    profissao: aluno.profissao || '',
    empresa: aluno.empresa || '',
    responsavel: aluno.responsavel || null,
    horarios: aluno.horarios?.map(h => ({
      id: h.id || undefined,
      local: h.local || '',
      diasSemana: h.diasSemana || [],
      horarioEntrada: h.horarioEntrada || '',
      horarioSaida: h.horarioSaida || '',
    })) || [],
    controleAcesso: {
      senha: '',
      senhaAtual: aluno.controleAcesso?.senha || '',
      impressaoDigital1: aluno.controleAcesso?.impressaoDigital1 || '',
      impressaoDigital2: aluno.controleAcesso?.impressaoDigital2 || '',
    },

    // 🔹 Avaliações físicas (com proteção completa)
    avaliacoesFisicas: Array.isArray(aluno.avaliacoesFisicas)
      ? aluno.avaliacoesFisicas.map((av) => ({
          id: av?.id || undefined,
          peso: av?.peso?.toString() || '',
          altura: formatarAltura(av?.altura) || '',
          imc: av?.imc?.toString() || '',
          percentualGordura: av?.percentualGordura?.toString() || '',
          massaMagra: av?.massaMagra?.toString() || '',
          massaGorda: av?.massaGorda?.toString() || '',
          circunferenciaTorax: av?.torax?.toString() || '',
          circunferenciaCintura: av?.cintura?.toString() || '',
          circunferenciaQuadril: av?.quadril?.toString() || '',
          circunferenciaBracoDireito: av?.bracoDireito?.toString() || '',
          circunferenciaBracoEsquerdo: av?.bracoEsquerdo?.toString() || '',
          circunferenciaCoxaDireita: av?.coxaDireita?.toString() || '',
          circunferenciaCoxaEsquerda: av?.coxaEsquerda?.toString() || '',
          circunferenciaPanturrilhaDireita: av?.panturrilhaDireita?.toString() || '',
          circunferenciaPanturrilhaEsquerda: av?.panturrilhaEsquerda?.toString() || '',
          observacoes: av?.observacoes || '',
          dataAvaliacao: formatarData(av?.dataAvaliacao) ||
            new Date().toISOString().split('T')[0], // 👈 fallback seguro
        }))
      : [],
  });
}, [aluno]);


  const handleChange = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
  };

  const handlePessoaChange = (campo, valor) => {
    setFormData(prev => ({ ...prev, pessoa: { ...prev.pessoa, [campo]: valor } }));
  };

  // Adicionar nova avaliação física
  const adicionarAvaliacaoFisica = () => {
    setFormData(prev => ({
      ...prev,
      avaliacoesFisicas: [
        ...prev.avaliacoesFisicas,
        {
          peso: '',
          altura: '',
          imc: '',
          percentualGordura: '',
          massaMagra: '',
          massaGorda: '',
          circunferenciaTorax: '',
          circunferenciaCintura: '',
          circunferenciaQuadril: '',
          circunferenciaBracoDireito: '',
          circunferenciaBracoEsquerdo: '',
          circunferenciaCoxaDireita: '',
          circunferenciaCoxaEsquerda: '',
          circunferenciaPanturrilhaDireita: '',
          circunferenciaPanturrilhaEsquerda: '',
          observacoes: '',
          dataAvaliacao: new Date().toISOString().split('T')[0]
        }
      ]
    }));
  };

  // Remover avaliação física
  const removerAvaliacaoFisica = (index) => {
    setFormData(prev => ({
      ...prev,
      avaliacoesFisicas: prev.avaliacoesFisicas.filter((_, i) => i !== index)
    }));
  };

  // Atualizar campo específico de uma avaliação
  const handleAvaliacaoFisicaChange = (index, campo, valor) => {
    setFormData(prev => {
      const novasAvaliacoes = [...prev.avaliacoesFisicas];
      const avaliacaoAtual = { ...novasAvaliacoes[index], [campo]: valor };

      // Cálculo automático de IMC
      if (campo === 'peso' || campo === 'altura') {
        const peso = parseFloat(campo === 'peso' ? valor : avaliacaoAtual.peso);
        const altura = parseFloat(campo === 'altura' ? valor : avaliacaoAtual.altura);

        if (peso > 0 && altura > 0) {
          const alturaMetros = altura > 3 ? altura / 100 : altura;
          const imc = (peso / (alturaMetros * alturaMetros)).toFixed(2);
          avaliacaoAtual.imc = imc;
          if (campo === 'altura' && altura > 3) {
            avaliacaoAtual.altura = alturaMetros.toFixed(2);
          }
        }
      }

      // Cálculo automático de massa magra e massa gorda
      if (campo === 'peso' || campo === 'percentualGordura') {
        const peso = parseFloat(campo === 'peso' ? valor : avaliacaoAtual.peso);
        const percentualGordura = parseFloat(campo === 'percentualGordura' ? valor : avaliacaoAtual.percentualGordura);

        if (peso > 0 && percentualGordura >= 0 && percentualGordura <= 100) {
          const massaGorda = ((peso * percentualGordura) / 100).toFixed(2);
          const massaMagra = (peso - massaGorda).toFixed(2);
          avaliacaoAtual.massaGorda = massaGorda;
          avaliacaoAtual.massaMagra = massaMagra;
        }
      }

      novasAvaliacoes[index] = avaliacaoAtual;
      return { ...prev, avaliacoesFisicas: novasAvaliacoes };
    });
  };



  const getClassificacaoIMC = (imc) => {
    if (!imc || imc <= 0) return { texto: '-', cor: 'gray' };
    if (imc < 18.5) return { texto: 'Abaixo do peso', cor: 'blue' };
    if (imc < 25) return { texto: 'Peso normal', cor: 'green' };
    if (imc < 30) return { texto: 'Sobrepeso', cor: 'yellow' };
    if (imc < 35) return { texto: 'Obesidade Grau I', cor: 'orange' };
    if (imc < 40) return { texto: 'Obesidade Grau II', cor: 'red' };
    return { texto: 'Obesidade Grau III', cor: 'red' };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const empresaId = usuario?.empresa?.id;

    if (!empresaId) {
      alert('Erro: Empresa não identificada. Faça login novamente.');
      return;
    }

    const dadosParaSalvar = {
      pessoa: {
        ...(formData.pessoa.codigo && { codigo: formData.pessoa.codigo }),
        tipo: 'FISICA',
        empresa: { connect: { id: empresaId } },
        nome1: formData.pessoa.nome1.trim(),
        nome2: formData.pessoa.nome2?.trim() || '',
        doc1: formData.pessoa.doc1.trim(),
        doc2: formData.pessoa.doc2?.trim() || '',
        dtNsc: formData.pessoa.dtNsc || null,
        situacao: formData.pessoa.situacao,
        enderecos: formData.enderecos
          .filter(end => end.logradouro || end.cep || end.cidade || end.uf)
          .map(end => ({
            ...(end.id && { id: end.id }),
            logradouro: end.logradouro?.trim() || '',
            cep: end.cep?.trim() || '',
            cidade: end.cidade?.trim() || '',
            uf: end.uf?.trim().toUpperCase() || ''
          })),
        contatos: formData.contatos
          .filter(cont => cont.valor)
          .map(cont => ({
            ...(cont.id && { id: cont.id }),
            tipo: cont.tipo,
            valor: cont.valor.trim()
          }))
      },
      vldExameMedico: formData.vldExameMedico || null,
      vldAvaliacao: formData.vldAvaliacao || null,
      objetivo: formData.objetivo?.trim() || '',
      profissao: formData.profissao?.trim() || '',
      empresa: formData.empresa?.trim() || '',
      responsavel: formData.responsavel || null,
      horarios: formData.horarios
        .filter(h => h.local && h.horarioEntrada && h.horarioSaida)
        .map(h => ({
          ...(h.id && { id: h.id }),
          local: h.local.trim(),
          diasSemana: h.diasSemana || [],
          horarioEntrada: h.horarioEntrada,
          horarioSaida: h.horarioSaida
        })),
      controleAcesso: {
        ...(formData.controleAcesso.senha
          ? { senha: formData.controleAcesso.senha }
          : formData.controleAcesso.senhaAtual
            ? { senha: formData.controleAcesso.senhaAtual }
            : {}
        ),
        impressaoDigital1: formData.controleAcesso.impressaoDigital1?.trim() || null,
        impressaoDigital2: formData.controleAcesso.impressaoDigital2?.trim() || null
      },
      avaliacoesFisicas: formData.avaliacoesFisicas
        .filter(av => av.peso && av.altura) // Apenas avaliações com dados básicos
        .map(av => ({
          ...(av.id && { id: av.id }),
          peso: parseFloat(av.peso),
          altura: parseFloat(av.altura),
          dataAvaliacao: av.dataAvaliacao,
          imc: av.imc ? parseFloat(av.imc) : null,
          percentualGordura: av.percentualGordura ? parseFloat(av.percentualGordura) : null,
          massaMagra: av.massaMagra ? parseFloat(av.massaMagra) : null,
          massaGorda: av.massaGorda ? parseFloat(av.massaGorda) : null,
          torax: av.circunferenciaTorax ? parseFloat(av.circunferenciaTorax) : null,
          cintura: av.circunferenciaCintura ? parseFloat(av.circunferenciaCintura) : null,
          quadril: av.circunferenciaQuadril ? parseFloat(av.circunferenciaQuadril) : null,
          bracoDireito: av.circunferenciaBracoDireito ? parseFloat(av.circunferenciaBracoDireito) : null,
          bracoEsquerdo: av.circunferenciaBracoEsquerdo ? parseFloat(av.circunferenciaBracoEsquerdo) : null,
          coxaDireita: av.circunferenciaCoxaDireita ? parseFloat(av.circunferenciaCoxaDireita) : null,
          coxaEsquerda: av.circunferenciaCoxaEsquerda ? parseFloat(av.circunferenciaCoxaEsquerda) : null,
          panturrilhaDireita: av.circunferenciaPanturrilhaDireita ? parseFloat(av.circunferenciaPanturrilhaDireita) : null,
          panturrilhaEsquerda: av.circunferenciaPanturrilhaEsquerda ? parseFloat(av.circunferenciaPanturrilhaEsquerda) : null,
          observacoes: av.observacoes?.trim() || ''
        }))
    };

    onSalvar(dadosParaSalvar);
  };

  const adicionarEndereco = () => {
    setFormData(prev => ({ ...prev, enderecos: [...prev.enderecos, { logradouro: '', cep: '', cidade: '', uf: '' }] }));
  };

  const removerEndereco = (index) => {
    setFormData(prev => ({ ...prev, enderecos: prev.enderecos.filter((_, i) => i !== index) }));
  };

  const handleEnderecoChange = (index, campo, valor) => {
    setFormData(prev => ({ ...prev, enderecos: prev.enderecos.map((end, i) => i === index ? { ...end, [campo]: valor } : end) }));
  };

  const adicionarContato = () => {
    setFormData(prev => ({ ...prev, contatos: [...prev.contatos, { tipo: 'CELULAR', valor: '' }] }));
  };

  const removerContato = (index) => {
    setFormData(prev => ({ ...prev, contatos: prev.contatos.filter((_, i) => i !== index) }));
  };

  const handleContatoChange = (index, campo, valor) => {
    setFormData(prev => ({ ...prev, contatos: prev.contatos.map((cont, i) => i === index ? { ...cont, [campo]: valor } : cont) }));
  };

  const adicionarHorario = () => {
    setFormData(prev => ({ ...prev, horarios: [...prev.horarios, { local: '', diasSemana: [], horarioEntrada: '', horarioSaida: '' }] }));
  };

  const removerHorario = (index) => {
    setFormData(prev => ({ ...prev, horarios: prev.horarios.filter((_, i) => i !== index) }));
  };

  const handleHorarioChange = (index, campo, valor) => {
    setFormData(prev => ({ ...prev, horarios: prev.horarios.map((h, i) => i === index ? { ...h, [campo]: valor } : h) }));
  };

  const toggleDiaSemana = (index, diaValue) => {
    setFormData(prev => ({
      ...prev, horarios: prev.horarios.map((h, i) => {
        if (i !== index) return h;
        const dias = h.diasSemana || [];
        return { ...h, diasSemana: dias.includes(diaValue) ? dias.filter(d => d !== diaValue) : [...dias, diaValue] };
      })
    }));
  };

  const diasSemana = [
    { label: 'SEG', value: 'SEGUNDA' },
    { label: 'TER', value: 'TERCA' },
    { label: 'QUA', value: 'QUARTA' },
    { label: 'QUI', value: 'QUINTA' },
    { label: 'SEX', value: 'SEXTA' },
    { label: 'SAB', value: 'SABADO' },
    { label: 'DOM', value: 'DOMINGO' }
  ];

  const abas = [
    { id: 'enderecos', label: 'Endereços', icon: '📍' },
    { id: 'contatos', label: 'Contatos', icon: '📞' },
    { id: 'avaliacaoFisica', label: 'Avaliação Física', icon: '📊' },
    { id: 'horarios', label: 'Horários', icon: '🕐' },
    { id: 'acesso', label: 'Controle de Acesso', icon: '🔐' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center overflow-y-auto py-8 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl mx-4">
        <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700">
          <h3 className="text-2xl font-bold text-white">{aluno ? 'Editar Aluno' : 'Novo Aluno'}</h3>
          <button onClick={onCancelar} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
                  <input type="text" required value={formData.pessoa.nome1}
                    onChange={(e) => handlePessoaChange('nome1', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Nome completo" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Apelido</label>
                  <input type="text" value={formData.pessoa.nome2}
                    onChange={(e) => handlePessoaChange('nome2', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Apelido ou nome social" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CPF *</label>
                  <input type="text" required value={formData.pessoa.doc1}
                    onChange={(e) => handlePessoaChange('doc1', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="000.000.000-00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">RG</label>
                  <input type="text" value={formData.pessoa.doc2 || ''}
                    onChange={(e) => handlePessoaChange('doc2', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="00.000.000-0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento</label>
                  <input type="date" value={formData.pessoa.dtNsc || ''}
                    onChange={(e) => handlePessoaChange('dtNsc', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>



            <div className="border-b px-0 bg-white-50 overflow-x-auto mb-4">
              <div className="flex gap-2 px-6">
                {abas.map(aba => (
                  <button key={aba.id} type="button"
                    onClick={() => setAbaSelecionada(aba.id)}
                    className={`px-4 py-3 font-medium border-b-2 whitespace-nowrap transition-colors ${abaSelecionada === aba.id
                      ? 'border-blue-600 text-blue-600 bg-white'
                      : 'border-transparent text-gray-600 hover:text-gray-800'
                      }`}>
                    {aba.icon} {aba.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-t pt-4 max-h-[calc(100vh-420px)] overflow-y-auto">
              {abaSelecionada === 'enderecos' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="font-semibold text-gray-800 flex items-center gap-2">
                      <MapPin size={20} className="text-blue-600" />
                      Endereços Cadastrados
                    </h5>
                    <button type="button" onClick={adicionarEndereco}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-2">
                      <Plus size={18} />
                      Adicionar Endereço
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.enderecos.map((endereco, index) => (
                      <div key={index} className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <h6 className="font-medium text-gray-800">📍 Endereço {index + 1}</h6>
                          <button type="button" onClick={() => removerEndereco(index)}
                            className="text-red-600 hover:bg-red-100 p-1 rounded">
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>

                            <input
                              type="text"
                              value={endereco.cep || ''}
                              onChange={async (e) => {
                                const cep = e.target.value.replace(/\D/g, '');
                                handleEnderecoChange(index, 'cep', cep);

                                if (cep.length === 8) {
                                  try {
                                    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                                    const data = await response.json();

                                    if (!data.erro) {
                                      handleEnderecoChange(index, 'logradouro', data.logradouro || '');
                                      handleEnderecoChange(index, 'cidade', data.localidade || '');
                                      handleEnderecoChange(index, 'uf', data.uf || '');
                                    }
                                  } catch (error) {
                                    console.error('Erro ao buscar CEP:', error);
                                  }
                                }
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="00000-000"
                            />

                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Logradouro</label>
                            <input type="text" value={endereco.logradouro || ''}
                              onChange={(e) => handleEnderecoChange(index, 'logradouro', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="Rua, Avenida..." />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                            <input type="text" value={endereco.cidade || ''}
                              onChange={(e) => handleEnderecoChange(index, 'cidade', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="Cidade" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">UF</label>
                            <input type="text" value={endereco.uf || ''}
                              onChange={(e) => handleEnderecoChange(index, 'uf', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="SP" maxLength="2" />
                          </div>
                        </div>
                      </div>
                    ))}

                    {formData.enderecos.length === 0 && (
                      <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                        <MapPin size={48} className="mx-auto mb-3 text-gray-400" />
                        <p className="font-medium">Nenhum endereço cadastrado</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {abaSelecionada === 'contatos' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="font-semibold text-gray-800 flex items-center gap-2">
                      <Phone size={20} className="text-blue-600" />
                      Contatos Cadastrados
                    </h5>
                    <button type="button" onClick={adicionarContato}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-2">
                      <Plus size={18} />
                      Adicionar Contato
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.contatos.map((contato, index) => (
                      <div key={index} className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <h6 className="font-medium text-gray-800">📞 Contato {index + 1}</h6>
                          <button type="button" onClick={() => removerContato(index)}
                            className="text-red-600 hover:bg-red-100 p-1 rounded">
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                            <select value={contato.tipo || 'CELULAR'}
                              onChange={(e) => handleContatoChange(index, 'tipo', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                              <option value="CELULAR">Celular</option>
                              <option value="TELEFONE_FIXO">Telefone Fixo</option>
                              <option value="EMAIL">E-mail</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {contato.tipo === 'EMAIL' ? 'E-mail' : 'Número'}
                            </label>
                            <input
                              type={contato.tipo === 'EMAIL' ? 'email' : 'text'}
                              value={contato.valor || ''}
                              onChange={(e) => handleContatoChange(index, 'valor', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder={contato.tipo === 'EMAIL' ? 'email@exemplo.com' : '(00) 00000-0000'} />
                          </div>
                        </div>
                      </div>
                    ))}

                    {formData.contatos.length === 0 && (
                      <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                        <Phone size={48} className="mx-auto mb-3 text-gray-400" />
                        <p className="font-medium">Nenhum contato cadastrado</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {abaSelecionada === 'avaliacaoFisica' && (
                <div>
                  {/* Cabeçalho */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4 flex gap-3">
                    <div className="bg-blue-600 text-white p-2 rounded-lg">📊</div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-1">Histórico de Avaliações Físicas</h5>
                      <p className="text-sm text-gray-600">Registre as avaliações físicas do aluno. Cálculos de IMC, massa magra e gorda são automáticos.</p>
                    </div>
                  </div>

                  {/* Contador e botão */}
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="font-semibold text-gray-800 flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm">
                        {formData.avaliacoesFisicas.length} {formData.avaliacoesFisicas.length === 1 ? 'avaliação' : 'avaliações'}
                      </span>
                    </h5>
                    <button type="button" onClick={adicionarAvaliacaoFisica}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-2 shadow-md transition-colors">
                      <Plus size={18} />Nova Avaliação
                    </button>
                  </div>

                  {/* Lista de avaliações */}
                  <div className="space-y-6">
                    {formData.avaliacoesFisicas.map((avaliacao, index) => (
                      <div key={index} className="border-2 border-gray-200 rounded-lg bg-white shadow-sm">
                        {/* Cabeçalho */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200 flex justify-between items-center">
                          <div>
                            <h6 className="font-bold text-gray-900 text-lg mb-1">📋 Avaliação #{formData.avaliacoesFisicas.length - index}</h6>
                            <input type="date" required value={avaliacao.dataAvaliacao}
                              onChange={e => handleAvaliacaoFisicaChange(index, 'dataAvaliacao', e.target.value)}
                              className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm font-medium" />
                          </div>
                          <button type="button" onClick={() => removerAvaliacaoFisica(index)}
                            className="text-red-600 hover:bg-red-100 p-2 rounded-lg transition-colors" title="Remover avaliação">
                            <Trash2 size={20} />
                          </button>
                        </div>

                        {/* Conteúdo */}
                        <div className="p-5 space-y-6">
                          {/* Medidas básicas */}
                          <div className="border border-gray-200 rounded-lg p-4">
                            <h6 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">1</span>Medidas Básicas
                            </h6>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {[
                                { label: "Peso (kg) *", key: "peso", step: "0.1", ph: "Ex: 75.5" },
                                { label: "Altura (m) *", key: "altura", step: "0.01", ph: "Ex: 1.75", extra: "💡 Digite em metros (ex: 1.75)" },
                                { label: "% Gordura", key: "percentualGordura", step: "0.1", ph: "Ex: 15.5" },
                              ].map(({ label, key, step, ph, extra }) => (
                                <div key={key}>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                                  <input type="number" step={step} required={label.includes('*')}
                                    value={avaliacao[key]} onChange={e => handleAvaliacaoFisicaChange(index, key, e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder={ph} />
                                  {extra && <p className="text-xs text-gray-500 mt-1">{extra}</p>}
                                </div>
                              ))}
                            </div>

                            {/* Resultados */}
                            {avaliacao.peso && avaliacao.altura && (
                              <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                                <h6 className="font-semibold text-green-900 mb-3">📈 Resultados Calculados</h6>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="bg-white rounded-lg p-3 shadow-sm">
                                    <p className="text-xs text-gray-600 mb-1">IMC</p>
                                    <p className="text-2xl font-bold text-gray-900">{avaliacao.imc || '-'}</p>
                                    {avaliacao.imc && (() => {
                                      const c = getClassificacaoIMC(parseFloat(avaliacao.imc)); return (
                                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${c.cor === 'green' ? 'bg-green-100 text-green-800' : c.cor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                                            c.cor === 'orange' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}`}>{c.texto}</span>)
                                    })()}
                                  </div>
                                  {avaliacao.massaMagra && <div className="bg-white rounded-lg p-3 shadow-sm"><p className="text-xs text-gray-600 mb-1">Massa Magra</p><p className="text-2xl font-bold text-blue-600">{avaliacao.massaMagra} kg</p></div>}
                                  {avaliacao.massaGorda && <div className="bg-white rounded-lg p-3 shadow-sm"><p className="text-xs text-gray-600 mb-1">Massa Gorda</p><p className="text-2xl font-bold text-orange-600">{avaliacao.massaGorda} kg</p></div>}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Circunferências */}
                          {[
                            {
                              titulo: 'Circunferências - Tronco', cor: 'purple', num: 2, campos: [
                                ['circunferenciaTorax', 'Tórax (cm)'], ['circunferenciaCintura', 'Cintura (cm)'], ['circunferenciaQuadril', 'Quadril (cm)']]
                            },
                            {
                              titulo: 'Circunferências - Membros Superiores', cor: 'orange', num: 3, campos: [
                                ['circunferenciaBracoDireito', '💪 Braço Direito (cm)'], ['circunferenciaBracoEsquerdo', '💪 Braço Esquerdo (cm)']]
                            },
                            {
                              titulo: 'Circunferências - Membros Inferiores', cor: 'green', num: 4, campos: [
                                ['circunferenciaCoxaDireita', '🦵 Coxa Direita (cm)'], ['circunferenciaCoxaEsquerda', '🦵 Coxa Esquerda (cm)'],
                                ['circunferenciaPanturrilhaDireita', '🦿 Panturrilha Direita (cm)'], ['circunferenciaPanturrilhaEsquerda', '🦿 Panturrilha Esquerda (cm)']]
                            }
                          ].map(({ titulo, cor, num, campos }) => (
                            <div key={num} className="border border-gray-200 rounded-lg p-4">
                              <h6 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <span className={`bg-${cor}-100 text-${cor}-700 px-3 py-1 rounded-full text-sm`}>{num}</span>{titulo}
                              </h6>
                              <div className={`grid grid-cols-1 md:grid-cols-${campos.length > 2 ? 2 : 3} gap-4`}>
                                {campos.map(([key, label]) => (
                                  <div key={key}>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                                    <input type="number" step="0.1" value={avaliacao[key]}
                                      onChange={e => handleAvaliacaoFisicaChange(index, key, e.target.value)}
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Ex: 36.5" />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}

                          {/* Observações */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">📝 Observações</label>
                            <textarea value={avaliacao.observacoes}
                              onChange={e => handleAvaliacaoFisicaChange(index, 'observacoes', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              rows="3" placeholder="Ex: Aluno apresenta boa mobilidade..." />
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Nenhuma avaliação */}
                    {formData.avaliacoesFisicas.length === 0 && (
                      <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                        <div className="text-6xl mb-4">📊</div>
                        <p className="font-medium text-lg mb-2">Nenhuma avaliação física cadastrada</p>
                        <p className="text-sm text-gray-600 mb-4">Clique em "Nova Avaliação" para começar</p>
                      </div>
                    )}
                  </div>

                  {/* Dica final */}
                  {formData.avaliacoesFisicas.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6 flex gap-3">
                      <span className="text-2xl">💡</span>
                      <div>
                        <h6 className="font-semibold text-amber-900 mb-1">Dica Profissional</h6>
                        <p className="text-sm text-amber-800">Registre avaliações periódicas (30-60 dias) para acompanhar a evolução do aluno. As mais recentes aparecem no topo.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}


              {abaSelecionada === 'avaliacaoFisica' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white p-2 rounded-lg">📊</div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-1">Avaliação Física Inicial</h5>
                        <p className="text-sm text-gray-600">Preencha os dados antropométricos do aluno. Os cálculos de IMC, massa magra e massa gorda serão feitos automaticamente.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Data da Avaliação *</label>
                    <input type="date" required value={formData.avaliacaoFisica.dataAvaliacao}
                      onChange={(e) => handleAvaliacaoFisicaChange('dataAvaliacao', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>

                  <div className="bg-white border-2 border-gray-200 rounded-lg p-5">
                    <h6 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">1</span>Medidas Básicas</h6>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Peso (kg) *</label>
                        <input type="number" step="0.1" required value={formData.avaliacaoFisica.peso}
                          onChange={(e) => handleAvaliacaoFisicaChange('peso', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Ex: 75.5" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Altura (m) *</label>
                        <input type="number" step="0.01" required value={formData.avaliacaoFisica.altura}
                          onChange={(e) => handleAvaliacaoFisicaChange('altura', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Ex: 1.75" min="0.5" max="2.5" />
                        <p className="text-xs text-gray-500 mt-1">💡 Digite em metros (ex: 1.75 para 1,75m)</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">% Gordura</label>
                        <input type="number" step="0.1" value={formData.avaliacaoFisica.percentualGordura}
                          onChange={(e) => handleAvaliacaoFisicaChange('percentualGordura', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Ex: 15.5" />
                      </div>
                    </div>

                    {formData.avaliacaoFisica.peso && formData.avaliacaoFisica.altura && (
                      <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                        <h6 className="font-semibold text-green-900 mb-3">📈 Resultados Calculados</h6>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white rounded-lg p-3 shadow-sm">
                            <p className="text-xs text-gray-600 mb-1">IMC</p>
                            <p className="text-2xl font-bold text-gray-900">{formData.avaliacaoFisica.imc || '-'}</p>
                            {formData.avaliacaoFisica.imc && (
                              <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {getClassificacaoIMC(parseFloat(formData.avaliacaoFisica.imc)).texto}
                              </span>
                            )}
                          </div>

                          {formData.avaliacaoFisica.massaMagra && (
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                              <p className="text-xs text-gray-600 mb-1">Massa Magra</p>
                              <p className="text-2xl font-bold text-blue-600">{formData.avaliacaoFisica.massaMagra} kg</p>
                            </div>
                          )}

                          {formData.avaliacaoFisica.massaGorda && (
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                              <p className="text-xs text-gray-600 mb-1">Massa Gorda</p>
                              <p className="text-2xl font-bold text-orange-600">{formData.avaliacaoFisica.massaGorda} kg</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-white border-2 border-gray-200 rounded-lg p-5">
                    <h6 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">2</span>Circunferências - Tronco</h6>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tórax (cm)</label>
                        <input type="number" step="0.1" value={formData.avaliacaoFisica.circunferenciaTorax}
                          onChange={(e) => handleAvaliacaoFisicaChange('circunferenciaTorax', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Ex: 95.5" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cintura (cm)</label>
                        <input type="number" step="0.1" value={formData.avaliacaoFisica.circunferenciaCintura}
                          onChange={(e) => handleAvaliacaoFisicaChange('circunferenciaCintura', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Ex: 82.0" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quadril (cm)</label>
                        <input type="number" step="0.1" value={formData.avaliacaoFisica.circunferenciaQuadril}
                          onChange={(e) => handleAvaliacaoFisicaChange('circunferenciaQuadril', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Ex: 98.5" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-gray-200 rounded-lg p-5">
                    <h6 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">3</span>Circunferências - Membros Superiores</h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">💪 Braço Direito (cm)</label>
                        <input type="number" step="0.1" value={formData.avaliacaoFisica.circunferenciaBracoDireito}
                          onChange={(e) => handleAvaliacaoFisicaChange('circunferenciaBracoDireito', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Ex: 32.5" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">💪 Braço Esquerdo (cm)</label>
                        <input type="number" step="0.1" value={formData.avaliacaoFisica.circunferenciaBracoEsquerdo}
                          onChange={(e) => handleAvaliacaoFisicaChange('circunferenciaBracoEsquerdo', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Ex: 32.0" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-gray-200 rounded-lg p-5">
                    <h6 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">4</span>Circunferências - Membros Inferiores</h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">🦵 Coxa Direita (cm)</label>
                        <input type="number" step="0.1" value={formData.avaliacaoFisica.circunferenciaCoxaDireita}
                          onChange={(e) => handleAvaliacaoFisicaChange('circunferenciaCoxaDireita', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Ex: 58.5" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">🦵 Coxa Esquerda (cm)</label>
                        <input type="number" step="0.1" value={formData.avaliacaoFisica.circunferenciaCoxaEsquerda}
                          onChange={(e) => handleAvaliacaoFisicaChange('circunferenciaCoxaEsquerda', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Ex: 58.0" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">🦿 Panturrilha Direita (cm)</label>
                        <input type="number" step="0.1" value={formData.avaliacaoFisica.circunferenciaPanturrilhaDireita}
                          onChange={(e) => handleAvaliacaoFisicaChange('circunferenciaPanturrilhaDireita', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Ex: 36.5" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">🦿 Panturrilha Esquerda (cm)</label>
                        <input type="number" step="0.1" value={formData.avaliacaoFisica.circunferenciaPanturrilhaEsquerda}
                          onChange={(e) => handleAvaliacaoFisicaChange('circunferenciaPanturrilhaEsquerda', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Ex: 36.0" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">📝 Observações</label>
                    <textarea value={formData.avaliacaoFisica.observacoes}
                      onChange={(e) => handleAvaliacaoFisicaChange('observacoes', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows="4"
                      placeholder="Ex: Aluno apresenta boa mobilidade, sem restrições de movimento. Objetivo principal é hipertrofia..." />
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <span className="text-2xl">💡</span>
                      <div>
                        <h6 className="font-semibold text-amber-900 mb-1">Dica Profissional</h6>
                        <p className="text-sm text-amber-800">Esta é a avaliação física inicial do aluno. Para acompanhar a evolução e criar novas avaliações, acesse o módulo "Avaliações Físicas" após salvar o cadastro do aluno.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {abaSelecionada === 'horarios' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="font-semibold text-gray-800">Horários de Treino</h5>
                    <button type="button" onClick={adicionarHorario}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-2">
                      <Plus size={18} />
                      Adicionar Horário
                    </button>
                  </div>
                  <div className="space-y-4">
                    {formData.horarios.map((horario, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <h6 className="font-medium text-gray-800">Horário {index + 1}</h6>
                          <button type="button" onClick={() => removerHorario(index)}
                            className="text-red-600 hover:bg-red-100 p-1 rounded">
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Local</label>
                            <input type="text" value={horario.local}
                              onChange={(e) => handleHorarioChange(index, 'local', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Ex: Academia Central" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Entrada</label>
                            <input type="time" value={horario.horarioEntrada}
                              onChange={(e) => handleHorarioChange(index, 'horarioEntrada', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Saída</label>
                            <input type="time" value={horario.horarioSaida}
                              onChange={(e) => handleHorarioChange(index, 'horarioSaida', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Dias da Semana</label>
                          <div className="flex flex-wrap gap-2">
                            {diasSemana.map(dia => (
                              <button key={dia.value} type="button"
                                onClick={() => toggleDiaSemana(index, dia.value)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${horario.diasSemana?.includes(dia.value)
                                  ? 'bg-blue-600 text-white shadow-md'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                  }`}>
                                {dia.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                    {formData.horarios.length === 0 && (
                      <p className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-300 rounded-lg">Nenhum horário cadastrado</p>
                    )}
                  </div>
                </div>
              )}

              {abaSelecionada === 'acesso' && (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-yellow-800">🔐 <strong>Informações de Segurança:</strong> Estas credenciais serão usadas para controle de acesso à academia.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {aluno ? 'Nova Senha (opcional)' : 'Senha de Acesso *'}
                    </label>
                    <input type="password" required={!aluno}
                      value={formData.controleAcesso.senha}
                      onChange={(e) => setFormData(prev => ({ ...prev, controleAcesso: { ...prev.controleAcesso, senha: e.target.value } }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder={aluno ? "Deixe vazio para manter a senha atual" : "Digite a senha (mínimo 4 dígitos)"} minLength="4" />

                    {aluno && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded">
                        <span>✓</span>
                        <span>Senha atual está protegida e será mantida se não preencher</span>
                      </div>
                    )}

                    <p className="text-xs text-gray-500 mt-1">
                      {aluno ? "⚠️ Preencha apenas se desejar alterar a senha existente" : "Senha numérica de 4+ dígitos para controle de acesso"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Impressão Digital 1</label>
                      <input type="text" value={formData.controleAcesso.impressaoDigital1}
                        onChange={(e) => setFormData(prev => ({ ...prev, controleAcesso: { ...prev.controleAcesso, impressaoDigital1: e.target.value } }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Código da digital 1" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Impressão Digital 2</label>
                      <input type="text" value={formData.controleAcesso.impressaoDigital2}
                        onChange={(e) => setFormData(prev => ({ ...prev, controleAcesso: { ...prev.controleAcesso, impressaoDigital2: e.target.value } }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Código da digital 2" />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <h6 className="font-semibold text-blue-900 mb-2">💡 Dica de Uso</h6>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• A senha é obrigatória e será usada na catraca</li>
                      <li>• Registre até 2 impressões digitais para backup</li>
                      <li>• Mantenha os dados atualizados para evitar problemas de acesso</li>
                    </ul>
                  </div>
                </div>
              )}


            </div>
          </div>

          <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Aba atual:</span> {abas.find(a => a.id === abaSelecionada)?.label}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={onCancelar}
                className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors">
                Cancelar
              </button>
              <button type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 shadow-md transition-colors">
                <Save size={18} />
                Salvar Aluno
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AlunoForm;
