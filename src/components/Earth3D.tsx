import React, { useEffect } from "react";
import Gis from "./gis";
import { data } from "./data";
import ThreeGis from "./three-gis";
import Points from "./Points";
type Earth3DProps = {};
const Earth3D: React.FC<Earth3DProps> = () => {
  useEffect(() => {
    // const gis = new Gis("globeArea");
    // gis.addData(data);
    // new ThreeGis("globeArea");
    new Points("globeArea");
  }, []);
  return <div id="globeArea" style={{ width: "500px", height: "500px" }}></div>;
};

export default Earth3D;
