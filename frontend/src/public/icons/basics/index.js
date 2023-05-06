import React from "react";

import EmptyBox from "../EmptyBox";

const Icon = props => {
  switch (props.name) {
    case "emptybox":
      return <EmptyBox {...props} />;
    default:
      return;
  }
};

export default Icon;
