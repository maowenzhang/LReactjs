
var pug = require('pug');
const path = require('path');
const MailService = require('./mail-service.js');
const AWSService = require('./aws-service.js');

var g_mailService = null;

var TestResult = function() {
    if (!g_mailService) {
        g_mailService = new MailService();
    }
}

TestResult.prototype.submitTestResult = function(req, testResultData) {
    var that = this;
    var userId = req.user.id;

    return new Promise((resolve, reject) => {
        // 1. Update test
        AWSService.get().updateUser(userId, testResultData)
        .then((userObj) => {

            // 2. Send email to admin
            // 
            var testLink = `http://${req.headers.host}/invite-link/${userObj.id}`;
            var subject = '嘉驰国际: DISC性格测试结果';
            var text = 'Not supported yet';
            // var textFile = path.join(__dirname, '../views/email/', 'invite-email-text.pug');
            // var text = pug.renderFile(textFile, {
            //     testLink: testLink
            // });
            var htmlFile = path.join(__dirname, '../views/email/', 'test-result-email-html.pug');
            var html = pug.renderFile(htmlFile, {
                'testLink': testLink,
                'userEmail': userObj.email,
            });
            var toEmail = 'maowen.zhang@autodesk.com';
            g_mailService.sendMail(toEmail, subject, text, html)
            .then((data) => {
                var msg = `邮件已成功发送给 ${toEmail}，邮件标题为：${subject}`;
                resolve(msg);
            }).catch((err) => {
                reject(err);
            });

        }).catch((err) => {
            reject(err);
        });
    })
}

module.exports = TestResult;