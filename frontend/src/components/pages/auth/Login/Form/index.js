import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash.clonedeep';
import $ from 'jquery';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

import FlashMessage from '../../../../partials/FlashMessage';
import AuthWait from '../../../../partials/AuthWait';
import { loginUser } from '../../../../../redux/actions/authentication';

class SignupForm extends Component {

    constructor() {
        super();
        this.state = {
            user_registered: false,
            flash_message_text: '',
            email: '',
            password: '',
            errors: {
                email: '',
                password: '',
                overall: ''
            },
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.setErrorMessage = this.setErrorMessage.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    UNSAFE_componentWillMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/feed');
        }
    }

    componentDidMount() {
        if (this.props.location.state !== undefined && this.props.location.state !== null) {
            this.setState({ 
                user_registered: true,
                email: this.props.location.state.registered_email,
                flash_message_text: this.props.location.state.flash_text
            });
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
            this.props.history.push('/feed');
        }

        if (nextProps.errors['login_message']) {
            this.setErrorMessage('overall', 'Twój adres email lub hasło jest nieprawidłowe');
        } else if (Object.entries(nextProps.errors).length !== 0) {

            Object.keys(nextProps.errors).forEach(function(key) {
                this.setErrorMessage(key, nextProps.errors[key]);
            }.bind(this));
        }
    }

    handleInputChange(e) {
        const current_target = [e.target.name].toString();
        
        this.setState({
            [e.target.name]: e.target.value,
        });

        if (!isNaN(e.target.value)) { 
            if (current_target === "email") { this.setErrorMessage(current_target, 'Proszę podaj swój adres email'); } 
            if (current_target === "password") { this.setErrorMessage(current_target, 'Proszę podaj swoje hasło'); } 
        } else { this.setErrorMessage(current_target, ''); }
    }

    setErrorMessage(target_name, message) {
        const errors = cloneDeep(this.state.errors);   
        errors[target_name] = message;

        $('#auth-form--wait').css('display', 'none');
        this.setState({ errors });
    }

    submitForm(e) {
        e.preventDefault();

        if (this.state.email === '') {
            this.setErrorMessage('email', 'Proszę podaj swój adres email');
        } else if (this.state.password === '') {
            this.setErrorMessage('password', 'Proszę podaj swoje hasło');
        } else {
            const user = {
                email: this.state.email,
                password: this.state.password
            }
            
            $('#auth-form--wait').css('display', 'block');
            this.props.loginUser(user);
        }
    }

    responseFacebook(response) {
        console.log(response);
      }

    render() {

        var { user_registered } = this.state;
        const { errors } = this.state;
        
        return (
            <>
            {user_registered === true && <FlashMessage message={this.state.flash_message_text}/>}
            <form onSubmit={this.submitForm} autoComplete="off" id="auth-form">
                <div id="auth-form--wait">
                    <AuthWait title="Logowanie"/>
                </div>
                <div className="auth-form--row">
                    <label className="bs-label">Adres Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="twojemail@example.com"
                        onChange={this.handleInputChange}
                        value={this.state.email}
                        className={(errors.email !== '') ? 'auth-form--input-error nbs-input' : 'nbs-input'}
                    />
                    {(errors.email !== '') ? <p className="auth-form--row--error">{errors.email}</p> : ''}
                </div>
                <div className="auth-form--row">
                    <label className="bs-label">Hasło</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="........"
                        onChange={this.handleInputChange}
                        value={this.state.password}
                        className={(errors.password !== '') ? 'auth-form--input-error nbs-input' : 'nbs-input'}
                    />
                    {(errors.password !== '') ? <p className="auth-form--row--error">{errors.password}</p> : ''}
                    {(errors.overall !== '') ? <p className="auth-form--row--error">{errors.overall}</p> : ''}
                </div>
                <div className="auth-form--row auth-form--row--submit--two">
                    <div className="auth-form--row--submit--two--item auth-form--row--facebook">
                        <FacebookLogin
                            appId="523312181931445"
                            fields="name,email"
                            callback={this.responseFacebook}
                            render={renderProps => (
                                <button type="button" onClick={renderProps.onClick}><i class="fab fa-facebook"></i> Logowanie</button>
                            )}
                        />
                    </div>
                    <div className="auth-form--row--submit--two--item">
                        <button type="submit" className="nbs-btn nbs-btn--primary">Zaloguj się</button>
                    </div>
                </div>
                <div className="auth-form--additionals">
                    <p>Nie pamiętasz hasła? <Link to="/reset-password">Odzyskaj tutaj</Link></p>
                </div>
            </form> 
            </>
        )
    }
}

SignupForm.propTypes = {
    children: PropTypes.object,
    location: PropTypes.object,
    loginUser: PropTypes.func,
    errors: PropTypes.object,
    auth: PropTypes.object,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
});

// export default withRouter(SignupForm);
export default withRouter(connect(mapStateToProps, { loginUser })(SignupForm));
