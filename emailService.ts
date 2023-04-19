import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "devmailernode@gmail.com",
    pass: "borftmxxglpqzjqo",
  },
});

const sendEmail = (email: string) => {
  const recoverToken = jwt.sign(email, process.env.SECRET_KEY!);
  const mailOptions = {
    from: "devmailernode@gmail.com",
    to: `${email}`,
    subject: "Recover Password",
    html: `Recovery password link below: <p> <a href="https://localhost:8686/change_password/${recoverToken}">Click here</a>`,
  };
  transport.sendMail(mailOptions);
};

export { sendEmail };
