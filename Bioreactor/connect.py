import json
from DocClientUtils import prettifyBatch, readJson
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
from RGB import RGB
from Button import Button
import time
import socket
import numpy as np
import sys

HOST = "192.168.43.186"
TEMP_PORT = 8090
PRESS_PORT = 8091
duration = 30


myMQTTClient = AWSIoTMQTTClient("pi01")
myMQTTClient.configureEndpoint("a1x06kutqzbjah-ats.iot.us-east-1.amazonaws.com", 8883)
myMQTTClient.configureCredentials("Certificates/AmazonRootCA1.pem", "Certificates/900b9cf919-private.pem.key", "Certificates/900b9cf919-certificate.pem.crt")

myMQTTClient.configureOfflinePublishQueueing(-1) 
myMQTTClient.configureDrainingFrequency(2)
myMQTTClient.configureConnectDisconnectTimeout(10) 
myMQTTClient.configureMQTTOperationTimeout(5)

with open("Information/Bioreactor.json", 'r') as fp:
    Bioreactor = json.load(fp)    
print(Bioreactor)

TOPIC = "/%s/%s/%s"%(Bioreactor['Facility'].split("|")[0], Bioreactor['Facility'].split("|")[1], Bioreactor['Id'])

def pickupTime():
    global readyToStart
    global inProgress
    global receiveB
    print("Waiting for the user to pickup the batch...")
    time.sleep(20)
    Bioreactor = readJson("Information/Bioreactor.json")
    Bioreactor["Available"]="True"
    myMQTTClient.publish("updateBioreactorAvailable",json.dumps(Bioreactor) , 0)
    print("Bioreactor is now available")
    Batch = readJson("Information/Batch.json")
    Batch["Status"] = "Finished"
    myMQTTClient.publish("updateBatchStatus",json.dumps(Batch) , 0)
    print("Cleaning up bioreactor...")
    time.sleep(10)
    readyToStart = False
    inProgress = False
    receiveB = True
    print("Waiting for a new Batch...")
    rgb.set(0xffff)

def startReading():
    global Email
    global batchId

    t_end = time.time() + duration

    while time.time() < t_end:
        temp_data = temp_conn.recv(1024)
        press_data = press_conn.recv(1024)
        if int(temp_data.decode()) > 1024:
            continue
        temp = 3950 / (np.log((1025.0 * 10 / (1023 - float(temp_data.decode())) - 10) / 10) + 3950 / 298.0) - 273.0
        press = ((int(press_data.decode())  * 800) / 1024) + 300
        ph = np.random.normal(7.5,2)
        Batch = readJson("Information/Batch.json")
        measurement = {
            "Brew": "%s|%s"%(Email, batchId),
            "Timestamp": int(time.time()),
            "Data": {
                "Temperature": temp,
                "Pressure": press,
                "Ph":ph
            },
            "Restrictions": Batch["Recipe"]['Restrictions']
        }
        print("Temperature: %s\nPressure: %s\npH: %s\n"%(temp,press,ph))
        #print("Published\nTemp:%s\nPressure%s\nPH:%s"%(measurement['Data']['Temperature'],measurement['Data']['Pressure'],measurement['Data']['Ph']))
        measurement = json.dumps(measurement)
        myMQTTClient.publish("measure",measurement , 0)
        #print("Published to topic: measure \n%s"%measurement)
    print("Finished brewing process.")
    rgb.set(0xff00)
    Batch["Status"] = "Ready for Pickup"
    myMQTTClient.publish("updateBatchStatus",json.dumps(Batch) , 0)
    print("Updated batch status to 'Ready for Pickup'")
    pickupTime()

def receiveBatch(client, userdata, mqttMsg):
    global Email
    global batchId
    global Batch
    global receiveB
    global readyToStart
    if receiveB:
        receiveB = False
        msg = mqttMsg.payload.decode('utf8').replace("'", '"')
        uglyBatch = json.loads(msg)
        Batch = dict()
        Batch["Keys"] = uglyBatch["Keys"]
        Batch["NewImage"] = uglyBatch["NewImage"]
        Batch = prettifyBatch(Batch)
        with open("Information/Batch.json", 'w') as fp:
            json.dump(Batch, fp)
        Email = Batch["Email"]
        batchId = Batch["Id"]
        readyToStart = True
        rgb.set(0x00ff00)
        time.sleep(0.5)
        rgb.set(0x0)
        time.sleep(0.5)
        rgb.set(0x00ff00)
        time.sleep(0.5)
        rgb.set(0x0)
        time.sleep(0.5)
        rgb.set(0xffff00)
        print("Picameeeee")
        readyToStart=True
        

def startProcess(useless):
    global readyToStart
    global inProgress
    if readyToStart:
        readyToStart = False
        inProgress = True
        rgb.set(0xff0000)
        print ("Starting process")
        Batch = readJson("Information/Batch.json")
        Batch["Status"] = "In Progress"
        myMQTTClient.publish("updateBatchStatus",json.dumps(Batch) , 0)
        print("Updated batch status to 'In Progress'")
        startReading()

try:
    global receiveB
    global readyToStart
    global inProgress
    global Email
    global batchId
    Email = "null"
    batchId = "null"
    inProgress = False
    rgb = RGB(11,12,13)
    rgb.set(0xffff)
    receiveB = True
    print("Connecting to MQTT")
    myMQTTClient.connect()
    print("Me conecte a IoT")
    
    print("Waiting for connection on sensors")
    rgb.set(0xff2500)
    temp_server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    press_server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    temp_server.bind((HOST, TEMP_PORT))
    press_server.bind((HOST, PRESS_PORT))
    temp_server.listen()
    press_server.listen()
    temp_conn, temp_addrs = temp_server.accept()
    press_conn, press_addrs = press_server.accept()
    print("Connected to sensors")
    rgb.set(0xff)
    
    button = Button(15, startProcess, bouncetime=1000)
    readyToStart = False
    print("Listening topic: %s"%("%s/receiveBatch"%TOPIC))
    myMQTTClient.subscribe("%s/receiveBatch"%TOPIC, 1, receiveBatch)
    while True:
        pass
except:
    myMQTTClient.disconnect()
    rgb.destroy()
    button.destroy()
    temp_conn.disconnect()
    press_conn.disconnect()
