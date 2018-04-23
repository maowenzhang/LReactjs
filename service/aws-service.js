
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

AWSService.prototype.getOrCreateUser = function(email, password) {
    var that = this;
    var doesUserExist = false;

    return new Promise((resolve, reject) => {
		AWSService.get().getUserByEmail(email)
		.then((userId) => {
			if (userId) {
                doesUserExist = true;
                return that.getUser(userId);
			}
			return that.createUser(email, password);
		}).then((userObj) => {
			resolve(userObj, doesUserExist);
		}).catch((err) => {
            reject(err);
		});
    });
}

AWSService.prototype.createUser = function(email, password) {
    var that = this;
    return new Promise((resolve, reject) => {
        var params = {
            "TableName": that.tableName,
            "Item": {
                "id": { "N": (Math.floor(Math.random() * 4294967296)).toString() },
                "email": { "S": email },
                "pw": { "S": bcrypt.hashSync(password) },
                "userRole": { "S": "member" }
            }
        };
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

AWSService.getUserObjectFromDBItem = function(dbItem) {
    var obj = {
        "id"    :    dbItem.id.N,
        "email" :    dbItem.email.S,
        "pw"    :    dbItem.pw.S
    };
    if (dbItem.userRole) {
        obj['userRole'] = dbItem.userRole.S;
    }
    if (dbItem.disc) {
        obj['disc'] = dbItem.disc.S;
    }
    return obj;
}

AWSService.prototype.getUser = function(userId) {
    return new Promise((resolve, reject) => {
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

AWSService.prototype.updateUser = function(userId, testResultData) {
    return new Promise((resolve, reject) => {
        var testData = JSON.stringify(testResultData);
        var params = {
                        "TableName": this.tableName, 
                        "Key": { "id": { "N": userId } },
                        "UpdateExpression": "set disc = :testData",
                        "ExpressionAttributeValues": { 
                            ":testData": {"S": testData}
                        }, 
                        "ReturnValues" : 'ALL_NEW'
                    };
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