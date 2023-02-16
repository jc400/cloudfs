import React, { useReducer, useRef, useState } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import registerFlow from '../../services/registerFlow';
import loginFlow from '../../services/loginFlow';
import loadVaultFlow from '../../services/loadVaultFlow';
import './Register.css';


export default function Register({ show, close, switchTo, setUser, setDB }) {

    const [registerData, setRegisterData] = useReducer( (st, ev) => { 
        return {...st, [ev.name]:ev.value}
    }, {});
    const messageRef = useRef();
    const [ buttonContent, setButtonContent ] = useState("Register");

    const handleChange = ev => {
        messageRef.current.innerText = '';
        setRegisterData({name: ev.target.name, value: ev.target.value});
    }
    const handleSubmit = ev => {
        ev.preventDefault();

        // set spinner
        setButtonContent(
            <Spinner animation="border" size="sm" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        )

        // register with username/pass
        registerFlow(registerData?.username, registerData?.password)

        // if no error is thrown, we should be able to login
        .then(() => loginFlow(registerData?.username, registerData?.password))
        .then(resp => {
            setUser({
                username: resp.username,
                encryptionKey: resp.encryptionKey,
                token: resp.token
            });
            return resp;
        })

        // load vault, set DB state
        .then(resp => loadVaultFlow(resp.encryptionKey, resp.token))
        .then(resp => {
            setDB(resp.db);
        })

        // close modal
        .then(() => close())
        .catch(err => {
            messageRef.current.innerText = err;
        })
        .finally(() => setButtonContent("Register"));

    }


    return (
        <Modal 
            show={show} 
            centered
            dialogClassName="register"
        >
            <form id="registerform" name="Register" title="Register" onSubmit={handleSubmit}>
                <h4>Register</h4>

                <hr />

                    <label>
                        <span className="d-block mt-3">Username:</span>
                        <input id="username" name="username" type="text" onChange={handleChange} autoFocus />
                    </label>
                    <label>
                        <span className="d-block mt-3">Password:</span>
                        <input id="password" name="password" type="password" onChange={handleChange} />
                    </label>
                    <label>
                        <span className="d-block mt-3">Repeat password:</span>
                        <input id="password2" name="password2" type="password" />
                    </label>
                    <div ref={messageRef} className="text-danger"></div>

                <hr />

                <div className="d-flex justify-content-between">
                    <button className="btn btn-link" onClick={switchTo}>Log in instead</button>
                    <button id="registerbutton" type="submit">{buttonContent}</button>
                </div>
            
            </form>
        </Modal>
        
    )





}