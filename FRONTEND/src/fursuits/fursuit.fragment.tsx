import { Col, Container, Image, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { axiosService } from "../services/AxiosService";

const fursuit = [
  {
    name: "Rasti",
    count: 10,
    img: "https://res.futrolajki.pl/fursuits/rasti.png"
  },
  {
    name: "Nijak",
    count: 1,
    img: "https://res.futrolajki.pl/fursuits/nijak.png"
  }
];

const FursuitRow = (props: { fursuitIns: any }) => {
  return <Row style={{ marginBottom: "5px" }}>
    <Col style={{backgroundColor: "lightblue", width: "fit-content" }}>
      <Image src={props.fursuitIns["img"]} width={"70x"} />
    </Col>
    <Col className={"CenterAlign"} style={{ backgroundColor: "lightblue", fontSize: "2vw" }}>
      {props.fursuitIns["name"]}
    </Col>
    <Col className={"CenterAlign"}
         style={{ backgroundColor: "lightblue", fontSize: "2vw", textAlign: "center", justifyContent: "center" }}>
      {props.fursuitIns["count"]}
    </Col>
  </Row>;
};

export const FursuitFragment = (props: { limit: number | undefined, ignorePageLimit: boolean }) => {

  const [fursuit, setFursuit] = useState<any[] | undefined>(undefined);

  useEffect(() => {
    const getData = () => {
      axiosService.get("/catch/fursuits?limit="+ props.limit).then(it=>{
            setFursuit(it.data);
      })
    };
    if(!fursuit){
      getData();
    }
    else {
      if (!props.ignorePageLimit && document.body.clientHeight > window.innerHeight) {
        setFursuit(fursuit?.slice(0, -1))
      }
    }
  }, [fursuit, props.limit]);

  if(!fursuit)
  {
    return <>Ładowanie....</>
  }

  return <Container>
    <Row style={{ marginBottom: "5px" }}>
      <Col className={"CenterAlign"} style={{ fontWeight: "bold", backgroundColor: "lightblue", fontSize: "2vw" }}>
        Zdjęcie
      </Col>
      <Col className={"CenterAlign"} style={{ fontWeight: "bold", backgroundColor: "lightblue", fontSize: "2vw" }}>
        Nazwa fursuita
      </Col>
      <Col className={"CenterAlign"} style={{
        fontWeight: "bold",
        backgroundColor: "lightblue",
        fontSize: "2vw",
        textAlign: "center",
        justifyContent: "center"
      }}>
        Liczba złapań
      </Col>
    </Row>
    {fursuit.map(it => <FursuitRow fursuitIns={it} key={it.name} />)}
  </Container>;
};
