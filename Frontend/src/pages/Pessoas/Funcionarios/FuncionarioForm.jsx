import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, MapPin, Phone, Briefcase } from 'lucide-react';
import { funcoesService } from '../../../services/api/funcoesService';

function FuncionarioForm({ funcionario, onSalvar, onCancelar }) {
    const [abaSelecionada, setAbaSelecionada] = useState('principal');
    const [funcoes, setFuncoes] = useState([]); // ✅ MOVIDO PARA DENTRO DO COMPONENTE
    const [formData, setFormData] = useState({
        pessoaId: '',
        pessoa: {
            nome1: '',
            nome2: '',
            doc1: '',
            doc2: '',
            dtNsc: '',
            situacao: 'ATIVO'
        },
        enderecos: [],
        contatos: [],
        funcaoId: '',
        dataAdmissao: '',
        dataDemissao: '',
        salario: '',
        situacao: 'ATIVO',
        controleAcesso: {  // ✅ ADICIONE ESTE OBJETO
            senha: '',
            impressaoDigital1: '',
            impressaoDigital2: ''
        }
    });

    // ✅ CARREGAR FUNÇÕES DA API
    useEffect(() => {
        const carregarFuncoes = async () => {
            try {
                const resposta = await funcoesService.listarTodos({ status: 'ATIVO' });
                console.log('📋 Funções carregadas:', resposta);

                // Ajuste conforme estrutura da resposta
                const listaFuncoes = resposta.data?.funcoes || resposta.funcoes || [];
                setFuncoes(listaFuncoes);
            } catch (error) {
                console.error('❌ Erro ao carregar funções:', error);
            }
        };
        carregarFuncoes();
    }, []);


    useEffect(() => {
        if (funcionario) {
            const formatarData = (data) => {
                if (!data) return '';
                return data.split('T')[0];
            };

            const dadosFuncionario = funcionario.data || funcionario;

            console.log('🔍 Funcionário completo:', dadosFuncionario);
            console.log('🎯 funcaoId encontrado:', dadosFuncionario.funcaoId);

            setFormData({
                pessoaId: dadosFuncionario.pessoaId || dadosFuncionario.pessoa?.id || '',
                pessoa: {
                    codigo: dadosFuncionario.pessoa?.codigo || '',
                    nome1: dadosFuncionario.pessoa?.nome1 || '',
                    nome2: dadosFuncionario.pessoa?.nome2 || '',
                    doc1: dadosFuncionario.pessoa?.doc1 || '',
                    doc2: dadosFuncionario.pessoa?.doc2 || '',
                    dtNsc: formatarData(dadosFuncionario.pessoa?.dtNsc),
                    situacao: dadosFuncionario.pessoa?.situacao || 'ATIVO'
                },
                enderecos: dadosFuncionario.pessoa?.enderecos || [],
                contatos: dadosFuncionario.pessoa?.contatos || [],
                funcaoId: dadosFuncionario.funcaoId || '',
                dataAdmissao: formatarData(dadosFuncionario.dataAdmissao),
                dataDemissao: formatarData(dadosFuncionario.dataDemissao),
                salario: dadosFuncionario.salario?.toString() || '',
                situacao: dadosFuncionario.situacao || 'ATIVO',
                // ✅ CORRIGIDO: Garantir que controleAcesso sempre exista
                controleAcesso: {
                    senha: dadosFuncionario.controleAcesso?.senha || '',
                    impressaoDigital1: dadosFuncionario.controleAcesso?.impressaoDigital1 || '',
                    impressaoDigital2: dadosFuncionario.controleAcesso?.impressaoDigital2 || ''
                }
            });
        }
    }, [funcionario]);

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log('🔍 formData completo:', formData);
        console.log('🎯 funcaoId selecionado:', formData.funcaoId);

        const dadosParaSalvar = {
            pessoa: {
                tipo: 'FISICA',
                nome1: formData.pessoa.nome1,
                nome2: formData.pessoa.nome2 || '',
                doc1: formData.pessoa.doc1,
                doc2: formData.pessoa.doc2 || '',
                dtNsc: formData.pessoa.dtNsc || null,
                situacao: formData.pessoa.situacao || 'ATIVO',
                enderecos: formData.enderecos || [],
                contatos: formData.contatos || []
            },
            funcionario: {
                funcaoId: formData.funcaoId,
                dataAdmissao: formData.dataAdmissao,
                dataDemissao: formData.dataDemissao || null,
                salario: formData.salario ? parseFloat(formData.salario) : null,
                situacao: formData.situacao || 'ATIVO',
                matricula: formData.matricula || '' // deixa vazio para gerar automaticamente
            }
        };



        console.log('📤 Dados que serão enviados:', dadosParaSalvar);

        onSalvar(dadosParaSalvar);
    };

    const handleChange = (campo, valor) => {
        setFormData(prev => ({ ...prev, [campo]: valor }));
    };

    const handlePessoaChange = (campo, valor) => {
        setFormData(prev => ({
            ...prev,
            pessoa: { ...prev.pessoa, [campo]: valor }
        }));
    };

    // ENDEREÇOS
    const adicionarEndereco = () => {
        setFormData(prev => ({
            ...prev,
            enderecos: [...prev.enderecos, {
                logradouro: '',
                cep: '',
                cidade: '',
                uf: ''
            }]
        }));
    };

    const removerEndereco = (index) => {
        setFormData(prev => ({
            ...prev,
            enderecos: prev.enderecos.filter((_, i) => i !== index)
        }));
    };

    const handleEnderecoChange = (index, campo, valor) => {
        setFormData(prev => ({
            ...prev,
            enderecos: prev.enderecos.map((end, i) =>
                i === index ? { ...end, [campo]: valor } : end
            )
        }));
    };

    // CONTATOS
    const adicionarContato = () => {
        setFormData(prev => ({
            ...prev,
            contatos: [...prev.contatos, {
                tipo: 'CELULAR',
                valor: ''
            }]
        }));
    };

    const removerContato = (index) => {
        setFormData(prev => ({
            ...prev,
            contatos: prev.contatos.filter((_, i) => i !== index)
        }));
    };

    const handleContatoChange = (index, campo, valor) => {
        setFormData(prev => ({
            ...prev,
            contatos: prev.contatos.map((cont, i) =>
                i === index ? { ...cont, [campo]: valor } : cont
            )
        }));
    };

    const abas = [
        { id: 'principal', label: 'Dados Principais', icon: '📋' },
        { id: 'enderecos', label: 'Endereços', icon: '📍' },
        { id: 'contatos', label: 'Contatos', icon: '📞' },
        { id: 'acesso', label: 'Controle de Acesso', icon: '🔐' }
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center overflow-y-auto py-8 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl mx-4">
                {/* Header */}
                <div className="p-6 border-b flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700">
                    <h3 className="text-2xl font-bold text-white">
                        {funcionario ? 'Editar Funcionário' : 'Novo Funcionário'}
                    </h3>
                    <button onClick={onCancelar} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Tabs */}
                    <div className="border-b px-6 bg-gray-50 overflow-x-auto">
                        <div className="flex gap-2">
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

                    <div className="p-6 max-h-[calc(100vh-300px)] overflow-y-auto">
                        {/* ABA: DADOS PRINCIPAIS */}
                        {abaSelecionada === 'principal' && (
                            <div className="space-y-6">
                                {/* Informações Pessoais */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        👤 Informações Pessoais
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
                                            <input type="text" required value={formData.pessoa.nome1}
                                                onChange={(e) => handlePessoaChange('nome1', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                placeholder="Nome completo do funcionário" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Apelido / Nome Social</label>
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

                                {/* Dados Profissionais */}
                                <div className="pt-6 border-t">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <Briefcase size={20} className="text-blue-600" />
                                        Dados Profissionais
                                    </h4>

                                    {funcionario && (
                                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                            <p className="text-sm text-blue-800">
                                                <strong>Matrícula:</strong> {funcionario.matricula || 'Será gerada automaticamente'}
                                            </p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Função *</label>
                                            <select required value={formData.funcaoId}
                                                onChange={(e) => handleChange('funcaoId', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                                <option value="">Selecione a função</option>
                                                {funcoes.map(funcao => (
                                                    <option key={funcao.id} value={funcao.id}>
                                                        {funcao.funcao} {/* ✅ CORRIGIDO: era funcao.descricao */}
                                                    </option>
                                                ))}
                                            </select>

                                            {/* ✅ ADICIONAR FEEDBACK */}
                                            {funcoes.length === 0 && (
                                                <p className="text-xs text-amber-600 mt-1">
                                                    ⚠️ Nenhuma função cadastrada. Cadastre funções primeiro!
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Data de Admissão *</label>
                                            <input type="date" required value={formData.dataAdmissao} // ✅ CORRIGIDO
                                                onChange={(e) => handleChange('dataAdmissao', e.target.value)} // ✅ CORRIGIDO
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Salário (R$)</label>
                                            <input type="number" step="0.01" min="0" value={formData.salario}
                                                onChange={(e) => handleChange('salario', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                placeholder="0.00" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ABA: ENDEREÇOS */}
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
                                                    <input type="text" value={endereco.cep || ''}
                                                        onChange={(e) => handleEnderecoChange(index, 'cep', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                        placeholder="00000-000" />
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

                        {/* ABA: CONTATOS */}
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

                        {/* ABA: CONTROLE DE ACESSO */}
                        {abaSelecionada === 'acesso' && (
                            <div className="space-y-4">
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                                    <p className="text-sm text-yellow-800">
                                        🔐 <strong>Informações de Segurança:</strong> Estas credenciais serão usadas para controle de acesso à academia.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Senha de Acesso {funcionario ? '' : '*'}
                                    </label>
                                    <input
                                        type="password"
                                        required={!funcionario}
                                        value={formData.controleAcesso.senha}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            controleAcesso: { ...prev.controleAcesso, senha: e.target.value }
                                        }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder={funcionario ? "Deixe em branco para manter a atual" : "Digite a senha (mínimo 4 dígitos)"}
                                        minLength="4" />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {funcionario
                                            ? "Preencha apenas se desejar alterar a senha"
                                            : "Senha numérica para catraca/controle de acesso"}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Impressão Digital 1</label>
                                        <input type="text" value={formData.controleAcesso.impressaoDigital1}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                controleAcesso: { ...prev.controleAcesso, impressaoDigital1: e.target.value }
                                            }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="Código da digital 1" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Impressão Digital 2</label>
                                        <input type="text" value={formData.controleAcesso.impressaoDigital2}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                controleAcesso: { ...prev.controleAcesso, impressaoDigital2: e.target.value }
                                            }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="Código da digital 2" />
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

                    {/* Footer */}
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
                                Salvar Funcionário
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FuncionarioForm;