// Netlify Function: send-support-email.js
// Envoie un email de support à support@daloamarket.shop via Resend

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SUPPORT_EMAIL = 'support@daloamarket.shop';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Champs manquants' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'DaloaMarket <support@daloamarket.shop>',
        to: SUPPORT_EMAIL,
        subject: `[Contact Support] ${subject}`,
        reply_to: email,
        html: `<p><strong>Nom :</strong> ${name}</p><p><strong>Email :</strong> ${email}</p><p><strong>Sujet :</strong> ${subject}</p><p><strong>Message :</strong><br>${message.replace(/\n/g, '<br>')}</p>`
      })
    });
    if (!response.ok) {
      const error = await response.text();
      return res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email', details: error });
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Erreur serveur', details: err.message });
  }
};