#!/bin/bash

echo "Starting mqtt publishing loop"

for ((c=100; c <= 1000; c=c+100))
do
  mosquitto_pub -h localhost -t distance -m "{\"x\":$c, \"y\":$c}"
  sleep 1s
done


mosquitto_pub -h localhost -t light -m "{\"x\":\"blue\", \"y\":\"5\"}"
mosquitto_pub -h localhost -t light -m "{\"x\":\"red\", \"y\":\"7\"}" 
mosquitto_pub -h localhost -t light -m "{\"x\":\"green\", \"y\":\"6\"}" 
mosquitto_pub -h localhost -t light -m "{\"x\":\"yellow\", \"y\":\"10\"}"
