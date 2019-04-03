const AWS = require('aws-sdk');
const iotdata = new AWS.IotData({ endpoint: 'a1x06kutqzbjah-ats.iot.us-east-1.amazonaws.com' });
const ddb = new AWS.DynamoDB.DocumentClient();
exports.handler = (event, context, callback) => {
    event.Records.forEach((record) => {


        if (record.eventName == 'INSERT') {
            console.log(record);
            console.log(record.dynamodb.NewImage.ok);
            const facility = record.dynamodb.NewImage.Bioreactor.M.Facility.S;
            const bioreactor = record.dynamodb.NewImage.Bioreactor.M.Id.S;
            const facilityname = record.dynamodb.NewImage.Bioreactor.M.FacilityName.S;
            const topic = "/" + facility.split("|")[0] + "/" + facility.split("|")[1] + "/" + bioreactor + "/receiveBatch";

            var params = {
                topic: topic,
                payload: JSON.stringify(record.dynamodb, null, 2),
                qos: 0
            };

            iotdata.publish(params, function(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("success");
                }
            });
            updateBioreactor(bioreactor, facility, "False", facilityname).then(() => {
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
        }
    });
    return `Successfully processed ${event.Records.length} records.`;
};

function updateBioreactor(id, facility, available, facilityname) {
    var params = {
        TableName: 'Bioreactor',
        Item: {
            Id: id,
            Facility: facility,
            Available: available,
            FacilityName: facilityname
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