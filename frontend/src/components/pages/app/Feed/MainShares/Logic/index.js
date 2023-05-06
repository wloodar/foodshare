import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import $ from 'jquery';
import { socket } from '../../../../../../socket';
import moment from 'moment';

import icon_pin from '../../../../../../public/img/icons/pin-white.svg';
import dish_image from '../../../../../../public/img/layout/dish.jpg';
import icon_user from '../../../../../../public/img/icons/user-icon.svg';
import Icon from '../../../../../../public/icons/account';

import LoadingBurger from '../../../../../partials/LoadingBurger';
import empty_offers_sad from '../../../../../../public/img/vectors/sad1.svg';

import newGraphic from '../graphics.svg';
import MakeNewShareFooter from '../../../../../partials/Layout/MakeNewShareFooter';

class MainShares extends Component {

    constructor(props) {
        super(props);
        this.state = {
            school_id: null,
            school_name: null,
            school_city: null,
            school_street: null,
            loading_offers: true,
            loading_school: true,
            offers: []
        };

        this.handleScroll = this.handleScroll.bind(this);
    }

    UNSAFE_componentWillMount() {
        if (!this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        }
    }

    componentWillUnmount() {
        $('.mn-nav').removeClass('mn-nav--transparent');
        window.removeEventListener('scroll', this.handleScroll);
    }

    componentDidMount() {
        // $('.mn-nav').addClass('mn-nav--transparent');
        window.addEventListener('scroll', this.handleScroll);

        $(window).resize(() => {
            $('.fds-offers--list--item--image').css('height', ($('.fds-offers--list--item--image').width() - $('.fds-offers--list--item--image').width() / 4) + "px");
        })

        axios.get(`${process.env.REACT_APP_GLOBAL_API_URL}/api/user/current/general`)
            .then(res => {
                if (res.data.school_id === null) {
                    this.props.history.push('/feed/search-school');
                } else {
                    this.setState({
                        school_id: res.data.school_id,
                        school_name: res.data.school_name,
                        school_city: res.data.school_city,
                        school_street: res.data.school_street,
                        loading_school: false
                    });      
                    
                    axios.get(`${process.env.REACT_APP_GLOBAL_API_URL}/api/offers/get/all-from-school`,{
                        params: {
                            school_id: res.data.school_id
                        }
                    })
                    .then(result => {
                        this.setState({
                            offers: result.data.offers,
                            loading_offers: false
                        });
            
                        $('.fds-offers--list--item--image').css('height', ($('.fds-offers--list--item--image').width() - $('.fds-offers--list--item--image').width() / 4) + "px");
                    })
                }
            })
    }

    handleScroll() {
        if ($(window).scrollTop() > 20) {
            // $('.mn-nav').removeClass('mn-nav--transparent');
        } else {
            // $('.mn-nav').addClass('mn-nav--transparent');
        }
    }

    render() {

        const { offers } = this.state;
    
        return (
            <>
            <div>
                <header className="n-header">
                    <div className="n-header--inner">
                        <div className="n-header--box">
                            <h3>{this.state.school_name}</h3>
                            <p>{this.state.loading_school ? "Ładowanie ..." : `${this.state.school_street}, ${this.state.school_city}`}</p>
                        </div>
                    </div>
                </header>
                {/* <header className="fds-wrap--header">
                    <div className="fds-wrap--header--inner">
                        <div className="fds-wrap--header--graphic">
                            <img src={newGraphic}/>
                        </div>
                        <div className="fds-wrap--header--info">
                            <div className="fds-wrap--header--info--box">
                                <h3>{this.state.school_name}</h3>
                                <p>{this.state.school_street}, {this.state.school_city}</p>
                            </div>
                        </div>
                    </div>
                </header> */}
                <section className="fds-offers">
                    <div className="fds-offers--header">
                        <div className="fds-offers--header--container">
                            <div className="fds-offers--header--container--left">
                                <h3>Lista ofert</h3>
                            </div>
                            <div className="fds-offers--header--container--right">
                                <Link to="/share" className="bs-btn bs-btn--primary">Podziel się</Link>
                            </div>
                        </div>
                    </div>
                    <main className="fds-offers--list">
                        {this.state.offers.length == 0 && this.state.loading_offers == false ? <div className="fds-offers--list--empty">
                            <div className="fds-offers--list--empty--image">
                                <img src={empty_offers_sad}/>
                            </div>
                            <div className="fds-offers--list--empty--text">
                                <h3>Brak ofert na ten moment...</h3>
                            </div>
                        </div> : null}
                        {this.state.loading_offers == true ? <div className="fds-offers--list--loading">
                            <LoadingBurger/>
                        </div>: null}
                        <ul>
                            {this.state.offers.map((value, index) => {
                                return <li key={index}>
                                    <Link to={"/feed/offer/" + offers[index].id}>
                                        <div className="fds-offers--list--item--image">
                                            {/* <img src={"https://ik.imagekit.io/8h7cde4sg/tr:w-600,q-30,f-jpg,pr-true" + offers[index].img_url}/> */}
                                            <img src={"https://res.cloudinary.com/dgzvc6fls/image/upload/v1575413544/" + offers[index].img_url}/>
                                        </div>
                                        <div className="fds-offers--list--item">
                                            <div className="fds-offers--list--item--left">
                                                <div className="fds-offers--list--item--details">
                                                    <h3 className="bs-title bs-title--small">{ offers[index].name }</h3>
                                                    <p><i class="fas fa-tags"></i><span>{ offers[index].price == 0.00 ? "Za darmo" : offers[index].price + "zł"}</span><i class="fas fa-clock"></i><span>{moment(new Date(offers[index].available_to)).format("HH:mm")}</span></p>
                                                </div>
                                            </div>
                                            <div className="fds-offers--list--item--right">
                                                <div className="fds-offers--list--item--right--short-info" style={this.props.auth.user.id == offers[index].shared_by ? {display: "block"} : null}>
                                                    <p>{this.props.auth.user.id == offers[index].shared_by ? "Twoja oferta" : null}</p>
                                                </div>
                                                <div className="fds-offers--list--item--right--name">
                                                    <p>{this.props.auth.user.id == offers[index].shared_by ? "Ty" : offers[index].first_name }</p>
                                                    {/* <img src={icon_user}/> */}
                                                    <Icon name="user"/>
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
            <MakeNewShareFooter/>
            </>
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
