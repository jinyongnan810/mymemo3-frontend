import axios from "axios";
import { Action, AnyAction, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { clearMessages, showMessages } from "./messages";
import * as types from "./types";

const jsonConfig = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const loadUser =
  (): ThunkAction<void, Object, unknown, AnyAction> =>
  async (dispatch: Dispatch<Action>) => {
    try {
      const res = await axios.get("/api/users/currentuser");
      if (res.data.currentUser) {
        dispatch({
          type: types.USER_LOADED,
          payload: res.data.currentUser,
        });
      } else {
        dispatch({
          type: types.AUTH_EXPIRED,
        });
      }
    } catch (error) {
      dispatch({
        type: types.AUTH_EXPIRED,
      });
    }
  };

export const login =
  (
    email: string,
    password: string
  ): ThunkAction<void, Object, unknown, AnyAction> =>
  async (dispatch) => {
    try {
      const res = await axios.post(
        "/api/users/signin",
        { email, password },
        jsonConfig
      );
      dispatch({
        type: types.LOGIN_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      console.error(JSON.stringify(error));
      error.response.data.errors.map(
        (e: { message: string; field: string }) => {
          dispatch(showMessages(e.message, "danger"));
        }
      );
    }
  };

export const signup =
  (
    email: string,
    password: string
  ): ThunkAction<void, Object, unknown, AnyAction> =>
  async (dispatch) => {
    try {
      const res = await axios.post(
        "/api/users/signup",
        { email, password },
        jsonConfig
      );
      dispatch({
        type: types.SIGNUP_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      console.error(error);
      error.response.data.errors.map((e: string) => {
        dispatch(showMessages(e, "danger"));
      });
    }
  };

export const logout =
  (): ThunkAction<void, Object, unknown, AnyAction> => async (dispatch) => {
    try {
      axios.post("/api/users/signout");
      dispatch({
        type: types.LOGOUT,
      });
    } catch (error) {
      dispatch({
        type: types.AUTH_EXPIRED,
      });
    }
    // dispatch(clearMessages());
  };
