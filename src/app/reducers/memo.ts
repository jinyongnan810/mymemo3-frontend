import { AnyAction, Reducer } from "redux";
import * as types from "../actions/types";
interface MemoInfo {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  searchHit?: boolean;
}
interface MemoBaseState {
  memos: MemoInfo[];
  currentMemo: MemoInfo | null;
  loading: boolean;
}
interface MemoBaseAction {
  type: string;
  payload: MemoBaseState["memos"] | MemoInfo | string | null;
}
const initialState: MemoBaseState = {
  loading: true,
  memos: [],
  currentMemo: null,
};
const memoReducer: Reducer<MemoBaseState, MemoBaseAction> = (
  state: MemoBaseState = initialState,
  action: MemoBaseAction
) => {
  const { type, payload } = action;
  switch (type) {
    case types.LOAD_MEMO:
      return {
        ...state,
        memos: payload as MemoBaseState["memos"],
        currentMemo: (payload as MemoBaseState["memos"])[0],
        loading: false,
      };
    case types.SET_CURRENT_MEMO:
      return {
        ...state,
        currentMemo: state.memos.filter((m) => m.id === (payload as string))[0],
      };
    case types.LOAD_MEMO_FAIL:
      return { memos: [], currentMemo: null, loading: false };
    case types.UPDATE_MEMO: {
      const newMemo = action.payload as MemoInfo;
      const memos = state.memos.slice();
      memos.find((memo) => {
        if (memo.id === newMemo.id) {
          memo.title = newMemo.title;
          memo.content = newMemo.content;
          memo.updatedAt = newMemo.updatedAt;
          return true;
        }
        return false;
      });
      if (state.currentMemo && state.currentMemo.id === newMemo.id) {
        return { ...state, memos: memos, currentMemo: newMemo };
      } else {
        return { ...state, memos: memos };
      }
    }
    case types.CREATE_MEMO: {
      const newMemo = action.payload as MemoInfo;
      const memos = state.memos.slice();
      memos.unshift(newMemo);
      return { ...state, memos: memos };
    }

    case types.DELETE_MEMO: {
      const id = action.payload as string;
      const memos = state.memos.slice().filter((memo) => memo.id !== id);
      if (state.currentMemo && id === state.currentMemo.id) {
        const newCurrentMemo = memos.length > 0 ? memos[0] : null;
        return { ...state, memos: memos, currentMemo: newCurrentMemo };
      }
      return { ...state, memos: memos };
    }
    case types.CHANGE_SEARCHING_WORD: {
      const word = (action.payload as string).toLowerCase();
      if (word) {
        return {
          ...state,
          memos: state.memos.map((memo) => {
            if (
              memo.title.toLowerCase().indexOf(word) > -1 ||
              memo.content.toLowerCase().indexOf(word) > -1
            ) {
              return { ...memo, searchHit: true };
            }
            return { ...memo, searchHit: false };
          }),
        };
      } else {
        return {
          ...state,
          memos: state.memos.map((memo) => ({ ...memo, searchHit: false })),
        };
      }
    }
    default:
      return state;
  }
};
export default memoReducer;
export { MemoInfo };
