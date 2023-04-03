import { Request, Response } from "express";
import sgMail from '@sendgrid/mail'

const send = async (req: Request, res: Response) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log(process.env.SENDGRID_API_KEY)
  const {
    name,
    email,
    message,
  }: { name: string; email: string; message: string } = req.body;
  const msg = `Name: ${name}\r\n Email: ${email}\r\n Message: ${message}`;
  const data = {
    to: "leilacheraghi81@gmail.com",
    from: `${email}`,
    subject: `${name.toUpperCase()} sent you a message from Contact Form`,
    text: `Email => ${email}`,
    html: msg.replace(/\r\n/g, "<br>"),
  };
  try {
    await sgMail.send(data);
    res.status(200).json({ message: "Your message was sent successfully." });
  } catch (err) {
    res
      .status(500)
      .json({ message: `There was an error sending your message. ${err}` });
  }
};

export const mailController = {
  send
};