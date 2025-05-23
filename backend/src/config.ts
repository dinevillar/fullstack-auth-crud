import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5001', 10),
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/auth-crud',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  serverUrl: process.env.SERVER_URL || 'http://localhost:5001',
  sessionSecret: process.env.SESSION_SECRET || 'your-secret-key',
  jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret',
  googleClientId: process.env.GOOGLE_CLIENT_ID || 'test-google-client-id',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  smtpHost: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
  smtpPort: parseInt(process.env.SMTP_PORT || '2525', 10),
  smtpAuthUser: process.env.SMTP_AUTH_USER || 'test-user',
  smtpAuthPassword: process.env.SMTP_AUTH_PASSWORD || 'test-password',
  smtpFromEmail: process.env.SMTP_FROM_EMAIL || 'dev@localhost',
  smtpFromName: process.env.SMTP_FROM_NAME || 'My App',
};
