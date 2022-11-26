import "react-slideshow-image/dist/styles.css";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { socketIO } from "../../screens/screen";
import { axiosService } from "../../services/AxiosService";

export interface SlideshowResponse {
  status: string,
  endpoint: string,
  photos: string[],
  slideTimeout: number;
}
function shuffle<T>(array: T[]) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
const PHOTOS_REFRESH_EVENT = "screen.photos.refresh";

let indexSlide = 0;
function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}


export const SlideshowFragment = (props: { wsEnabled: boolean, socketIO: Socket }) => {
  const [photos, setPhotos] = useState<SlideshowResponse>();
  const [loading, setLoading] = useState(false);
  const [forceReload, setForceReload] = useState(false);

  useEffect(() => {
    const refreshPhotos = () => {
      axiosService.get("photos").then(it => {
        if (it.data) {
          shuffle(it.data.photos)
          setPhotos(it.data);
          indexSlide = 0;
        }

      });
    }
    if (photos === undefined){
      refreshPhotos()
    }
    if(props.wsEnabled) {
      socketIO.on(PHOTOS_REFRESH_EVENT, () => {
        setForceReload(true);
      });
    }
    const interval = setInterval(refreshPhotos, 30000)

    const photosChange = setInterval(() => {
      if(photos) {
        const photo = document.getElementById("slide_photos")! as HTMLImageElement
        photo.src = photos.endpoint + "/" + photos.photos[indexSlide++]
        if(indexSlide >= photos.photos.length)
        {
          indexSlide = 0;
        }
      }
    }, photos?.slideTimeout ? photos.slideTimeout : 5000)

      return () => {
        socketIO.off(PHOTOS_REFRESH_EVENT);
        clearInterval(interval)
        clearInterval(photosChange)
      };

  });



  if (photos === undefined) {
    return <div> LOADING... </div>;
  }

  return <div className={"slide-container"}>
      <img src={photos.endpoint + "/" + photos.photos[indexSlide++]} id="slide_photos" style={{ height: "60vh", marginBottom: "10px" }} />
    {/*<Slide arrows={false} autoplay={true} duration={5000}>*/}
    {/*  {photos.photos.map((it, index) => (*/}
    {/*    <div className={"each-slide"} key={index}>*/}
    {/*      <img src={photos?.endpoint + "/" + it} style={{ height: "60vh", marginBottom: "10px" }} />*/}
    {/*    </div>*/}
    {/*  ))*/}
    {/*  }*/}
    {/*</Slide>*/}
  </div>;
};
