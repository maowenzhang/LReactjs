var AWS = require("aws-sdk");

AWS.config.update({
  region: "ap-southeast-1",
  endpoint: "http://dynamodb.ap-southeast-1.amazonaws.com"
});

var dynamodb = new AWS.DynamoDB();

var params = {
    "AttributeDefinitions": [
        {
            "AttributeName": "email",
            "AttributeType": "S"
        },
        {
            "AttributeName": "id",
            "AttributeType": "N"
        }
    ],
    "GlobalSecondaryIndexes": [
        {
            "IndexName": "email-index",
            "Projection": {
                "ProjectionType": "KEYS_ONLY"
            },
            "ProvisionedThroughput": {
                "WriteCapacityUnits": 5,
                "ReadCapacityUnits": 5
            },
            "KeySchema": [
                {
                    "KeyType": "HASH",
                    "AttributeName": "email"
                }
            ]
        }
    ],
    "ProvisionedThroughput": {
        "WriteCapacityUnits": 5,
        "ReadCapacityUnits": 5
    },
    "TableName": "user",
    "KeySchema": [
        {
            "KeyType": "HASH",
            "AttributeName": "id"
        }
    ]
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});