import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Recaptcha from 'react-google-invisible-recaptcha';
import styled from "styled-components";

import Container from "@material-ui/core/Container";
import { Typography } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { Paper } from "@material-ui/core";
import { FormControl } from "@material-ui/core";
import { FormHelperText } from "@material-ui/core";
import { Input } from "@material-ui/core";

import ErrorIcon from "@material-ui/icons/Error";

import {
  resetPassword,
} from "store/actions/authActions";
import {
setConnectionError
  } from "store/actions/connectionActions";

import {validatePasswordChangeToken} from "store/actions/authActions";

import { asyncForEach } from "utils/functions";
import { uiPaths, palette } from "utils/constants";

const FormContainer = styled(Container)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 3rem 0 3rem 0;
`;

const ErrorPaper = styled(Paper)`
  display: flex;
  margin: 1rem 0 0 0;
  padding: 0.5rem;
  background-color: #ffe7e7;
  text-align: left;
`;


class ResetPassword extends Component {
  state = {
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
    fullHeightCorrection: 0,
    tokenChecked: false,
    tokenExpired: false
  };

  async componentDidMount() {
  
    //validate link token for password change
    try {
        await validatePasswordChangeToken(this.props.match.params.token) 
    } catch (error) {
        if(error.response.data === 'jwt expired'){
            this.setState({tokenExpired: true})
            setTimeout(() => {
                this.props.history.push('/')
            }, 4000);
        }else{
            this.props.onConnectionErrorSet(error)
        }
    }
    this.setState({tokenChecked: true})
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
    e.preventDefault();

    const targets = ["password", "confirmPassword"];
    await asyncForEach(targets, async target => {
      if (this.state[target].length === 0) {
        this.setState({
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

    if (!this.state.error.password && !this.state.error.confirmPassword) {
      
        this.recaptcha.execute();
      }else{
        this.recaptcha.reset();
      }
  };
  
  onResolved = async () => {
    await this.props.onConfirm(this.props.match.params.token, this.state.password, this.state.confirmPassword, this.recaptcha.getResponse());
    this.props.history.push("/");
  }

  render() {
    const { authError } = this.props;

    return (
        this.state.tokenChecked &&
        <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: `calc(100vh - ${this.props.fullHeightCorrection}px)`,
          background: palette.primary.main
        }}
      ><img src={uiPaths.logo} style={{width: '50vw', flexBasis: '20%'}} alt="logo"/>
          {this.state.tokenExpired ? 
          <FormContainer>
        <div >
            <Typography variant="h5" style={{color: 'white', marginBottom: "2rem"}}>Link umożliwiający reset hasła wygasł.</Typography>
            <Typography variant="h6">Za chwilę nastąpi przekierowanie na stronę logowania...</Typography>
        </div>
          </FormContainer>
          :

        <FormContainer maxWidth="xs">
          <form onSubmit={this.handleSubmit} className="white">
            <Typography
              variant="h5"
              style={{ textAlign: "center", marginBottom: "1rem", color: 'white' }}
            >
              Reset hasła
            </Typography>
            <div >
              <React.Fragment>
                {authError ? (
                  <ErrorPaper>
                    <ErrorIcon
                      style={{ marginRight: "0.5rem", color: "#ff001f" }}
                    />
                    <Typography>{authError}</Typography>
                  </ErrorPaper>
                ) : null}

                
                <FormControl
                  fullWidth
                  style={{ marginTop: "1rem", marginBottom: "0.5rem" }}
                >


                  <Input
                    id="password"
                    type="password"
                    required
                    placeholder="Nowe hasło *"
                    error={this.state.error.password}
                    onChange={this.handleChange}
                    inputProps={{style:{textAlign:'center', fontSize: '1.3rem', fontFamily: 'Futura'}}}
                  />
                  {this.state.error.password ? (
                    <FormHelperText error>
                      {this.state.formError.password}
                    </FormHelperText>
                  ) : null}
                </FormControl>
                <FormControl
                  fullWidth
                  style={{ marginTop: "1rem", marginBottom: "0.5rem" }}
                >

                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    placeholder="Powtórz nowe hasło *"
                    error={this.state.error.confirmPassword}
                    onChange={this.handleChange}
                    inputProps={{style:{textAlign:'center', fontSize: '1.3rem', fontFamily: 'Futura'}}}
                  />
                  {this.state.error.confirmPassword ? (
                    <FormHelperText error>
                      {this.state.formError.confirmPassword}
                    </FormHelperText>
                  ) : null}
                </FormControl>

                <Button
                  fullWidth
                  style={{ justifyContent: 'center', marginTop: "1.5rem", background: 'black', color: 'white', fontSize: '1.2rem', padding: '0.2rem'}}
                  onClick={this.handleSubmit}
                  variant="contained"
                  color="primary"
                >
                  Zatwierdź
                </Button>
              </React.Fragment>
            </div>
          </form>
        </FormContainer>
        }
                      <Recaptcha
                  ref={ ref => this.recaptcha = ref }
                  sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                  onResolved={ this.onResolved }
              />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authError: state.auth.authError, // auth in rootReducer, authError in authReducer, state global Redux store
    auth: state.auth,
    fullHeightCorrection: state.layout.navbarHeight + state.layout.footerHeight,
  };
};

const mapDispatchToProps = dispatch => {
  return {
      onConnectionErrorSet: (error) => dispatch(setConnectionError(error)),
      onConfirm: (token, password, confirmPassword, recaptchaToken) =>
        dispatch(resetPassword(token, password, confirmPassword, recaptchaToken))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
