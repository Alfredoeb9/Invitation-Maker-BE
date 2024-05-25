import nodemailer from "nodemailer";
import { getForgotTemplate } from "../services/templateService";

const SMTPConfig = {
  service: "gmail",
  EMAIL: process.env.REACT_APP_SERVER_EMAIL,
  PASSWORD: process.env.REACT_APPEMAIL_PWD,
  PORT: 587,
  FROM_EMAIL: process.env.REACT_APP_SERVER_EMAIL,
};

const transporter = nodemailer.createTransport({
  secure: false,
  service: SMTPConfig.service,
  auth: {
    user: SMTPConfig.EMAIL,
    pass: SMTPConfig.PASSWORD,
  },
});

interface MailOptionsTypes {
  from: string;
  to: string;
  subject: string;
  html: string;
}

const sendEmail = async (mailOptions: MailOptionsTypes) => {
  transporter.verify(async (error) => {
    if (error) throw Error("Something went wrong");
  });

  const emailResponse = await transporter.sendMail(mailOptions);

  if (!emailResponse) return { error: "Something went wrong" };

  return { result: "Email sent successfully" };
};

export const sendVerifyingUserEmail = async (
  toEmail: string,
  name: string,
  url: string
) => {
  const content = `We're excited to have you get started. Please verify you email by clicking on the link below.`;
  const title = "Welcome!";
  const button = "Verify Email";
  const subTxt = "";
  const mainLink = url;

  const html = getForgotTemplate({
    name,
    content,
    title,
    button,
    subTxt,
    mainLink,
  });

  const mailOptions = {
    from: SMTPConfig.FROM_EMAIL,
    to: toEmail,
    subject: "Verify your email for A1. Invitation Maker!",
    html,
  };

  const sendEmailResponse = await sendEmail(mailOptions);
  if (!sendEmailResponse) throw Error("Email Not Sent");

  return sendEmailResponse;
};
