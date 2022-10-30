import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ScreenMain } from "./screens/screen";
import { AcreditionSystem } from "./accreditation/acredition-system";

export interface ProgramEntry {
  startTime: string;
}

const rows = [
  {
    conDay: 1,
    startTime: "10:00",
    newStartTime: null,
    endTime: null,
    newEndTime: null,
    type: "normal",
    description: "Pysiek wali balona",
    room: "Domek 8"
  },
  {
    conDay: 1,
    startTime: "23:30",
    newStartTime: null,
    endTime: null,
    newEndTime: null,
    type: "normal",
    description: "Klef",
    room: "Domek 8 Pokój Assalta"
  },
  {
    conDay: 1,
    startTime: "24:00",
    newStartTime: null,
    endTime: null,
    newEndTime: null,
    type: "normal",
    description: "Pysiek wali balona",
    room: "Domek 8"
  }
];



function App() {



  return (
    <Router>
      <Routes>
        <Route path="/" element={<ScreenMain />} />
        <Route path="/acc" element={<AcreditionSystem />} />

      </Routes>
    </Router>
  );
}

export default App;
