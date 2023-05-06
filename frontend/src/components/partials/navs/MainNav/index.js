import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import $ from "jquery";
import logo from './logo.png';

class MainNav extends Component {

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }
    
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll() {

    }
    
    render() {

        return (
            <nav className="mn-nav">
                <div className="mn-nav--wrapper">
                    <div className="mn-nav--left">
                        {/* <h2><Link to="/"><span>Food</span>Share</Link></h2> */}
                        <h2><Link to="/"><img src={logo}/></Link></h2>
                    </div>
                    <div className="mn-nav--right">
                        <Link to="/login" className="mn-nav--right--login">Zaloguj się</Link>
                    </div>
                </div>
            </nav>
        )
    }
}

MainNav.propTypes = {
    children: PropTypes.object
};

export default MainNav;
