import Image from "next/image";
import React from "react";
import X from "../../public/logo.svg";

function Logo() {
  return (
    <Image 
      src={X} 
      alt="Logo" 
      width={50}   // adjust size as needed
      height={50} 
      priority 
    />
  );  
}

export default Logo;
