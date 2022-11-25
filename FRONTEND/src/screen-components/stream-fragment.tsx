import { ScreenEntity } from "../screen-admin/screen.entity";
import React, { useEffect, useState } from "react";
import ReactHlsPlayer from "react-hls-player";
import { Socket } from "socket.io-client";
import { axiosService } from "../services/AxiosService";


export const StreamFragment = (props: { screen: ScreenEntity, socketIO: Socket }) => {
  const playerRef = React.useRef<HTMLVideoElement>() as React.MutableRefObject<HTMLVideoElement>;
  const [streamLink, setStreamLink] = useState<string>("")
  useEffect(()=>{
      axiosService.get("/screen/streams/"+props.screen.id).then(it =>
      {
        if(it.status === 200){
          setStreamLink(it.data)
        }
      })
  })

  if(streamLink.endsWith(".mp4"))
  {
      return <video autoPlay={true} loop={true} controls={false} muted={false} height={window.innerHeight-50}>
        <source src={streamLink} type="video/mp4"/>
      </video>
  }

  return <ReactHlsPlayer
    src={streamLink}
    autoPlay={false}
    controls={false}
    muted={true}
    height={window.innerHeight-50}
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
