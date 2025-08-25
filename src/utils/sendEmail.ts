// core
import { config } from "@config/env";
import nodemailer from "nodemailer";


export const sendEmail = async (
  to: string | string[],
  subject: string,
  html: string,
  from: string = config.emailSender,
  attachments?: {
    filename: string;
    content: Buffer;
    contentType: string;
  }[]
) => {
  try {
    to = Array.isArray(to) ? to.join(",") : to;

    const smtpTransporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await smtpTransporter.verify();
    console.log("SMTP connection OK");

    const sendResult = await smtpTransporter.sendMail({
      from,
      to,
      subject,
      text: html.replace(/<(?:.|\n)*?>/gm, ""),
      html,
      attachments, // include here
    });

    return !!sendResult.messageId;
  } catch (error) {
    throw error;
  }
};
