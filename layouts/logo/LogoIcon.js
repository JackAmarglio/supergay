import React from "react";
import { Link } from "@mui/material";

const LogoIcon = () => {
  return (
    <Link href="/">
      <img 
        src={"https://i.imgur.com/4cSFanU.png"} 
        alt={'ETHTRADERS logo'}
        style={{
          width: 150,
          height: 50
        }} 
      />
    </Link>
  );
};

export default LogoIcon;
