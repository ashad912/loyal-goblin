import React, { Component } from 'react'
import { connect } from 'react-redux'
import { signIn } from '../../store/actions/authActions'
import { Redirect } from 'react-router-dom'
import Container from '@material-ui/core/Container';
import { Typography } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { Paper } from '@material-ui/core';
import styled from 'styled-components'
import { FormControl } from '@material-ui/core';
import { FormHelperText } from '@material-ui/core';
import { Input } from '@material-ui/core';
import { InputLabel } from '@material-ui/core';
import { Divider } from '@material-ui/core';
import { Link } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import {asyncForEach} from '../../utils/methods'


//import {labels} from '../strings/labels'


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

const ActionBar = styled.div`
    display: flex;
    justify-content: space-between;
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
            this.props.signIn(this.state)
        }
        
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
                                    <InputLabel htmlFor="input-email" error={this.state.error.email}>Email *</InputLabel>
                                    <Input id="email" aria-describedby="email" required error={this.state.error.email} onChange={this.handleChange}/>
                                    {this.state.error.email ? (<FormHelperText error id="my-helper-text">{this.state.formError.email}</FormHelperText>) : (null)}
                                    
                                </FormControl>
                                <FormControl fullWidth style={{marginTop: '1rem', marginBottom: "0.5rem"}}>
                                    <InputLabel htmlFor="input-password" error={this.state.error.password}>Password *</InputLabel>
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
                                <Divider style={{marginTop: '1.5rem', marginBottom: '1rem'}}/>
                                <ActionBar>
                                    <Typography>
                                        <Link href='/lost-password' to='/lost-password' >
                                            Zapomniałaś/eś hasła?
                                        </Link>
                                    </Typography>
                                    <Typography>
                                        <Link href='/signup' to='/signup' >
                                            Nie masz konta? Zarejestruj się!
                                        </Link>
                                    </Typography>
                                </ActionBar>
                            </StyledPaper>                 
                    </form>
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