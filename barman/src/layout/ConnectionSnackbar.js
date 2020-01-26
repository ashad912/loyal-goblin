import React from "react";
import Snackbar from "@material-ui/core/Snackbar";

const ConnectionSnackbar = props => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left"
      }}
      open={props.connection.connectionError}
      onClose={props.resetConnectionError}
      autoHideDuration={3000}
      message={<span>Brak połączenia z serwerem.</span>}
    />
  );
};



export default ConnectionSnackbar;

