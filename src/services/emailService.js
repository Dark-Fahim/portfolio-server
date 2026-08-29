import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  return transporter;
}

const emailWrapper = (title, bodyHtml) => `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#0A0E12;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0E12;padding:32px 0;">
      <tr>
        <td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="background:#121820;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:#0A0E12;padding:24px 32px;border-bottom:1px solid #1A222C;">
                <span style="color:#34D399;font-family:monospace;font-size:14px;letter-spacing:1px;">PORTFOLIO</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;color:#E7EAEE;">
                <h1 style="margin:0 0 16px 0;font-size:20px;color:#E7EAEE;">${title}</h1>
                <div style="font-size:14px;line-height:1.6;color:#9AA5B1;">${bodyHtml}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background:#0A0E12;color:#5B6470;font-size:12px;">
                This is an automated message from your portfolio contact system.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

export async function sendAdminNotification(contactMessage) {
  const { name, email, phone, company, service, budget, message } = contactMessage;
  const html = emailWrapper(
    'New Portfolio Inquiry',
    `
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ''}
      ${company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : ''}
      ${service ? `<p><strong>Service:</strong> ${escapeHtml(service)}</p>` : ''}
      ${budget ? `<p><strong>Budget:</strong> ${escapeHtml(budget)}</p>` : ''}
      <p><strong>Message:</strong><br/>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
    `
  );

  await getTransporter().sendMail({
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
    to: process.env.NOTIFY_EMAIL,
    replyTo: email,
    subject: 'New Portfolio Inquiry',
    html,
  });
}

export async function sendVisitorConfirmation(contactMessage) {
  const { name, email } = contactMessage;
  const html = emailWrapper(
    `Thanks for reaching out, ${escapeHtml(name)}`,
    `<p>I have received your message and will get back to you soon.</p>
     <p>In the meantime, feel free to check out my recent work and blog.</p>`
  );

  await getTransporter().sendMail({
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Thanks for contacting me',
    html,
  });
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
