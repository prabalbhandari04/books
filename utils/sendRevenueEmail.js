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


const sendRevenueEmail = (userEmail,overallRevenue, currentMonthRevenue, currentYearRevenue, month, year) => {
    oauth2Client.setCredentials({
        refresh_token: MAILING_SERVICE_REFRESH_TOKEN,
    });
    console.log('revenue')
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
        to: userEmail,
        subject: `Revenue Details for `,
        html: `
        <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
          <h2 style="text-align: center; text-transform: uppercase;color: teal;">Revenue Details</h2>
          <p>Here are the revenue details for author :</p>
          <p><strong>Overall Revenue:</strong>Rs. ${overallRevenue}</p>
          <p><strong>Current Month Revenue:</strong>Rs. ${currentMonthRevenue}</p>
          <p><strong>Current Year Revenue:</strong>Rs. ${currentYearRevenue}</p>
          <p><strong>Month:</strong> ${month}</p>
          <p><strong>Year:</strong> ${year}</p>
          <p>If you have any questions or concerns, please contact our support team at support@ayuhapp.com.</p>
        </div>
      `,
    };

    smtpTransport.sendMail(mailOptions, (err, info) => {
        if (err) return err;
        return info;
    });
    console.log('revenue123 ')
};


module.exports = sendRevenueEmail;
