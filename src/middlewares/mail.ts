import nodemailer from 'nodemailer'
import * as dotenv from 'dotenv'
dotenv.config()

interface EmailOptions {
  email: string;
  subject: string;
  html: string;
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "Gmail",
    port: 587,
    auth: {
      user: process.env.USER, // Update with your actual environment variable name
      pass: process.env.PASSWORD, // Update with your actual environment variable name
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // async..await is not allowed in global scope, must use a wrapper
  const main = async () => {
    try {
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: process.env.USER, // Update with your actual environment variable name
        to: options.email,
        subject: options.subject,
        html: options.html,
      });

      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  await main();
};

export default sendEmail;


