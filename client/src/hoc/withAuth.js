import React from "react";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Loading from "../components/layout/Loading";

const withAuth = WrappedComponent => {
  return class extends React.Component {


    render() {
      if (this.props.loading) {
        return <Loading />;
      }

      if (!this.props.auth.uid) {
        return <Redirect to="/signin" />;
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
    loading: state.connection.loading
  };
};


const composedWithAuth = compose(
  connect(
    mapStateToProps
  ),
  withAuth
);

export default composedWithAuth;
