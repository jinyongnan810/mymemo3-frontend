import React, { useState } from "react";
import { setCurrentMemo, deleteMemo, updateMemo } from "../../actions/memo";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";

const ListItem = ({ memo, isCurrent }: { memo: any; isCurrent: boolean }) => {
  const [title, setTitle] = useState(memo.title);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const setCurrent = (id: string) => {
    dispatch(setCurrentMemo(id));
    scrollToTop();
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };
  const remove = (id: string) => {
    if (window.confirm("Are you sure to delete this memo?")) {
      dispatch(deleteMemo(id));
    }
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    var keyCode = e.keyCode || e.which;
    // save
    if (keyCode === 13) {
      e.preventDefault();
      dispatch(updateTitle());
    }
  };
  const updateTitle = () => {
    dispatch(updateMemo({ title: title }, memo.id));
  };

  let className = "k-title";
  if (isCurrent) {
    className += " current";
  }
  if (memo.searchHit) {
    className += " hit";
  }

  return (
    <div
      className={className}
      key={memo.id}
      onClick={(e) => setCurrent(memo.id)}
    >
      {isAuthenticated ? (
        <input
          value={title}
          className="k-title-edit"
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => onKeyDown(e)}
          onBlur={(e) => updateTitle()}
        />
      ) : (
        `${memo.title}`
      )}
      {isAuthenticated ? (
        <img
          src="assets/imgs/delete.svg"
          alt="Delete memo.."
          className="k-title-delete"
          onClick={(e) => remove(memo.id)}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default ListItem;
