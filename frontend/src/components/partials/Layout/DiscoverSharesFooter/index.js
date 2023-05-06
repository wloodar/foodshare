import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import foodGraphic from './food.svg';

class NewShareFooter extends Component {
    
    render() {

        return (
            <section className="fdsn-offers-footer">
                <div className="fdsn-offers-footer--inner">
                    <div className="fdsn-offers-footer--text">
                        <Link to="/feed">Odkryj Oferty</Link>
                    </div>
                    <div className="fdsn-offers-footer--graphic">
                        <img src={foodGraphic}/>
                    </div>  
                </div>
            </section> 
        )
    }
}

NewShareFooter.propTypes = {
    children: PropTypes.object
};

export default NewShareFooter;
            