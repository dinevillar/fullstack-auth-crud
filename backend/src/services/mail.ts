import nodemailer from 'nodemailer';
import { config } from '@/config'

export const mailTransport = nodemailer.createTransport({
  host: config.smtpHost,
  port: config.smtpPort,
  auth: {
    user: config.smtpAuthUser,
    pass: config.smtpAuthPassword
  }
});
