import { Transition } from "react-transition-group";
import React, { useEffect, useState } from "react";

export type MessageType = {
    message: string;
    iconUrl: string;
}

const defaultStyles = {
    transition: `opacity 300ms ease-in-out`,
    opacity: 0
};

function getMessageDiv(currentMessage: MessageType, state: string) {
    let opacity = { opacity: 1 };
    if (state === "exiting" || state === "exited") {
        opacity = { opacity: 0 };
    }
    return <div
      className="Userfeed"
      style={{ ...defaultStyles, ...opacity }}>
        {currentMessage.message}
    </div>;
}

let currentMessage: MessageType = { message: "test", iconUrl: "" };
const timeout = 300;

export const ShowMessage = (messageDisplay: MessageType) => {

    const [publicMessageTransition, setPublicMessageTransition] = useState(true);
    const [currentMessage, setCurrentMessage] = useState<MessageType>({ message: "", iconUrl: "" });

    useEffect(() => {
        setPublicMessageTransition(false);
        const time = setTimeout(() => {
            setCurrentMessage(messageDisplay);
            setPublicMessageTransition(true);
        }, 600);
        return () => clearTimeout(time);
    }, [messageDisplay]);

    return (
      <Transition in={publicMessageTransition} timeout={timeout}>
          {
              state => getMessageDiv(currentMessage, state)
          }
      </Transition>

    );
};
