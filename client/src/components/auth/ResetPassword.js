import React, { Component } from "react";
import { connect } from "react-redux";
import {
  signIn,
  resetPassword,
} from "../../store/actions/authActions";
import {
setConnectionError
  } from "../../store/actions/connectionActions";
  import axios from 'axios'
import { Redirect, Link } from "react-router-dom";
import Container from "@material-ui/core/Container";
import { Typography } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { Paper } from "@material-ui/core";
import styled from "styled-components";
import { FormControl } from "@material-ui/core";
import { FormHelperText } from "@material-ui/core";
import { Input } from "@material-ui/core";
import { InputLabel } from "@material-ui/core";
import { Divider } from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";
import { asyncForEach } from "../../utils/methods";

//import {labels} from '../strings/labels'

const FormContainer = styled(Container)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin: 3rem 0 3rem 0;
`;

const StyledPaper = styled(Paper)`
  padding: 1rem;
  border: 1px solid #eeeeee;
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
  color: #249123;
  &:visited {
    color: #249123;
  }
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
    const navbar = document.getElementById("navbar").offsetHeight;
    const footer = document.getElementById("footer").offsetHeight;
    this.setState({ fullHeightCorrection: navbar + footer });

    //validate link token for password change
    try {
        await axios.post('/user/validatePasswordChangeToken', {token: this.props.match.params.token})
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
      await this.props.onConfirm(
        this.props.match.params.token,
        this.state.password,
        this.state.confirmPassword
      );
      this.props.history.push("/");
    }
  };

  render() {
    const { authError } = this.props;

    return (
        this.state.tokenChecked &&
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          minHeight: `calc(100vh - ${this.state.fullHeightCorrection}px)`
        }}
      >
          {this.state.tokenExpired ? 
          <FormContainer>

        <StyledPaper elevation={0}>
            <Typography variant="h6">Link umożliwiający reset hasła wygasł.</Typography>
            <Typography variant="caption">Za chwilę nastąpi przekierowanie na stronę logowania.</Typography>
        </StyledPaper>
          </FormContainer>
          :

        <FormContainer maxWidth="xs">
          <form onSubmit={this.handleSubmit} className="white">
            <Typography
              variant="h5"
              style={{ textAlign: "left", marginBottom: "1rem" }}
            >
              Reset hasła
            </Typography>
            <StyledPaper elevation={0}>
              <React.Fragment>
                {authError ? (
                  <ErrorPaper>
                    <ErrorIcon
                      style={{ marginRight: "0.5rem", color: "#ff001f" }}
                    />
                    <Typography>{authError}</Typography>
                  </ErrorPaper>
                ) : null}

                <Typography style={{ textAlign: "left" }}>
                  Wpisz nowe hasło:
                </Typography>
                <FormControl
                  fullWidth
                  style={{ marginTop: "1rem", marginBottom: "0.5rem" }}
                >
                  <InputLabel
                    htmlFor="password"
                    error={this.state.error.password}
                  >
                    Nowe hasło *
                  </InputLabel>
                  <Input
                    id="password"
                    type="password"
                    required
                    error={this.state.error.password}
                    onChange={this.handleChange}
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
                  <InputLabel
                    htmlFor="confirmPassword"
                    error={this.state.error.confirmPassword}
                  >
                    Powtórz nowe hasło *
                  </InputLabel>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    error={this.state.error.confirmPassword}
                    onChange={this.handleChange}
                  />
                  {this.state.error.confirmPassword ? (
                    <FormHelperText error>
                      {this.state.formError.confirmPassword}
                    </FormHelperText>
                  ) : null}
                </FormControl>

                <Button
                  fullWidth
                  style={{ justifyContent: "center", marginTop: "1.5rem" }}
                  onClick={this.handleSubmit}
                  variant="contained"
                  color="primary"
                >
                  Zatwierdź
                </Button>
              </React.Fragment>
            </StyledPaper>
          </form>
        </FormContainer>
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authError: state.auth.authError, // auth in rootReducer, authError in authReducer, state global Redux store
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
      onConnectionErrorSet: (error) => dispatch(setConnectionError(error)),
    onConfirm: (token, password, confirmPassword) =>
      dispatch(resetPassword(token, password, confirmPassword))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
