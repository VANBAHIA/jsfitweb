module.exports = {
  apps: [{
    name: 'jsfit-gestao',
    script: './src/server.js',
    
    // Cluster mode com 2 instâncias
    instances: 2,
    exec_mode: 'cluster',
    
    // Variáveis de ambiente
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    
    // Logs
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    
    // Restart automático
    max_memory_restart: '500M',
    autorestart: true,
    watch: false,
    
    // Tratamento de erros
    min_uptime: '10s',
    max_restarts: 10,
    restart_delay: 4000,
    
    // Monitoramento
    listen_timeout: 3000,
    kill_timeout: 5000
  }]
}
