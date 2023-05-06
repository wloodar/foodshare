import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import shareGraphic from './share.svg';

class MakeNewShareFooter extends Component {
    
    render() {

        return (
            <section className="fdsn-offers-footer">
                <div className="fdsn-offers-footer--inner">
                    <div className="fdsn-offers-footer--text">
                        <Link to="/share">Podziel się teraz</Link>
                    </div>
                    <div className="fdsn-offers-footer--graphic">
                        <img src={shareGraphic}/>
                    </div>  
                </div>
            </section>
        )
    }
}

MakeNewShareFooter.propTypes = {
    children: PropTypes.object
};

export default MakeNewShareFooter;
            