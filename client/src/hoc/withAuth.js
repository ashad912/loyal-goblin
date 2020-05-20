import React from "react";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Loading from "../components/layout/Loading";

const withAuth = WrappedComponent => {
  return class extends React.Component {
    // state = {
    //   confirmLoaded: false
    // }

    // componentDidUpdate = (prevProps) =>  {
    //   if(prevProps.connection.auth.uid === null &&  === false && this.state.confirmLoaded === false){
    //     this.setState({
    //       confirmLoaded: true
    //     })
    //   }
    // }


    render() {
      console.log('withAuth')
      if ((this.props.connection.loading && !this.props.auth.uid) || this.props.auth.init) {
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
    connection: state.connection
  };
};


const composedWithAuth = compose(
  connect(
    mapStateToProps
  ),
  withAuth
);

export default composedWithAuth;
