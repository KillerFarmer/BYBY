const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();


exports.handler = (event, context, callback) => {
    if (!event.requestContext.authorizer) {
        errorResponse('Authorization not configured', context.awsRequestId, callback);
        return;
    }

    const requestBody = JSON.parse(event.body);
    const username = event.requestContext.authorizer.claims['cognito:username'];
    const id = requestBody.Batch;
    const brew = username + '|' + id;
    getMeasurements(brew).then((query) => {
        callback(null, {
            statusCode: 201,
            body: JSON.stringify(query),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
        });
    }).catch((err) => {
        console.error(err);
        errorResponse(err.message, context.awsRequestId, callback)
    });
};


function getMeasurements(brew) {
    var params = {
        TableName: "Measurement",
        KeyConditionExpression: "Brew = :brew",
        ExpressionAttributeValues: { ":brew": brew }
    };
    return ddb.query(params, function(err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data.Item);
        }
    }).promise();
}

function errorResponse(errorMessage, awsRequestId, callback) {
    callback(null, {
        statusCode: 500,
        body: JSON.stringify({
            Error: errorMessage,
            Reference: awsRequestId,
        }),
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    });
}