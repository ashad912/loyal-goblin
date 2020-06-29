import React from "react";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Loading from "../components/layout/Loading";

const withNoAuth = WrappedComponent => {
  return class extends React.Component {


    render() {
      if (this.props.init) {
        return <Loading />;
      }

      if (this.props.uid) {
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
    uid: state.auth.uid,
    init: state.auth.init,
  };
};


const composedWithNoAuth = compose(
  connect(
    mapStateToProps
  ),
  withNoAuth
);

export default composedWithNoAuth;
