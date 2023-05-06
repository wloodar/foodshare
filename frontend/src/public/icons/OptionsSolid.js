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
        height={width}>
    <g>
        <g>
            <g>
                <path d="M28.3,36H64v-8H28.3c-1.7-4.7-6.1-8-11.3-8s-9.6,3.3-11.3,8H0l0,8h5.7c1.7,4.7,6.1,8,11.3,8S26.6,40.7,28.3,36z M13,32
                    c0-2.2,1.8-4,4-4s4,1.8,4,4s-1.8,4-4,4S13,34.2,13,32z"/>
            </g>
        </g>
        <g>
            <g>
                <path d="M39,64c5.2,0,9.6-3.3,11.3-8H64v-8H50.3c-1.7-4.7-6.1-8-11.3-8s-9.6,3.3-11.3,8H0l0,8h27.7C29.4,60.7,33.8,64,39,64z
                    M35,52c0-2.2,1.8-4,4-4s4,1.8,4,4s-1.8,4-4,4S35,54.2,35,52z"/>
            </g>
        </g>
        <g>
            <g>
                <path d="M46,24c5.2,0,9.6-3.3,11.3-8H64V8h-6.7C55.6,3.3,51.2,0,46,0c-5.2,0-9.6,3.3-11.3,8H0l0,8h34.7C36.4,20.7,40.8,24,46,24z
                    M50,12c0,2.2-1.8,4-4,4s-4-1.8-4-4s1.8-4,4-4S50,9.8,50,12z"/>
            </g>
        </g>
    </g>
    </svg>
);

export default SVG;
