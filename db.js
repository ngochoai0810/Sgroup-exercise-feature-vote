
require('dotenv').config();
const mysql = require("mysql2");
const nodemailer = require("nodemailer");

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 3306, 
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
      pool: true,
      poolConfig: {
        maxConnections: 3,
        maxMessages: 10,
        rateDelta: 1000,
        rateLimit: 5,
      },
    });

    try {
      const info = await transporter.sendMail({
        from: emailFrom,
        to: emailTo,
        subject: emailSubject,
        text: emailText,
      });
      console.log("Email sent: " + info.messageId);
      return info;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  },
};

Object.freeze(mailler);

const pool = mysql.createPool(dbConfig);

module.exports = {
  pool,
  mailler,
};
