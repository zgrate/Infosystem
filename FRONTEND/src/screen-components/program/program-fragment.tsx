import { useEffect, useState } from "react";
import { PROGRAM_UPDATE_EVENT, ProgramEntity } from "./entities/program.entity";
import { ScreenEntity } from "../../screen-admin/screen.entity";
import { Socket } from "socket.io-client";
import { axiosService } from "../../services/AxiosService";
import "./program.style.css";
import { Col, Container, Row } from "react-bootstrap";

const FormatDate = (date: string) => {
  const data = new Date(date);
  return data.getHours() + ":" + data.getMinutes();
};

const GenerateTable = (props: { program: ProgramEntity[], fullWidth: boolean }) => {
  return <Container>
    <Row className={"StyleHeader"}>
      <Col xs={2} className={"header content"}>
        Godzina
      </Col>
      <Col className={"header content"}>
        Nazwa Punktu
      </Col>
      <Col xs={3} className={"header content"}>
        Sala
      </Col>
    </Row>
    {props.program.length !== 0 ? props.program.map(it => <TableRow program={it} />) : <EmptyRow />}
  </Container>;
};

const MainTableRow = (props: { program: ProgramEntity }) => {
  console.log(props.program);
  return <Row className={"MainStyle"}>
    <Col xs={2} className={"MainStyleCol"}>
      {FormatDate(props.program.eventStartTime.toString())}
    </Col>
    <Col className={"MainStyleCol"}>
      {props.program.translations[0].title}
    </Col>
  </Row>;
};

const TableRow = (props: { program: ProgramEntity }) => {
  console.log(props.program);
  return <Row className={"TableRow"}>
    <Col xs={2} className={"content"}>
      {FormatDate(props.program.eventStartTime.toString())}
    </Col>
    <Col className={"content"}>
      {props.program.translations[0].title}
    </Col>
    <Col xs={3} className={"content"}>
      {props.program.eventScheduledLocation}
    </Col>
  </Row>;
};

function capitalizeFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const GenerateMainRoomTable = (props: { program: ProgramEntity[] }) => {
  return (
    <Container>
      <Row className={"MainRoomStyleHeader"}>
        <Col xs={2} className={"header column"}>Godzina</Col>
        <Col className={"header column"}>Nazwa punktu</Col>
      </Row>
      {props.program.length !== 0 ? props.program.map(it => <MainTableRow program={it} />) : <EmptyRow />}
    </Container>
  );
};

const EmptyRow = () => {
  return <Row style={{ backgroundColor: "aquamarine", border: "1px solid" }}>
    <Col>
      Nie ma już zaplanowanych eventów w tej sali!
    </Col>
  </Row>;
};

export const ProgramFragment = (props: { screen: ScreenEntity, socketIO: Socket }) => {
  const [program, setProgram] = useState<ProgramEntity[]>();
  const [loading, setLoading] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(false);
  useEffect(() => {
    props.socketIO.on(PROGRAM_UPDATE_EVENT, () => {
      setForceRefresh(true);
    });
    const repeating = setInterval(() => {
      setForceRefresh(true);
    }, 300000);
    return () => {
      props.socketIO.off(PROGRAM_UPDATE_EVENT);
      clearInterval(repeating);
    };
  });
  if (program === undefined || forceRefresh) {
    if (!loading) {
      axiosService.get("program/screen").then(it => {
        if (it.data) {
          setProgram(it.data["program"]);
        }
        setLoading(false);
      });
      setLoading(true);
      setForceRefresh(false);
    }
    return <div> Ładowanie programu... </div>;
  } else {
    // console.log(program);
    // console.log(props.screen)
    if (props.screen.preferredRoom !== undefined) {
      return <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", margin: 10 }}>
        <div style={{ width: "60%", margin: 5 }}>
          <div style={{
            marginBottom: "8px",
            fontWeight: "bold",
            border: "1px solid",
            backgroundColor: "cyan"
          }}>{capitalizeFirstLetter(props.screen.preferredRoom)}</div>
          <GenerateMainRoomTable
            program={program.filter(it => it.eventScheduledLocation === props.screen.preferredRoom).slice(0, props.screen.maxMainRoomEntry)} />
        </div>
        <div style={{ width: "40%", margin: 5 }}>
          <div
            style={{ marginBottom: "8px", fontWeight: "bold", border: "1px solid", backgroundColor: "aquamarine" }}>Inne
            sale
          </div>
          <GenerateTable
            program={program.filter(it => it.eventScheduledLocation !== props.screen.preferredRoom).slice(0, props.screen.maxOtherRoomEntry)}
            fullWidth={false} />
        </div>
      </div>;
    }
    return <>
      <GenerateTable program={program} fullWidth={true} />
    </>;
  }

};
