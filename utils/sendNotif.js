const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground';

const MAILING_SERVICE_CLIENT_ID = process.env.MAILING_SERVICE_CLIENT_ID;
const MAILING_SERVICE_CLIENT_SECRET = process.env.MAILING_SERVICE_CLIENT_SECRET;
const MAILING_SERVICE_REFRESH_TOKEN = process.env.MAILING_SERVICE_REFRESH_TOKEN;

const oauth2Client = new OAuth2(
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  MAILING_SERVICE_REFRESH_TOKEN,
  OAUTH_PLAYGROUND
);

// emailService.js
const sendNotif = (to, bookTitle , price , authorEmail ) => {
    oauth2Client.setCredentials({
      refresh_token: MAILING_SERVICE_REFRESH_TOKEN,
    });
  
    const accessToken = oauth2Client.getAccessToken();
    const smtpTransport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'ayuh.official@gmail.com',
        clientId: MAILING_SERVICE_CLIENT_ID,
        clientSecret: MAILING_SERVICE_CLIENT_SECRET,
        refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
        accessToken: accessToken,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  
  
    const mailOptions = {
      from: 'ayuh.official@gmail.com',
      to: to,
      subject: 'New Book Realeased.',
      html: `
        <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
          <h2 style="text-align: center; text-transform: uppercase;color: teal;">New Book has been realeased!</h2>
          <p>A new book has been realeased:</p>
          <p><strong>Title:</strong> ${bookTitle}</p>
          <p><strong>Price:</strong> ${price}</p>
          <p><strong>Author:</strong> ${authorEmail}</p>
          <p>If you have any questions or concerns, please contact our support team at support@ayuhapp.com.</p>
        </div>
      `,
    };
  
    smtpTransport.sendMail(mailOptions, (err, info) => {
      if (err) return err;
      return info;
    });
  };
  
module.exports = sendNotif;
