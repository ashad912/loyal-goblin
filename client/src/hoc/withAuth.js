import React from "react";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Loading from "components/layout/Loading";

const withAuth = WrappedComponent => {
  return class extends React.Component {

    passProps = () => {
      
    }
    
    render() {

      if (this.props.init) {
        return <Loading />;
      }

      if (!this.props.uid) {
        return <Redirect to="/signin" />;
      }

      const propsToPass = {...this.props}
      delete propsToPass.init 

      return (
        <React.Fragment>
          <WrappedComponent {...propsToPass} />
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


const composedWithAuth = compose(
  connect(
    mapStateToProps
  ),
  withAuth
);

export default composedWithAuth;
