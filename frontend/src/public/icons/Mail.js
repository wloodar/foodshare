import React from "react";

const SVG = ({
  style = {},
  fill = "#444",
  width = "100%",
  className = "",
  viewBox = "0 0 64 64"
}) => (
    <svg 
        enable-background="new 0 0 64 64"
        viewBox={viewBox} 
        xmlns="http://www.w3.org/2000/svg"
        fill={fill}
        width={width}
        height={width}
    >
    <g>
        <g>
            <g>
                <path d="M30.9,33.7L0,13v36c0,2.2,1.8,4,4,4h56c2.2,0,4-1.8,4-4V13L33.1,33.7C32.4,34.1,31.6,34.1,30.9,33.7z"/>
            </g>
        </g>
        <g>
            <g>
                <path d="M60.4,10.6H3.6l27.3,18.3c0.7,0.5,1.6,0.5,2.2,0L60.4,10.6z"/>
            </g>
        </g>
    </g>
    </svg>
);

export default SVG;
