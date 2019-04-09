const AWS = require('aws-sdk');
var ses = new AWS.SES({
    region: 'us-east-1'
});
exports.handler = (event, context, callback) => {
    event.Records.forEach((record) => {


        if (record.eventName == 'INSERT') {
            const Email = record.dynamodb.Keys.Brew.S.split("|")[0];
            const ph = record.dynamodb.NewImage.Data.M.Ph.N;
            const temp = record.dynamodb.NewImage.Data.M.Temperature.N;
            const pressure = record.dynamodb.NewImage.Data.M.Pressure.N;
            var restrictions = record.dynamodb.NewImage.Restrictions;
            var alerta = false;
            restrictions.L.forEach((res) => {
                if (res.M.Sensor.S == 'Temperature') {
                    if (parseFloat(res.M.max.S) < temp || parseFloat(res.M.min.S) > temp) {
                        alerta = true
                    }
                } else if (res.M.Sensor.S == 'PH') {
                    if (parseFloat(res.M.max.S) < ph || parseFloat(res.M.min.S) > ph) {
                        alerta = true
                    }
                } else if (res.M.Sensor.S == 'Pressure') {
                    if (parseFloat(res.M.max.S) < pressure || parseFloat(res.M.min.S) > pressure) {
                        alerta = true
                    }
                }
            })

            if (alerta) {
                var eParams = {
                    Destination: {
                        ToAddresses: [Email]
                    },
                    Message: {
                        Body: {
                            Text: {
                                Data: "Hey! Some sensors on your batch are reporting undesired results. Please log in into your byby account at: http://byby-brewing.s3-website-us-east-1.amazonaws.com/ for more information.\nTemperature = " + temp + "\npH = " + ph + "\nPressure = " + pressure + "\nCheers!."
                            }
                        },
                        Subject: {
                            Data: "Batch with id " + record.dynamodb.Keys.Brew.S.split("|")[1] + " has a problem."
                        }
                    },
                    Source: "adrian.chouza@cetys.edu.mx"
                };
                console.log('===SENDING EMAIL===');
                var email = ses.sendEmail(eParams, function(err, data) {
                    if (err) console.log(err);
                    else {
                        console.log("===EMAIL SENT===");
                        console.log(data);


                        console.log("EMAIL CODE END");
                        console.log('EMAIL: ', email);
                        context.succeed(event);

                    }
                });
                console.log("Hubo alerta");
            } else {
                console.log("No hubo alerta");
            }

        }
    });
    return `Successfully processed ${event.Records.length} records.`;
};