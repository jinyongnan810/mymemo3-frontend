import { Action, AnyAction, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import axios from "axios";

import { showMessages } from "./messages";
import * as types from "./types";
axios.defaults.baseURL = "https://kins-memo.herokuapp.com/";
console.log(
  "You can contact and make friends with me via yuunan.kin@gmail.com~"
);
// load memos
export const loadMemos = (): ThunkAction<
  void,
  Object,
  unknown,
  AnyAction
> => async (dispatch) => {
  try {
    const res = await axios.get(`/api/memo/list`);
    dispatch({ type: types.LOAD_MEMO, payload: res.data });
  } catch (error) {
    dispatch({ type: types.LOAD_MEMO_FAIL });
    if (error.message) {
      console.log(error.message);
      dispatch(showMessages("Fail to load memos.", "danger"));
    }
  }
};

// set current
export const setCurrentMemo = (
  id: string
): ThunkAction<void, Object, unknown, AnyAction> => async (dispatch) => {
  dispatch({ type: types.SET_CURRENT_MEMO, payload: id });
};

// update memos
export const updateMemo = (
  memo: any,
  id: string
): ThunkAction<void, Object, unknown, AnyAction> => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post(
      `/api/memo/${id}`,
      JSON.stringify(memo),
      config
    );
    dispatch({ type: types.UPDATE_MEMO, payload: res.data });
    dispatch(showMessages("Memo successfully updated."));
  } catch (error) {
    if (error.message) {
      console.log(error.message);
      dispatch(showMessages("Fail to update memo.", "danger"));
    }
  }
};

// delete memos
export const deleteMemo = (
  id: string
): ThunkAction<void, Object, unknown, AnyAction> => async (dispatch) => {
  try {
    await axios.delete(`/api/memo/${id}`);
    dispatch({ type: types.DELETE_MEMO, payload: id });
    dispatch(showMessages("Memo successfully deleted."));
  } catch (error) {
    if (error.message) {
      console.log(error.message);
      dispatch(showMessages("Fail to delete memo.", "danger"));
    }
  }
};

// create memos
export const createMemo = (
  memo: any
): ThunkAction<void, Object, unknown, AnyAction> => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post(`/api/memo`, JSON.stringify(memo), config);
    dispatch({ type: types.CREATE_MEMO, payload: res.data });
    dispatch(showMessages("Memo successfully created."));
  } catch (error) {
    if (error.message) {
      console.log(error.message);
      dispatch(showMessages("Fail to create memo.", "danger"));
    }
  }
};

// search memos
export const searchMemo = (
  word: string
): ThunkAction<void, Object, unknown, AnyAction> => async (dispatch) => {
  dispatch({ type: types.CHANGE_SEARCHING_WORD, payload: word });
};
