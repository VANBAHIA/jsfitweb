/**
 * Utilitário para gerenciar cache de login
 * Armazena dados da última empresa logada
 */

const STORAGE_KEY = 'fitgestao_ultimo_login';

export const loginCache = {
  /**
   * Salva dados da última empresa logada
   */
  salvarUltimaEmpresa(dadosEmpresa) {
    try {
      const dados = {
        // Dados da empresa
        id: dadosEmpresa.id,
        nomeFantasia: dadosEmpresa.nomeFantasia,
        razaoSocial: dadosEmpresa.razaoSocial,
        cnpj: dadosEmpresa.cnpj,
        logo: dadosEmpresa.logo || null,
        
        // Dados do último acesso
        ultimoUsuario: dadosEmpresa.ultimoUsuario || null,
        dataUltimoAcesso: new Date().toISOString()
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
      console.log('💾 Cache salvo:', dados.nomeFantasia);
    } catch (error) {
      console.error('❌ Erro ao salvar cache de login:', error);
    }
  },

  /**
   * Recupera dados da última empresa logada
   */
  obterUltimaEmpresa() {
    try {
      const dados = localStorage.getItem(STORAGE_KEY);
      if (!dados) return null;
      
      const empresaCache = JSON.parse(dados);
      
      // Verificar se cache não expirou (30 dias)
      const dataCache = new Date(empresaCache.dataUltimoAcesso);
      const diasPassados = (new Date() - dataCache) / (1000 * 60 * 60 * 24);
      
      if (diasPassados > 30) {
        console.log('⚠️ Cache expirado (30 dias)');
        this.limparCache();
        return null;
      }
      
      console.log('✅ Cache recuperado:', empresaCache.nomeFantasia);
      return empresaCache;
    } catch (error) {
      console.error('❌ Erro ao recuperar cache de login:', error);
      return null;
    }
  },

  /**
   * Limpa cache de login
   */
  limparCache() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('🗑️ Cache limpo');
    } catch (error) {
      console.error('❌ Erro ao limpar cache de login:', error);
    }
  },

  /**
   * Verifica se existe cache válido
   */
  temCacheValido() {
    return this.obterUltimaEmpresa() !== null;
  },

  /**
   * Formata CNPJ para exibição
   */
  formatarCNPJ(cnpj) {
    if (!cnpj) return '';
    return cnpj.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    );
  }
};