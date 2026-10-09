const nodemailer = require('nodemailer');

class EmailService {
    constructor(transporterConfig) {
        this.transporter = nodemailer.createTransport(transporterConfig);
    }

    async sendEmail(to, subject, text) {
        return this.transporter.sendMail({
            from: this.transporter.options.auth.user,
            to,
            subject,
            text,
        });
    }
}

module.exports = EmailService;
