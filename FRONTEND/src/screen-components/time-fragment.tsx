import { useEffect, useState } from "react";

export const TimeFragment = ()=>{
  const [time, setTime] = useState(new Date());
  useEffect(() =>{
    const interval = setInterval(()=>{
      setTime(new Date())
    })
    return ()=>{
      clearInterval(interval);
    }
  })

  const timeString = time.toLocaleString();

  return <div className={"TimeFragment"}>{timeString}</div>
}
