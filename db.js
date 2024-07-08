const mysql = require("mysql2");
const nodemailer = require("nodemailer");

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Ngochoai123:",
  database: "userin",
  port: 3306,
  connectTimeout: 10000,
};

const mailler = {
  async sendEmail({ emailFrom, emailTo, emailSubject, emailText }) {
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "rodrick.hills@ethereal.email",
        pass: "RbSTwjHb7aT9zdXhb4",
      },
      poolConfig: {
        maxConnections: 3,
        maxMessage: 10,
        rateDelta: 1000,
        rateLimit: 5,
      },
    });

    await transporter.sendMail({
      from: emailFrom,
      to: emailTo,
      subject: emailSubject,
      text: emailText,
    });
  },
};

Object.freeze(mailler);

const pool = mysql.createPool(dbConfig);

module.exports = {
  pool,
  mailler,
};
