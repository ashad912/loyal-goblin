import React from 'react'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import {authCheck} from '../store/actions/authActions'
import Loading from '../components/layout/Loading';

const withAuth = (WrappedComponent) => {

    return class extends React.Component {


        componentDidMount = async () => { 
            if(this.props.loading){
                await this.props.authCheck()
            }
            
            
        }

        render () {
            if(this.props.loading) {
                return <Loading/>
            }
            
            if(!this.props.auth.uid) {
                return (
                    <Redirect to = '/signin' />
                )
            }
            
            return (
                <React.Fragment>
                    <WrappedComponent {...this.props}/>
                </React.Fragment>
            );
        }
    }

      
}
const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        connection: !!state.loading
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        authCheck: () => dispatch(authCheck()),
    }
}


const composedWithAuth = compose(
    connect(mapStateToProps, mapDispatchToProps),
    withAuth
)

export default composedWithAuth
