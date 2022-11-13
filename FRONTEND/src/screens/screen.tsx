import { ShowMessage } from "../screen-components/public-messages";
import { getMarqueeOrg } from "../screen-components/marquee-generator";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import io, { Socket } from "socket.io-client";
import { AdminMessageEntity, DisplayModeType, PeopleMessageEntity, ScreenEntity } from "../screen-admin/screen.entity";
import { axiosService } from "../services/AxiosService";
import { ProgramFragment } from "../screen-components/program/program-fragment";
import { SlideshowFragment } from "../screen-components/program/slideshow.fragment";

const message_org = ["Witamy na Futrołajkach 2022!", "Przypominamy, że możesz zgłosić swój punkt programu na @futrolajkibot!", "Przypominamy, że pokój 111 ma zakaz robienia dziur w ścianiach", "Przypominamy, że Z-Grate ma zakaz walenia balonów. Wszystkie nadużycia prosimy zgłaszać na @futrolajki bot lub telefonicznie"];

export const socketIO = io(process.env.REACT_APP_API_URL!, {
  auth: {
    token: localStorage.getItem("screenId") ? localStorage.getItem("screenId") : "guest"
  },
  reconnection: true,
  reconnectionAttempts: 999999,
  transports: ["websocket"],
  autoConnect: false
});

const PING_INTERVAL = 3000;
const CONNECTION_TIMEOUT = 5000;
let disconnectTimes = 0;
let lastPong = Date.now();
let lastMessageChange = Date.now();
let lastUpdate = Date.now();

export interface MessagesWrapper {
  peopleMessages: PeopleMessageEntity[] | undefined;
  adminMessages: AdminMessageEntity[] | undefined;
}


export const DisplayFragment = (props: { mode: string, screen: ScreenEntity, socketIO: Socket }) => {


  if (props.mode === "info") {
    return <ProgramFragment screen={props.screen} socketIO={props.socketIO} />;
  }
  if (props.mode === "slideshow") {
    return <SlideshowFragment socketIO={props.socketIO} />;
  }
  return <></>;
};

export const ScreenMain = () => {

  const [screenSettings, setScreenSettings] = useState<ScreenEntity>();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<DisplayModeType>("connecting");
  const [messages, setMessages] = useState<MessagesWrapper>();
  const [messagesLoading, setMessageLoading] = useState(false);
  const [forceMessageReload, setForceMessageReload] = useState(false);
  const [peopleMessageIndex, setPeopleMessageIndex] = useState(0);

  const executeUpdate = () => {
    axiosService.get("/screen/info/" + localStorage.getItem("screenId")).then(it => {
      if (it.status === 404) {
        localStorage.removeItem("screenId");
      } else {
        setScreenSettings(it.data);
        setMode(it.data.currentDisplayMode!);
        lastUpdate = Date.now();
      }
      setLoading(false);
    }).catch(it => {
      setMode("connection_error");
      setLoading(false);
    });

    setLoading(true);
    //TODO: Error handling?
  };

  useEffect(() => {

    socketIO.on("connect_error", (data) => {
      console.log("CONNECTION ERROR" + data);
      setTimeout(() => {
        socketIO.connect();
      }, 5000);
    });

    socketIO.on("disconnect", (erro) => {
      disconnectTimes += 1;
      if (disconnectTimes > 5) {
        socketIO.disconnect();
        socketIO.connect();
        disconnectTimes = 0;
      }
      console.log(erro);
    });
    socketIO.on("screen.mode.change", (...args) => {
      setMode(args[0]);
    });
    socketIO.on("screen.settings.update", () => {
      executeUpdate();
    });
    socketIO.on("screen.messages.update", () => {
      setForceMessageReload(true);
    });
    socketIO.on("pong", () => {
      console.log("Ponged!");
      lastPong = (Date.now());
    });
    const timeout = setInterval(() => {
      if (Date.now() - lastPong > PING_INTERVAL * 2) {
        socketIO.disconnect();
        socketIO.connect();
        lastPong = (Date.now());
      } else {
        socketIO.emit("ping");
      }
    }, PING_INTERVAL);

    const peopleMessageTimeout = setInterval(() => {
      if (screenSettings && Date.now() - lastMessageChange > screenSettings?.peopleMessageRotate && screenSettings.peopleMessages && messages?.peopleMessages && messages.peopleMessages.length > 0) {
        lastMessageChange = Date.now();
        let newMessageIndex = peopleMessageIndex + 1;
        if (newMessageIndex > messages.peopleMessages.length - 1) {
          newMessageIndex = 0;
        }
        console.log("SETTINGS.. ." + messages.peopleMessages.length);
        setPeopleMessageIndex(newMessageIndex);
      }
    }, 1000);

    socketIO.connect();

    return () => {
      clearInterval(timeout);
      clearInterval(peopleMessageTimeout);
      socketIO.off("connect_error");
      socketIO.off("disconnect");
      socketIO.off("screen.mode.change");
      socketIO.off("pong");
      socketIO.off("screen.settings.update");
      socketIO.off("screen.messages.update");
    };
  }, [socketIO, setMode, executeUpdate, lastPong, lastMessageChange, setForceMessageReload]);

  if (!localStorage.getItem("screenId")) {
    return <Navigate replace to={"/auth"} />;
  }
  if (screenSettings === undefined) {
    if (!loading) {
      executeUpdate();
    }
  }
  // console.log(screenSettings)
  if (!messagesLoading && screenSettings != null) {
    if (forceMessageReload || (screenSettings?.peopleMessages && screenSettings?.adminMessages && messages === undefined)) {
      axiosService.get("messages").then((res) => {
        let admins: AdminMessageEntity[] = res.data["admin"];
        const peoples: PeopleMessageEntity[] = res.data["people"];
        if (admins.length < 6) {
          while (admins.length < 6) {
            admins = admins.concat(admins);
          }
        }
        setMessages({ adminMessages: admins, peopleMessages: peoples });
        setMessageLoading(false);
        lastUpdate = Date.now();
      }).catch(it => {
        console.log("Trying again  soon...");
        setTimeout(() => setMessageLoading(false), CONNECTION_TIMEOUT);
      });
      setMessageLoading(true);
      setForceMessageReload(false);
    } else if (forceMessageReload || (screenSettings?.peopleMessages && messages === undefined)) {
      axiosService.get("messages/people").then((res) => {
        const peoples: PeopleMessageEntity[] = res.data;
        setMessages({ peopleMessages: peoples, adminMessages: undefined });
        setMessageLoading(false);
        lastUpdate = Date.now();
      }).catch(it => {
        console.log("Trying again  soon...");
        setTimeout(() => setMessageLoading(false), CONNECTION_TIMEOUT);
      });
      setMessageLoading(true);
      setForceMessageReload(false);
    } else if (forceMessageReload || (screenSettings?.adminMessages && messages === undefined)) {
      axiosService.get("messages/admin").then((res) => {
        const admins: AdminMessageEntity[] = res.data;
        setMessages({ peopleMessages: undefined, adminMessages: admins });

        setMessageLoading(false);
        setForceMessageReload(false);
        lastUpdate = Date.now();
      }).catch(it => {
        console.log("Trying again  soon...");
        setTimeout(() => setMessageLoading(false), CONNECTION_TIMEOUT);
      });
      setMessageLoading(true);
    }
  }

  console.log(mode);


  if (mode === "connecting") {
    return <div className={"App"}>
      Proszę czekać, trwa ogarnianie połączenia...
    </div>;
  } else if (mode === "connection_error") {
    setTimeout(() => {
      executeUpdate();
    }, CONNECTION_TIMEOUT);
    return <div className={"App"}>
      Problem z połączeniem, proszę czekać....
    </div>;
  } else {
    return <div className="App">
      <ShowMessage message={messages?.peopleMessages?.[peopleMessageIndex]} />
      <DisplayFragment mode={mode} screen={screenSettings!!} socketIO={socketIO} />
      {/*<AllScheduleView rows={rows}/>*/}
      {/*<StreamView streamLink={"https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"} playerStyle={{}} />*/}
      <div className="Footer">
        {getMarqueeOrg(messages?.adminMessages)}
      </div>
      <div style={{ fontSize: "15px" }}>Last update {new Date(lastMessageChange).toString()}</div>
    </div>;
  }
}
