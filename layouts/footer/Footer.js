import React from "react";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
const Footer = () => {
  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <Typography color="textSecondary">
        ETHTRADERS is powered by{" "}
        <Link href="https://docs.swapsdk.xyz">
          <a>0x v4 Swap SDK</a>
        </Link>{" "}
      </Typography>
    </Box>
  );
};

export default Footer;
