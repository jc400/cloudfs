import React, { useReducer, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import loginFlow from '../../services/loginFlow';
import loadVaultFlow from '../../services/loadVaultFlow';
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

        loginFlow(loginData?.username, loginData?.password)
        .then(resp => {
            UserState.setUser({
                username: resp.username,
                encryptionKey: resp.encryptionKey,
            });
            return resp;
        })
        .then(resp => loadVaultFlow(resp.encryptionKey))
        .then(resp => console.log("set db here"))
        .then(() => close())
        .catch(err => {
            messageRef.current.innerText = err;
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