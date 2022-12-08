import React, { useEffect, useState } from "react";
import ReactHlsPlayer from "react-hls-player";
import { axiosService } from "../services/AxiosService";

export const StreamDJ = (props: { streamLink: string }) => {
  const playerRef = React.useRef<HTMLVideoElement>() as React.MutableRefObject<HTMLVideoElement>;
  return <ReactHlsPlayer
    src={props.streamLink}
    autoPlay={false}
    controls={true}
    width="100%"
    height="auto"
    playerRef={playerRef} />;
};

export interface DJResponse{
  twitch: {name: string, viewerCount: number, isOnline: boolean}[],
  vrcdn: {
    stream: string,
    isOnline: boolean,
    totalViewers: number}[]
}



export const DJView = () => {
  const [dj, setDj] = useState<DJResponse>();
  const [lastUpdate, setUpdate] = useState(new Date());
  const refreshDJ = () => {
    axiosService.get("/dj/stats").then(it => {
      if(it.status === 200) {
        setDj(it.data)
        setUpdate(new Date())
      }
    })
  }

  useEffect(()=>{
    refreshDJ()
  }, [])

  useEffect(()=>{
    const t = setInterval(() => {
      refreshDJ()
    }, 10000)
    return ()=>{
      clearInterval(t)
    }
  }, [])
  return <>
    <div style={{ fontSize: "50px", display: "flex", flexDirection: "row", justifyContent: "center", margin: "20px", backgroundColor: "white" }}>
      {/*<div style={{ width: "100%", margin: "20px" }}>*/}
        {/*<StreamDJ streamLink={"https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"} />*/}
      {/*</div>*/}
      <div style={{ width: "90%", margin: "20px", textAlign: "center" }}>

        STATS:
        <div>TWITCH: {dj ? dj.twitch.map(it => <TwitchRow row={it}/>) : "Loading.."}</div>
        <div>VRCDN: {dj ? dj.vrcdn.map(it => <VRCDNFragment row={it}/>) : "Loading..."}</div>
        <div>LAST UPDATE: {lastUpdate.toLocaleString("pl", {timeZone: "Europe/Warsaw"})}</div>
      </div>
    </div>
    <div style={{
      fontSize: "50px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      margin: "20px",
      textAlign: "center"
    }}>
      {/*<div>*/}
      {/*  <button style={{ width: "90%", fontSize: "50px" }}>IM READY</button>*/}
      {/*</div>*/}
      {/*<div className={"MarginTop"}>*/}
      {/*  <button style={{ width: "90%", fontSize: "50px" }}>CALL SUPPORT</button>*/}
      {/*</div>*/}
      {/*<div className={"MarginTop"}>*/}
      {/*  <button style={{ width: "90%", fontSize: "50px" }}>END OF SET</button>*/}
      {/*</div>*/}
    </div>
  </>;
};

const TwitchRow = (props: {row: any})=>{
  return <div key={props.row.name}>

      {props.row["name"]}: {props.row.isOnline ? props.row.viewerCount : "Offline"}

    </div>
}

const VRCDNFragment = (props: {row: any})=>{
  return <div key={props.row.name}>

      {props.row["stream"]}: {props.row.isOnline ? props.row.totalViewers : "Offline"}

    </div>
}
