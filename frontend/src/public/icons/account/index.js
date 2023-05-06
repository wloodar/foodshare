import React from "react";

import SettingsOutline from "../SettingsOutline";
import OptionsSolid from '../OptionsSolid';
import ShoppingBag from '../ShoppingBag';
import History from '../History';
import Statistics from '../Statistics';
import Logout from '../Logout';
import Edit from '../Edit';
import Receive from '../Receive';
import Trash from '../Trash';
import Mail from '../Mail';
import User from '../User';

const Icon = props => {
  switch (props.name) {
    case "settingsoutline":
      return <SettingsOutline {...props} />;
    case "optionssolid":
      return <OptionsSolid {...props} />;
    case "shoppingbag":
      return <ShoppingBag {...props} />;
    case "history":
      return <History {...props} />;
    case "statistics":
      return <Statistics {...props} />;
    case "logout":
      return <Logout {...props} />;
    case "edit":
      return <Edit {...props} />;
    case "receive":
      return <Receive {...props} />;
    case "trash":
      return <Trash {...props} />;
    case "mail":
      return <Mail {...props} />;
    case "user":
      return <User {...props} />;
    default:
      return;
  }
};

export default Icon;
