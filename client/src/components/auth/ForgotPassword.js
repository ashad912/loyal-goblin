import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Recaptcha from 'react-google-invisible-recaptcha';

import Container from "@material-ui/core/Container";
import { Typography } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { Paper } from "@material-ui/core";
import styled from "styled-components";
import { FormControl } from "@material-ui/core";
import { FormHelperText } from "@material-ui/core";
import { Input } from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";

import { forgotPassword } from "store/actions/authActions";

import { asyncForEach } from "utils/functions";
import { palette, uiPaths } from "utils/constants";
import { PintoTypography } from 'assets/fonts'

const FormContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
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

const SentPaper = styled(Paper)`
  display: flex;
  margin: 1rem 0 2rem 0;
  padding: 1rem;
  background-color: #d6ffd3;
  text-align: left;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
`;
const StyledLink = styled(Link)`
  color: white;
  &:visited {
    color: white;
  }
`;

class ForgotPassword extends Component {
  state = {
    email: "",
    passwordSent: false,
    formError: {
      email: ""
    },
    error: {
      email: false
    },
    jwtNotExpiredError: false
  };


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

      default:
        break;
    }
  }

  handleSubmit = async e => {
    e.preventDefault();
    const targets = ["email"];
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

    if (!this.state.error.email) {
      this.recaptcha.execute();
    } else {
      this.recaptcha.reset();
    }

  };

  onResolved = async () => {
    const res = await this.props.onConfirm(this.state.email, this.recaptcha.getResponse());
    if (res === "jwt not expired") {
      this.setState({ jwtNotExpiredError: true });
      setTimeout(() => {
        this.props.history.push('/')
      }, 6500);
    } else {
      this.setState({
        passwordSent: true
      });
    }
  }

  render() {
    const { authError } = this.props;

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: `calc(100vh - ${this.props.fullHeightCorrection}px)`,
          background: palette.primary.main
        }}
      >
        <FormContainer maxWidth="xs">
        <img src={uiPaths.logo} style={{ width: '50%', flexBasis: '20%', marginBottom: '1rem' }} alt="logo" />
          <form onSubmit={this.handleSubmit} className="white">
            <Typography
              variant="h5"
              style={{ textAlign: "left", marginBottom: "1rem", color: 'white' }}
            >
              Odzyskiwanie dostępu
            </Typography>
            <div >
              {this.state.passwordSent ? (
                <React.Fragment>
                  <SentPaper>
                    <Typography>Email został wysłany.</Typography>
                  </SentPaper>
                  <Typography style={{ textAlign: "left" }}>
                    Jego dostarczenie może chwilę potrwać. Zanim powtórzysz
                    reset hasła, poczekaj do dzięsieciu minut.
                  </Typography>
                </React.Fragment>
              ) : (
                  <React.Fragment>
                    {authError ? (
                      <ErrorPaper>
                        <ErrorIcon
                          style={{ marginRight: "0.5rem", color: "#ff001f" }}
                        />
                        <Typography>{authError}</Typography>
                      </ErrorPaper>
                    ) : null}

                    {this.state.jwtNotExpiredError ? (
                      <React.Fragment>
                        <Typography variant="h6">
                          Email z linkiem do resetu hasła został wysłany w ciągu
                          ostatniej godziny. Sprawdź swoją skrzynę odbiorczą i
                          folder SPAM, lub spróbuj ponownie za godzinę.
                      </Typography>
                        <Typography variant="caption">
                          Za chwilę nastąpi przekierowanie na stronę logowania...
                      </Typography>
                      </React.Fragment>
                    ) : (
                        <React.Fragment>
                          <PintoTypography style={{ textAlign: "left" }}>
                            Zapomniałaś/eś hasła? Podaj adres email przypisany do
                            konta. Otrzymasz link, który pozwoli Ci zresetować
                            hasło.
                      </PintoTypography>
                          <FormControl
                            fullWidth
                            style={{ marginTop: "1rem", marginBottom: "0.5rem" }}
                          >
                            {/* <InputLabel
                          htmlFor="input-email"
                          error={this.state.error.email}
                        >
                          Email *
                        </InputLabel> */}
                            <Input
                              id="email"
                              aria-describedby="email"
                              required
                              placeholder="Email"
                              error={this.state.error.email}
                              onChange={this.handleChange}
                              inputProps={{ style: { textAlign: 'center', fontSize: '1.3rem', fontFamily: 'Futura' } }}
                            />
                            {this.state.error.email ? (
                              <FormHelperText error id="my-helper-text">
                                {this.state.formError.email}
                              </FormHelperText>
                            ) : null}
                          </FormControl>

                          <Button
                            fullWidth
                            style={{ justifyContent: 'center', marginTop: "1.5rem", background: 'black', color: 'white', fontSize: '1.2rem', padding: '0.2rem' }}


                            onClick={this.handleSubmit}
                            variant="contained"
                            color="primary"
                          >
                            Resetuj hasło
                      </Button>
                        </React.Fragment>
                      )}
                  </React.Fragment>
                )}


              <ActionBar style={{ marginTop: '2rem' }}>
                <Typography>
                  <StyledLink
                    to="/signin"
                    style={{ textDecoration: "none", textAlign: "left" }}
                  >
                    Pamiętasz hasło?
                  </StyledLink>
                </Typography>
              </ActionBar>
            </div>
          </form>
        </FormContainer>
        <Recaptcha
          ref={ref => this.recaptcha = ref}
          sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
          onResolved={this.onResolved}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authError: state.auth.authError, // auth in rootReducer, authError in authReducer, state global Redux store
    auth: state.auth,
    fullHeightCorrection: state.layout.footerHeight
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onConfirm: (email, recaptchaToken) => dispatch(forgotPassword(email, recaptchaToken))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
