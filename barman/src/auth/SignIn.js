import React, { Component } from 'react'
import styled from 'styled-components'
import Recaptcha from 'react-google-invisible-recaptcha';
import Container from '@material-ui/core/Container';
import { Typography } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { Paper } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import { FormHelperText } from '@material-ui/core';
import { Input } from '@material-ui/core';
import { InputLabel } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';

import {asyncForEach} from '../utils/methods'


const FormContainer = styled(Container)`
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin: 3rem 0 3rem 0;
`

const StyledPaper = styled(Paper)`
    padding: 1rem;
    border: 1px solid #eeeeee;
`

const ErrorPaper = styled(Paper)`
    display: flex;
    margin: 1rem 0 0 0;
    padding: 0.5rem;
    background-color: #ffe7e7; 
    text-align: left;
`



class SignIn extends Component {
    state = {
        userName: "",
        password: "",
        formError: {
            userName: '',
            password: ''
        },
        error: {
            userName: false,
            password: false,
        },
        fullHeightCorrection: 0
    }

    componentDidMount() {
        // const navbar = document.getElementById("navbar").offsetHeight;
        // const footer = document.getElementById("footer").offsetHeight;
        // this.setState({fullHeightCorrection: navbar+footer})
    }
    

    // componentDidUpdate(prevProps, prevState){
    //     const targets = ['userName', 'password']
        
    //     targets.forEach((target) => {
    //         if((prevState[target].length === 1) && (this.state[target].length === 0)){
    //             this.setState({
    //                 error: {
    //                     ...this.state.error,
    //                     [target]: true,
    //                 }
    //             })
    //         }
            
    //         if((prevState[target].length === 0) && (this.state[target].length === 1)){
    //             this.setState({
    //                 error: {
    //                     ...this.state.error,
    //                     [target]: false,
    //                 }
    //             })
    //         }
    //     } )
    //}

    handleChange = (e) => {
        const id = e.target.id
        const value = e.target.value
        this.setState({
            [id]: value
        }, () => {
            this.validateField(id, value)
        })
    }

    validateField(fieldName, value) {
        
      
        switch(fieldName) {
          case 'userName':
            let emailValid = true;
            let emailError = ''

            if(value.length <= 0){

                emailValid = false
                emailError = 'Pole wymagane!'
            }

            this.setState({
                formError: {
                    ...this.state.formError,
                    userName: emailError
                },
                error : {
                    ...this.state.error,
                    userName: !emailValid
                }
            });

            break;

          case 'password':
            let passwordValid = true
            let passwordError = ''
            if(value.length){
                passwordValid = value.length >= 6;
                passwordError = passwordValid ? '': 'Hasło jest za krótkie!';
            }else{
                passwordValid = false;
                passwordError = 'Pole wymagane!'
            }      
            
           
            this.setState({
                formError: {
                    ...this.state.formError,
                    password: passwordError
                },
                error : {
                    ...this.state.error,
                    password: !passwordValid
                }
            });

            break;

          default:
            break;
        }
        

      }

    handleSubmit = async (e) => {
        e.preventDefault();

        const targets = ['userName', 'password']
        await asyncForEach(targets, async (target) => {

            if(this.state[target].length === 0){
                await this.setState({
                    error: {
                        ...this.state.error,
                        [target]: true,
                    },
                    formError: {
                        ...this.state.formError,
                        [target]: 'Pole wymagane!',
                    }
                })
            }
        })

        if(!this.state.error.userName && !this.state.error.password){
            this.recaptcha.execute();
        }else{
            this.recaptcha.reset();
        }
        
    }

    onResolved = () => {
        this.props.handleSignIn(this.state.userName,this.state.password, this.recaptcha.getResponse())
    }
    
    render() {
        const authError = this.props.auth.authError
        
        return (
            <div style={{display: 'flex', justifyContent: 'center', minHeight:`calc(100vh - ${this.state.fullHeightCorrection}px)`}}>
                <FormContainer  maxWidth="xs">
                    <form onSubmit={this.handleSubmit} className="white">
                    
                        <Typography variant="h5" style={{textAlign: 'left', marginBottom: '1rem'}}>Zaloguj</Typography>
                            <StyledPaper elevation={0}>
                                <FormControl fullWidth style={{marginTop: '1rem', marginBottom: "0.5rem"}}>
                                    <InputLabel htmlFor="input-userName" error={this.state.error.userName}>Nazwa użytkownika *</InputLabel>
                                    <Input id="userName" aria-describedby="userName" required error={this.state.error.userName} onChange={this.handleChange}/>
                                    {this.state.error.userName ? (<FormHelperText error id="my-helper-text">{this.state.formError.userName}</FormHelperText>) : (null)}
                                    
                                </FormControl>
                                <FormControl fullWidth style={{marginTop: '1rem', marginBottom: "0.5rem"}}>
                                    <InputLabel htmlFor="input-password" error={this.state.error.password}>Hasło *</InputLabel>
                                    <Input id="password" aria-describedby="password" type="password" required error={this.state.error.password} onChange={this.handleChange}/>
                                    {this.state.error.password ? (<FormHelperText error id="my-helper-text">{this.state.formError.password}</FormHelperText>) : (null)}
                                </FormControl>
                                
                                { authError ? (
                                    <ErrorPaper>
                                        <ErrorIcon style={{marginRight: '0.5rem', color: '#ff001f'}}/>
                                        <Typography>{authError}</Typography>
                                    </ErrorPaper>
                                ) : null}
                                
                                <Button 
                                    fullWidth
                                    style={{ justifyContent: 'center', marginTop: "1.5rem"}}
                                    onClick={this.handleSubmit} 
                                    variant="contained" 
                                    color="primary" 
                                    >
                                    Zaloguj
                                    
                                </Button> 
                                
                            </StyledPaper> 
                            <Recaptcha
                                ref={ ref => this.recaptcha = ref }
                                sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                                onResolved={ this.onResolved }
                            />                 
                    </form>
                </FormContainer>
            </div>
        )
    }
}



export default SignIn