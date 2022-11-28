import { FursuitFragment } from "./fursuit.fragment";
import React from "react";

export const FursuitPage = () => {
  return <div className="App" style={{
    marginLeft: "auto",
    marginRight: "auto",
    width: "30%",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    display: "flex"
  }}>
    <FursuitFragment limit={99999999} ignorePageLimit={true} />
  </div>;
};
