import React, { Component, Fragment, useEffect } from "react";
import { withAlert } from "react-alert";
import { useAppSelector } from "../../../app/hooks";

const Alert = ({ alert }: { alert: any }) => {
  const message = useAppSelector((state) => state.messages);
  useEffect(() => {
    if(message.message==="")return;
    if (message.level === "success") {
      alert.success(
        <div style={{ textTransform: "initial" }}>{message.message}</div>
      );
    } else {
      alert.error(message.message);
      console.error(JSON.stringify(message));
    }
  }, [message]);
  return <div></div>;
};

export default withAlert()(Alert);
