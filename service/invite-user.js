
var pug = require('pug');
const path = require('path');
const MailService = require('./mail-service.js');
const AWSService = require('./aws-service.js');

var g_mailService = null;

var InviteUser = function() {
    if (!g_mailService) {
        g_mailService = new MailService();
    }
}

InviteUser.prototype.invite = function(req, email, userName, ownerUserId) {
    var that = this;
    return new Promise((resolve, reject) => {
        var password = '123xyz';
        AWSService.get().getOrCreateUser(email, password, userName, ownerUserId)
        .then((userObj, doesUserExist) => {

            var testLink = `http://${req.headers.host}/invite-link/${userObj.id}`;
            var subject = '嘉驰国际: 邀请您参加DISC性格测试';
            var text = 'Not supported yet';
            // var textFile = path.join(__dirname, '../views/email/', 'invite-email-text.pug');
            // var text = pug.renderFile(textFile, {
            //     testLink: testLink
            // });
            var htmlFile = path.join(__dirname, '../views/email/', 'invite-email-html.pug');
            var html = pug.renderFile(htmlFile, {
                'testLink': testLink,
                'userEmail' : userObj.email,
                'userName': userObj.userName
            });
            g_mailService.sendMail(email, subject, text, html)
            .then((data) => {
                var msg = `邮件已成功发送给 ${userObj.userName} (${email})，邮件标题为：${subject}`;
                resolve(msg);
            }).catch((err) => {
                reject(err);
            });

        }).catch((err) => {
            reject(err);
        });
    })
}

InviteUser.prototype.logInInvitedUser = function(req, userId) {
    var that = this;
    return new Promise((resolve, reject) => {
        var password = '123xyz';
        AWSService.get().getUser(userId)
        .then((userObj) => {
            var hasLogIn = false;
            var data = {'userObj': userObj, 'hasLogIn': hasLogIn};
			// if (!bcrypt.compareSync(password, userObj.pw)) {
            if (userObj.userRole === "admin") {
                console.log("can't auto login admin user");
                resolve(data);
            } else {
                req.logIn(userObj, err => {
                    if (err) {
                        resolve(data);
                    } else {
                        data.hasLogIn = true;
                        resolve(data);
                    }
                })
            }
        }).catch((err) => {
            reject(err);
        });
    })
}

InviteUser.prototype.getAdminUserInfo = function(req) {
    var that = this;
    return new Promise((resolve, reject) => {
        AWSService.get().getAdminUsers()
        .then((adminUsers) => {
            // Prepare data
            var data = [];
            adminUsers.map((item) => {
                var tmpItem = {
                    'id': item.id,
                    'userName': item.userName,
                    'email': item.email
                };
                data.push(tmpItem);
            });
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    })
}


module.exports = InviteUser;