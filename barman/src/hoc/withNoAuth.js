import React from "react";
import { Redirect } from "react-router-dom";
import Loading from "../layout/Loading";

const withNoAuth = (WrappedComponent, connection, auth, handleSignIn, setLoading) => {
  return class extends React.Component {


    render() {

      if ((connection.loading && auth.uid) || auth.init) {
        return <Loading />;
      }

      if (auth.uid) {
        return <Redirect to="/" />;
      }

      return (
        <React.Fragment>
          <WrappedComponent {...this.props} connection={connection} auth={auth} handleSignIn={handleSignIn} setLoading={setLoading}/>
        </React.Fragment>
      );
    }
  };
};


export default withNoAuth;
