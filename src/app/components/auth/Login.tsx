import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import PropTypes from "prop-types";
import React, { useRef, useState } from "react";
import { Redirect } from "react-router-dom";

import { login } from "../../actions/auth";

const Login = ({ showLogin }: { showLogin: boolean }) => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(login(emailRef.current!.value, passwordRef.current!.value));
  };

  // if (isAuthenticated) {
  //   return <Redirect to='/' />;
  // }
  return (
    <div className={showLogin ? "login-container login" : "login-container"}>
      <div className="login-card">
        <h2 className="login-title">Login to Kin's Memo</h2>
        <form onSubmit={(e) => onSubmit(e)}>
          <div className="login-form">
            <label>Email</label>
            <input
              type="text"
              className="login-input"
              name="email"
              ref={emailRef}
            />
          </div>
          <div className="login-form">
            <label>Password</label>
            <input
              type="password"
              className="login-input"
              name="password"
              ref={passwordRef}
            />
          </div>
          <div className="login-form">
            <button type="submit" className="login-btn">
              Login
            </button>
          </div>
          {/* <p>
                Make an new account? <Link to="/register">Register</Link>
              </p> */}
        </form>
      </div>
    </div>
  );
};

export default Login;
