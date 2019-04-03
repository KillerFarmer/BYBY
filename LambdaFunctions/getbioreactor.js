const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();


exports.handler = (event, context, callback) => {
    if (!event.requestContext.authorizer) {
        errorResponse('Authorization not configured', context.awsRequestId, callback);
        return;
    }

    const requestBody = JSON.parse(event.body);
    const facility = requestBody.Facility;
    getBioreactor(facility).then((query) => {
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


function getBioreactor(facility) {
    var params = {
        TableName: "Bioreactor",
        FilterExpression: "Facility = :facl AND Available = :state",
        ExpressionAttributeValues: { ":facl": facility, ":state": "True" }
    };
    return ddb.scan(params, function(err, data) {
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