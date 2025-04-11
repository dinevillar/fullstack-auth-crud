import express from 'express';
import cors from 'cors';
import session from 'express-session';
import Redis from 'ioredis';
import RedisStore from 'connect-redis';
import { config } from './config';
import { connectDB } from './db';

const redis = new Redis(config.redisUrl);
const redisStore = new RedisStore({
  client: redis
})

const app = express();

app.use(cors({
  origin: config.clientUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use(session({
  store: redisStore,
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.nodeEnv === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    sameSite: config.nodeEnv === 'production' ? 'none' : 'lax'
  }
}));

const start = async () => {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
