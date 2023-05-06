import React from 'react'
import { Link } from 'react-router-dom';
import Form from './Form';
import loginImage from './auth.svg';

export default function SignUp() {
  return (
  <div className="auth-container">
    <div className="auth-container--form">
        <div className="auth-container--form--inner">
            <Form/>
        </div>
        </div>
        <div className="auth-container--other">
            <div className="auth-container--box">
                <div className="auth-container--box--image">
                    <img src={loginImage}/>
                </div>  
                {/* <div className="auth-container--box--text">
                    <ul>
                        <li>Posiadzasz już konto? <Link to="/login">Zaloguj się</Link></li>
                    </ul>
                </div> */}
            </div>
        </div>
    </div>
  )
}