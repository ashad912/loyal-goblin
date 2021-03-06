import React from "react";
import { connect } from "react-redux";
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
      
    message={<span>{props.connection.message}</span>}
    />
  );
};


const mapStateToProps = state => {
    return {
      connection: state.connection
    };
  };

export default connect(mapStateToProps)(ConnectionSnackbar);

