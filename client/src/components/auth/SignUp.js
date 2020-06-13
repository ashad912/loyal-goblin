import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Link } from "react-router-dom"

import Container from "@material-ui/core/Container";
import { Typography } from "@material-ui/core";
import Recaptcha from 'react-google-invisible-recaptcha';
import { Button } from "@material-ui/core";
import { Paper } from "@material-ui/core";
import { FormControl } from "@material-ui/core";
import { FormHelperText } from "@material-ui/core";
import { Input } from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";

import { signUp } from "store/actions/authActions";

import {asyncForEach} from 'utils/functions'
import { palette, uiPaths } from 'utils/constants';

//import {labels} from '../strings/labels'

const FormContainer = styled(Container)`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    background: ${palette.primary.main};
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
    flex-direction: column;
    align-items: center
    justify-content: center;
    margin-top: 1rem;
`
const StyledLink = styled(Link)`
color: white;
&:visited {
  color: white;
}
`

class SignUp extends Component {
  state = {
    email: "",
    password: "",
    confirmPassword: "",
    formError: {
      email: "",
      password: "",
      confirmPassword: ""
    },
    error: {
      email: false,
      password: false,
      confirmPassword: false
    },
    fullHeightCorrection: 0
  };

  componentDidMount() {
    //const navbar = document.getElementById("navbar").offsetHeight;
    const footer = document.getElementById("footer").offsetHeight;
    this.setState({fullHeightCorrection: footer})
}

  handleChange = e => {
    const id = e.target.id;
    const value = e.target.value;
    this.setState(
      {
        [id]: value
      },
      () => {
        this.validateField(id, value);
      }
    );
  };

  validateField(fieldName, value) {
    switch (fieldName) {
      case "email":
        let emailValid = true;
        let emailError = "";

        if (value.length) {
          emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
          emailError = emailValid ? "" : "Adres email jest niepoprawny!";
        } else {
          emailValid = false;
          emailError = "Pole wymagane!";
        }

        this.setState({
          formError: {
            ...this.state.formError,
            email: emailError
          },
          error: {
            ...this.state.error,
            email: !emailValid
          }
        });

        break;

      case "password":
        let passwordValid = true;
        let passwordError = "";
        if (value.length) {
          passwordValid = value.length >= 7;
          passwordError = passwordValid ? "" : "Hasło jest za krótkie!";
        } else {
          passwordValid = false;
          passwordError = "Pole wymagane!";
        }

        this.setState(
          {
            formError: {
              ...this.state.formError,
              password: passwordError
            },
            error: {
              ...this.state.error,
              password: !passwordValid
            }
          },
          () => {
            if (this.state.confirmPassword.length) {
              if (this.state.password !== this.state.confirmPassword) {
                this.setState({
                  formError: {
                    ...this.state.formError,
                    confirmPassword: "Hasła nie są takie same!"
                  },
                  error: {
                    ...this.state.error,
                    confirmPassword: true
                  }
                });
              } else {
                this.setState({
                  formError: {
                    ...this.state.formError,
                    confirmPassword: ""
                  },
                  error: {
                    ...this.state.error,
                    confirmPassword: false
                  }
                });
              }
            }
          }
        );

        break;
      case "confirmPassword":
        let confirmValid = true;
        let confirmError = "";
        if (value.length) {
          confirmValid = value === this.state.password;
          confirmError = confirmValid ? "" : "Hasła nie są takie same!";
        } else {
          confirmValid = false;
          confirmError = "Pole wymagane!";
        }

        this.setState({
          formError: {
            ...this.state.formError,
            confirmPassword: confirmError
          },
          error: {
            ...this.state.error,
            confirmPassword: !confirmValid
          }
        });

        break;
      default:
        break;
    }
  }

  handleSubmit = async e => {
   // console.log(this.state);
    e.preventDefault();

    const targets = ["email", "password", "confirmPassword"];
    await asyncForEach(targets, async target => {
     // console.log(this.state.error);
     // console.log(this.state.error[target]);
      if (this.state[target].length === 0) {
        await this.setState({
          error: {
            ...this.state.error,
            [target]: true
          },
          formError: {
            ...this.state.formError,
            [target]: "Pole wymagane!"
          }
        });
      }
    });

    if (
      !this.state.error.email &&
      !this.state.error.password &&
      !this.state.error.confirmPassword
    ) {
      this.recaptcha.execute();
    }else{
      this.recaptcha.reset();
    }
  }

  onResolved = () => {
    this.props.signUp({email: this.state.email, password: this.state.password, recaptcha: this.recaptcha.getResponse()})
  }

  render() {
    
    const { authError } = this.props;

    return (
      <div style={{background: palette.primary.main,display: 'flex', flexDirection:'column', justifyContent: 'flex-end', minHeight:`calc(100vh - ${this.state.fullHeightCorrection}px)`, position: 'relative'}}>
      <FormContainer  maxWidth="xs" >
      <img src={uiPaths.logo} style={{width: '50vw', flexBasis: '20%', marginBottom: '-1.2rem'}} alt="logo"/>
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
                          <Input id="password" placeholder="Hasło" aria-describedby="password" type="password" required error={this.state.error.password} onChange={this.handleChange} inputProps={{style:{textAlign:'center', fontSize: '1.3rem', fontFamily: 'Futura'}}}/>
                          {this.state.error.password ? (<FormHelperText error id="my-helper-text">{this.state.formError.password}</FormHelperText>) : (null)}
                      </FormControl>
              <FormControl
                fullWidth
                style={{ marginTop: "1rem", marginBottom: "0.5rem" }}
              >
                {/* <InputLabel
                  htmlFor="input-password"
                  error={this.state.error.confirmPassword}
                >
                  Potwierdź hasło *
                </InputLabel> */}
                <Input
                  id="confirmPassword"
                  aria-describedby="confirm-password"
                  type="password"
                  required
                  placeholder="Powtórz hasło"
                  error={this.state.error.confirmPassword}
                  onChange={this.handleChange}
                  inputProps={{style:{textAlign:'center', fontSize: '1.3rem', fontFamily: 'Futura'}}}
                />
                {this.state.error.confirmPassword ? (
                  <FormHelperText error id="my-helper-text">
                    {this.state.formError.confirmPassword}
                  </FormHelperText>
                ) : null}
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
                          Zarejestruj
                          
                      </Button> 
              <ActionBar>
                <Typography>
                  <StyledLink to="/signin" style={{ textDecoration: 'none'}}>
                    <span style={{color: 'black'}}>Masz już konto?</span>
                    <span> Zaloguj się!</span>
                  </StyledLink>
                </Typography>
              </ActionBar>
              <Recaptcha
                  ref={ ref => this.recaptcha = ref }
                  sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                  onResolved={ this.onResolved }
              />
            </div>
          </form>
          <img src={uiPaths.people} style={{width:'100%' }} alt=""/>
        </FormContainer>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authError: state.auth.authError,
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signUp: creds => dispatch(signUp(creds))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUp);
