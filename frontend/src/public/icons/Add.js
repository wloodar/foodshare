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
    
    <path d="M14.875,0 C6.69375,0 0,6.69375 0,14.875 C0,23.05625 6.69375,29.75 14.875,29.75 C23.05625,29.75 29.75,23.05625 29.75,14.875 C29.75,6.69375 23.05625,0 14.875,0 L14.875,0 Z M22.3125,16.3625 L16.3625,16.3625 L16.3625,22.3125 L13.3875,22.3125 L13.3875,16.3625 L7.4375,16.3625 L7.4375,13.3875 L13.3875,13.3875 L13.3875,7.4375 L16.3625,7.4375 L16.3625,13.3875 L22.3125,13.3875 L22.3125,16.3625 L22.3125,16.3625 Z" transform="translate(20.125 20.125)" stroke="none" class="main-fill"></path>
  </g></g>
  </svg>
);

export default SVG;
