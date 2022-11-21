import { useEffect, useState } from "react";
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

  const [screenData, setScreenData] = useState(undefined);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    if (localStorage.getItem("screenId") && screenData === undefined && !loading) {
      axiosService.get("/screen/get/" + localStorage.getItem("screenId"), { validateStatus: (status) => status < 500 }).then(res => {
        if (res.status >= 400) {
          localStorage.removeItem("screenId");
          setRefresh(!refresh);
        } else {
          setScreenData(res.data);
        }
        setLoading(false);
      }).catch(it => {
        localStorage.removeItem("screenId");
        setRefresh(!refresh);
        setLoading(false);
      });
      setLoading(true);
    } else if (!localStorage.getItem("screenId") && !loading) {
      axiosService.post("/screen").then((it) => {
        console.log(it);
        localStorage.setItem("screenId", it.data["id"]);
        setScreenData(it.data);
        setLoading(false);
      });
      setLoading(true);

    }

  }, [loading, screenData, refresh]);

  if (localStorage.getItem("screenId")) {
    if (screenData != undefined) {
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
      return <div className={"App"}>
        Loading...
      </div>;
    }

  } else {
    if (screenData == null) {
      return <div className={"App"}>
        Autoryzacja z {process.env.REACT_APP_API_URL}
      </div>;
    }
    return <div className={"App"}>
      Loading...
    </div>;
  }
};
