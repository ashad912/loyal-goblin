import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { StylesProvider, ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import styled from "styled-components";
import axios from "axios";
import moment from "moment";
import SignIn from "./auth/SignIn";
import Menu from "./components/Menu";
import QRReader from "./components/QRReader";
import Order from "./components/Order";
import withAuth from "./hoc/withAuth";
import withNoAuth from "./hoc/withNoAuth";
import PageNotFound from "./PageNotFound";
import ConnectionSnackbar from "./layout/ConnectionSnackbar";
import ConnectionSpinnerDialog from "./layout/ConnectionSpinnerDialog";
import Settings from "./components/Settings";

export const OrderContext = React.createContext(null);

const goblinTheme = createMuiTheme({
  palette: {
    primary: {
      light: "#66bb6a",
      main: "#388e3c",
      dark: "#1b5e20",
      contrastText: "#fff"
    },
    secondary: {
      light: "#f44336",
      main: "#e53935",
      dark: "#b71c1c",
      contrastText: "#000"
    }
  }
});

const Toast = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  background: black;
  color: rgba(255, 255, 255, 1);
  display: none;
  text-align: center;
  padding: 2rem 0;
  font-size: 2rem;
`;


function App(props) {
  const [connection, setConnection] = useState({
    loading: false,
    connectionError: null
  });
  const [auth, setAuth] = useState({ uid: null, init: null });
  const [order, setOrder] = useState([]);
  const [orderFinalized, setOrderFinalized] = useState(false);
  const [timer, setTimer] = useState("");
  const [userId, setUserId] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [orderError, setOrderError] = useState('')


  useEffect(() => {

    setTimeout(() => {
      setOrderError('')
    }, 6000);
  }, [orderError])

  useEffect(() => {
    axios.defaults.baseURL = process.env.REACT_APP_API_URL;
    axios.interceptors.request.use(
      function(config) {
        setLoading(true);
        return config;
      },
      function(error) {
        setLoading(false);
        return Promise.reject(error);
      }
    );

    // Add a response interceptor
    axios.interceptors.response.use(
      function(response) {
        setLoading(false);
        return response;
      },
      function(error) {
        setLoading(false);
        return Promise.reject(error);
      }
    );
    checkAuth();
    if (localStorage.getItem("lastUserId")) {
      handleGetOrder(localStorage.getItem("lastUserId"));
    }
  }, []);

  useEffect(() => {
    if (order.length > 0) {
      calculateTimeLeft();
      const orderTimeout = setInterval(() => {
        calculateTimeLeft();
      }, 1000);
      return () => {
        clearInterval(orderTimeout);
      };
    }
  }, [order]);

  const calculateTimeLeft = () => {
    if (order.length > 0) {
      const utcDateNow = moment.utc(new Date());
      const orderTimeMax = moment(order[0].createdAt);
      const difference = orderTimeMax.diff(utcDateNow);
      if (difference > 0) {
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        const formatted = moment(`${minutes}:${seconds}`, "mm:ss").format(
          "mm:ss"
        );
        setTimer(`Zamówienie wygaśnie za ${formatted}`);
      } else {
        handleEndOrder();
      }
    } else {
      handleEndOrder();
    }
  };

  const handleEndOrder = () => {
    setRedirect(true);
    setOrder([]);
    setUserId(null);
    localStorage.removeItem("lastUserId");
    setOrderFinalized(false);
    setRedirect(false);
  };

  const checkAuth = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/barman/me");
      setAuth({ uid: res.data._id, init: false });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const setLoading = isLoading => {
    const conn = { ...connection };
    conn.loading = isLoading;
    setConnection(conn);
  };

  const handleSignIn = async (userName, password) => {
    try {
      const res = await axios.post("/barman/login", { userName, password });
      setAuth({ uid: res.data._id, init: false });
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetOrder = async userId => {
    try {
      const res = await axios.get("/product/verify/" + userId);
      setOrder(res.data);
      setUserId(userId);
      localStorage.setItem("lastUserId", userId);
    } catch (error) {
      console.log(error);
      setOrderError(error.response.data)
    }
  };

  const handleFinalizeOrder = async () => {
    try {
      const res = await axios.post("/product/finalize", { userId, currentOrder: order });
      setOrder([]);
      setOrderFinalized(true);
      setUserId(null);
      setTimeout(() => {
        handleEndOrder();
      }, 5500);
    } catch (error) {
      setOrderError(error.response.data)
      setTimeout(() => {
        handleEndOrder();
      }, 5500);
    }
  };

  const handleChangePassword = async (oldPassword, password, confirmPassword) => {
    try {
      await axios.patch("/barman/changePassword", {oldPassword, password, confirmPassword})
      setTimeout(() => {
        handleLogout()
      }, 3000);
    } catch (error) {
      
    }
  }

  const handleLogout = async () => {
    try {
      await axios.post("/barman/logout")
      setAuth({ uid: null, init: null })
      setOrder([])
      setUserId(null)
      localStorage.removeItem('lastUserId')
    } catch (error) {
      
    }
  }

  
  const closeToast = () => {
    document.getElementById("toast").style.display = "none";
  };

  return (
    <OrderContext.Provider
      value={{
        order,
        handleGetOrder,
        timer,
        finalizeOrder: handleFinalizeOrder,
        orderFinalized,
        redirect,
        handleChangePassword,
        handleLogout,
        orderError
      }}
    >
      <ThemeProvider theme={goblinTheme}>
        <BrowserRouter>
          <div className="App">
            <Switch>
              <Route
                exact
                path="/"
                component={withAuth(QRReader, connection, auth)}
              />
              <Route
                exact
                path="/menu"
                component={withAuth(Menu, connection, auth)}
              />
              <Route
                exact
                path="/order"
                component={withAuth(Order, connection, auth, setLoading)}
              />
              <Route
                exact
                path="/settings"
                component={withAuth(Settings, connection, auth, setLoading)}
              />
              <Route
                exact
                path="/signin"
                component={withNoAuth(
                  SignIn,
                  connection,
                  auth,
                  handleSignIn,
                  setLoading
                )}
              />
              <Route component={PageNotFound} />
            </Switch>
          </div>

          <ConnectionSnackbar
            resetConnectionError={() => this.props.resetConnectionError()}
            connection={connection}
          />
          <ConnectionSpinnerDialog connection={connection} />
          <Toast id="toast" onClick={closeToast}>
              Dostępna aktualizacja!
              <p
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "lighter",
                  color: "rgba(220, 220, 220, 1)"
                }}
              >
                Zamknij aplikację i uruchom ją ponownie.
              </p>
            </Toast>
        </BrowserRouter>
      </ThemeProvider>
    </OrderContext.Provider>
  );
}

export default App;
