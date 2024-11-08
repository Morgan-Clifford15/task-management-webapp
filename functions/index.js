const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    // Configure your email service here
});

exports.sendClientEmail = functions.https.onRequest(async (req, res) => {
    const { to, subject, text } = req.body;

    const mailOptions = {
        from: 'Your Company <noreply@yourcompany.com>',
        to,
        subject,
        text
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    }
});
