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
                <polygon points="53,56 8,56 8,11 29,11 29,3 0,3 0,64 61,64 61,35 53,35 			"/>
            </g>
        </g>
        <g>
            <g>
                <polygon points="19,45 31,45 54,22 42,10 19,33 			"/>
            </g>
        </g>
        <g>
            <g>
                <rect x="45.5" y="4.3" transform="matrix(0.7071 0.7071 -0.7071 0.7071 22.8873 -35.2548)" width="17" height="11.3"/>
            </g>
        </g>
    </g>
    </svg>
);

export default SVG;