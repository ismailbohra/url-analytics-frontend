import { Snackbar } from "@mui/material";
import React, { useEffect } from "react";

function Toast({ open, msg, setMessage, setOpen }) {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setMessage("");
    setOpen(false);
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={open}
      autoHideDuration={2000}
      message={msg}
      onClose={handleClose}
    />
  );
}

export default Toast;
