import React, { useEffect, useState } from "react";
import "./App.css";
import { showProgram } from "./screen-components/program";
import { getMarqueeOrg } from "./screen-components/marquee-generator";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { MessageType, ShowMessage } from "./screen-components/public-messages";

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

  const [testMsg, setTestMsg] = useState<MessageType>({ message: "", iconUrl: "" });

  useEffect(() => {
    const interval = setInterval(() => {
      setTestMsg({ message: Date().toLocaleString(), iconUrl: "" });
      console.log("test");
    }, 2000);
    return () => clearInterval(interval);
  });

  return (
    <div className="App">
      <ShowMessage message={testMsg.message} iconUrl={testMsg.iconUrl} />

      <header className="App-header">
        <img src={"images/header.png"} alt="logo" />
      </header>
      <Container className="Container" fluid>
        <Row>
          <Col sm={4}>
            TEST
          </Col>
          <Col sm={8}>
            {showProgram(rows)}
          </Col>
          <Col sm={4}>
            TEST
          </Col>
        </Row>
      </Container>
      <div className="Footer">
        {getMarqueeOrg(["Witamy na Futrołajkach 2022!", "Przypominamy, że możesz zgłosić swój punkt programu na @futrolajkibot!", "Przypominamy, że pokój 111 ma zakaz robienia dziur w ścianiach", "Przypominamy, że Z-Grate ma zakaz walenia balonów. Wszystkie nadużycia prosimy zgłaszać na @futrolajki bot lub telefonicznie"])}

      </div>

    </div>
  );
}

export default App;
