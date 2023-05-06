import React from "react";

const SVG = ({
  style = {},
  fill = "#444",
  width = "100%",
  className = "",
  viewBox = "0 0 515.556 515.556"
}) => (
    <svg 
        enable-background="new 0 0 515.556 515.556"
        viewBox={viewBox} 
        xmlns="http://www.w3.org/2000/svg"
        fill={fill}
        width={width}
        height={width}
    >
    <path d="m322.222 451.111h-257.778v-386.667h257.778v32.222h64.444v-96.666h-386.666v515.556h386.667v-96.667h-64.444v32.222z"/><path d="m396.107 138.329-45.564 45.564 41.662 41.662h-166.65v64.445h166.65l-41.662 41.662 45.564 45.564 119.449-119.449z"/>
    </svg>
);

export default SVG;
