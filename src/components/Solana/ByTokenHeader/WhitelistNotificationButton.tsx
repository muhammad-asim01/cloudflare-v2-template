
import React from "react";
import Button from "../Button";
import { isMobile } from "react-device-detect";
import { useTheme } from "@mui/material";

function ApplyWhiteListButton(props: any) {
  const theme : any = useTheme();
  const { joinPool } = props;

  return (
    <>
      <Button
        text={"Register Interest"}
      color={"#1e1e1e"}
        style={{
          width: "100%",
          height: 36,
          borderRadius: 50,
          font: "normal normal 500 14px/20px   Violet Sans",
          background: "transparent",
          border: "1px solid  #0066FF",
         
          padding: 4,
          margin: isMobile ? "7px auto" : "unset",
          color:'#1e1e1e'
        }}
        onClick={joinPool}
        disabled={false}
      />
    </>
  );
}

export default ApplyWhiteListButton;
