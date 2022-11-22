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
    <Col style={{ width: "fit-content" }}>
      <Image src={props.fursuitIns["img"]} width={"100x"} />
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

export const FursuitFragment = (props: { limit: number | undefined }) => {

  const [fursuit, setFursuit] = useState([]);

  const getData = async (limit: number | undefined) => {
    if (limit === undefined) {
      try {
        const fursuits = (await axiosService.get("/catch/fursuits")).data;
        setFursuit(fursuits);
      } catch (e) {
        console.log("Wystąpił bład!");
      }
    }
  };

  useEffect(() => {
    getData(props.limit);
  }, [props.limit]);


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
    {fursuit.map(it => <FursuitRow fursuitIns={it} />)}
  </Container>;
};
