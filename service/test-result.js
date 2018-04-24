
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
    var testDateObj = new Date();
    var testDate = testDateObj.toISOString();
    return new Promise((resolve, reject) => {
        var theUserObj = null;

        // 1. Update test
        AWSService.get().updateUserTestResult(userId, testResultData, testDate)
        .then((userObj) => {
            theUserObj = userObj;
            // 2. Get ownerUser
            var ownerUserId = theUserObj.ownerUserId;
            return AWSService.get().getUser(ownerUserId);
        }).then((ownerUserObj) => {
            // 3. Send email to admin
            // 
            if (!ownerUserObj) {
                var msg = "邀请的用户没有对应的负责人！";
                resolve(msg);
                return;
            }
            var toEmail = ownerUserObj.email;

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
                'userName': theUserObj.userName,
                'userEmail': theUserObj.email,
                'testResult': testResultDataStr,
                'ownerUserName': ownerUserObj.userName
            });
            g_mailService.sendMail(toEmail, subject, text, html)
            .then((data) => {
                var msg = `测试结果已提交，谢谢！`;
                resolve(msg);
            }).catch((err) => {
                reject(err);
            });

        }).catch((err) => {
            reject(err);
        });
    })
}

TestResult.prototype.getTestResultData = function(req) {
    var that = this;
    var userId = req.user.id;

    return new Promise((resolve, reject) => {

        // 1. Update test
        AWSService.get().getAllUsers()
        .then((users) => {
            // 2. Prepare data
            // 
            var data = [];
            users.map((item) => {
                var tmpItem = {
                    'id': item.id,
                    'userName': item.userName,
                    'email': item.email,
                    'userRole': item.userRole,
                    'disc': item.disc,
                    'testDate': item.testDate
                };
                data.push(tmpItem);
            });
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    })
}
module.exports = TestResult;