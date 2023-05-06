import React from "react";

import PizzaSlice from "../PizzaSlice";
import Messages from "../Messages";
import User from '../User';
import UserTwo from '../User2';
import Add from '../Add';

const Icon = props => {
  switch (props.name) {
    case "pizzaslice":
      return <PizzaSlice {...props} />;
    case "messages":
      return <Messages {...props} />;
    case "user":
      return <User {...props} />;
    case "usertwo":
      return <UserTwo {...props} />;
    case "add":
      return <Add {...props} />;
    default:
      return;
  }
};

export default Icon;
