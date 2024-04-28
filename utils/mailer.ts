import nodemailer from 'nodemailer';





const sendEmail = async (email: string[], subject: string, text: string) => {
    // Configure mail for usage
    const mailOptions = {
        from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: "<b>Hello world?</b>", // html body
      };
      
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
              user: "maddison53@ethereal.email",
              pass: "jn7jnAPss4f63QBp6D",
            },
          });
        const mailResponse = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", mailResponse.messageId);

    } catch (error) {
        console.error(error);
    }
};



export {
    sendEmail,
}
