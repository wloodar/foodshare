import React from "react";

const SVG = ({
  style = {},
  fill = "#444",
  width = "100%",
  className = "",
  viewBox = "0 0 64 64"
}) => (
    <svg 
        version="1.1" 
        xmlns="http://www.w3.org/2000/svg" 
        xmlnsXlink="http://www.w3.org/1999/xlink" 
        x="0px" y="0px"
        viewBox={viewBox} 
        enable-background="new 0 0 64 64" 
        xmlSpace="preserve"
        fill={fill}
        width={width}
        height={width}
    >
    <g>
        <g>
            <path d="M54,8H43V5c0-2.8-2.2-5-5-5H26c-2.8,0-5,2.2-5,5v3H10c-2.2,0-4,1.8-4,4v8h4.1l2.6,38.4c0.2,3.1,2.8,5.6,6,5.6h26.5
                c3.1,0,5.8-2.5,6-5.6L53.9,20H58v-8C58,9.8,56.2,8,54,8z M21,52.1l-2-26l4-0.2l2,26L21,52.1z M34,52h-4V26h4V52z M37,8H27V6h10V8z
                M43,52.1l-4-0.2l2-26l4,0.2L43,52.1z"/>
        </g>
    </g>
    </svg>
);

export default SVG;
