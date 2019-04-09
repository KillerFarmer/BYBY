const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();


exports.handler = (event, context, callback) => {
    if (!event.requestContext.authorizer) {
        errorResponse('Authorization not configured', context.awsRequestId, callback);
        return;
    }

    const username = event.requestContext.authorizer.claims['cognito:username'];
    const requestBody = JSON.parse(event.body);
    const coordinates = requestBody.Coordinates;
    getFacility(coordinates).then((query) => {
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


function getFacility(coordinates) {
    const RANGE = .1;
    var params = {
        TableName: "Facility",
        FilterExpression: "Coordinates.lat BETWEEN :lowLat AND :highLat AND Coordinates.lng BETWEEN :lowLng AND :highLng",
        ExpressionAttributeValues: {
            ":lowLat": coordinates.lat - RANGE,
            ":highLat": coordinates.lat + RANGE,
            ":lowLng": coordinates.lng - RANGE,
            ":highLng": coordinates.lng + RANGE,

        }
    };
    return ddb.scan(params, (err, data) => {
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