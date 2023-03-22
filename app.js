require("dotenv").config();
const express = require("express");
const app = express();
require("express-async-errors");
const nodemailer = require("nodemailer");
const notFound = require("./middlewares/not-found");
const errorHandlerMiddelware = require("./middlewares/errorHandler");

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.get("/", (req, res) => {
  res.send("<a href='/send'>send email</a>");
});
app.get("/send", async (req, res) => {
  //const testAccount = await nodemailer.createTestAccount();
  // create reusable transporter object using the default SMTP transport
  let transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // send mail with defined transport object
  let info = await transport.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });
  res.send("send email successful");
});

//middleware
app.use(notFound);
app.use(errorHandlerMiddelware);

//listen
const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server listen at port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
