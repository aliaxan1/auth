import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';
import { PrismaClient} from '@prisma/client';
import { User } from './types';

const prisma = new PrismaClient();






const sendEmail = async (user: User, emailType: string) => {
  const hashedToken = await bcryptjs.hash(user?.id, 10)

  if (emailType === "VERIFY") {
    await prisma.user.update({
      where: {
        id: user?.id
      },
      data: {
        verifyToken: hashedToken,
        verifyTokenExpiry: (Date.now() + 3600000).toString()
      }
    })
  } else if (emailType === "RESET") {
    await prisma.user.update({
      where: {
        id: user?.id
      },
      data: {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: (Date.now() + 3600000).toString()
      }
    })
  }


  try {
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      }
    });

    console.log("trasporter--->",transporter);

    const mailOptions = {
      from: 'hitesh@gmail.com',
      to: user?.email,
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
      or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
      </p>`
    }

    const mailresponse = await transporter.sendMail(mailOptions);
    console.log("mailResponse--->",mailresponse);
    return mailresponse;
  } catch (error) {
    console.error(error);
  }
};



export {
  sendEmail,
}
