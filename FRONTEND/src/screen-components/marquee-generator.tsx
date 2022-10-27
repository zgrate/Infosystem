import Marquee from "react-fast-marquee";

function messageGen(mess: string) {
  return (
    <span className="MarqueeText">
          {mess}
      </span>
  );
}

export function getMarqueeOrg(listMessages: Array<string>) {
  return (
    <Marquee className="MarqueeOrg" gradient={false} speed={50}>
      {listMessages.map((o) => messageGen(o))}
    </Marquee>
  );
}
