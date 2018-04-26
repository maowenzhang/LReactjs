
var bcrypt = require('bcrypt-nodejs');
var aws = require('aws-sdk');
var g_DB = null;
var g_AWSService = null;

var AWSService = function() {

    // Initialize dynamodb
    if (!g_DB) {
        if (process.env.AWS_REGION) {
            aws.config.region = process.env.REGION
        }
        aws.config.update({region: "ap-southeast-1"});

        // if (process.env.AWS_ACCESS_KEY_ID) {
        //     console.log(process.env.AWS_ACCESS_KEY_ID);
        //     aws.config.update({accessKeyId: process.env.AWS_ACCESS_KEY_ID});
        // }
        // if (process.env.AWS_SECRET_ACCESS_KEY) {
        //     console.log(process.env.AWS_SECRET_ACCESS_KEY);
        //     aws.config.update({secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY});
        // }
        // else {
        //     aws.config.update({region: "ap-southeast-1"});
        //     aws.config.credentials = new aws.SharedIniFileCredentials({profile: 'default'});
        // }
        g_DB = new aws.DynamoDB();
    }

    this.tableName = "user";
}

AWSService.get = function() {
    if (!g_AWSService) {
        g_AWSService = new AWSService();
    }
    return g_AWSService;
}

AWSService.prototype.getDb = function() {
    return g_DB;
}

AWSService.prototype.getOrCreateUser = function(email, password, userName, ownerUserId) {
    var that = this;
    var doesUserExist = false;

    return new Promise((resolve, reject) => {
		AWSService.get().getUserByEmail(email)
		.then((userId) => {
			if (userId) {
                doesUserExist = true;
                return that.updateUserOwner(userId, ownerUserId);
			}
			return that.createUser(email, password, userName, ownerUserId);
		}).then((userObj) => {
			resolve(userObj, doesUserExist);
		}).catch((err) => {
            reject(err);
		});
    });
}

AWSService.prototype.createUser = function(email, password, userName, ownerUserId) {
    var that = this;
    return new Promise((resolve, reject) => {
        if (!userName) {
            userName = '';
        }
        var params = {
            "TableName": that.tableName,
            "Item": {
                "id": { "N": (Math.floor(Math.random() * 4294967296)).toString() },
                "email": { "S": email },
                "pw": { "S": bcrypt.hashSync(password) },
                "userRole": { "S": "member" },
                "userName": { "S": userName }
            }
        };
        // Can't put empty or invalid data type to dynamo DB
        if (ownerUserId) {
            params["Item"]["ownerUserId"] = { "N": ownerUserId };
        }

        g_DB.putItem(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                var userObj = AWSService.getUserObjectFromDBItem(params.Item);
                resolve(userObj);
            }
        })
    });
}

AWSService.formatedDISCTestResult = function(disc) {
    if (!disc) {
        return '';
    }
    var jsonDisc = JSON.parse(disc);
    if (!jsonDisc) {
        return '';
    }
    var count_D = jsonDisc['D'] || 0;
    var count_I = jsonDisc['I'] || 0;
    var count_S = jsonDisc['S'] || 0;
    var count_C = jsonDisc['C'] || 0;
    var tmp = `D-${count_D}, I-${count_I}, S-${count_S}, C-${count_C}`;
    return tmp;
}

AWSService.getUserObjectFromDBItem = function(dbItem) {
    // in case invalid item
    if (!dbItem) {
        var obj = {
            "id"    :    '',
            "email" :    '',
            "pw"    :    '',
        };
        return obj;
    }

    var obj = {
        "id"    :    dbItem.id.N,
        "email" :    dbItem.email.S,
        "pw"    :    dbItem.pw.S
    };
    if (dbItem.userRole) {
        obj['userRole'] = dbItem.userRole.S;
    }
    if (dbItem.userName) {
        obj['userName'] = dbItem.userName.S;
    }
    if (dbItem.disc) {
        var tmp = AWSService.formatedDISCTestResult(dbItem.disc.S);
        obj['disc'] = tmp;
    }
    if (dbItem.testDate) {
        obj['testDate'] = dbItem.testDate.S;
    }
    if (dbItem.ownerUserId) {
        obj['ownerUserId'] = dbItem.ownerUserId.N;
    }
    return obj;
}

AWSService.prototype.getUser = function(userId) {
    return new Promise((resolve, reject) => {
        if (!userId) {
            resolve(null);
            return;
        }
        var params = {
                        "TableName": this.tableName, 
                        "Key": { "id": { "N": userId } } 
                    };
        g_DB.getItem(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                var userObj = AWSService.getUserObjectFromDBItem(data.Item);
                resolve(userObj);
            }
        });
    });
}

AWSService.prototype.updateUserTestResult = function(userId, testResultData, testDate) {
    var testData = JSON.stringify(testResultData);
    var params = {
            "UpdateExpression": "set disc = :val1, testDate = :val2",
            "ExpressionAttributeValues": { 
                ":val1": {"S": testData},
                ":val2": {"S": testDate}
            }
        };
    return this.updateUserBase(userId, params);
}

AWSService.prototype.updateUserOwner = function(userId, ownerUserId) {
    var params = {
            "UpdateExpression": "set ownerUserId = :val1",
            "ExpressionAttributeValues": { 
                ":val1": {"N": ownerUserId}
            } 
        };
    return this.updateUserBase(userId, params);
};

AWSService.prototype.updateUserRole = function(userId, userRole) {
    var params = {
            "UpdateExpression": "set userRole = :val1",
            "ExpressionAttributeValues": { 
                ":val1": {"S": userRole}
            }
        };
    return this.updateUserBase(userId, params);
};

AWSService.prototype.updateUserName = function(userId, userName) {
    var params = {
            "UpdateExpression": "set userName = :val1",
            "ExpressionAttributeValues": { 
                ":val1": {"S": userName}
            } 
        };
    return this.updateUserBase(userId, params);
};

AWSService.prototype.updateUserBase = function(userId, inputParmas) {
    return new Promise((resolve, reject) => {
        var params = {
                        "TableName": this.tableName, 
                        "Key": { "id": { "N": userId } },
                        "ReturnValues" : 'ALL_NEW'
                    };
        var updateParamNames = ['UpdateExpression', 'ExpressionAttributeValues'];
        updateParamNames.map((item) => {
            if (inputParmas[item]) {
                params[item] = inputParmas[item];
            }
        })
                    
        g_DB.updateItem(params, function (err, data) {
            if (err) {
                reject(err);
            } else {
                var userObj = AWSService.getUserObjectFromDBItem(data.Attributes);
                resolve(userObj);
            }
        });
    });
}

AWSService.prototype.getUserByEmail = function(email) {
    var that = this;
    return new Promise((resolve, reject) => {
        var params = {
            "TableName": that.tableName,
            "IndexName": "email-index",
            "KeyConditions": {
                "email": {
                    "ComparisonOperator": "EQ",
                    "AttributeValueList": [{ "S": email }]
                }
            }
        };
        console.log("Scanning for :" + JSON.stringify(params))//.Items["email"].name)

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        g_DB.query(params, function (err, data) {
            // if there are any errors, return the error
            if (err) {
                reject(err);
            }
            // check to see if theres already a user with that email
            else if (data.Items.length <= 0) {
                resolve(null);
            } else {
                var userId = data.Items[0]["id"].N;
                resolve(userId);
            }
        });
    });
}

AWSService.prototype.getAdminUsers = function() {
    var that = this;
    return new Promise((resolve, reject) => {
        var params = {
            "TableName": that.tableName,
            "FilterExpression": "userRole = :val",
            "ExpressionAttributeValues": {":val": {"S": "admin"}},
            "ReturnConsumedCapacity": "TOTAL"
        };
        console.log("Scanning for :" + JSON.stringify(params))//.Items["email"].name)

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        g_DB.scan(params, function (err, data) {
            // if there are any errors, return the error
            if (err) {
                reject(err);
            }
            // check to see if theres already a user with that email
            else if (data.Items.length <= 0) {
                resolve([]);
            } else {
                var userId = data.Items[0]["id"].N;
                var userObjs = [];
                data.Items.map((item) => {
                    var userObj = AWSService.getUserObjectFromDBItem(item);
                    userObjs.push(userObj);
                });
                resolve(userObjs);
            }
        });
    });
}

AWSService.prototype.getAllUsers = function() {
    var that = this;
    return new Promise((resolve, reject) => {
        var params = {
            "TableName": that.tableName,
            "ReturnConsumedCapacity": "TOTAL"
        };
        console.log("Scanning for :" + JSON.stringify(params))//.Items["email"].name)

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        g_DB.scan(params, function (err, data) {
            // if there are any errors, return the error
            if (err) {
                reject(err);
            }
            // check to see if theres already a user with that email
            else if (data.Items.length <= 0) {
                resolve([]);
            } else {
                var userId = data.Items[0]["id"].N;
                var userObjs = [];
                data.Items.map((item) => {
                    var userObj = AWSService.getUserObjectFromDBItem(item);
                    userObjs.push(userObj);
                });
                resolve(userObjs);
            }
        });
    });
}
module.exports = AWSService;