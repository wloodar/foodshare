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
			<circle cx="32" cy="15" r="15"/>
		</g>
	</g>
	<g>
		<g>
			<path d="M38.6,34H25.4C16.4,34,9,41.4,9,50.4V64h46V50.4C55,41.4,47.6,34,38.6,34z"/>
		</g>
	</g>
</g>
    </svg>
);

export default SVG;
