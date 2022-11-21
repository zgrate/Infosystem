import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import { axiosService } from "../services/AxiosService";


export const AdminMessageFragment = (props: { forceReload: boolean }) => {
  const [message, setMessage] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const loadMessages = () => {
    axiosService.get("/screen/message").then(it => {
      if (it.data) {
        setMessage(it.data["result"]);
      }
      setLoading(false);
    });
    setLoading(true);
  };
  useEffect(() => {
    if (message === undefined) {
      if (!loading) {
        loadMessages();
      }
    }
    const timer = setInterval(() => {
      loadMessages();
    }, 30000);
    return () => {
      clearInterval(timer);
    };
  }, [message, loading]);
  if (message === undefined) {
    return <div>Ładowanie...</div>;
  } else {
    return <div style={{ border: "1px solid", margin: "20px", fontSize: "initial" }}>
      <ReactMarkdown children={message} />
    </div>;
  }
};
