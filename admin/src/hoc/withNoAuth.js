import React from "react";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Loading from "../layout/Loading";

const withNoAuth = WrappedComponent => {
  return class extends React.Component {


    render() {
      //console.log(this.props.auth)
      if ((this.props.connection.loading && this.props.auth.uid) || this.props.auth.init) {
        return <Loading />;
      }

      if (this.props.auth.uid) {
        return <Redirect to="/" />;
      }

      return (
        <React.Fragment>
          <WrappedComponent {...this.props} />
        </React.Fragment>
      );
    }
  };
};
const mapStateToProps = state => {
  return {
    auth: state.auth,
    connection: state.connection
  };
};


const composedWithNoAuth = compose(
  connect(
    mapStateToProps
  ),
  withNoAuth
);

export default composedWithNoAuth;
