const webSocketServerPort = 8000;
const webSocketServer = require("websocket").server;
const http = require("http");
const mqtt = require("mqtt");


const server = http.createServer();
server.listen(webSocketServerPort);
console.log("Listening on port 8000");


const wsServer = new webSocketServer({
    httpServer:server
});

const clients = {};

const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
};
const mqtt_client = mqtt.connect({
        host:"127.0.0.1"
    });

wsServer.on('request', (request) => {
    var userID = getUniqueID();
    console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');
    // You can rewrite this part of the code to accept only the requests from allowed origin
    const connection = request.accept(null, request.origin);
    clients[userID] = connection;
    console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients))

    
    connection.on("message", (message) => {
        var sub = JSON.parse(message.utf8Data)
        mqtt_client.subscribe(sub);
    })

    mqtt_client.on("message", (topic, message) =>{
        var result = {
            "topic":topic,
            "data":message.toString("utf8")
        };
        
        clients[userID].sendUTF(JSON.stringify(result));
    })

    
});
