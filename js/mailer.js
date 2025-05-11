const nodemailer = require('nodemailer');
const conf = require('../public/conf.js');

const transporter = nodemailer.createTransport({
  host: conf.smtpHost,
  port: conf.smtpPort,
  secure: false,
  auth: {
    user: conf.mailFrom,
    pass: conf.mailSecret
  }
});

transporter.verify((err, success) => {
  if (err) {
    console.error("Errore verifica SMTP:", err);
  } else {
    console.log('Configurazione di nodemailer corretta!');
  }
});

const result = {
  send: async (email, subject, text) => {
    try {
      return await transporter.sendMail({
        from: conf.mailFrom, 
        to: email,
        subject: subject,
        text: text
      });
    } catch (error) {
      console.log("Errore nell'invio dell'email:");
      console.log(error);
      throw error;
    }
  },
  test: async () => {
    return transporter.verify();
  }
};

module.exports = result;
