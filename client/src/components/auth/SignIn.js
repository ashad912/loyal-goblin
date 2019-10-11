import React, { Component } from 'react'
import { connect } from 'react-redux'
import { signIn } from '../../store/actions/authActions'
import { Redirect } from 'react-router-dom'
import Container from '@material-ui/core/Container';
import { Typography } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { Button } from '@material-ui/core';

//import {labels} from '../strings/labels'

class SignIn extends Component {
    state = {
        email: "",
        password: ""
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleSubmit = (e) => {
        console.log(this.state)
        e.preventDefault();
        this.props.signIn(this.state)
    }


    render() {
        if(this.props.auth.uid) return <Redirect to='/' />

        const { authError } = this.props
        
        return (
            <Container style={{flexDirection: 'column'}} maxWidth="sm">
                <form onSubmit={this.handleSumbit} className="white">
                    <Typography className="grey-text text-darken-3">Login</Typography>
                    <TextField
                        id="email"
                        type="email"
                        label="Email"
                        style={{ margin: 8 }}
                        margin="normal"
                        
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={this.handleChange}
                    />
                    <TextField
                        id="password"
                        type="password"
                        label="Password"
                        style={{ margin: 8 }}
                        margin="normal"
                        
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={this.handleChange}
                    />
                    
                    <Button 
                        style={{display: 'flex', justifyContent: 'center'}}
                        onClick={this.handleSubmit} 
                        variant="contained" 
                        color="primary" 
                        >
                        Zaloguj
                        
                    </Button> 
                    <div className="red-text center">
                        { authError ? <p>{authError}</p> : null}
                    </div>
                    
                </form>
            </Container>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        authError: state.auth.authError, // auth in rootReducer, authError in authReducer, state global Redux store
        auth: state.auth,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        signIn: (creds) => dispatch(signIn(creds)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
