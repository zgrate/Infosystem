import "react-slideshow-image/dist/styles.css";
import { Slide } from "react-slideshow-image";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { socketIO } from "../../screens/screen";
import { axiosService } from "../../services/AxiosService";

export interface SlideshowResponse {
  status: string,
  endpoint: string,
  photos: string[]
}

const PHOTOS_REFRESH_EVENT = "screen.photos.refresh";

export const SlideshowFragment = (props: { socketIO: Socket }) => {
  const [photos, setPhotos] = useState<SlideshowResponse>();
  const [loading, setLoading] = useState(false);
  const [forceReload, setForceReload] = useState(false);

  useEffect(() => {
    socketIO.on(PHOTOS_REFRESH_EVENT, () => {
      setForceReload(true);
    });
    return () => {
      socketIO.off(PHOTOS_REFRESH_EVENT);
    };
  });

  if (photos === undefined || forceReload) {
    if (!loading) {
      axiosService.get("photos").then(it => {
        if (it.data) {
          setPhotos(it.data);
        }
        setLoading(false);
      });
      setLoading(true);
      setForceReload(false);
    }
    return <div> LOADING... </div>;
  }

  return <div className={"slide-container"}>
    <Slide arrows={false} autoplay={true} duration={5000}>
      {photos.photos.map((it, index) => (
        <div className={"each-slide"} key={index}>
          <img src={photos?.endpoint + "/" + it} style={{ height: "60vh", marginBottom: "10px" }} />
        </div>
      ))
      }
    </Slide>
  </div>;
};
