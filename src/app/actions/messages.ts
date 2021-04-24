import { Action, AnyAction, Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import * as types from "./types";

export const showMessages = (
  message: string,
  level: "success" | "danger" = "success"
): ThunkAction<void, Object, unknown, AnyAction> => async (
  dispatch: Dispatch<Action>
) => {
  const id = Date.now();
  dispatch({
    type: types.SHOW_MESSAGES,
    payload: {
      id,
      level,
      message,
    },
  });
};

export const clearMessages = (): ThunkAction<
  void,
  Object,
  unknown,
  AnyAction
> => async (dispatch: Dispatch<Action>) => {
  dispatch({
    type: types.CLEAR_MESSAGES,
  });
};
