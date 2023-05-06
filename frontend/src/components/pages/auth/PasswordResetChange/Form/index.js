import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash.clonedeep';
import queryString from 'query-string';
import axios from 'axios';

class SignupForm extends Component {

    constructor() {
        super();
        this.state = {
            token_expired: false,
            password_reset_token: '',
            new_password: '',
            confirm_new_password: '',
            errors: {
                new_password: '',
                confirm_new_password: ''
            }
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.setErrorMessage = this.setErrorMessage.bind(this);
        this.initialValidation = this.initialValidation.bind(this);
        this.submitPasswordChange = this.submitPasswordChange.bind(this);
    }

    UNSAFE_componentWillMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/feed');
        }

        if (this.props.match.params.id !== undefined && this.props.match.params.id.length == 128) {
            const url_search = queryString.parse(this.props.location.search);
            if (url_search.ead != undefined) {
                axios.post(`${process.env.REACT_APP_GLOBAL_API_URL}/api/auth/password/reset/validate-token`, {email: url_search.ead, token: this.props.match.params.id})
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
        console.log(nextProps);
        
    }

    setErrorMessage(target_name, message) {
        const errors = cloneDeep(this.state.errors);   
        errors[target_name] = message;

        this.setState({ errors });
    }

    handleInputChange(e) {   
        const current_target = [e.target.name].toString();     
        this.setState({
            [e.target.name]: e.target.value,
        });

        if (!isNaN(e.target.value)) {
            if (current_target === "new_password") { this.setErrorMessage('new_password', 'Proszę podaj nowe hasło'); }
            if (current_target === "confirm_new_password") { this.setErrorMessage('confirm_new_password', 'Proszę potwierdź nowe hasło'); }
        } else { this.setErrorMessage(current_target, ''); }
    }

    initialValidation() {
        if (!isNaN(this.state.new_password)) { this.setErrorMessage('new_password', 'Proszę podaj nowe hasło'); return false; }
        if (this.state.new_password.length <= 6 || this.state.new_password.length >= 32) { this.setErrorMessage('new_password', 'Hasło musi składać się z 6 do 32 znaków'); return false; }
        if (!containsUppercaseLetter(this.state.new_password)) { this.setErrorMessage('new_password', 'Hasło musi zawierać przynajmniej jedną wielką literę'); return false; }

        if (!isNaN(this.state.confirm_new_password)) { this.setErrorMessage('confirm_new_password', 'Proszę potwierdź nowe hasło'); return false; }
        if (this.state.new_password !== this.state.confirm_new_password) { this.setErrorMessage('confirm_new_password', 'Wpisane hasła nie są identyczne'); return false; }

        function containsUppercaseLetter (str) {
            for (var i=0; i < str.length; i++) {
                if (str[i] === str[i].toUpperCase() && str[i] !== str[i].toLowerCase()) {
                    return true;
                } else if ((i + 1) == str.length) {
                    return false;
                }
            }
        }

    }

    submitPasswordChange(e) {
        e.preventDefault();

        if (this.initialValidation() !== false) {
            axios.post(`${process.env.REACT_APP_GLOBAL_API_URL}/api/auth/password/reset/change`, { email: queryString.parse(this.props.location.search).ead, token: this.props.match.params.id, password: this.state.new_password, password_confirmed: this.state.confirm_new_password })
                .then(res => {
                    if (res.data.message === "expired" || res.data.message === "failed") {
                        this.setState({ token_expired: true, password_reset_token: '' });
                    }

                    if (res.data.message === "true") {
                        this.props.history.push({
                            pathname: '/login',
                            state: { registered_email: queryString.parse(this.props.location.search).ead, flash_text: 'Zmiana hasła przebiegła pomyślnie' }
                        })
                    }
                    
                })
        }
    }

    render() {

        const { password_reset_token } = this.state;
        const { token_expired } = this.state;
        const { errors } = this.state;

        return (
            <>
                { token_expired == false ? (
                    <div className="reset-password">
                        <h3>Minęło zbyt wiele czasu ...</h3>
                        <p>Link, który próbujesz użyć do odzyskania hasła jest już nieaktualny.</p>
                        <Link to="/reset-password" className="nbs-btn nbs-btn--primary">Odzyskaj hasło</Link>
                    </div>
                ) : (
                    <>
                    <div className="auth-container--form--header">
                        <h2>Odzyskaj hasło</h2>
                    </div>
                    <form onSubmit={this.submitPasswordChange} autoComplete="off">
                        <div className="auth-form--row">
                            <label className="bs-label">Nowe hasło</label>
                            <input
                                type="password"
                                name="new_password"
                                placeholder="Przynajmniej 6 znaków"
                                onChange={this.handleInputChange}
                                value={this.state.new_password}
                                className={(errors.new_password !== '') ? 'auth-form--input-error' : 'nbs-input'}
                            />
                            {(errors.new_password !== '') ? <p className="auth-form--row--error">{errors.new_password}</p> : ''}
                        </div>
                        <div className="auth-form--row">
                            <label className="bs-label">Potwierdź hasło</label>
                            <input
                                type="password"
                                name="confirm_new_password"
                                placeholder="******"
                                onChange={this.handleInputChange}
                                value={this.state.confirm_new_password}
                                className={(errors.confirm_new_password !== '') ? 'auth-form--input-error nbs-input' : 'nbs-input'}
                            />
                            {(errors.confirm_new_password !== '') ? <p className="auth-form--row--error">{errors.confirm_new_password}</p> : ''}
                        </div>
                        <div className="auth-form--row">
                            <button type="submit" className="nbs-btn nbs-btn--primary">Zmień hasło</button>
                        </div>
                    </form>
                    </>
                )}
                </>
        );
    }
}

SignupForm.propTypes = {
    children: PropTypes.object,
    location: PropTypes.object,
    requestResetPasswordChange: PropTypes.func,
    errors: PropTypes.object,
    auth: PropTypes.object,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
});

// export default withRouter(SignupForm);
export default withRouter(connect(mapStateToProps)(SignupForm));
