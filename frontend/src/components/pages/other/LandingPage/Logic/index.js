import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import $ from 'jquery';

import FlashMessage from '../../../../partials/FlashMessage';

class SignupForm extends Component {

    constructor() {
        super();
        this.state = {
            logout: false,
            flash_text: ''
        };
    }

    UNSAFE_componentWillMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/feed');
        }
    }

    componentDidMount() {
        $('.mn-nav').css('border-bottom', '0');
        // if (this.props.location.state !== undefined) {
        //     this.setState({ 
        //         logout: true,
        //         flash_text: this.props.location.state.flash_text
        //     });
        // }
    }

    render() {

        const { logout, flash_text } = this.state;

        return (
            <>
                {logout === true && <div className="logout-alert"><p>{flash_text}</p></div>}
            </>
        )
    }
}

SignupForm.propTypes = {
    children: PropTypes.object,
    auth: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

// export default withRouter(SignupForm);
export default withRouter(connect(mapStateToProps)(SignupForm));
