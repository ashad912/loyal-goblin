// import React from 'react'
// import { compose } from 'redux'
// import { Redirect } from 'react-router-dom'
// import { connect } from 'react-redux';
// import {authCheck} from '../store/actions/authActions'

// const withAuth = (WrappedComponent) => {

//     return class extends React.Component {
//         state = {
//             loading: true
//         }

//         async componentWillMount(){
            
//             await this.props.authCheck()
//             this.setState({loading: false})
//         }

//         render () {
//             if(this.state.loading) {
//                 return null
//             }
            
//             if(!this.props.auth.uid) {
//                 return (
//                     <Redirect to = '/signin' />
//                 )
//             }
            
//             return (
//                 <React.Fragment>
//                     <WrappedComponent />
//                 </React.Fragment>
//             );
//         }
//     }

      
// }
// const mapStateToProps = (state) => {
//     return {
//         auth: state.auth,
//     }
// }
// const mapDispatchToProps = (dispatch) => {
//     return {
//         authCheck: () => dispatch(authCheck()),
//     }
// }


// const composedWithAuth = compose(
//     connect(mapStateToProps, mapDispatchToProps),
//     withAuth
// )

// export default composedWithAuth
