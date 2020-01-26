import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { StylesProvider, ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
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


function App(props) {
  const [connection, setConnection] = useState({
    loading: false,
    connectionError: null
  });
  const [auth, setAuth] = useState({ uid: null, init: null });
  const [order, setOrder] = useState([]);
  const [orderFinalized, setOrderFinalized] = useState(false)
  const [timer, setTimer] = useState("");
  const [userId, setUserId] = useState(null);
  const [redirect, setRedirect] = useState(false)

  useEffect(() => {
    axios.defaults.baseURL = process.env.REACT_APP_API_URL;
    axios.interceptors.request.use(
      function(config) {
        setLoading(true)
        return config;
      },
      function(error) {
        setLoading(false)
        return Promise.reject(error);
      }
    );

    // Add a response interceptor
    axios.interceptors.response.use(
      function(response) {
       setLoading(false)
        return response;
      },
      function(error) {
        setLoading(false)
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
    setRedirect(true)
    setOrder([]);
    setUserId(null);
    localStorage.removeItem('lastUserId')
    setOrderFinalized(false)
    setRedirect(false)
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
    }
  };

  const handleFinalizeOrder = async () => {
    try {
      const res = await axios.post("/product/finalize", { userId });
      setOrder([]);
      setOrderFinalized(true)
      setUserId(null);
      setTimeout(() => {
        handleEndOrder();
      }, 5000);
    } catch (error) {
      setTimeout(() => {
        handleEndOrder();
      }, 5000);
    }

  };

  return (
    <OrderContext.Provider
      value={{
        order,
        handleGetOrder,
        timer,
        finalizeOrder: handleFinalizeOrder,
        orderFinalized,
        redirect
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
      </BrowserRouter>

      </ThemeProvider>
    </OrderContext.Provider>
  );
}

export default App;
