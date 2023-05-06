import React from 'react';
import { Link } from 'react-router-dom';

import Form from './Form';
import infoImage from './forgot.svg';

export default function Login() {
  return (
    <div className="auth-container auth-container--password-recovery">
      <div className="auth-container--form">
        <div className="auth-container--form--inner">
          <div className="auth-container--form--header">
            <h2>Zresetuj hasło</h2>
          </div>
          <Form/>
        </div>
        </div>
        <div className="auth-container--other">
            <div className="auth-container--box">
                <div className="auth-container--box--image">
                    <img src={infoImage}/>
                </div>  
                <div className="auth-container--box--text">
                    <ul>
                        <li>Wróc na <Link to="/login">stronę logowania</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
  )
}