import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import $ from 'jquery';
import { socket } from '../../../../../../socket';

import icon_pin from '../../../../../../public/img/icons/pin.svg';
import dish_image from '../../../../../../public/img/layout/dish.jpg';
import icon_user from '../../../../../../public/img/icons/user-icon.svg';

class MainShares extends Component {

    constructor(props) {
        super(props);
        this.state = {
            school_id: null,
            school_name: null,
            school_city: null,
            school_street: null,
        };
    }

    UNSAFE_componentWillMount() {
        if (!this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        }
    }

    componentDidMount() {
        $('.fds-offers--list--item--image').css('height', ($('.fds-offers--list--item--image').width() - $('.fds-offers--list--item--image').width() / 10) + "px");
        $(window).resize(() => {
            $('.fds-offers--list--item--image').css('height', ($('.fds-offers--list--item--image').width() - $('.fds-offers--list--item--image').width() / 10) + "px");
        })

        axios.get(`http://localhost:7000/api/user/currrent/general`)
            .then(res => {
                console.log(res.data);
                
                if (res.data.school_id === null) {
                    this.props.history.push('/feed/search-school');
                } else {
                    this.setState({
                        school_id: res.data.school_id,
                        school_name: res.data.school_name,
                        school_city: res.data.school_city,
                        school_street: res.data.school_street,
                    });                    
                }
            })
    }

    render() {

        const elements = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];

        return (
            <div className="fds-wrap">
                <header className="fds-wrap--header">
                    <div className="fds-wrap--header--inner">
                        <div className="fds-wrap--header--inner--pin">
                            <img src={icon_pin}/>
                        </div>
                        <div className="fds-wrap--header--inner--content">
                            <h3>{this.state.school_name}</h3>
                            <p>{this.state.school_street}, {this.state.school_city}</p>
                        </div>
                    </div>
                </header>
                <section className="fds-offers">
                    <div className="fds-offers--header">
                        <h5 className="bs-title bs-title--medium">Lista ofert podzielenia się</h5>
                        <Link to="/feed/share" className="bs-btn">Podziel się</Link>
                    </div>
                    <main className="fds-offers--list">
                        <ul>
                            {elements.map((value, index) => {
                                return <li>
                                    <Link to="/feed/offer/129231">
                                        <div className="fds-offers--list--item--image">
                                            <img src={dish_image}/>
                                        </div>
                                        <div className="fds-offers--list--item">
                                            <div className="fds-offers--list--item--left">
                                                <div className="fds-offers--list--item--details">
                                                    <h3 className="bs-title bs-title--small">Kanapka z szynką</h3>
                                                    <p><span className="bs-green">Za darmo</span> | 15:00</p>
                                                </div>
                                            </div>
                                            <div className="fds-offers--list--item--right">
                                                <div className="fds-offers--list--item--right--phone">
                                                    <a href="tel:5011122712">501 122 712</a>
                                                </div>
                                                <div className="fds-offers--list--item--right--name">
                                                    <img src={icon_user}/>
                                                    <p>Jakub</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            })}
                        </ul>
                    </main>
                </section>
            </div>
        )
    }
}

MainShares.propTypes = {
    children: PropTypes.object,
    auth: PropTypes.object,
    history: PropTypes.object,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

// export default withRouter(SignupForm);
export default withRouter(connect(mapStateToProps)(MainShares));
