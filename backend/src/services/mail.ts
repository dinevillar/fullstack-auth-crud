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

export const sendHtmlEmail = async (to: string, subject: string, html: string) => {
  try {
    await mailTransport.sendMail({
      from: {
        name: config.smtpFromName,
        email: config.smtpFromEmail,
      },
      to,
      subject,
      html
    })
  } catch(err) {
    console.log(err)
    throw err
  }
}
