import { Transition } from "react-transition-group";
import React, { useEffect, useState } from "react";
import { PeopleMessageEntity } from "../screen-admin/screen.entity";
import { Image } from "react-bootstrap";

const defaultStyles = {
    transition: `opacity 300ms ease-in-out`,
    opacity: 0
};

function getMessageDiv(currentMessage: PeopleMessageEntity, state: string) {
    let opacity = { opacity: 1 };
    if (state === "exiting" || state === "exited") {
        opacity = { opacity: 0 };
    }
    return <div
      className="Userfeed"
      style={{ ...defaultStyles, ...opacity }}>
        <div>
            <div>
                <Image height="50px" width="50px" src={currentMessage.imgUrl ? currentMessage.imgUrl : ""} />
            </div>
            <div style={{ fontSize: "20px" }}>@{currentMessage.tgUser}</div>
        </div>
        <div>
            {currentMessage.message}
        </div>
    </div>;
}

const timeout = 300;

export const ShowMessage = (props: { message: PeopleMessageEntity | undefined }) => {

    const [publicMessageTransition, setPublicMessageTransition] = useState(true);
    const [currentMessage, setCurrentMessage] = useState<PeopleMessageEntity>();

    useEffect(() => {
        setPublicMessageTransition(false);
        const time = setTimeout(() => {
            setCurrentMessage(props.message);
            setPublicMessageTransition(true);
        }, 600);
        return () => clearTimeout(time);
    }, [props.message]);
    if (currentMessage === undefined || props.message === undefined) {
        return <></>;
    } else {
        return (
          <Transition in={publicMessageTransition} timeout={timeout}>
              {
                  state => getMessageDiv(currentMessage, state)
              }
          </Transition>);
    }


};
