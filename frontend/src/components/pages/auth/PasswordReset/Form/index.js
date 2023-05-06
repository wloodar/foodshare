import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash.clonedeep';

import { loginUser, requestPasswordChange } from '../../../../../redux/actions/authentication';

class SignupForm extends Component {

    constructor() {
        super();
        this.state = {
            show_email_alert: false,
            email: '',
            errors: {
                email: ''
            }
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
            this.setState({ email: '' });
        } else {
            this.setErrorMessage('email', 'Proszę podaj swój adres email.');   
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
            <form onSubmit={this.submitForm} autoComplete="off">
                { show_email_alert && <div className="auth-form--alert auth-form--alert--normal"><p>Wysłaliśmy do ciebie maila odnośnie zmiany hasła</p></div> }
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
                    <button type="submit" className="nbs-btn nbs-btn--primary">Potwierdź</button>
                </div>
            </form>
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
