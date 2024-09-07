/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from 'nodemailer';
import config from '../config';
import ApiError from '../error/ApiError';
import httpStatus from 'http-status';

const transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  secure: false,
  auth: config.mail.auth,
});

export interface ISendMail {
  sendTo: string;
  subject: string;
  body: string;
}

const sendMail = async ({ sendTo, subject, body }: ISendMail) => {
  try {
    const info = await transporter.sendMail({
      from: `${config.app_name} "<${config.mail.auth.user}>`,
      to: sendTo,
      subject: subject,
      html: body,
    });

    if (!info.messageId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to send email');
    }
  } catch (error: any) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

export default sendMail;
