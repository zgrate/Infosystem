import ReactHlsPlayer from "react-hls-player";
import React from "react";


export const StreamView = (props: any) => {
  const playerRef = React.useRef<HTMLVideoElement>() as React.MutableRefObject<HTMLVideoElement>;
  return <ReactHlsPlayer
    src="https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"
    autoPlay={false}
    controls={true}
    width="100%"
    height="auto"
    playerRef={playerRef} />;
};
