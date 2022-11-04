import { MessageType, ShowMessage } from "../screen-components/public-messages";
import { StreamView } from "../views/stream";
import { getMarqueeOrg } from "../screen-components/marquee-generator";
import React, { useEffect, useState } from "react";

const message_org = ["Witamy na Futrołajkach 2022!", "Przypominamy, że możesz zgłosić swój punkt programu na @futrolajkibot!", "Przypominamy, że pokój 111 ma zakaz robienia dziur w ścianiach", "Przypominamy, że Z-Grate ma zakaz walenia balonów. Wszystkie nadużycia prosimy zgłaszać na @futrolajki bot lub telefonicznie"];


export const ScreenMain = () => {
  const [testMsg, setTestMsg] = useState<MessageType>({ message: "", iconUrl: "" });

  useEffect(() => {
    const interval = setInterval(() => {
      setTestMsg({ message: Date().toLocaleString(), iconUrl: "" });
      console.log("test");
    }, 2000);
    return () => clearInterval(interval);
  });

  return <div className="App">
    <ShowMessage message={testMsg.message} iconUrl={testMsg.iconUrl} />
    {/*<AllScheduleView rows={rows}/>*/}
    <StreamView streamLink={"https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"} playerStyle={{}} />
    <div className="Footer">
      {getMarqueeOrg(message_org)}
    </div>

  </div>;
};
