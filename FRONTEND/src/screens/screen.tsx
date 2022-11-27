import { ShowMessage } from "../screen-components/public-messages";
import { getMarqueeOrg } from "../screen-components/marquee-generator";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import io, { Socket } from "socket.io-client";
import { AdminMessageEntity, DisplayModeType, PeopleMessageEntity, ScreenEntity } from "../screen-admin/screen.entity";
import { axiosService } from "../services/AxiosService";
import { ProgramFragment } from "../screen-components/program/program-fragment";
import { SlideshowFragment } from "../screen-components/program/slideshow.fragment";
import { StreamFragment } from "../screen-components/stream-fragment";
import { AdminMessageFragment } from "../screen-components/admin-message.fragment";
import { TimeFragment } from "../screen-components/time-fragment";
import { FursuitFragment } from "../fursuits/fursuit.fragment";


export const socketIO = io(process.env.REACT_APP_API_URL!, {
  auth: {
    token: localStorage.getItem("screenId") ? localStorage.getItem("screenId") : "guest"
  },
  reconnection: true,
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


export const DisplayFragment = (props: { mode: string, screen: ScreenEntity, socketIO: Socket, wsEnabled: boolean }) => {

  if (props.mode === "info") {
    return <ProgramFragment wsEnabled={props.wsEnabled} screen={props.screen} socketIO={props.socketIO} />;
  } else if (props.mode === "slideshow") {
    return <SlideshowFragment wsEnabled={props.wsEnabled} socketIO={props.socketIO} />;
  } else if (props.mode === "message") {
    return <AdminMessageFragment forceReload={true} />;
  } else if (props.mode === "fursuit"){
    return <div style={{width: "50%", marginLeft: "auto", marginRight: "auto"}}><FursuitFragment limit={10}/> </div>
  }

  return <></>;
};

var indexCurrent = 0;
var lastChange = Date.now();

export const ScreenMain = (props: {wsEnabled: boolean}) => {

  const [screenSettings, setScreenSettings] = useState<ScreenEntity>();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<DisplayModeType | string>("connecting");
  const [messages, setMessages] = useState<MessagesWrapper>();
  const [messagesLoading, setMessageLoading] = useState(false);
  const [forceMessageReload, setForceMessageReload] = useState(false);
  const [peopleMessageIndex, setPeopleMessageIndex] = useState(0);
  // const { sendMessage, lastMessage, readyState } = useWebSocket(process.env.REACT_APP_API_URL!, {
  //   shouldReconnect: (closeEvent) => true,
  //   protocols: "websocket"
  //   onMessage: ()
  // });




  useEffect(() => {

    let displayChange: any = undefined;
    if(screenSettings && screenSettings.currentDisplayMode === "change")
    {
      displayChange = setInterval(() => {
        const m = screenSettings.modesQueue[indexCurrent]
        if(isNaN(Number(m)))
        {
          lastChange = Date.now();
          setMode(m);
          indexCurrent++;
        }
        else if(Date.now() - lastChange > Number(m)){
          indexCurrent++;
        }
        if(indexCurrent >= screenSettings.modesQueue.length){
          indexCurrent = 0;
        }

      }, 1000)
    }

    const updateMessages = (screenSettings: ScreenEntity) => {
        if (screenSettings?.peopleMessages && screenSettings?.adminMessages) {
          axiosService.get("messages").then((res) => {
            let admins: AdminMessageEntity[] = res.data["admin"];
            const peoples: PeopleMessageEntity[] = res.data["people"];
            if (admins.length < 6) {
              while (admins.length < 6) {
                admins = admins.concat(admins);
              }
            }
            setMessages({ adminMessages: admins, peopleMessages: peoples });
            lastUpdate = Date.now();
          }).catch(it => {
            console.log("Trying again  soon...");
          });
        } else if ( (screenSettings?.peopleMessages)) {
          axiosService.get("messages/people").then((res) => {
            const peoples: PeopleMessageEntity[] = res.data;
            setMessages({ peopleMessages: peoples, adminMessages: undefined });
            lastUpdate = Date.now();
          }).catch(it => {
            console.log("Trying again  soon...");
          });
        } else if ((screenSettings?.adminMessages)) {
          axiosService.get("messages/admin").then((res) => {
            const admins: AdminMessageEntity[] = res.data;
            setMessages({ peopleMessages: undefined, adminMessages: admins });
            lastUpdate = Date.now();
          }).catch(it => {
            console.log("Trying again  soon...");
          });
        }

    };

    const executeUpdate = () => {

      axiosService.get("/screen/info/" + localStorage.getItem("screenId"), { validateStatus: (status) => status < 500 }).then(it => {
        if (it.status > 400) {
          localStorage.removeItem("screenId");
        } else {
          setScreenSettings(it.data);
          setMode(it.data.currentDisplayMode!);
          updateMessages(it.data);
          const c = document.getElementById("footer")!
          c.textContent = it.data.name + "Last update" + new Date().toString()
        }
        setLoading(false);
      }).catch(error => {
        // console.log(error.toJSON())
        if (error.response) {
          if (error.response.status === 403) {
            console.log("THSI IS UNAUTH!");
          }
        }
        return setTimeout(() => {
          // setMode("connection_error");
          // setLoading(false);
          if (error.status === 403) {
            localStorage.removeItem("screenId");
          }
        }, 1000);

      });

      // setLoading(true);
      //TODO: Error handling?
    };
    var timeout: any = undefined;
    if(props.wsEnabled) {
      socketIO.on("connect_error", (data) => {
        console.log("CONNECTION ERROR" + data);
        setTimeout(() => {
          socketIO.connect();
        }, 5000);
      });

      // socketIO.on("disconnect", (erro) => {
      //   disconnectTimes += 1;
      //   if (disconnectTimes > 5) {
      //     socketIO.disconnect();
      //     socketIO.connect();
      //     disconnectTimes = 0;
      //   }
      //   console.log(erro);
      // });
      socketIO.on("screen.mode.change", (...args) => {
        console.log("SCREEN MODE SCHAGNGE");
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
      socketIO.on("screen.refresh", () => {
        window.location.reload();
      });
      timeout = setInterval(() => {
        if (Date.now() - lastPong > PING_INTERVAL * 2) {
          socketIO.disconnect();
          socketIO.connect();
          lastPong = (Date.now());
        } else {
          socketIO.emit("ping");
        }
      }, PING_INTERVAL);
      socketIO.disconnect();
      socketIO.connect();
    }
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



    if (screenSettings === undefined) {
        executeUpdate();
    }


    const autoRepeat = setInterval(()=>{
      executeUpdate();
    }, props.wsEnabled ? 60000 : 30000)


    return () => {
      timeout && clearInterval(timeout);
      clearInterval(peopleMessageTimeout);
      clearInterval(autoRepeat);
      displayChange && clearInterval(displayChange);
      socketIO.off("connect_error");
      socketIO.off("disconnect");
      socketIO.off("screen.mode.change");
      socketIO.off("pong");
      socketIO.off("screen.settings.update");
      socketIO.off("screen.messages.update");
      socketIO.off("screen.refresh");
    };
  }, [screenSettings, messages?.peopleMessages, peopleMessageIndex, loading]);

  if (!localStorage.getItem("screenId")) {
    return <Navigate replace to={"/auth"} />;
  }
    console.log(mode);


  if (mode === "connecting") {
    return <div className={"App"}>
      Proszę czekać, trwa ogarnianie połączenia...
    </div>;
  } else if (mode === "connection_error") {
    return <div className={"App"}>
      Problem z połączeniem, proszę czekać....
    </div>;
  } else if (mode === "stream") {
    return <div className="App">
      <StreamFragment screen={screenSettings!!} socketIO={socketIO} />
      <div style={{ fontSize: "15px" }}>{screenSettings?.name} Last
        update {new Date(lastMessageChange).toString()}</div>
    </div>;
  } else {
    return <div className="App">
      <TimeFragment/>
      <ShowMessage message={messages?.peopleMessages?.[peopleMessageIndex]} />
      <DisplayFragment wsEnabled={props.wsEnabled} mode={mode} screen={screenSettings!!} socketIO={socketIO} />
      {/*<AllScheduleView rows={rows}/>*/}
      {/*<StreamView streamLink={"https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"} playerStyle={{}} />*/}
      <div className="Footer">
        {getMarqueeOrg(messages?.adminMessages)}
      </div>
      <div id={"footer"} style={{ fontSize: "15px" }}>{screenSettings?.name} Last
        update {new Date(lastMessageChange).toString()}</div>
    </div>;
  }
}
