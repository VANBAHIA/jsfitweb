import React from 'react';
import { User, CreditCard, Users, DollarSign, Calendar, FileText, Check } from 'lucide-react';

function Step5Resumo({ dados }) {
  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0);
  };

  const formatarData = (data) => {
    if (!data) return 'Não informada';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const obterTextoFormaPagamento = (forma) => {
    const formas = {
      'DINHEIRO': '💵 Dinheiro',
      'PIX': '📱 PIX',
      'CARTAO_CREDITO': '💳 Cartão de Crédito',
      'CARTAO_DEBITO': '💳 Cartão de Débito',
      'BOLETO': '🧾 Boleto'
    };
    return formas[forma] || forma;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-100 rounded-lg">
            <Check className="text-green-600" size={28} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-green-900">
              ✅ Confirme os Dados da Matrícula
            </h3>
            <p className="text-green-700 text-sm">
              Revise todas as informações antes de finalizar
            </p>
          </div>
        </div>
      </div>

      {/* Grid de Informações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card do Aluno */}
        <div className="bg-white border-2 border-blue-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
            <div className="p-3 bg-blue-100 rounded-lg">
              <User className="text-blue-600" size={24} />
            </div>
            <h4 className="text-lg font-bold text-gray-900">Dados do Aluno</h4>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                Nome Completo
              </span>
              <span className="text-base font-semibold text-gray-900">
                {dados.aluno?.pessoa?.nome1} {dados.aluno?.pessoa?.nome2 || ''}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                Matrícula
              </span>
              <span className="text-base text-gray-900 font-mono">
                {dados.aluno?.matricula}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                CPF
              </span>
              <span className="text-base text-gray-900">
                {dados.aluno?.pessoa?.doc1 || 'Não informado'}
              </span>
            </div>

            {dados.aluno?.pessoa?.contatos && dados.aluno.pessoa.contatos.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                  Contato
                </span>
                <span className="text-base text-gray-900">
                  {dados.aluno.pessoa.contatos[0].valor}
                </span>
              </div>
            )}

            <div className="pt-3">
              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                dados.aluno?.pessoa?.situacao === 'ATIVO'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {dados.aluno?.pessoa?.situacao}
              </span>
            </div>
          </div>
        </div>

        {/* Card do Plano */}
        <div className="bg-white border-2 border-purple-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CreditCard className="text-purple-600" size={24} />
            </div>
            <h4 className="text-lg font-bold text-gray-900">Plano Escolhido</h4>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                Nome do Plano
              </span>
              <span className="text-base font-semibold text-gray-900">
                {dados.plano?.nome}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                Código
              </span>
              <span className="text-base text-gray-900 font-mono">
                {dados.plano?.codigo}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                Periodicidade
              </span>
              <span className="text-base text-gray-900">
                {dados.plano?.periodicidade}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                Valor Mensal
              </span>
              <span className="text-2xl font-bold text-green-600">
                {formatarValor(dados.plano?.valorMensalidade)}
              </span>
            </div>
          </div>
        </div>

        {/* Card da Turma (se selecionada) */}
        {dados.turma && (
          <div className="bg-white border-2 border-orange-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Users className="text-orange-600" size={24} />
              </div>
              <h4 className="text-lg font-bold text-gray-900">Turma</h4>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                  Nome da Turma
                </span>
                <span className="text-base font-semibold text-gray-900">
                  {dados.turma.nome}
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                  Sexo
                </span>
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                  dados.turma.sexo === 'MASCULINO' 
                    ? 'bg-blue-100 text-blue-800'
                    : dados.turma.sexo === 'FEMININO'
                    ? 'bg-pink-100 text-pink-800'
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {dados.turma.sexo}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Card de Valores e Pagamento */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white border-opacity-30">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <DollarSign className="text-white" size={24} />
            </div>
            <h4 className="text-lg font-bold">Valores e Pagamento</h4>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm opacity-90">Valor do Plano:</span>
              <span className="text-lg font-bold">
                {formatarValor(dados.plano?.valorMensalidade)}
              </span>
            </div>

            {dados.desconto && (
              <div className="flex justify-between items-center pb-4 border-b border-white border-opacity-30">
                <span className="text-sm opacity-90">
                  Desconto ({dados.desconto.descricao}):
                </span>
                <span className="text-lg font-bold text-yellow-300">
                  - {formatarValor(dados.valorDesconto)}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <span className="text-base font-semibold">VALOR FINAL:</span>
              <span className="text-3xl font-bold">
                {formatarValor(dados.valorFinal || dados.plano?.valorMensalidade)}
              </span>
            </div>

            <div className="bg-white bg-opacity-20 rounded-lg p-4 mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Forma de Pagamento:</span>
                <span className="font-semibold">{obterTextoFormaPagamento(dados.formaPagamento)}</span>
              </div>
              
              {dados.parcelamento > 1 && (
                <div className="flex justify-between">
                  <span className="text-sm">Parcelamento:</span>
                  <span className="font-semibold">
                    {dados.parcelamento}x de {formatarValor((dados.valorFinal || dados.plano?.valorMensalidade) / dados.parcelamento)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card de Datas */}
      <div className="bg-white border-2 border-blue-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Calendar className="text-blue-600" size={24} />
          </div>
          <h4 className="text-lg font-bold text-gray-900">Informações de Data</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">
              Data de Início
            </span>
            <span className="text-lg font-bold text-gray-900">
              {formatarData(dados.dataInicio)}
            </span>
          </div>

          {dados.diaVencimento && (
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                Dia de Vencimento
              </span>
              <span className="text-lg font-bold text-gray-900">
                Todo dia {dados.diaVencimento}
              </span>
            </div>
          )}

          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">
              Situação Inicial
            </span>
            <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
              ATIVA
            </span>
          </div>
        </div>
      </div>

      {/* Observações (se houver) */}
      {dados.observacoes && (
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FileText className="text-gray-600" size={20} />
            </div>
            <h4 className="font-bold text-gray-900">Observações</h4>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            {dados.observacoes}
          </p>
        </div>
      )}

      {/* Alerta Final */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <span className="text-3xl">⚠️</span>
          <div>
            <h5 className="font-bold text-yellow-900 mb-2">Atenção - Confirmação Final</h5>
            <p className="text-sm text-yellow-800 mb-3">
              Você está prestes a criar uma nova matrícula. Antes de confirmar, verifique se:
            </p>
            <ul className="text-sm text-yellow-800 space-y-1 ml-4">
              <li>✓ Todos os dados do aluno estão corretos</li>
              <li>✓ O plano selecionado é o adequado</li>
              <li>✓ Os valores e descontos estão corretos</li>
              <li>✓ As datas estão configuradas corretamente</li>
            </ul>
            <p className="text-sm text-yellow-800 mt-3 font-semibold">
              Clique em "Confirmar Matrícula" para finalizar o cadastro.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step5Resumo;