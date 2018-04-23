const nodemailer = require('nodemailer');

var MailService = function() {

    // create reusable transporter object using the default SMTP transport
    this.transporter = nodemailer.createTransport({
        host: 'smtp.163.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'xgiants_test@163.com',
            pass: 'Rachel2018'
        }
    });

    this.fromEmail = 'xgiants_test@163.com';

};


MailService.prototype.sendMail = function(toEmail, subject, text, html) {
    var that = this;

    return new Promise((resolve, reject) => {

        mailOptions = {
            from: this.fromEmail, 
            to: toEmail,
            subject: subject,
            text: text,
            html: html
        };

        // send mail with defined transport object
        that.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                resolve('success');
            }
        });
    });
};

module.exports = MailService;

