import Marquee from "react-fast-marquee";
import { AdminMessageEntity } from "../screen-admin/screen.entity";

function messageGen(mess: AdminMessageEntity) {
  return (
    <span key={mess.id} className="MarqueeText">
          {mess.message}
      </span>
  );
}

export function getMarqueeOrg(listMessages: AdminMessageEntity[] | undefined) {
  if (listMessages) {
    if (listMessages.length > 0) {
      return (
        <Marquee className="MarqueeOrg" gradient={false} speed={150 / listMessages.length}>
          {listMessages.map((o) => messageGen(o))}
        </Marquee>
      );
    } else {

    }
  } else
    return <></>;
}
