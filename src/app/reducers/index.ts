import { combineReducers } from "redux";
import auth from "./auth";
import messages from "./messages";
import memo from "./memo";
export default combineReducers({ auth, messages, memo });
