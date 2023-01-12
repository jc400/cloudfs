import React, { useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, check_login } from '../../services/auth';

import Button from '../Button/Button';

import "./Login.css";

export default function Login({ setAuthenticated }) {
  const navigate = useNavigate();
  const username = useRef(null);
  const password = useRef(null);
  const err_ref = useRef(null);

  useEffect(() => {
    check_login()
      .then(resp => {
        if (resp["logged in"]) {
          setAuthenticated(true);
          navigate("/file-explorer");
        }
      })
  }, [navigate, setAuthenticated]);

  function handleLogin() {
    login(username.current.value, password.current.value)
      .then(resp => {
        if (resp?.success) {
          setAuthenticated(true);
          navigate("/file-explorer");
        } else {
          err_ref.current.innerText = resp?.message;
        }
      });
  }

  return (
    <div className="outer">
      <div className="login-box">
        <h2>Log In</h2>
        <p>to continue to CloudFS</p>
        <label>Username:
          <br></br>
          <input type="text" ref={username}></input>
        </label>
        <label>Password:
          <br></br>
          <input type="password" ref={password}></input>
        </label>
        <p ref={err_ref}></p>

        <div className="login-controls">
          <Link to="/register">Create account</Link>
          <Button
            onClick={handleLogin}
            style={{ backgroundColor: "var(--accent)" }}
          >Log in</Button>
        </div>
      </div>
    </div>
  );
}
