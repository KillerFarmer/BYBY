# Monitoring a Batch
The final part of the original user story, consisted in monitoring the state of the batch, which includes its pH, pressure and its temperature. We used the following AWS technologies: 
* [API Gateway](https://aws.amazon.com/api-gateway/ "API Gateway") communicates our WebApp with AWS.
* [Lambda](https://aws.amazon.com/lambda/ "Lambda") which adds functionality to retrieve information in DynamoDB.
* [DynamoDB](https://aws.amazon.com/dynamodb/ "DynamoDB") where information is stored.
* [SES](https://aws.amazon.com/ses/ "SES") AWS' simple email service which allows us to send emails automatically. 
## User Stories 
### View batch characteristics
**As a** user **I want to** click a batch **so that** I can see data read from the sensors.
## Important Files 
* [batch-view.js](https://github.com/KillerFarmer/BYBY/tree/master/js/batch-view.js "batch-view.js")

We used [Chart.js]("Chart.js") to produce the dynamic charts and we used plugins for the [zoom](https://github.com/chartjs/chartjs-plugin-zoom "Zoom") and [annotation](https://github.com/chartjs/chartjs-plugin-annotation "Annotation") features. 
## Important Lambda Functions
* [getmeasurement.js](https://github.com/KillerFarmer/BYBY/blob/master/LambdaFunctions/getmeasurements.js)

The function serves to get the stored measurements for display on the charts.
## Flow
Most of the processes for this part of the WebApp are automatic, the only thing the user can do is use the "Reload Charts" to retrieve the latest information from DynamoDB. 
![Monitor 1](https://raw.githubusercontent.com/KillerFarmer/BYBY/blob/master/img/monitor.png "Make Batch Done")
![Monitor 2](https://raw.githubusercontent.com/KillerFarmer/BYBY/blob/master/img/monitor2.png "Make Batch Done")
![Monitor 3](https://raw.githubusercontent.com/KillerFarmer/BYBY/blob/master/img/monitor3.png "Make Batch Done")

Finally, you may have noticed two red lines in the charts, this serve as reference lines for the minimum and maximum values the user specified in their recipe. If a value goes over or under the respective limit an email is send using SES. It's important to know that our SES was in sandbox mode, thus you had to verify the emails manually. This concludes the WebApp part of the proyect if you would like to know how the Raspberry Pi works and sends or recieves information you can read about it [here](https://github.com/KillerFarmer/BYBY/blob/master/documentation/biocomms.md#bioreactor--webapp-communication "Biorreactor Communication").
