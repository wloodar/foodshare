import React from "react";

import ChatGirl from "../ChatGirl";
import ChatConversation from '../ChatConversations';
import ChatGroup from '../ChatGroup';


const Icon = props => {
  switch (props.name) {
    case "chatgirl":
      return <ChatGirl {...props} />;
    case "chatconversation":
      return <ChatConversation {...props} />;
    case "chatgroup":
      return <ChatGroup {...props} />;
    default:
      return;
  }
};

export default Icon;
