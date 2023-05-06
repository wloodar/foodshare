import React from 'react';
import { Link } from 'react-router-dom';
import Main from '../App/components/main';
import MainNav from '../App/components/nav/index';

export default ({ children }) => (
    <>
    <nav className="ap-nav">
        <MainNav/>
    </nav>
    <div className="mn-wrap">
        <Main/>
        { children }
    </div>
    </>
);