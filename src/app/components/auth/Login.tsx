import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Redirect } from "react-router-dom";

import { login } from "../../actions/auth";

const Login = ({ showLogin }: { showLogin: boolean }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(login(email, password));
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
              onChange={(e) => onChange(e)}
              value={email}
            />
          </div>
          <div className="login-form">
            <label>Password</label>
            <input
              type="password"
              className="login-input"
              name="password"
              onChange={(e) => onChange(e)}
              value={password}
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
