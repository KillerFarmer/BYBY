# Make a batch
Now that the user has recipes he can produce, they have now the ability to make a batch. We used the following AWS technologies:
* [API Gateway](https://aws.amazon.com/api-gateway/ "API Gateway") communicates our WebApp with AWS.
* [Lambda](https://aws.amazon.com/lambda/ "Lambda") which adds functionality to save and retrieve information in DynamoDB.
* [DynamoDB](https://aws.amazon.com/dynamodb/ "DynamoDB") where information is stored and recipes retrieved. 

Additionally, we used the [Google Maps API](https://developers.google.com/maps/documentation/javascript/tutorial "Maps"), which allows us to display maps and custom markers as well as user location (which wasn't our case since it requieres SSL certification). Furthermore, we used custom markers to signal the facilities where the bioreactors are located, displaying the locations that are within a small radius of the user. 
## User Stories 
### Select bioreactor from map
**As a** user **I want to** select a bioreactor from the map **such that** a bioreactor is assigned to me.
### Select a bioreactor
**As a** user, **I want to** select a bioreactor **such that** it is near my current location and is able to process my recipe **so that** I can head to such location to brew a batch.
## Important Files 
* [make-batch.js](https://github.com/KillerFarmer/BYBY/tree/documentation/js/make-batch.js "make-batch.js")
  
This is one of the longer files since it involves a lot of google maps stuff, specially dinamically generating custom markers. In addition to getting multiple lists from DynamoDB for facilities, recipies and bioreactors. 
## Flow
![Make Batch](https://raw.githubusercontent.com/KillerFarmer/BYBY/documentation/documentation/img/makebatch.png "Make Batch")
![Make Batch Selection](https://raw.githubusercontent.com/KillerFarmer/BYBY/documentation/documentation/img/makebatchselection.png "Make Batch Selection")
![Make Batch Success](https://raw.githubusercontent.com/KillerFarmer/BYBY/documentation/documentation/img/makebatchsuccess.png "Make Batch Success")
![Make Batch Done](https://raw.githubusercontent.com/KillerFarmer/BYBY/documentation/documentation/img/makebatchdone.png "Make Batch Done")