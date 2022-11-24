import { useEffect, useState } from "react";
import { PROGRAM_UPDATE_EVENT, ProgramEntity } from "./entities/program.entity";
import { ScreenEntity } from "../../screen-admin/screen.entity";
import { Socket } from "socket.io-client";
import { axiosService } from "../../services/AxiosService";
import "./program.style.css";
import { Col, Container, Row } from "react-bootstrap";

const FormatDate = (date: string) => {
  const data = new Date(date);
  const currentTime = new Date("2022-12-01 12:00");
  if(currentTime.getDate() === data.getDate())
    return data.getHours().toString().padStart(2, "0") + ":" + data.getMinutes().toString().padStart(2, "0");
  else if(Math.abs(data.getDate()-currentTime.getDate()) === 1){
    return "Jutro, " + data.getHours().toString().padStart(2, "0") + ":" + data.getMinutes().toString().padStart(2, "0");
  }
  else{
    return data.getDate().toString().padStart(2, "0")  +"-"+(data.getMonth()+1).toString().padStart(2, "0")  +", " + data.getHours().toString().padStart(2, "0") + ":" + data.getMinutes().toString().padStart(2, "0");

  }
};

const GenerateTable = (props: { program: ProgramEntity[], fullWidth: boolean }) => {
  return <Container>
    <Row className={"StyleHeader"}>
      <Col xs={3} className={"header content"}>
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


const MainTableRow = (props: { program: ProgramEntity, myRoom: string }) => {
  console.log(props.program);
  const getRoomChange = () => {
    if (props.program.eventChangedRoom) {
      if (props.program.eventChangedRoom === props.myRoom) {
        return " TERAZ W TEJ SALI!";
      } else {
        return " TERAZ W " + capitalizeFirstLetter(props.program.eventScheduledLocation);
      }
    } else {
      return "";
    }
  };
  if (props.program.eventState === "cancelled") {
    return <Row className={"MainStyle"}>
      <Col xs={2} className={"MainStyleCol"}>
        <span className={"Cancelled"}>{FormatDate(props.program.eventStartTime.toString())}</span>
      </Col>
      <Col className={"MainStyleCol"}>
        <span className={"Cancelled"}>{props.program.translations[0].title}</span> ODWOŁANO!
      </Col>
    </Row>;
  } else if (props.program.eventState === "moved") {
    return <Row className={"MainStyle"}>
      <Col xs={2} className={"MainStyleCol"}>
        <span
          style={{ textDecoration: !!props.program.eventStartTime ? "line-through" : "" }}
          className={"Moved"}>{FormatDate(props.program.eventStartTime.toString())}</span> {!!props.program.changeStartTime ? FormatDate(props.program.changeStartTime.toString()) : ""}
      </Col>
      <Col className={"MainStyleCol"}>
        <span
          className={"Moved"}>{props.program.translations[0].title}</span><span><strong> ZMIANA! {getRoomChange()}</strong></span>
      </Col>
    </Row>;
  } else {
    return <Row className={"MainStyle"}>
      <Col xs={2} className={"MainStyleCol"}>
        {FormatDate(props.program.eventStartTime.toString())}
      </Col>
      <Col className={"MainStyleCol"}>
        {props.program.translations[0].title}
      </Col>
    </Row>;
  }
};

const TableRow = (props: { program: ProgramEntity }) => {

  if (props.program.eventState === "moved") {
    return <Row className={"TableRow"}>
      <Col xs={3} className={"content"}>
        <span
          className={"Moved"}>{!!props.program.changeStartTime ? FormatDate(props.program.changeStartTime.toString()) : FormatDate(props.program.eventStartTime.toString())}</span>
      </Col>
      <Col className={"content"}>
        <span className={"Moved"}>{props.program.translations[0].title}</span>
      </Col>
      <Col xs={3} className={"content"}>
        <span
          className={"Moved"}>{!!props.program.eventChangedRoom ? props.program.eventChangedRoom : props.program.eventScheduledLocation}</span>
      </Col>
    </Row>;
  } else if (props.program.eventState === "cancelled") {
    return <Row className={"TableRow"}>
      <Col xs={3} className={"content"}>
        <span className={"Cancelled"}>{FormatDate(props.program.eventStartTime.toString())}</span>
      </Col>
      <Col className={"content"}>
        <span className={"Cancelled"}>{props.program.translations[0].title}</span>
      </Col>
      <Col xs={3} className={"content"}>
        <span className={"Cancelled"}>{props.program.eventScheduledLocation}</span>
      </Col>
    </Row>;
  } else {

    return <Row className={"TableRow"}>
      <Col xs={3} className={"content"}>
        {FormatDate(props.program.eventStartTime.toString())}
      </Col>
      <Col className={"content"}>
        {props.program.translations[0].title}
      </Col>
      <Col xs={3} className={"content"}>
        {capitalizeFirstLetter(props.program.eventScheduledLocation)}
      </Col>
    </Row>;

  }
};

function capitalizeFirstLetter(s: string) {
  return (s?.charAt(0)?.toUpperCase() + s?.slice(1))?.replace("_", " ");
}

const GenerateMainRoomTable = (props: { program: ProgramEntity[], myRoom: string }) => {
  return (
    <Container>
      <Row className={"MainRoomStyleHeader"}>
        <Col xs={2} className={"header column"}>Godzina</Col>
        <Col className={"header column"}>Nazwa punktu</Col>
      </Row>
      {props.program.length !== 0 ? props.program.map(it => <MainTableRow program={it} myRoom={props.myRoom} />) :
        <EmptyRow />}
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
    if (program === undefined && !loading) {
      setForceRefresh(true);
    }
    if (forceRefresh) {
      axiosService.get("program/screen").then(it => {
        if (it.data) {
          setProgram(it.data["program"]);
        }
        setLoading(false);
      });
      setLoading(true);
      setForceRefresh(false);
    }
    if(document.body.clientHeight > window.innerHeight){
      setProgram(program?.slice(0, -1))
    }
    // console.log("BUTTON " + buttonIsVisible)
    return () => {
      props.socketIO.off(PROGRAM_UPDATE_EVENT);
      clearInterval(repeating);
    };
  }, [forceRefresh, loading, program, props.socketIO]);
  if (program === undefined || forceRefresh) {
    return <div> Ładowanie programu... </div>;
  } else {
    if (props.screen.preferredRoom != undefined) {
      return <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", margin: 10 }}>
        <div style={{ width: "60%", margin: 5 }}>
          <div className={"PreferredRoomHeader"}>{capitalizeFirstLetter(props.screen.preferredRoom)}</div>
          <GenerateMainRoomTable
            program={program.filter(it => it.eventScheduledLocation === props.screen.preferredRoom || (it.eventState === "moved" && it.eventChangedRoom === props.screen.preferredRoom)).slice(0, props.screen.maxMainRoomEntry)}
            myRoom={props.screen.preferredRoom} />
        </div>
        <div style={{ width: "40%", margin: 5 }}>
          <div
            className={"PreferredRoomHeader"} style={{backgroundColor: "aquamarine"}}>Inne
            sale
          </div>
          <GenerateTable
            program={program.filter(it => it.eventScheduledLocation !== props.screen.preferredRoom && (it.eventState !== "moved" && it.eventScheduledLocation !== props.screen.preferredRoom)).slice(0, props.screen.maxOtherRoomEntry)}
            fullWidth={false} />
        </div>
      </div>;
    }
    return <div style={{ marginBottom: "10px" }}>
      <GenerateTable program={program} fullWidth={true} />
    </div>;
  }

};
