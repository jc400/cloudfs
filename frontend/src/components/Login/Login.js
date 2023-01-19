import React, { useReducer, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import { login } from '../../services/auth';
import './Login.css';


export default function Login({ show, close, UserState, switchTo }) {

    const [loginData, setLoginData] = useReducer( (st, ev) => { 
        return {...st, [ev.name]:ev.value}
    }, {});
    const messageRef = useRef();

    const handleChange = ev => {
        messageRef.current.innerText = '';
        setLoginData({name: ev.target.name, value: ev.target.value});
    }
    const handleSubmit = ev => {
        ev.preventDefault();
        login(loginData?.username, loginData?.password)
        .then(resp => {
            if (resp?.success === true){
                UserState.setUser({
                    "logged in": true, 
                    username: loginData.username,
                    password: loginData.password,
                });
                UserState.loginActions();
                close();
            } else {
                messageRef.current.innerText = resp["message"];
            }
        })
    }


    return (
        <Modal 
            show={show} 
            onHide={close} 
            centered
            dialogClassName="login"
        >
            <form name="Login" onSubmit={handleSubmit}>

                <Modal.Header closeButton>
                    <Modal.Title>Log in</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <label>
                        <span className="d-block mt-3">Username:</span>
                        <input id="username" name="username" type="text" onChange={handleChange} autoFocus />
                    </label>
                    <label>
                        <span className="d-block mt-3">Password:</span>
                        <input id="password" name="password" type="password" onChange={handleChange} />
                    </label>
                    <div ref={messageRef} className="text-danger"></div>
                </Modal.Body>

                <Modal.Footer>
                    <a 
                        href="#" 
                        onClick={switchTo}
                    >Register for account</a>
                    <button type="button" onClick={close}>Cancel</button>
                    <button type="submit">Submit</button>
                </Modal.Footer>
            
            </form>
        </Modal>
        
    )





}