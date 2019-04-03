const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();


exports.handler = (event, context, callback) => {
    if (!event.requestContext.authorizer) {
        errorResponse('Authorization not configured', context.awsRequestId, callback);
        return;
    }

    const user = event.requestContext.authorizer.claims['cognito:username'];
    const requestBody = JSON.parse(event.body);
    const recipe = requestBody.Recipe;
    const timestamp = requestBody.Timestamp;
    const status = requestBody.Status;
    const bioreactor = requestBody.Bioreactor;
    const id = requestBody.Id;
    putRecipe(user, recipe, timestamp, status, bioreactor, id).then(() => {
        callback(null, {
            statusCode: 201,
            body: JSON.stringify({ info: 'Success' }),
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


function putRecipe(user, recipe, timestamp, status, bioreactor, id) {
    var params = {
        TableName: 'Batch',
        Item: {
            Email: user,
            Recipe: recipe,
            Timestamp: timestamp,
            Status: status,
            Bioreactor: bioreactor,
            Id: id
        }
    };
    return ddb.put(params, function(err, data) {
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