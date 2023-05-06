import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import $ from "jquery";
import { logoutUser } from '../../../../../../redux/actions/authentication';

import Icon from "../../../../../../public/icons/account";

class MainAccountAside extends Component {

    constructor() {
        super();
        this.state = {
            width: 0, height: 0
        }

        this.updateDimensions = this.updateDimensions.bind(this);
    }

    UNSAFE_componentWillMount() {
        if (!this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        }
    }
    
    componentDidMount() {
        window.addEventListener('resize', this.updateDimensions);
        if ($(window).width() <= 600) {
            // $('.mn-nav').addClass('mn-nav--without-shadow');
        }
        
        $('.ac-nav--fade').css('height', $('.ac-nav').height() + "px");

        var active = $('.ac-nav--inner--active');
        var left = active.position().left;
        var currScroll= $(".ac-nav").scrollLeft(); 
        var contWidth = $('.ac-nav').width()/2; 
        var activeOuterWidth = active.outerWidth()/2;
        left= left + currScroll - contWidth + activeOuterWidth;

        $('.ac-nav--inner').scrollLeft(left);
    }

    updateDimensions = () => {
        if ($(window).width() <= 600) {
            // $('.mn-nav').addClass('mn-nav--without-shadow');            
        } else {
            // $('.mn-nav').removeClass('mn-nav--without-shadow');
        }
    }    

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
        // $('.mn-nav').removeClass('mn-nav--without-shadow');
    }

    onLogout(e) {
        e.preventDefault();
        this.props.logoutUser(this.props.history);
        this.props.history.push({
            pathname: '/',
            state: { logout: true, flash_text: 'Pomyślnie wylogowano.' }
        })
    }

    render() {

        return (
            <>
            {/* <button onClick={this.onLogout.bind(this)}><div className="ac-nav--item"><Icon name="logout"/><p>Wyloguj się</p></div><span></span></button> */}
            <aside className="ac-aside">
                <div className="ac-aside--list">
                    <ul>
                        <li><NavLink to="/account" activeClassName="bs-color--primary-light ac-aside--list--active" exact><Icon name="optionssolid"/><p>Ustawienia profilu</p></NavLink></li>
                        <li><NavLink to="/account/shares" activeClassName="bs-color--primary-light ac-aside--list--active"><Icon name="shoppingbag"/><p>Twoje oferty</p></NavLink></li>
                        {/* <li><NavLink to="/inbox" activeClassName="bs-color--primary-light ac-aside--list--active"><Icon name="mail"/><p>Wiadomości</p></NavLink></li> */}
                        {/* <li><NavLink to="/account/statistics" activeClassName="bs-color--primary-light ac-aside--list--active"><Icon name="statistics"/><p>Statystyki</p></NavLink></li> */}
                        <li><button onClick={this.onLogout.bind(this)} style={{ background: "rgba(0,0,0,0)" }}><Icon name="logout"/><p>Wyloguj się</p></button></li>
                    </ul>
                </div>
            </aside>
            <div className="ac-nav">  
                <div className="ac-nav--fade ac-nav--fade--left"></div>
                <div className="ac-nav--fade ac-nav--fade--right"></div>
                <div className="ac-nav--inner">
                    <NavLink to="/account" activeClassName="ac-nav--inner--active" onClick={this.scrollMenu} exact><div className="ac-nav--item"><Icon name="optionssolid"/><p>Ustawienia profilu</p></div><span></span></NavLink>
                    <NavLink to="/account/shares" activeClassName="ac-nav--inner--active" onClick={this.scrollMenu}><div className="ac-nav--item"><Icon name="shoppingbag"/><p>Twoje oferty</p></div><span></span></NavLink>
                    {/* <NavLink to="/inbox" activeClassName="ac-nav--inner--active" onClick={this.scrollMenu}><div className="ac-nav--item"><Icon name="mail"/><p>Wiadomości</p></div><span></span></NavLink> */}
                    {/* <NavLink to="/account/statistics" activeClassName="ac-nav--inner--active" onClick={this.scrollMenu}><div className="ac-nav--item"><Icon name="statistics"/><p>Statystyki</p></div><span></span></NavLink> */}
                    <button onClick={this.onLogout.bind(this)}><div className="ac-nav--item"><Icon name="logout"/><p>Wyloguj się</p></div><span></span></button>
                </div>
            </div>
            </>
        )
    }
}

MainAccountAside.propTypes = {
    logoutUser: PropTypes.func,
    children: PropTypes.object,
    auth: PropTypes.object,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

// export default MainAccountAside;
export default withRouter(connect(mapStateToProps, { logoutUser })(MainAccountAside));
