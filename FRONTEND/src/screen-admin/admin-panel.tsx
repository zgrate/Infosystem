import React, { useContext, useRef, useState } from "react";
import { axiosService } from "../services/AxiosService";
import { ScreenEntity } from "./screen.entity";

export const AllowedOption = ["info", "stream", "other"];

export const AdminContext = React.createContext<any>([]);

type ModeType = "list" | "settings" | "details" | "reg"

export const ScreenSettings = (props: { screen: ScreenEntity }) => {
  return <div className={"App"}>
    <form onSubmit={(data) => console.log(data)}>
      <label>
        Name:
        <input style={{ width: "100%" }} type={"text"} name={"Name"} defaultValue={props.screen.name} />
      </label>
      <label>
        Mode:
        <input style={{ width: "100%" }} list="modes" />
        <datalist defaultValue={props.screen.currentDisplayMode} style={{ width: "100%" }} id={"modes"}>
          {AllowedOption.map(it => {
            return <option key={it} value={it} />;
          })}
        </datalist>
      </label>
    </form>
  </div>;
};

export const ScreenShow = (props: { screen: ScreenEntity }) => {
  const [mode, setMode, details, setDetails] = useContext(AdminContext);

  return <div style={{ marginTop: 10, border: "1px solid" }}>
    <a onClick={() => {
      setMode("details");
      setDetails(props.screen);
    }}>Screen {props.screen.name} Mode {props.screen.currentDisplayMode} Zarejestrowany {props.screen.isRegistered ? "Tak" : "Nie"} Połączony {props.screen.isConnected ? "Tak" : "Nie"}</a>
  </div>;
};


const LoadingComponent = () => {
  return <div className={"App"}>Loading...</div>;
};
const RegScreen = () => {
  const inputRef = React.createRef<HTMLInputElement>();
  return <div className={"App"}>
    <input ref={inputRef} type="text" height={"5vh"}
           style={{ height: "5vh", fontSize: "2vh", width: "40vw" }} />
    <button onClick={() => {
      axiosService.post("admin/screen/register", { authKey: inputRef.current!.value });
    }
    }>Send
    </button>
  </div>;
};

const ListView = () => {
  const [screens, setScreens] = useState<ScreenEntity[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  if (screens == undefined) {
    if (!loading) {
      axiosService.get("/admin/screen/list").then(res => {
        setScreens(res.data);
        setLoading(false);
      });
    }
    return <LoadingComponent />;
  } else {
    return <div>{screens.map(it => <ScreenShow key={it.id} screen={it} />)}</div>;
  }
};

const ShowPartialAdmin = (props: { view: ModeType }) => {
  const [mode, setMode, details, setDetails] = useContext(AdminContext);
  if (props.view === "list") {
    return <ListView />;
  } else if (props.view === "details") {

    return <div>
      <button onClick={() => setMode("list")}>Back</button>
      <ScreenSettings screen={details} />
    </div>;
  } else if (props.view === "reg") {
    return <RegScreen />;
  } else {
    return <div>TODO</div>;
  }

};

export const AdminPanel = () => {

  const [loading, setLoading] = useState(false);
  const [userChecked, setUserChecked] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<ModeType>("list");
  const [details, setDetails] = useState<ScreenEntity | undefined>(undefined);

  if (!userChecked) {
    if (localStorage.getItem("password")) {
      if (!loading) {
        axiosService.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("password")}`;
        axiosService.get("admin/auth/self").then(res => {
          if (res.status === 403) {
            localStorage.removeItem("password");
          } else {
            setUserChecked(true);
          }
          setLoading(false);
        }).catch(it => {
          localStorage.removeItem("password");
          setLoading(false);
        });
        setLoading(true);
      }
      return <LoadingComponent />;

    } else {
      return <div className={"App"}>
        <input ref={passwordRef} type="password" height={"5vh"}
               style={{ height: "5vh", fontSize: "2vh", width: "40vw" }} />
        <button onClick={() => {
          localStorage.setItem("password", passwordRef.current!.value);
          setRefresh(!refresh);
          // // axiosService.defaults.headers.common["Authorization"] = "Bearer " + passwordRef.current!.value;
          // axiosService.get("/accreditation/items").then((response) => {
          //   setAccounts(response.data);
          // }).catch(it => setError(true));
        }
        }>ACCEPT
        </button>

      </div>;
    }
  } else {
    return <AdminContext.Provider value={[mode, setMode, details, setDetails]}>
      <div className={"App"}>
        <button onClick={() => setMode("reg")}>Screen Reg</button>
        <div>Admin Panel</div>

        <ShowPartialAdmin view={mode} />
      </div>
    </AdminContext.Provider>;

  }
};
