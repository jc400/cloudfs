import React, { useReducer, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import { register } from '../../services/auth';
import './Register.css';


export default function Register({ show, close, switchTo }) {

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
        register(registerData?.username, registerData?.password)
        .then(resp => {
            if (resp?.success === true){
                messageRef.current.innerText = "Registered successfully! Logging you in...";
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
            dialogClassName="register"
        >
            <form name="Register" onSubmit={handleSubmit}>

                <Modal.Header closeButton>
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

                <Modal.Footer>
                    <a href="#" onClick={switchTo}>Log in instead</a>
                    <button type="button" onClick={close}>Cancel</button>
                    <button type="submit">Register</button>
                </Modal.Footer>
            
            </form>
        </Modal>
        
    )





}