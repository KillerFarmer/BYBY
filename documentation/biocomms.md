# Bioreactor – WebApp Communication
The last part of the project was to simulate the Bioreactor, which in our case was a RaspberryPi 3. We used special [wi-fi modules](https://www.nodemcu.com/index_en.html "Modules") to connect the sensors and MQTT to send messages to IoT Core and inovke rules. 
* [IoT Core](https://aws.amazon.com/iot-core/ "IoT Core") Were we declared a Thing named Bioreactor with the associated Certificate files, which have been removed from github for security reasons.
There are three different rules that are invoked in the process: 
    * UpdateBatchStatus listens to "updateBatchStatus" topic and stores the contents of these messages into the Batch table updating the value as its name suggests
    * StoreData listens for "measure" topic and writes it into Measurements table.
    * UpdateBioreactorStatus listens for "updateBioreactorAvailable" topic and writes into Bioreactor table.

## User Stories 
Load Batch to bioreactor
Bioreactor received Batch feedback
Start a batch
Add more sensors
Test Bioreactor Hardware
Storing batch data
## Important Files 
* [connect.py](https://github.com/KillerFarmer/BYBY/blob/documentation/Bioreactor/connect.py "connect.py")
* [RGB.py](https://github.com/KillerFarmer/BYBY/blob/documentation/Bioreactor/RGB.py "RGB.py")
* [Button.py](https://github.com/KillerFarmer/BYBY/blob/documentation/Bioreactor/Button.py "Button.py")

## Flow
### Recieving a Batch
Once a  batch has been created in the make batch view, the bioreactor code kicks in.
A message is published to a unique topic referencing a specific bioreactor. Every raspberrypi should have its own identifier, e.g. "/TJ/22025/receiveBatch/01". Then, the raspberry blinks its green color (via the RGB.py code) twice to indicate that it has received a message (the batch), storing it locally and then updating the Bioreactor status through the IoT rule.
### Start a Batch
After this, the led should turn orange while it connects itself to the sensors. Once its done, it turns yellow to indicate that the button (Button.py) must be pressed.
### Storing Batch Measurements
The led turns red and the sensors start sending information to the RaspberryPi who then publishes it to "measure" topic. If you wish to know more about how the sensors communicate with the Pi you can read the code [here]("Bioreactor-Sensor Communication").
### Finishing a Batch
Once the brewing process is done (simulated by a timespan of seconds), it updates the batch status to "ready for pickup" and the led turns green. A timer to simulate the time taken for the user to pick up his batch is started and when it's done, batch status is changed to "Finished" and the process restarts, updating the Availability of the bioreactor to True, opening its doors to another batch.



