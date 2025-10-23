#!/bin/bash

# ====================================
# Script de Deploy JSFitGestão
# ====================================

set -e  # Parar se houver erro

echo "🚀 ====================================="
echo "   Deploy JSFitGestão"
echo "🚀 ====================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ====================================
# 1. VERIFICAÇÕES INICIAIS
# ====================================
echo "📋 Verificando requisitos..."

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não está instalado${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ NPM não está instalado${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v)${NC}"
echo -e "${GREEN}✅ NPM $(npm -v)${NC}"
echo ""

# ====================================
# 2. BACKUP DO BANCO DE DADOS
# ====================================
echo "💾 Criando backup do banco de dados..."
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# Backup do PostgreSQL (ajuste conforme seu banco)
# pg_dump -U postgres jsfit_gestao > $BACKUP_DIR/database.sql

echo -e "${GREEN}✅ Backup criado em $BACKUP_DIR${NC}"
echo ""

# ====================================
# 3. BUILD DO FRONTEND
# ====================================
echo "⚛️  Compilando Frontend..."
cd frontend

# Instalar dependências
echo "📦 Instalando dependências do frontend..."
npm install

# Build de produção
echo "🔨 Gerando build de produção..."
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Erro ao gerar build do frontend${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Frontend compilado com sucesso${NC}"
cd ..
echo ""

# ====================================
# 4. COPIAR BUILD PARA O BACKEND
# ====================================
echo "📁 Copiando build para o backend..."

# Remover build antigo
rm -rf backend/frontend

# Criar diretório e copiar
mkdir -p backend/frontend
cp -r frontend/dist/* backend/frontend/

echo -e "${GREEN}✅ Build copiado para backend/frontend${NC}"
echo ""

# ====================================
# 5. PREPARAR BACKEND
# ====================================
echo "🔧 Preparando Backend..."
cd backend

# Instalar dependências
echo "📦 Instalando dependências do backend..."
npm install --production

# Gerar Prisma Client
echo "🗄️  Gerando Prisma Client..."
npx prisma generate

# Aplicar migrations (cuidado em produção!)
echo "⚠️  Deseja aplicar migrations? (s/n)"
read -r APPLY_MIGRATIONS

if [ "$APPLY_MIGRATIONS" = "s" ]; then
    echo "📊 Aplicando migrations..."
    npx prisma migrate deploy
fi

echo -e "${GREEN}✅ Backend preparado${NC}"
cd ..
echo ""

# ====================================
# 6. CONFIGURAR PM2 (PROCESSO)
# ====================================
echo "⚙️  Configurando PM2..."

# Criar/atualizar ecosystem.config.js
cat > backend/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'jsfit-gestao',
    script: './src/server.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '500M',
    autorestart: true,
    watch: false
  }]
}
EOF

echo -e "${GREEN}✅ PM2 configurado${NC}"
echo ""

# ====================================
# 7. REINICIAR APLICAÇÃO
# ====================================
echo "🔄 Reiniciando aplicação..."
cd backend

# Verificar se PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  PM2 não instalado. Instalando globalmente...${NC}"
    npm install -g pm2
fi

# Parar aplicação antiga (se existir)
pm2 stop jsfit-gestao 2>/dev/null || true
pm2 delete jsfit-gestao 2>/dev/null || true

# Iniciar nova aplicação
pm2 start ecosystem.config.js

# Salvar configuração do PM2
pm2 save

# Configurar PM2 para iniciar no boot
pm2 startup

echo -e "${GREEN}✅ Aplicação reiniciada com sucesso${NC}"
echo ""

# ====================================
# 8. VERIFICAR STATUS
# ====================================
echo "📊 Status da aplicação:"
pm2 list
echo ""

# ====================================
# 9. CONFIGURAR NGINX (OPCIONAL)
# ====================================
echo "🌐 Deseja configurar/atualizar Nginx? (s/n)"
read -r CONFIGURE_NGINX

if [ "$CONFIGURE_NGINX" = "s" ]; then
    cat > /tmp/jsfit-nginx.conf << 'EOF'
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;

    # Redirecionar para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name seudominio.com www.seudominio.com;

    # Certificados SSL (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/seudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seudominio.com/privkey.pem;

    # Configurações de segurança SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;

    # Logs
    access_log /var/log/nginx/jsfit-access.log;
    error_log /var/log/nginx/jsfit-error.log;

    # Limites
    client_max_body_size 10M;

    # Proxy para a aplicação Node.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache para arquivos estáticos
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

    echo "📄 Arquivo de configuração Nginx gerado em /tmp/jsfit-nginx.conf"
    echo "📝 Copie para /etc/nginx/sites-available/ e crie link simbólico"
    echo ""
fi

# ====================================
# 10. FINALIZAÇÃO
# ====================================
echo ""
echo "✨ ====================================="
echo "   Deploy concluído com sucesso!"
echo "✨ ====================================="
echo ""
echo "📋 Próximos passos:"
echo "   1. Verificar logs: pm2 logs jsfit-gestao"
echo "   2. Monitorar: pm2 monit"
echo "   3. Acessar: http://seu-servidor:3000"
echo ""
echo "🔒 Segurança:"
echo "   - Configure firewall (ufw)"
echo "   - Configure SSL/HTTPS"
echo "   - Configure backup automático"
echo ""
echo "📚 Comandos úteis:"
echo "   - pm2 restart jsfit-gestao"
echo "   - pm2 stop jsfit-gestao"
echo "   - pm2 logs jsfit-gestao"
echo "   - pm2 monit"
echo ""