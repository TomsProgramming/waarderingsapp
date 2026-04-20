export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || '3306',
    dbUser: process.env.DB_USER || 'root',
    dbPassword: process.env.DB_PASSWORD || '',
    dbName: process.env.DB_NAME || 'waarderingsapp',
    authSecret: process.env.AUTH_SECRET || 'dev-insecure-secret-change-me-in-production-please',
    smtpHost: process.env.SMTP_HOST || '',
    smtpPort: process.env.SMTP_PORT || '587',
    smtpSecure: process.env.SMTP_SECURE || 'false',
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    smtpFrom: process.env.SMTP_FROM || 'Waarderingsapp <noreply@example.com>',
    public: {
      baseUrl: process.env.PUBLIC_BASE_URL || 'http://localhost:3000'
    }
  },
  nitro: {
    experimental: {
      asyncContext: true
    }
  }
})
