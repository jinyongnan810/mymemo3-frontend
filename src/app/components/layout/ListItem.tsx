import React, { useState } from "react";
import { setCurrentMemo, deleteMemo, updateMemo } from "../../actions/memo";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { MemoInfo } from "../../../app/reducers/memo";
import Moment from "react-moment";
import moment from "moment";
const { dataLayer } = window;

const ListItem = ({
  memo,
  isCurrent,
}: {
  memo: MemoInfo;
  isCurrent: boolean;
}) => {
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
    dataLayer.push({ event: "title-updated" });
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
      <div className="k-date">
        <Moment format="GG.M.D kk:mm">
          {moment.utc(memo.updatedAt).local()}
        </Moment>
      </div>
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
