#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <SPI.h>  

char* ssid = "GENERIC_WIFI"; //REPLACE FOR ACTUAL WIFI SSID
char* password = "GENERIC_PASSWORD"; //REPLACE FOR ACTUAL WIFI PASSWORD

uint16_t port = 8091; // 8090 for Temperature, 8091 for Pressure
char * host = "192.168.43.186"; //REPLACE WITH RASPBERRY'S IP

int measure = 0;

WiFiClient client;

void setup(){
  Serial.begin(9600);
  
  WiFi.begin(ssid, password);
  Serial.println(port);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("...");
  }
  
  Serial.print("WiFi connected with IP: ");
  Serial.println(WiFi.localIP());

  while (!client.connect(host, port)) {
    Serial.println("Connection to host failed");
    
    delay(1000);
  }

  Serial.print("Connected to server");
}

void loop()
{        
  measure = analogRead(A0);
  Serial.println(measure);
  client.print(measure);  
  delay(2000); 
}
