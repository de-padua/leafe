import Image from "next/image";
import React from "react";

function Logo() {
  return (
  <svg xmlns="http://www.w3.org/2000/svg" width="50"  viewBox="0 0 160 160" fill="none">
<rect x="44" y="68" width="24" height="24" fill="#039855"/>
<rect x="116" y="92.0001" width="24" height="24" transform="rotate(180 116 92.0001)" fill="#027A48"/>
<path d="M68 68L92 44V68L68 92V68Z" fill="#A6F4C5"/>
<path d="M92 92L68 116L68 92L92 68L92 92Z" fill="#6CE9A6"/>
<path d="M44 68L92 20V44L68 68H44Z" fill="#32D583"/>
<path d="M116 92.0001L68 140L68 116L92 92.0001L116 92.0001Z" fill="#12B76A"/>
</svg>
  );
}

export default Logo;
