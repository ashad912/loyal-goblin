import React from "react";
import { connect } from "react-redux";
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

const mapStateToProps = state => {
    return {
      connection: state.connection
    };
  };

export default connect(mapStateToProps)(ConnectionSpinnerDialog);
