import { Col, Container, Image, Row } from "react-bootstrap";

const fursuit = [
  {
    name: "Rasti",
    catches: 10,
    img: "https://res.futrolajki.pl/fursuits/rasti.png"
  },
  {
    name: "Nijak",
    catches: 1,
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
      {props.fursuitIns["catches"]}
    </Col>
  </Row>;
};

export const FursuitFragment = () => {
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
