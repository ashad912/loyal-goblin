import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";

const ConnectionSpinnerDialog = props => {
  return (
    <Dialog open={props.connection.loading}>
      <DialogContent
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "10",
          height: "10rem",
          width: "10rem"
        }}
      >
        <CircularProgress style={{ height: 100, width: 100 }} />
      </DialogContent>
    </Dialog>
  );
};


export default ConnectionSpinnerDialog;
