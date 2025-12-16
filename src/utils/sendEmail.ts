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
      service: "gmail", // lets nodemailer handle host/port/secure
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass, // App Password
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
