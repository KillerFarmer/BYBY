const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();


exports.handler = (event, context, callback) => {
    if (!event.requestContext.authorizer) {
        errorResponse('Authorization not configured', context.awsRequestId, callback);
        return;
    }

    const email = event.requestContext.authorizer.claims['cognito:username'];
    const requestBody = JSON.parse(event.body);
    const name = requestBody.Name;
    const ingredients = requestBody.Ingredients;
    const timestamp = requestBody.Timestamp;
    const restrictions = requestBody.Restrictions;

    putRecipe(email, name, ingredients, timestamp, restrictions).then(() => {
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


function putRecipe(email, name, ingredients, timestamp, restrictions) {
    var params = {
        TableName: 'Recipe',
        Item: {
            Email: email,
            Name: name,
            Ingredients: ingredients,
            Timestamp: timestamp,
            Restrictions: restrictions,
        }
    };
    return ddb.put(params, (err, data) => {
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