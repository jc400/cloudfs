import React, { useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, login } from '../../services/auth';

import Button from '../Button/Button';

import "./Register.css";


export default function Register(props) {
    const navigate = useNavigate();

    // reference for the input box 
    const username = useRef(null);
    const password = useRef(null);
    const password_confirm = useRef(null);
    const err_ref = useRef(null);

    function handleLogin(username, password) {
        login(username, password)
            .then(resp => {
                if (resp?.success) {
                    navigate("/file-explorer");
                } else {
                    err_ref.current.innerText = resp?.message;
                }
            });
    }

    function handleRegister() {
        let error_message = validate();
        err_ref.current.innerHTML = error_message;
        if (error_message === '') {
            register(username.current.value, password.current.value)
                .then(resp => {
                    if (resp?.success) {
                        handleLogin(username.current.value, password.current.value);
                    } else {
                        err_ref.current.innerText = resp?.message;
                    }
                })
        }
    }

    function validate() {
        let message = '';
        if (username.current.value.length > 30) message += "Username must be less than 30 characters.<br>";
        if (username.current.value === "") message += "Username cannot be blank.<br>";
        if (password.current.value !== password_confirm.current.value) message += "Passwords don't match.<br>";
        return message;
    }

    return (
        <div className="outer">
            <div className="registration-box">

                <h2>Register</h2>
                <p>for a CloudFS account</p>
                <label>Username:
                    <br></br>
                    <input type="text" ref={username}></input>
                </label>
                <label>Password:
                    <br></br>
                    <input type="password" ref={password}></input>
                </label>
                <label>Confirm Password:
                    <br></br>
                    <input type="password" ref={password_confirm}></input>
                </label>
                <p ref={err_ref}></p>

                <div className="registration-controls">
                    <Link to="/login">Log in instead</Link>
                    <Button 
                        onClick={handleRegister}
                        style={{backgroundColor: "var(--accent)"}}
                    >Register</Button>
                </div>
            </div>
        </div>
    );
}
