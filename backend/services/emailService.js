const nodemailer = require('nodemailer');
const env = require('../config/env');

let transporter = null;

function configured() {
  return Boolean(env.smtp.host && env.smtp.user && env.smtp.password);
}

function getTransporter() {
  if (!configured()) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: { user: env.smtp.user, pass: env.smtp.password }
    });
  }
  return transporter;
}

async function sendContactNotification(contact) {
  const transport = getTransporter();
  if (!transport) return { sent: false, configured: false };
  await transport.sendMail({
    from: env.smtp.from,
    to: env.smtp.to,
    replyTo: contact.email,
    subject: contact.subject || `Nuevo contacto NovaTech: ${contact.name}`,
    text: `Nombre: ${contact.name}\nCorreo: ${contact.email}\nEmpresa: ${contact.company || ''}\nTeléfono: ${contact.phone || ''}\n\n${contact.message}`
  });
  return { sent: true, configured: true };
}

module.exports = { sendContactNotification, configured };
