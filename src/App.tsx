import React from "react";
import Earth3D from "./components/Earth3D";
import "./App.css";

const components = { Earth3D };
function App() {
  return (
    <div className="App">
      <components.Earth3D />
    </div>
  );
}

export default App;
