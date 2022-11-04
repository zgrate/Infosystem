import React from "react";
import ReactHlsPlayer from "react-hls-player";

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

export const DJView = () => {
  return <>
    <div style={{ fontSize: "50px", display: "flex", flexDirection: "row", justifyContent: "center", margin: "20px" }}>
      <div style={{ width: "100%", margin: "20px" }}>
        <StreamDJ streamLink={"https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"} />
      </div>
      <div style={{ width: "90%", margin: "20px", textAlign: "center" }}>
        STATS:
        <div>
          VRCDN: 20
        </div>
        <div>
          VRCHAT: 30
        </div>
        <div>
          TWITCH: 40
        </div>
      </div>
      <div style={{ width: "70%", textAlign: "right" }}>
        <div>
          20:52:01
        </div>
        <div>
          REC: 00:00:10
        </div>
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
      <div>
        <button style={{ width: "90%", fontSize: "50px" }}>IM READY</button>
      </div>
      <div className={"MarginTop"}>
        <button style={{ width: "90%", fontSize: "50px" }}>CALL SUPPORT</button>
      </div>
      <div className={"MarginTop"}>
        <button style={{ width: "90%", fontSize: "50px" }}>END OF SET</button>
      </div>
    </div>
  </>;
};
