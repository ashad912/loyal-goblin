import React from "react";
import { Redirect } from "react-router-dom";
import Loading from "../layout/Loading";

const withAuth = (WrappedComponent, connection, auth, setLoading) => {
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
      //console.log(this.props.auth)
      if ((connection.loading && !auth.uid) || auth.init) {
        return <Loading />;
      }

      if (!auth.uid) {
        return <Redirect to="/signin" />;
      }

      return (
        <React.Fragment>
          <WrappedComponent {...this.props}  connection={connection} auth={auth} setLoading={setLoading}/>
        </React.Fragment>
      );
    }
  };
};


export default withAuth;
