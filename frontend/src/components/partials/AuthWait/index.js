import React from 'react';
import LoadingBurger from '../LoadingBurger';

const AuthWait = ({title}) => (
    <div className="auth-form--wait">
        <div className="auth-form--wait--inner">
            <div className="auth-form--wait--content">
                <LoadingBurger/>
                <h5>{title} ...</h5>
            </div>
        </div>
    </div>
);

export default AuthWait;