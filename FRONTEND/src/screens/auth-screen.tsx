import { useState } from "react";
// import { socketIO } from "../services/socketio.service";
import { axiosService } from "../services/AxiosService";

export interface AuthorizationEvent {
  screenId: string;
  authKey: string;
}

export const AuthScreen = () => {
  // useEffect(() =>{
  //   socketIO.on("auth.event", (obj: AuthorizationEvent)=>{
  //
  //   })
  // })

  const [screenData, setScreenData] = useState(null);
  const [refresh, setRefresh] = useState(false);

  if (localStorage.getItem("screenId")) {
    if (screenData != null) {
      if (screenData["isRegistered"]) {
        return <div className={"App"}>
          Ekran jest już zautoryzowany! Zapraszamy na stronę
          <a href={"/screen"}>tutaj</a>
        </div>;
      } else {
        return <div className={"App"}>
          Prosimy o przekazanie Adminowi kodu {screenData["authKey"]} dla ekranu {screenData["name"]}
        </div>;
      }
    } else {
      axiosService.get("/screen/get/" + localStorage.getItem("screenId")).then(res => {
        if (res.status === 404) {
          localStorage.removeItem("screenId");
          setRefresh(!refresh);
        } else {
          setScreenData(res.data);
        }
      });
      return <div className={"App"}>
        Loading...
      </div>;
    }

  } else {
    if (screenData == null) {
      axiosService.post("/screen").then((it) => {
        console.log(it);
        localStorage.setItem("screenId", it.data["id"]);
        setScreenData(it.data);
      });
      return <div className={"App"}>
        Autoryzacja z {process.env.REACT_APP_API_URL}
      </div>;
    }
    return <div className={"App"}>
      Loading...
    </div>;
  }
};
