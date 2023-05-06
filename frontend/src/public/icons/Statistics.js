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
            <g>
                <rect x="7" y="46" width="14" height="18"/>
            </g>
        </g>
        <g>
            <g>
                <rect x="25" y="38" width="14" height="26"/>
            </g>
        </g>
        <g>
            <g>
                <rect x="43" y="26" width="14" height="38"/>
            </g>
        </g>
        <g>
            <g>
                <path d="M28.8,21.4l5.7,5.7l15.8-15.8C53.4,14.4,56,17,56,17V0H39c0,0,2.5,2.5,5.7,5.7L34.5,15.8l-5.3-5.3L6.4,30l5.2,6.1
                    L28.8,21.4z"/>
            </g>
        </g>
    </g>
    </svg>
);

export default SVG;
