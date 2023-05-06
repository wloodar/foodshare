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
            <path d="M51.4,20.6c-0.2-2-1.9-3.6-4-3.6H43v-6c0-6-4.9-10.9-10.9-10.9C26,0.1,21.1,5,21.1,11v6h-5.5c-2,0-3.8,1.5-4,3.6l-4.1,39
                c-0.3,2.4,1.6,4.4,4,4.4h40.1c2.4,0,4.2-2.1,4-4.4L51.4,20.6z M25.1,11c0-3.8,3.1-6.9,6.9-6.9S39,7.2,39,11v6H25.1V11z M23,30
                c-1.7,0-3-1.3-3-3s1.3-3,3-3s3,1.3,3,3S24.7,30,23,30z M41,30c-1.7,0-3-1.3-3-3s1.3-3,3-3s3,1.3,3,3S42.7,30,41,30z"/>
        </g>
    </g>
    </svg>
);

export default SVG;
