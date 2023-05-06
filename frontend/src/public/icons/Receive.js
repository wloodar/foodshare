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
                <g>
                    <path d="M53,19.3L53,19.2c-0.6-1.3-2-2.2-3.5-2.2H46v6h2.1l9.2,11H45c0,0-1.5,5.1-2.4,8c-0.5,1.7-1.8,2-3.6,2H25
                        c-1.8,0-3.3-1.2-3.8-2.9L19,34H6.7l9.2-11H18v-6h-3.4c-1.5,0-2.9,0.8-3.6,2.2L0,34v29c0,0.6,0.4,1,1,1h62c0.6,0,1-0.4,1-1V34
                        L53,19.3z"/>
                </g>
            </g>
        </g>
    </g>
    <g>
        <g>
            <g>
                <polygon points="32,0 43,13 38,13 38,28 26,28 26,13 21,13 			"/>
            </g>
        </g>
    </g>
    </svg>
);

export default SVG;