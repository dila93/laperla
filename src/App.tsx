import "./App.css";
import Schedule from "./components/Schedule";
import video from "./laperlapromo.mp4";

function App() {
  return (
    <div className="App">
      <div className="container">
        <video autoPlay loop muted className="video">
          <source src={video} type="video/mp4" />
        </video>
        <Schedule></Schedule>
      </div>
    </div>
  );
}

export default App;
