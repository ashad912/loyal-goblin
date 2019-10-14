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
import {asyncForEach} from '../../methods'


//import {labels} from '../strings/labels'


const FormContainer = styled(Container)`
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin: 3rem 0 3rem 0
`

const StyledPaper = styled(Paper)`
    padding: 1rem
    border: 1px solid #eeeeee
`

const ErrorPaper = styled(Paper)`
    display: flex;
    margin: 1rem 0 0 0;
    padding: 0.5rem;
    background-color: #ffe7e7; 
    text-align: left;
`

const SentPaper = styled(Paper)`
    display: flex;
    margin: 1rem 0 2rem 0;
    padding: 1rem;
    background-color: #d6ffd3; 
    text-align: left;
`

const ActionBar = styled.div`
    display: flex;
    justify-content: space-between;
`

class SignIn extends Component {
    state = {
        email: "",
        passwordSent: false,
        formError: {
            email: '',
        },
        error: {
            email: false,
        }
    }



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

          default:
            break;
        }
        

      }

    handleSubmit = async (e) => {
        console.log(this.state)
        e.preventDefault();

        const targets = ['email']
        await asyncForEach(targets, async (target) => {
            console.log(this.state.error)
            console.log(this.state.error[target])
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

        if(!this.state.error.email){
            //template
            this.setState({
                passwordSent: true
            })
        }
        
    }



    render() {
        if(this.props.auth.uid) return <Redirect to='/' />
        const dudUrl = 'javascript:;';
        const { authError } = this.props
        
        return (
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <FormContainer  maxWidth="xs">
                    <form onSubmit={this.handleSubmit} className="white">
                    
                        <Typography variant="h5" style={{textAlign: 'left', marginBottom: '1rem'}}>Odzyskiwanie dostępu</Typography>
                            <StyledPaper elevation={0}>

                                {this.state.passwordSent ? (
                                    <React.Fragment>
                                    <SentPaper>
                                            <Typography>Email został wysłany.</Typography>
                                    </SentPaper>
                                    <Typography style={{textAlign: 'left'}}>Jego dostarczenie może chwilę potrwać. Zanim powtórzysz reset hasła, poczekaj do dzięsieciu minut.</Typography>
                                    </React.Fragment>
                                ) : (
                                <React.Fragment>
                                    { authError ? (
                                        <ErrorPaper>
                                            <ErrorIcon style={{marginRight: '0.5rem', color: '#ff001f'}}/>
                                            <Typography>{authError}</Typography>
                                        </ErrorPaper>
                                    ) : null}

                                    <Typography style={{textAlign: 'left'}}>Zapomniałaś/eś hasła? Podaj adres email przypisany do konta. Otrzymasz link, który pozwoli Ci zresetować hasło.</Typography>
                                    <FormControl fullWidth style={{marginTop: '1rem', marginBottom: "0.5rem"}}>
                                        <InputLabel htmlFor="input-email" error={this.state.error.email}>Email *</InputLabel>
                                        <Input id="email" aria-describedby="email" required error={this.state.error.email} onChange={this.handleChange}/>
                                        {this.state.error.email ? (<FormHelperText error id="my-helper-text">{this.state.formError.email}</FormHelperText>) : (null)}
                                    </FormControl>
                                
                                    
                                    <Button 
                                        fullWidth
                                        style={{ justifyContent: 'center', marginTop: "1.5rem"}}
                                        onClick={this.handleSubmit} 
                                        variant="contained" 
                                        color="primary" 
                                        >
                                            Resetuj hasło
                                    </Button> 
                                </React.Fragment>
                                )}
                                
                                

                                <Divider style={{marginTop: '1.5rem', marginBottom: '1rem'}}/>
                                <ActionBar>
                                    <Typography>
                                        <Link href='/signin' to='/signin' >
                                            Pamiętasz hasło?
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