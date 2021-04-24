import { AnyAction, Reducer } from "redux";
import * as types from "../actions/types";
interface MessagesInfo {
  id: number;
  message: string;
  level: "success" | "danger";
}
interface MessagesBaseAction {
  type: string;
  payload?: MessagesInfo;
}
const initialState: MessagesInfo = {
  id: 0,
  level: "success",
  message: "",
};
const messagesReducer: Reducer<MessagesInfo, MessagesBaseAction> = (
  state: MessagesInfo = initialState,
  action: MessagesBaseAction
) => {
  const { type, payload } = action;
  switch (type) {
    case types.SHOW_MESSAGES:
      return payload as MessagesInfo;
    case types.CLEAR_MESSAGES:
      return { id: 0, level: "success", message: "" };
    default:
      return state;
  }
};
export default messagesReducer;
export { MessagesInfo };
