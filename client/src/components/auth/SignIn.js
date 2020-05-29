import React, { Component } from 'react'
import { connect } from 'react-redux'
import Recaptcha from 'react-google-invisible-recaptcha';
import styled from 'styled-components'

import { Link } from 'react-router-dom'
import Container from '@material-ui/core/Container';
import { Typography } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { Paper } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import { FormHelperText } from '@material-ui/core';
import { Input } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';

import { signIn } from 'store/actions/authActions'

import {asyncForEach} from 'utils/functions'
import { palette, uiPaths } from 'utils/definitions';


//import {labels} from '../strings/labels'


const FormContainer = styled(Container)`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    background: ${palette.primary.main};
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

const ActionBar = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
`
const StyledLink = styled(Link)`
    color: white;
    &:visited {
        color: white;
    }
`

class SignIn extends Component {
    state = {
        email: "",
        password: "",
        formError: {
            email: '',
            password: ''
        },
        error: {
            email: false,
            password: false,
        },
        fullHeightCorrection: 0
    }

    componentDidMount() {
        const navbar = document.getElementById("navbar").offsetHeight;
        const footer = document.getElementById("footer").offsetHeight;
        this.setState({fullHeightCorrection: navbar+footer})
    }
    
    // componentWillUnmount(){
    //     if(this.recaptcha){
    //         this.recaptcha.reset();
    //     }
        
    // }
    // componentDidUpdate(prevProps, prevState){
    //     const targets = ['email', 'password']
        
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
          case 'email':
            let emailValid = true;
            let emailError = ''

            if(value.length){
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                emailError = emailValid ? '' : 'Adres email jest niepoprawny!';
            }else {
                emailValid = false
                emailError = 'Pole wymagane!'
            }

            this.setState({
                formError: {
                    ...this.state.formError,
                    email: emailError
                },
                error : {
                    ...this.state.error,
                    email: !emailValid
                }
            });

            break;

          case 'password':
            let passwordValid = true
            let passwordError = ''
            if(value.length){
                passwordValid = value.length >= 7;
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

        const targets = ['email', 'password']
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

        if(!this.state.error.email && !this.state.error.password){
            this.recaptcha.execute();
        }else{
            this.recaptcha.reset();
        }
        
    }

    onResolved = () => {
        this.props.signIn({email: this.state.email, password: this.state.password})
    }


    render() {
        const authError = this.props.auth.authError
        
        return (
            <div style={{background: palette.primary.main,display: 'flex', flexDirection:'column', justifyContent: 'flex-end', minHeight:`calc(100vh - ${this.state.fullHeightCorrection}px)`, position: 'relative'}}>
                <FormContainer  maxWidth="xs" >
                <img src={uiPaths.logo} style={{width: '50vw', flexBasis: '20%'}} alt="logo"/>
                    <form onSubmit={this.handleSubmit} className="white">
                    
                        {/* <Typography variant="h5" style={{textAlign: 'left', marginBottom: '1rem'}}>Zaloguj</Typography> */}
                            {/* <StyledPaper elevation={0}> */}
                            <div>

                                <FormControl fullWidth style={{marginTop: '1rem', marginBottom: "0.5rem"}}>
                                    {/* <InputLabel htmlFor="input-email" error={this.state.error.email}>Email *</InputLabel> */}
                                    <Input id="email" placeholder="Email" aria-describedby="email" required error={this.state.error.email} onChange={this.handleChange} inputProps={{style:{textAlign:'center', fontSize: '1.3rem', fontFamily: 'Futura'}}}/>
                                    {this.state.error.email ? (<FormHelperText error id="my-helper-text">{this.state.formError.email}</FormHelperText>) : (null)}
                                    
                                </FormControl>
                                <FormControl fullWidth style={{marginTop: '1rem', marginBottom: "0.5rem"}}>
                                    {/* <InputLabel htmlFor="input-password" error={this.state.error.password}>Hasło *</InputLabel> */}
                                    <Input id="password" placeholder="Hasło" aria-describedby="password" type="password" required error={this.state.error.password} onChange={this.handleChange} inputProps={{style:{textAlign:'center', fontSize: '1.3rem',  fontFamily: 'Futura'}}}/>
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
                                    style={{ justifyContent: 'center', marginTop: "1.5rem", background: 'black', color: 'white', fontSize: '1.2rem', padding: '0.2rem'}}
                                    onClick={this.handleSubmit} 
                                    variant="contained" 
 
                                    >
                                    Zaloguj
                                    
                                </Button> 
                                {/* <Divider style={{marginTop: '1.5rem', marginBottom: '1rem'}}/> */}
                                <ActionBar>
                                    <Typography>
                                        <StyledLink to='/lost-password' style={{ textDecoration: 'none'}}>
                                            Zapomniałaś/eś hasła?
                                        </StyledLink>
                                    </Typography>
                                    <Typography>
                                        <StyledLink to='/signup' style={{ textDecoration: 'none'}}>
                                            <span style={{color: 'black'}}>Nie masz konta?</span>
                                            <span> Zarejestruj się!</span>
                                        </StyledLink>
                                    </Typography>
                                </ActionBar>
                                <Recaptcha
                                    ref={ ref => this.recaptcha = ref }
                                    sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                                    onResolved={ this.onResolved }
                                    
                                />
                            </div>
                            {/* </StyledPaper>                  */}
                    </form>
                <img src={uiPaths.people} style={{width:'100%' }} alt=""/>
                </FormContainer>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        connection: state.connection,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        signIn: (creds) => dispatch(signIn(creds)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)