import React, { useReducer, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { login } from '../../services/auth';
import './Login.css';


export default function Login({ show, close, setUser }) {

    const [loginData, setLoginData] = useReducer( (st, ev) => { 
        return {...st, [ev.name]:ev.value}
    }, {});

    const handleChange = ev => {
        setLoginData({name: ev.target.name, value: ev.target.value});
    }
    const handleSubmit = ev => {
        ev.preventDefault();
        login(loginData?.username, loginData?.password)
        .then(resp => {
            if (resp["logged in"] === true){
                setUser({"logged in": true, username: loginData.username});
                close();
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
                        <input id="username" name="username" type="text" onChange={handleChange} />
                    </label>
                    <label>
                        <span className="d-block mt-3">Password:</span>
                        <input id="password" name="password" type="password" onChange={handleChange} />
                    </label>
                </Modal.Body>

                <Modal.Footer>
                    <button type="button" onClick={close}>Cancel</button>
                    <button type="submit">Submit</button>
                </Modal.Footer>
            
            </form>
        </Modal>
        
    )





}