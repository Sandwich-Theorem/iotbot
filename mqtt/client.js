import pkg from 'websocket';
const { w3cwebsocket: w3c} = pkg;

const client = new w3c("ws://127.0.0.1:8000");
client.onopen = () => {
    console.log("Websocket client connected");
};
client.onmessage = (message) => {
    console.log("Data from server: ");
    console.log(message["data"]);
}