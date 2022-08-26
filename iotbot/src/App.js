import "./bootstrap.css"
import { w3cwebsocket } from 'websocket';
import { useState, useEffect} from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

const client = new w3cwebsocket("ws://127.0.0.1:8000");
client.onopen = () => {
    console.log("Websocket client connected");
    client.send(JSON.stringify({
      "iotbot/distance":{qos:0},
      "iotbot/battery":{qos:0},
      "iotbot/motorspeed":{qos:0},
      "iotbot/velocity":{qos:0}
    }))
};



function App() {
  const [dis_data, set_data] = useState([]);
  const [bat_data, set_data_bat] = useState([]);
  const [motor_data, set_data_motor] = useState([]);
  const [velo_data, set_data_velo] = useState([]);
  const size = useWindowSize();
  
  useEffect(() => {
    client.onmessage = (message) => {
      let temp = JSON.parse(message["data"]);
      let topic =temp["topic"]
      let daten = JSON.parse(temp["data"]);
     
      if (topic === "iotbot/distance") {
        set_data((current_data) => {
          if(current_data.length > 300){current_data.shift();}
          return [...current_data, daten];
        }); 
      } else if (topic === "iotbot/battery") {
        set_data_bat((current_data) => {
          if(current_data.length > 300){current_data.shift();}
          return [...current_data, daten];
        }); 
      } else if(topic === "iotbot/motorspeed"){
        set_data_motor((current_data) => {
          if(current_data.length > 300){current_data.shift();}
          return [...current_data, daten];
        }); 
      } else if(topic === "iotbot/velocity"){
        set_data_velo((current_data) => {
          if(current_data.length > 300){current_data.shift();}
          return [...current_data, daten];
        }); 
      }
    };
  }, []);
  return (
    <div className="App">
      <header className="App-header">
      <div class="container" width={size.width} height={size.height}>


        <div class="zelle1">
          <h2 class="distanceHeader">Distance</h2>
          <ResponsiveContainer debounce="1" width="100%" height="85%">
            <LineChart data={dis_data} margin={{ top: 0, right: 25, bottom: 0, left: 50 }}> 
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis/>
              <YAxis name="distance" unit=" dm"/>
              <Tooltip/>
              <Legend/>
              <Line type="monotone" dataKey="right" name="distance to front right sensor" stroke="#ef0137" strokeWidth={4}/>
              <Line type="monotone" dataKey="left"  name="distance to front left sensor"  stroke="#500078" strokeWidth={4}/> 
              </LineChart>
          </ResponsiveContainer>
        </div>
          
          
        <div class="zelle2">
          <h2 class="motorspeedHeader">Motorspeed</h2>
          <ResponsiveContainer debounce="1" width="100%" height="85%">
          <LineChart data={motor_data} margin={{ top: 0, right: 50, bottom: 0, left: 25 }}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis/>
            <YAxis name="motorspeed" unit=" %"/>
            <Tooltip/>
            <Legend/>
            <Line type="monotone" dataKey="lin_per" name="linear performance" stroke="#ffd732" strokeWidth={4}/>
            <Line type="monotone" dataKey="ang_per" name="angular performance" stroke="#fe8389" strokeWidth={4}/>
          </LineChart>
          </ResponsiveContainer>
        </div>


        <div class="zelle3">
          <h2 class="velocityHeader">Velocity</h2>
          <ResponsiveContainer debounce="1" width="100%" height="85%">
          <LineChart data={velo_data} margin={{ top: 0, right: 25, bottom: 10, left: 50 }}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis/>
            <YAxis name="velocity" unit=" rpm"/>
            <Tooltip/>
            <Legend/>
            <Line type="monotone" dataKey="rpm" stroke="#ff9000" strokeWidth={4}/>
          </LineChart>
          </ResponsiveContainer>
        </div>
          

        <div class="zelle4">
          <h2 class="batteryHeader">Battery</h2>
          <ResponsiveContainer debounce="1" width="100%" height="85%">
          <LineChart data={bat_data} margin={{ top: 0, right: 50, bottom: 10, left: 25 }}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis/>
            <YAxis name="battery" unit=" volt"/>
            <Tooltip/>
            <Legend/>
            <Line dataKey="voltage" stroke="#00ffb9" strokeWidth={4} fill="#00ffb9"/>
          </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      </header>
    </div>
  );
}

// Hook
function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.width,
        height: window.height, //TODO
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

export default App;
