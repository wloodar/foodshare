import React, { Component, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import $ from 'jquery';

import { Parallax, Background } from 'react-parallax';
import image_theme_dark from './dark.png';
import image_theme_light from './light.png';

class Conversation extends Component {

    constructor(props) {
        super(props);
        this.state = {  
            user: this.props.auth.user
        };

        this.changeUnderLinePosition = this.changeUnderLinePosition.bind();
        this.changeTheme = this.changeTheme.bind(this);
    }

    UNSAFE_componentWillMount() {
        if (!this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        }
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    componentWillUnmount() {
        const { user } = this.state;
    }

    componentDidMount() {
        const { user } = this.state;    
        this.updateUnderlinePosition();
        // document.documentElement.setAttribute('data-theme', 'dark');
    }

    componentDidUpdate() {
        this.updateUnderlinePosition();
    }




    updateUnderlinePosition() {
        let menu = document.getElementById('wl_theme_nav_links');
        if (menu) {
            let sliding_border = document.getElementById('wl_theme_slide_click');
            const lengthOfItems = $('#wl_theme_nav_links').children('li').length - 1;
            const widthOfElement = 100 / lengthOfItems;
            
            const marginLeft = widthOfElement * $('.wl-theme--slider--active').parent().index();
            
            sliding_border.style.marginLeft = marginLeft + '%';  
            sliding_border.style.width =  widthOfElement + '%';
        }

        function getPercentage( min, max ) {
            return min / max * 100;
        }
    }

    changeUnderLinePosition() {
        let menu = document.getElementById('wl_theme_nav_links');

        if (menu) {
            let menu_slider_click = document.getElementById('wl_theme_slide_click');
            if ( menu_slider_click ) {
              nav_slider( menu, function( el, width, tempMarginLeft ) {   
                    el.onclick = () => {
                        // menu_slider_click.style.width =  Math.round(width) + '%';      
                        menu_slider_click.style.width =  width + '%';                    
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


    changeTheme = (e, theme) => {
        const { target } = e;
        if ($(target).is('.wl-theme--slider--active') !== true) {
            $('.wl-theme--slider--inner--btn').removeClass('wl-theme--slider--active');
            $(target).addClass('wl-theme--slider--active');
            this.updateUnderlinePosition();
        }

        switch(theme) {
            case 0:
                document.documentElement.setAttribute('data-theme', 'dark');
                $('#wl_theme_dark').addClass('wl-theme--active'); $('#wl_theme_light').removeClass('wl-theme--active');
                break;
            default: 
                document.documentElement.setAttribute('data-theme', 'light');
                $('#wl_theme_light').addClass('wl-theme--active'); $('#wl_theme_dark').removeClass('wl-theme--active');
                break;
        }
    }



    render() {

        const { user } = this.state;
        
        return (
            <div className="wl-wrap">
                <header className="wl-header">
                    <div className="wl-header--inner">
                        <div className="wl-header--box">
                            <h2>Witaj, {user.first_name}!</h2>
                            <p>Kilka spraw do ogarnięcia i zaczynamy</p>
                        </div>
                    </div>
                </header>
                <div className="wl-wrapper">
                    <section className="wl-theme">
                        <div className="wl-wrapper--header">
                            <h3>Wybierz motyw</h3>
                        </div>
                        <div className="wl-wrapper--description">
                            <p>Starając się o najlepszą wygodę korzystania naszej aplikacji, oferujemy tobie do wyboru dwa motywy. Polecamy wybrać motyw ciemny, twoje oczy to docenią ;)</p>
                        </div>
                        <div className="wl-theme--options">
                            <div className="wl-theme--options--item wl-theme--active" id="wl_theme_dark">
                                <img src={image_theme_dark}/>
                            </div>
                            <div className="wl-theme--options--item" id="wl_theme_light">
                                <img src={image_theme_light}/>
                            </div>
                        </div>
                        <div className="wl-theme--slider">
                            <div className="wl-theme--slider--inner">
                                <ul id="wl_theme_nav_links">    
                                    <li><button className="wl-theme--slider--inner--btn wl-theme--slider--active" onClick={(e) => this.changeTheme(e, 0)}>Ciemny - preferowany</button></li>
                                    <li><button className="wl-theme--slider--inner--btn" onClick={(e) => this.changeTheme(e, 1)}>Jasny</button></li>
                                    <li id="wl_theme_slide_click"></li>
                                </ul>
                            </div>
                        </div>  
                    </section>  
                </div>
            </div>
        )
    }
}

Conversation.propTypes = {
    children: PropTypes.object,
    auth: PropTypes.object,
    history: PropTypes.object,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default withRouter(connect(mapStateToProps)(Conversation));
