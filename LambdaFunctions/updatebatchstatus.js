const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
exports.handler = (event, context, callback) => {
    console.log(event);
    var params = {
        TableName: 'Batch',
        Key: {
            Email: event.Email,
            Id: event.Id
        },
        UpdateExpression: 'set #status = :s',
        ExpressionAttributeNames: { '#status': 'Status' },
        ExpressionAttributeValues: {
            ':s': event.Status
        }
    };

    ddb.update(params, (err, dat) => {
        if (err) {
            console.log(err);
        } else {
            console.log(dat);
        }
    })
};