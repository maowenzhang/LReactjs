
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
        var theUserObj = null;

        // 1. Update test
        AWSService.get().updateUser(userId, testResultData)
        .then((userObj) => {
            theUserObj = userObj;
            // 2. Get admin users
            return AWSService.get().getAdminUsers();
        }).then((adminUsers) => {
            // 3. Send email to admin
            // 
            var adminEmails = [];
            adminUsers.map((item) => {
                adminEmails.push(item.email);
            });
            var toEmail = adminEmails.join(',');

            var testLink = `http://${req.headers.host}/test-result`;
            var subject = '嘉驰国际: DISC性格测试结果';
            var text = 'Not supported yet';
            // var textFile = path.join(__dirname, '../views/email/', 'invite-email-text.pug');
            // var text = pug.renderFile(textFile, {
            //     testLink: testLink
            // });
            var testResultDataStr = JSON.stringify(testResultData);
            var htmlFile = path.join(__dirname, '../views/email/', 'test-result-email-html.pug');
            var html = pug.renderFile(htmlFile, {
                'testLink': testLink,
                'userEmail': theUserObj.email,
                'testResult': testResultDataStr
            });
            g_mailService.sendMail(toEmail, subject, text, html)
            .then((data) => {
                var msg = `测试结果已提交，并已通知相关人员。`;
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