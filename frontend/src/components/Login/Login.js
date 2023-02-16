import React, { useReducer, useRef, useState } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import loginFlow from '../../services/loginFlow';
import loadVaultFlow from '../../services/loadVaultFlow';
import './Login.css';


export default function Login({ show, close, switchTo, setUser, setDB }) {

    const [loginData, setLoginData] = useReducer( (st, ev) => { 
        return {...st, [ev.name]:ev.value}
    }, {});
    const messageRef = useRef();
    const [ buttonContent, setButtonContent ] = useState("Log in");

    const handleChange = ev => {
        messageRef.current.innerText = '';
        setLoginData({name: ev.target.name, value: ev.target.value});
    }

    const handleSubmit = ev => {
        ev.preventDefault();

        // set spinner
        setButtonContent(
            <Spinner animation="border" size="sm" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        );

        // login, save username and key
        loginFlow(loginData?.username, loginData?.password)
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

        // close login modal
        .then(() => close())
        .catch(err => {
            // if error, display message 
            messageRef.current.innerText = err;
        })
        .finally(() => setButtonContent("Log in"));
    }


    return (
        <Modal 
            show={show} 
            centered
            dialogClassName="login"
        >
            <form name="Login" title="Login" onSubmit={handleSubmit}>

                <Modal.Header>
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

                <Modal.Footer className="justify-content-between">
                    <button className="btn btn-link" onClick={switchTo}>Register for account</button>
                    <button type="submit">{buttonContent}</button>
                </Modal.Footer>
            
            </form>
        </Modal>
        
    )





}