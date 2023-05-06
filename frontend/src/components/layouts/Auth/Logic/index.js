import React, { Component } from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import $ from 'jquery';

class AuthLayout extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };

        this.updateAccountUnderlinePosition = this.updateAccountUnderlinePosition.bind();
    }

    UNSAFE_componentWillMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/feed');
        }
    }

    componentWillUnmount() {
        
    }

    componentDidMount() {
        this.updateAccountUnderlinePosition();
    }

    componentDidUpdate() {
        this.updateAccountUnderlinePosition();
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


    render() {

        return (
            <>
            <div className="na-nav">
                <header className="inbox-header">
                    {window.location.pathname == "/login" ? <h2>Witaj, zaloguj się!</h2>: null}
                    {window.location.pathname.indexOf('/signup') > -1 ? <h2>Stwórz konto</h2>: null}
                </header>
                <div className="na-nav--inner">
                    <ul id="account_nav_links">    
                        <li style={{ width: "50%" }}><NavLink activeClassName="na-nav--active" to="/login">Logowanie</NavLink></li>
                        <li style={{ width: "50%" }}><NavLink activeClassName="na-nav--active" to="/signup">Rejestracja</NavLink></li>
                        <li style={{ width: "50%" }} id="account_slide_click"></li>
                    </ul>
                </div>
            </div>
            </>
        )
    }
}

AuthLayout.propTypes = {
    children: PropTypes.object,
    auth: PropTypes.object,
    history: PropTypes.object,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

// export default withRouter(SignupForm);
export default withRouter(connect(mapStateToProps)(AuthLayout));
