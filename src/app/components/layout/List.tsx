import { useAppSelector } from "../../../app/hooks";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import AddMemo from "./AddMemo";
import ListItem from "./ListItem";

const List = () => {
  const { memos, currentMemo, loading } = useAppSelector((state) => state.memo);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  return (
    <div className="k-sidebar-container" id="k-sidebar-container">
      <div className="k-arrow">
        <img
          src="assets/imgs/right.svg"
          alt="Toggle List..."
          className="k-toggle-list"
        />
      </div>
      <div id="k-sidebar" className="k-sidebar hide-scrollbar">
        {loading ? (
          <Fragment>
            <img
              src="assets/imgs/loading-white.svg"
              alt="Loading..."
              className="k-loading"
            />
          </Fragment>
        ) : (
          <Fragment>
            {isAuthenticated ? <AddMemo /> : ""}
            {memos.map((memo) => (
              <ListItem
                memo={memo}
                isCurrent={!!currentMemo && memo.id === currentMemo.id}
                key={memo.id}
              />
            ))}
          </Fragment>
        )}
      </div>
    </div>
  );
};
export default List;
