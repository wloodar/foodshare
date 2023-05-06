import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logoutUser } from '../../../../../redux/actions/authentication';
import { withRouter } from 'react-router-dom';
import { Link, NavLink, BrowserRouter } from 'react-router-dom';
// import { BrowserHistoryBuildOptions } from 'history';
import PropTypes from 'prop-types';
import $ from "jquery";

import user_icon from './user-icon.svg';
import nav_panel_history from './icons/history.svg';
import nav_panel_shopping_bag from './icons/shopping-bag.svg';
import nav_panel_help from './icons/help.svg';
import nav_panel_user from './icons/user.svg';
import nav_panel_logout from './icons/logout.svg';
import Icon from '../../../../../public/icons/account';
import NavIcon from '../../../../../public/icons/navigation';
import logo from './logo.png';

// console.log(useLastLocation());

class MainNav extends Component {

    constructor() {
        super();
        this.state = {
            width: 0, height: 0,
            user_first_name: ''
        };
        
        this.changeUnderlinePosition = this.changeUnderlinePosition.bind();
        this.changeAccountUnderLinePosition = this.changeAccountUnderLinePosition.bind();
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        window.addEventListener('scroll', this.handleScroll);
        this.setState({ 
            user_first_name: this.props.auth.user.first_name
         })

        
         $('.na-nav--inner ul li').click((e) => {
             console.log(e);
             
            $(e.currentTarget).siblings().removeClass('na-nav--inner--active');
            $(e.currentTarget).addClass('na-nav--inner--active');
         });
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    componentDidUpdate() {
        if (window.location.href.indexOf("account") > -1) {
            $('.mn-nav').addClass('mn-nav--with-shadow');
        } else {
            $('.mn-nav').removeClass('mn-nav--with-shadow');
        }

        this.updateUnderlinePosition();
        this.updateAccountUnderlinePosition();
    }
    
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    handleScroll() {

    }

    openUserPanel(e) {
        $('.mn-nav--overlay').css('display', 'block');
        $('.mn-nav--panel').css('display', 'block');
    }

    closeUserPanel(e) {
        $('.mn-nav--overlay').css('display', 'none');
        $('.mn-nav--panel').css('display', 'none');
    }
 
    onLogout(e) {
        e.preventDefault();
        this.props.logoutUser(this.props.history);
        this.props.history.push({
            pathname: '/',
            state: { logout: true, flash_text: 'Pomyślnie wylogowano.' }
        })
    }


    updateUnderlinePosition() {
        let menu = document.getElementById('main_app_nav_links');
        if (menu) {
            let sliding_border = document.getElementById('nav_slide_click');
            const lengthOfItems = $('#main_app_nav_links').children('li').length;
            const widthOfElement = Math.round(100 / lengthOfItems);
            
            const marginLeft = Math.round(widthOfElement * $('.mn-nav--right--wrapper--active').parent().index());
            if ($('.mn-nav--right--wrapper--active').parent().index() !== -1) {
                sliding_border.style.marginLeft = marginLeft + '%';  
                sliding_border.style.width =  widthOfElement + '%';
            }
        }

        function getPercentage( min, max ) {
            return min / max * 100;
        }
    }

    changeUnderlinePosition() {
        let menu = document.getElementById('main_app_nav_links');

        if (menu) {
            let menu_slider_click = document.getElementById('nav_slide_click');
            if ( menu_slider_click ) {
              nav_slider( menu, function( el, width, tempMarginLeft ) {   
                    el.onclick = () => {
                        menu_slider_click.style.width =  Math.round(width) + '%';                    
                        menu_slider_click.style.marginLeft = Math.round(tempMarginLeft) + '%';    
                    }
              });
            }
        }

        function nav_slider( menu, callback ) {
            
            let menu_width = menu.offsetWidth;
            // We only want the <li> </li> tags
            menu = menu.getElementsByTagName( 'li' );            
            if ( menu.length > 0 ) {
              var marginLeft = [];
              // Loop through nav children i.e li
              [].forEach.call( menu, ( el, index ) => {
                // Dynamic width/margin calculation for hr       app-mnav--main--active       
                var width = getPercentage( el.offsetWidth, menu_width );   
                // var width = getPercentage( $('.app-mnav--main--active').outerWidth(), menu_width );                              
                var tempMarginLeft = 0;
                // We don't want to modify first elements positioning
                if ( index != 0 )  {
                  tempMarginLeft = getArraySum( marginLeft );
                }            
                // Set mouse event  hover/click
                callback( el, width, tempMarginLeft );      
                /* We store it in array because the later accumulated value is used for positioning */
                marginLeft.push( width );
              } );
            }
        }

        function getPercentage( min, max ) {
            return min / max * 100;
        }
          
          // Not using reduce, because IE8 doesn't supprt it
        function getArraySum( arr ) {
            let sum = 0;
            [].forEach.call( arr, ( el, index ) => {
              sum += el;
            } );
            return sum;
        }

    }

    
    updateAccountUnderlinePosition() {
        let menu = document.getElementById('account_nav_links');
        if (menu) {
            let sliding_border = document.getElementById('account_slide_click');
            const lengthOfItems = $('#account_nav_links').children('li').length - 1;
            // const widthOfElement = Math.round(100 / lengthOfItems);
            const widthOfElement = 100 / lengthOfItems;
            
            // const marginLeft = Math.round(widthOfElement * $('.nv-nav--active').parent().index());
            const marginLeft = widthOfElement * $('.na-nav--active').parent().index();
            sliding_border.style.marginLeft = marginLeft + '%';  
            sliding_border.style.width =  widthOfElement + '%';
        }

        function getPercentage( min, max ) {
            return min / max * 100;
        }
    }

    changeAccountUnderLinePosition() {
        let menu = document.getElementById('account_nav_links');

        if (menu) {
            let menu_slider_click = document.getElementById('account_slide_click');
            if ( menu_slider_click ) {
              nav_slider( menu, function( el, width, tempMarginLeft ) {   
                    el.onclick = () => {
                        // menu_slider_click.style.width =  Math.round(width) + '%';      
                        menu_slider_click.style.width =  (width - "19px") + '%';                    
                        // menu_slider_click.style.marginLeft = Math.round(tempMarginLeft) + '%';    
                        menu_slider_click.style.marginLeft = tempMarginLeft + '%';    
                        $(el).css('color', '#fff !important');
                    }
              });
            }
        }

        function nav_slider( menu, callback ) {
            
            let menu_width = menu.offsetWidth;
            // We only want the <li> </li> tags
            menu = menu.getElementsByTagName( 'li' );            
            if ( menu.length > 0 ) {
              var marginLeft = [];
              // Loop through nav children i.e li
              [].forEach.call( menu, ( el, index ) => {
                // Dynamic width/margin calculation for hr       app-mnav--main--active       
                var width = getPercentage( el.offsetWidth, menu_width );   
                // var width = getPercentage( $('.app-mnav--main--active').outerWidth(), menu_width );                              
                var tempMarginLeft = 0;
                // We don't want to modify first elements positioning
                if ( index != 0 )  {
                  tempMarginLeft = getArraySum( marginLeft );
                }            
                // Set mouse event  hover/click
                callback( el, width, tempMarginLeft );      
                /* We store it in array because the later accumulated value is used for positioning */
                marginLeft.push( width );
              } );
            }
        }

        function getPercentage( min, max ) {
            return min / max * 100;
        }
          
          // Not using reduce, because IE8 doesn't supprt it
        function getArraySum( arr ) {
            let sum = 0;
            [].forEach.call( arr, ( el, index ) => {
              sum += el;
            } );
            return sum;
        }

    }


    animateTransition = (el) => {
       
    }
    
    render() {
        
        const { user_first_name } = this.state;

        return (
            <>
            {window.location.href.indexOf("account") > -1 && this.state.width <= 600 ? <div className="na-nav">
                <header className="inbox-header">
                    {window.location.pathname == "/account" ? <h2>Ustawienia konta</h2>: null}
                    {window.location.pathname.indexOf('/account/shares') > -1 ? <h2>Twoje oferty</h2>: null}
                    {window.location.pathname.indexOf('/account/statistics') > -1 ? <h2>Statystyki</h2>: null}
                </header>
                <div className="na-nav--inner">
                    <ul id="account_nav_links">    
                        <li><NavLink activeClassName="na-nav--active" to="/account" exact>Ustawienia</NavLink></li>
                        <li><NavLink activeClassName="na-nav--active" to="/account/shares">Twoje oferty</NavLink></li>
                        <li><NavLink activeClassName="na-nav--active" to="/account/statistics">Statystyki</NavLink></li>
                        <li id="account_slide_click"></li>
                    </ul>
                </div>
            </div> : ''}

            <nav className="mn-nav">
                <div className="mn-nav--wrapper">
                    <div className="mn-nav--left">
                        {this.props.auth.isAuthenticated ? <Link to="/feed"><img src={logo}/></Link> : <Link to="/"><img src={logo}/></Link>}
                    </div>
                    <div className="mn-nav--right ap-nav--account">
                        <div className="mn-nav--right--wrapper">
                            <ul id="main_app_nav_links">    
                                <li><NavLink to="/feed" activeClassName='mn-nav--right--wrapper--active' onClick={this.animateTransition.bind(this)}><NavIcon name="pizzaslice"/></NavLink></li>
                                <li><NavLink to="/share" activeClassName='mn-nav--right--wrapper--active' onClick={this.animateTransition.bind(this)}><NavIcon name="add"/></NavLink></li>
                                <li id="nn_messages"><NavLink to="/inbox" activeClassName='mn-nav--right--wrapper--active' onClick={this.animateTransition.bind(this)}><NavIcon name="messages"/></NavLink></li>
                                <li><NavLink to="/account" activeClassName='mn-nav--right--wrapper--active' onClick={this.animateTransition.bind(this)}><NavIcon name="usertwo"/></NavLink></li>
                                <hr id="nav_slide_click"/>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="mn-nav--overlay" onClick={this.closeUserPanel.bind(this)}></div>
            <div className="mn-nav--panel">
                <div className="mn-nav--panel--header">
                    <h5 className="bs-title bs-title--small">Witaj, <span>{ user_first_name }!</span></h5>
                </div>
                <div className="mn-nav--panel--list" onClick={this.closeUserPanel.bind(this)}>
                    <ul>
                        {/* <li><Link to="/account/history"><div className="mn-nav--panel--list--imgbg"><img src={nav_panel_history}/></div><p>Historia</p></Link></li> */}
                        <li><Link to="/account/shares"><div className="mn-nav--panel--list--imgbg"><img src={nav_panel_shopping_bag}/></div><p>Twoje oferty</p></Link></li>
                        <li><Link to="/account"><div className="mn-nav--panel--list--imgbg"><img src={nav_panel_user}/></div><p>Konto</p></Link></li>
                        <li><Link to="/help"><div className="mn-nav--panel--list--imgbg"><img src={nav_panel_help}/></div><p>Pomoc</p></Link></li>
                        <li className="mn-nav--panel--list--logout"><a href="" onClick={this.onLogout.bind(this)}><div className="mn-nav--panel--list--imgbg"><img src={nav_panel_logout}/></div><p>Wyloguj się</p></a></li>
                    </ul>
                </div>
                <div className="mn-nav--panel--copyright">
                    <p>© 2019 ShareFood</p>
                </div>
            </div>
            </>
        )
    }
}

MainNav.propTypes = {
    logoutUser: PropTypes.func,
    children: PropTypes.object,
    auth: PropTypes.object,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default withRouter(connect(mapStateToProps, { logoutUser })(MainNav));