import { useEffect } from "react";

export const TimeFragment = ()=>{
  useEffect(() =>{
    const interval = setInterval(()=>{
      // setTime(new Date())
      const e = document.getElementById("timer")!
      e.textContent = new Date().toLocaleString()
    }, 1000)
    return ()=>{
      clearInterval(interval);
    }
  })


  return <div id={"timer"} className={"TimeFragment"}/>
}
