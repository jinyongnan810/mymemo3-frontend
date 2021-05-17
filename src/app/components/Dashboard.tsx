import React, { Fragment, useEffect, useState } from "react";
import { logout } from "../actions/auth";
import { loadMemos } from "../actions/memo";
import { useAppDispatch, useAppSelector } from "../hooks";

import Login from "./auth/Login";
import Content from "./layout/Content";
import List from "./layout/List";
import SearchBox from "./layout/SearchBox";

const Dashboard = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [showLogin, toggleShowLogin] = useState(false);
  const [showSearchBox, toggleShowSearchBox] = useState(false);

  let sidebar;
  useEffect(() => {
    // load memos
    dispatch(loadMemos());
    // bind document event
    document.addEventListener("keydown", onKeyDown, false);
    window.addEventListener("scroll", onScroll, false);

    // eslint-disable-next-line
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  let contentEl: HTMLElement | null;
  const onScroll = (e: any) => {
    let fadeoutBottom = true;
    let fadeoutTop = true;
    if (
      document.body.scrollHeight <=
      window.scrollY + window.innerHeight + 50
    ) {
      fadeoutBottom = false;
    } else {
      fadeoutBottom = true;
    }

    if (window.scrollY <= 50) {
      fadeoutTop = false;
    } else {
      fadeoutTop = true;
    }
    const cls =
      fadeoutTop && fadeoutBottom
        ? "fadeout-both"
        : fadeoutTop
        ? "fadeout-top"
        : fadeoutBottom
        ? "fadeout-bottom"
        : "";
    if (!contentEl) {
      contentEl = document.getElementById("content-display");
    }
    if (cls) {
      // contentEl.classList.remove("fadeout-both");
      // contentEl.classList.remove("fadeout-top");
      // contentEl.classList.remove("fadeout-bottom");
      // contentEl.classList.add(cls);
    }
  };

  const login = () => {
    if (isAuthenticated) {
      dispatch(logout());
      toggleShowLogin(false);
    } else {
      toggleShowLogin(!showLogin);
    }
  };
  // key events
  const onKeyDown = (e: KeyboardEvent) => {
    var keyCode = e.keyCode || e.which;
    // f3
    if (e.keyCode === 114) {
      e.preventDefault();
      toggleShowSearchBox(true);
    }
    // ctrl+f
    if (e.ctrlKey || e.metaKey) {
      if (keyCode === 70) {
        e.preventDefault();
        toggleShowSearchBox(true);
      }
    }
  };

  return (
    <Fragment>
      <h1
        className="k-site-title unselectable"
        onClick={(e) => scrollToTop()}
        onDoubleClick={(e) => login()}
      >
        Kin's Page
      </h1>
      <List />
      <Content />
      {showSearchBox && <SearchBox toggle={toggleShowSearchBox} />}

      {isAuthenticated ? <Fragment /> : <Login showLogin={showLogin} />}
    </Fragment>
  );
};

export default Dashboard;
