import "./bootstrap.css"
import { w3cwebsocket } from 'websocket';
import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

const client = new w3cwebsocket("ws://127.0.0.1:8000");
client.onopen = () => {
    console.log("Websocket client connected");
    client.send(JSON.stringify({
      "distance":{qos:0},
      "light":{qos:0}
    }))
};


function App() {
  const [dis_data, set_data] = useState([]);
  const [bar_data, set_data_bar] = useState([]);
  
  useEffect(() => {
    client.onmessage = (message) => {
      let temp = JSON.parse(message["data"]);
      let topic =temp["topic"]
      let daten = JSON.parse(temp["data"]);

      if(topic === "distance"){
        set_data((current_data) => [...current_data, daten]);
      } else if(topic === "light"){
        set_data_bar((current_bar_data) => [...current_bar_data, daten]);
      }
    };
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <h2>TOF Data</h2>
        <LineChart
          width={1700}
          height={800}
          data={dis_data}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="y" stroke="#82ca9d" strokeWidth={3} />
        </LineChart>

        <h2>Amount of ligths</h2>
        <BarChart
          width={1700}
          height={800}
          data={bar_data}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="y" fill="#82ca9d" />
        </BarChart>

      </header>
    </div>
  );
}

export default App;
