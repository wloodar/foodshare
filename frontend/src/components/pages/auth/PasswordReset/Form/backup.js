import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash.clonedeep';
import queryString from 'query-string';
import axios from 'axios';

import FlashMessage from '../../../../partials/FlashMessage';
import { loginUser, requestPasswordChange } from '../../../../../redux/actions/authentication';

class SignupForm extends Component {

    constructor() {
        super();
        this.state = {
            show_email_alert: false,
            token_expired: false,
            password_reset_token: '',
            email: '',
            new_password: '',
            confirm_new_password: '',
            errors: {
                email: ''
            }
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.setErrorMessage = this.setErrorMessage.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.pathname !== prevProps.location.pathname && this.props.match.path !== '/reset-password/:id') {
            this.setState({ password_reset_token: '', show_email_alert: false })
        }
    }

    UNSAFE_componentWillMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/dashboard');
        }

        if (this.props.match.params.id !== undefined && this.props.match.params.id.length == 128) {
            const url_search = queryString.parse(this.props.location.search);
            if (url_search.ead != undefined) {
                axios.post('http://localhost:7000/api/auth/password/reset/validate-token', {email: url_search.ead, token: this.props.match.params.id})
                    .then(res => {
                        
                        // validation of token
                        const res_mes = res.data.message.toString();
                        
                        if (res_mes === "failed" ) {
                            this.props.history.push('/reset-password');
                        } else if (res_mes === "expired") {
                            this.setState({ token_expired: true });
                        }
                    })    
            }
            
            this.setState({ password_reset_token: this.props.match.params.id });
        } else if (this.props.match.params.id !== undefined && this.props.match.params.id.length != 128) {
            this.props.history.push('/reset-password');
        } 
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (isNaN(nextProps.errors)) {
            this.setState({ show_email_alert: true });
        }
    }

    setErrorMessage(target_name, message) {
        const errors = cloneDeep(this.state.errors);   
        errors[target_name] = message;

        this.setState({ errors });
    }

    handleInputChange(e) {        
        this.setState({
            [e.target.name]: e.target.value,
        });

        this.setErrorMessage('email', ''); 
    }

    submitForm(e) {
        e.preventDefault();

        if (isNaN(this.state.email)) {
            this.props.requestPasswordChange({email: this.state.email});
        } else {
            this.setErrorMessage('email', 'Please enter your email address');   
        } 
    }

    submitPasswordChange(e) {
        e.preventDefault();
    }

    render() {

        const { password_reset_token } = this.state;
        const { show_email_alert } = this.state;
        const { token_expired } = this.state;
        const { errors } = this.state;

        return (
            <>
            { password_reset_token == '' ? (
                <form onSubmit={this.submitForm} autoComplete="off">
                    { show_email_alert && <div className="auth-form--alert auth-form--alert--normal"><p>Password reset request sent</p></div> }
                    <div className="auth-form--row">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="youremail@example.com"
                            onChange={this.handleInputChange}
                            value={this.state.email}
                            className={(errors.email !== '') ? 'auth-form--input-error' : ''}
                        />
                        {(errors.email !== '') ? <p className="auth-form--row--error">{errors.email}</p> : ''}
                    </div>
                    <div className="auth-form--row">
                        <button type="submit">Reset Password</button>
                    </div>
                    <div className="auth-form--row--bottom-text">
                        <p>Return to <Link to="/login">Login Page</Link></p>
                    </div>
                </form> 
            ) : (
                <>
                { token_expired ? (
                    <div className="reset-password">
                        <h3>Token is expired</h3>
                        <p>The link you used to reset your password is expired.</p>
                        <Link to="/reset-password">Reset your Password</Link>
                    </div>
                ) : (
                    <form onSubmit={this.submitPasswordChange} autoComplete="off">
                        <div className="auth-form--row">
                            <label>New Password</label>
                            <input
                                type="password"
                                name="new_password"
                                placeholder="Minimum 6 characters"
                                onChange={this.handleInputChange}
                                value={this.state.new_password}
                            />
                        </div>
                        <div className="auth-form--row">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                name="confirm_new_password"
                                onChange={this.handleInputChange}
                                value={this.state.confirm_new_password}
                            />
                        </div>
                        <div className="auth-form--row">
                            <button type="submit">Change Password</button>
                        </div>
                    </form>
                )}
                </>
            )}
            </>
        );
    }
}

SignupForm.propTypes = {
    children: PropTypes.object,
    location: PropTypes.object,
    loginUser: PropTypes.func,
    requestPasswordChange: PropTypes.func,
    errors: PropTypes.object,
    auth: PropTypes.object,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
});

// export default withRouter(SignupForm);
export default withRouter(connect(mapStateToProps, { loginUser, requestPasswordChange })(SignupForm));
