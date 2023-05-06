import React from "react";

const SVG = ({
  style = {},
  fill = "#444",
  width = "100%",
  className = "",
  viewBox = "0 0 70 70"
}) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={width}
        height={width} 
        viewBox={viewBox}
    ><desc>Made with illustrio</desc>
  
<g class="base"><g fill-rule="evenodd" stroke="none" class="main-fill">
    
    <path d="M32,30 L32,32 L0,32 L0,30 L0.007,30 C0.087,23.137 1.609,22.148 11.698,17.836 C9.476,15.469 7.999,11.543 7.999,8 C7.999,2.477 11.581,0 15.999,0 C20.418,0 24,2.477 24,8 C24,11.543 22.523,15.469 20.301,17.836 C30.391,22.148 31.91,23.137 31.992,30 L32,30 Z" transform="translate(19 19)" stroke="none" class="main-fill"></path>
  </g></g>
  </svg>
);

export default SVG;
