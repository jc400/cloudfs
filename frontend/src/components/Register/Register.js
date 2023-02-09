import React, { useReducer, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import registerFlow from '../../services/registerFlow';
import loginFlow from '../../services/loginFlow';
import loadVaultFlow from '../../services/loadVaultFlow';
import './Register.css';


export default function Register({ show, close, switchTo, setUser, setDB }) {

    const [registerData, setRegisterData] = useReducer( (st, ev) => { 
        return {...st, [ev.name]:ev.value}
    }, {});
    const messageRef = useRef();

    const handleChange = ev => {
        messageRef.current.innerText = '';
        setRegisterData({name: ev.target.name, value: ev.target.value});
    }
    const handleSubmit = ev => {
        ev.preventDefault();

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
        });

    }


    return (
        <Modal 
            show={show} 
            centered
            dialogClassName="register"
        >
            <form name="Register" title="Register" onSubmit={handleSubmit}>

                <Modal.Header>
                    <Modal.Title>Register</Modal.Title>
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
                    <label>
                        <span className="d-block mt-3">Repeat password:</span>
                        <input id="password2" name="password2" type="password" />
                    </label>
                    <div ref={messageRef} className="text-danger"></div>
                </Modal.Body>

                <Modal.Footer className="justify-content-between">
                    <button className="btn btn-link" onClick={switchTo}>Log in instead</button>
                    <button type="submit">Register</button>
                </Modal.Footer>
            
            </form>
        </Modal>
        
    )





}