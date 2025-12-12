// Netlify Function : Envoi d'email pour paiement d'annonce unitaire
const { Resend } = require('resend');

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TO_EMAIL = 'support@daloamarket.shop';
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const resend = new Resend(RESEND_API_KEY);

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: CORS_HEADERS,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Méthode non autorisée' })
    };
  }

  try {
    const {
      listingId,
      fullName,
      email,
      phone,
      screenshotBase64,
      screenshotFilename = 'screenshot.png'
    } = JSON.parse(event.body);

    if (!listingId || !fullName || !email || !phone || !screenshotBase64) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Données manquantes' })
      };
    }

    // Préparer l'email HTML
    const html = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #FF7F00;">Paiement annonce à valider</h2>
            <div style="background-color: #F3F4F6; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Détails de la demande</h3>
              <ul style="list-style: none; padding: 0;">
                <li>🆔 <strong>ID annonce:</strong> ${listingId}</li>
                <li>👤 <strong>Nom:</strong> ${fullName}</li>
                <li>📧 <strong>Email:</strong> ${email}</li>
                <li>📱 <strong>Téléphone:</strong> ${phone}</li>
              </ul>
            </div>
            <p style="color: #666; font-size: 14px;">La capture d'écran du paiement est jointe à cet email.</p>
          </div>
        </body>
      </html>
    `;

    // Préparer la pièce jointe
    const attachmentData = screenshotBase64.split(';base64,').pop();

    // Envoi de l'email avec Resend
    const result = await resend.emails.send({
      from: 'DaloaMarket <noreply@daloamarket.shop>',
      to: TO_EMAIL,
      subject: `🆕 Paiement annonce à valider - ID ${listingId}`,
      html: html,
      attachments: [{
        filename: screenshotFilename,
        content: attachmentData,
        content_type: 'image/png'
      }],
      tags: [{
        name: 'category',
        value: 'listing_payment'
      }]
    });

    // Confirmation au client
    await resend.emails.send({
      from: 'DaloaMarket <noreply@resend.dev>',
      to: email,
      subject: '✅ Preuve de paiement reçue - DaloaMarket',
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #2563EB;">Preuve de paiement reçue</h2>
              <p>Nous avons bien reçu votre preuve de paiement pour la publication de votre annonce.</p>
              <ul style="list-style: none; padding: 0;">
                <li>🆔 <strong>ID annonce:</strong> ${listingId}</li>
              </ul>
              <p>Notre équipe va vérifier votre paiement et publier votre annonce dans les plus brefs délais.</p>
              <p style="color: #666; font-size: 14px;">Pour toute question, contactez-nous via la page d'aide de DaloaMarket.</p>
            </div>
          </body>
        </html>
      `
    });

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: true,
        message: 'Preuve de paiement envoyée avec succès',
        emailId: result.id
      })
    };

  } catch (error) {
    console.error('Erreur:', error);
    if (error.response) {
      console.error('Réponse d\'erreur Resend:', error.response.data);
    }
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: 'Erreur lors de l\'envoi de la preuve de paiement',
        details: error.message,
        type: error.name || 'UnknownError'
      })
    };
  }
};
