import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { showProgram } from "../screen-components/program";
import Container from "react-bootstrap/Container";
import React from "react";

export const AllScheduleView = (options: { rows: Array<any> }) => {
  return <Container className="Container" fluid>
    <Row>
      <Col sm={8}>
        {showProgram(options.rows)}
      </Col>
    </Row>
  </Container>;
};
