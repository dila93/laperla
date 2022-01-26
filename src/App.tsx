import React from 'react';
import './App.css';
import video from "./laperlapromo.mp4";

function App() {
  return (
    <div className="App">
      <div className="container">
        <div className="main-title">
        La Perla</div>
        <div className="description">
      Sitio en construcción</div>
        <video 
          autoPlay
          loop
          muted
          className="video"
        >
          <source src={video} type="video/mp4"/>
        </video>
      </div>
      

      
    </div>
  );
}

export default App;
