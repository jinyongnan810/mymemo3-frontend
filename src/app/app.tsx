import React, { Fragment, useEffect } from "react";
import {
  Provider as AlertProvider,
  AlertPosition,
  AlertTransition,
} from "react-alert";
const AlertTemplate = require("react-alert-template-basic");
import { Route, Router, Switch, useHistory } from "react-router";
import { Provider } from "react-redux";
import store from "./store";
import { createHashHistory } from "history";

import axios from "axios";
import Dashboard from "./components/Dashboard";
import Login from "./components/auth/Login";
import "./sass/main.scss";
import { loadUser } from "./actions/auth";
import { PrivateRoute } from "./routes/PrivateRoute";
import { PublicRoute } from "./routes/PublicRoute";
import Alert from "./components/layout/Alert";
const alertOptions = {
  timeout: 5000,
  position: "bottom center" as AlertPosition,
  transition: "scale" as AlertTransition,
};
const app = () => {
  axios.defaults.baseURL = process.env.SERVER_URL;
  axios.defaults.withCredentials = true;
  const history = createHashHistory();
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <AlertProvider template={AlertTemplate} {...alertOptions}>
        <Router history={history}>
          <Fragment>
            <Alert />
            <Switch>
              <Route exact path="/" component={Dashboard} />
              <Route exact path="/login" component={Login} />
            </Switch>
          </Fragment>
        </Router>
      </AlertProvider>
    </Provider>
  );
};

export default app;
