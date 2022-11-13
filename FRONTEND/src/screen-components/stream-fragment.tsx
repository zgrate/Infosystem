import { ScreenEntity } from "../screen-admin/screen.entity";
import React from "react";
import ReactHlsPlayer from "react-hls-player";
import { Socket } from "socket.io-client";

export const StreamFragment = (props: { screen: ScreenEntity, socketIO: Socket }) => {
  const playerRef = React.useRef<HTMLVideoElement>() as React.MutableRefObject<HTMLVideoElement>;

  return <ReactHlsPlayer
    src={"https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"}
    autoPlay={false}
    controls={false}
    muted={true}
    width={"100%"}
    playerRef={playerRef}
    onCanPlay={it => {
      playerRef.current.muted = false;
      playerRef.current.play().then(it => {
        console.log("PLAY SUCCESSFULL!");
        playerRef.current.requestFullscreen().catch(it => console.error(it));
      }).catch(it => {
        console.log("PLAY FAILED");
        console.error(it);
      });
    }
    }
  />;
};
