import React from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';
import loginImage from './auth.svg';
import { Helmet } from 'react-helmet';

export default function Login() {
  return (
    <div className="auth-container">
      <Helmet>
          <title>Logowanie</title>
      </Helmet>
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
                      <li>Nie posiadasz jeszcze konta? <Link to="/signup">Zarejestruj się teraz</Link></li>
                      <li>Nie pamiętasz swojego hasła? <Link to="/reset-password">Odzyskaj tutaj</Link></li>
                  </ul>
              </div> */}
          </div>
      
      </div>
    </div>
  )
}