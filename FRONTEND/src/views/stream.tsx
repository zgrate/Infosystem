import ReactHlsPlayer from "react-hls-player";
import React, { CSSProperties } from "react";


export const StreamView = (props: { streamLink: string, playerStyle: CSSProperties | undefined }) => {
  const playerRef = React.useRef<HTMLVideoElement>() as React.MutableRefObject<HTMLVideoElement>;
  return <ReactHlsPlayer
    style={props.playerStyle}
    src={props.streamLink}
    autoPlay={false}
    controls={true}
    width="100%"
    height="auto"
    playerRef={playerRef} />;
};
