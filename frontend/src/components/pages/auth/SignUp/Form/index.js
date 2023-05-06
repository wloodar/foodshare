import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cloneDeep from 'lodash.clonedeep';
import $ from 'jquery';

import AuthWait from '../../../../partials/AuthWait';
import { registerUser } from '../../../../../redux/actions/authentication';

class SignupForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            terms_of_use: false,
            errors: {
                register_type: '',
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                terms_of_use: ''
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

    
        

    UNSAFE_componentWillReceiveProps(updatedProps) { 
        if (Object.entries(updatedProps.errors).length !== 0) {
            Object.keys(updatedProps.errors).forEach(function(key) {
                this.setErrorMessage(key, updatedProps.errors[key]);
            }.bind(this));
        } else {
            this.props.history.push({
                pathname: '/login',
                state: { registered_email: this.state.email, flash_text: 'Rejestracja przebiegła pomyślnie! Teraz możesz się zalogować.' }
            })
        }
    }

    handleInputChange(e) {
        const current_target = [e.target.name].toString();

        if (current_target !== "terms_of_use") {
            this.setState({
                [e.target.name]: e.target.value,
            });
        } else {
            this.setState({
                [e.target.name]: e.target.checked
            });
        }
        

        if (!isNaN(e.target.value)) { 
            console.log(current_target);
            if (current_target === "first_name") { this.setErrorMessage(current_target, 'Proszę podaj swoje imię'); } 
            if (current_target === "last_name" && Number.isNaN(e.target.value)) { this.setErrorMessage(current_target, 'Proszę podaj swoje nazwisko'); } else { this.setErrorMessage(current_target, ''); }
            if (current_target === "email") { this.setErrorMessage(current_target, 'Proszę podaj swój adres email'); } 
            if (current_target === "password") { this.setErrorMessage(current_target, 'Proszę podaj swoje hasło'); } 
            if (current_target === "terms_of_use") { this.setErrorMessage(current_target, 'Musisz wyrazić zgodę na warunki korzystania'); } 
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
        

        if (this.state.terms_of_use) {
            const user = {
                register_type: 1,
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                email: this.state.email,
                password: this.state.password
            }
    
            $('#auth-form--wait').css('display', 'block');
            this.props.registerUser(user, this.props.history);
        } else {
            this.setErrorMessage('terms_of_use', 'Musisz wyrazić zgodę na warunki korzystania');
        }
    }

    render() {

        const { errors } = this.state;

        return (
            <form onSubmit={this.submitForm} autoComplete="off" id="auth-form">
                <div id="auth-form--wait">
                    <AuthWait title="Rejestracja"/>
                </div>
                <div className="auth-form--row auth-form--row--two">
                    <div className="auth-form--row--two--item">
                        <label className="bs-label">Imię</label>
                        <input
                            type="text"
                            name="first_name"
                            placeholder="Np. Jakub"
                            autoComplete="off"
                            onChange={this.handleInputChange}
                            value={this.state.first_name}
                            className={(errors.first_name !== '') ? 'auth-form--input-error nbs-input' : 'nbs-input'}
                        />
                        {(errors.first_name !== '') ? <p className="auth-form--row--error">{errors.first_name}</p> : ''}
                    </div>
                    <div className="auth-form--row--two--item">
                        <label className="bs-label">Nazwisko</label>
                        <input
                            type="text"
                            name="last_name"
                            placeholder="Np. Kowalski"
                            onChange={this.handleInputChange}
                            value={this.state.last_name}
                            className={(errors.last_name !== '') ? 'auth-form--input-error nbs-input' : 'nbs-input'}
                        />
                        {(errors.last_name !== '') ? <p className="auth-form--row--error">{errors.last_name}</p> : ''}
                    </div>

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
                        placeholder="Minimalnie 6 znaków"
                        onChange={this.handleInputChange}
                        value={this.state.password}
                        className={(errors.password !== '') ? 'auth-form--input-error nbs-input' : 'nbs-input'}
                    />
                    {(errors.password !== '') ? <p className="auth-form--row--error">{errors.password}</p> : ''}
                </div>
                <div className="auth-form--row">
                    <label className="custom-checkbox bs-label">Zgadzam się z <Link to="/">warunkami korzystania.</Link>
                        <input 
                            type="checkbox"
                            name="terms_of_use"
                            onChange={this.handleInputChange}
                        />
                        <span className="custom-checkbox--checkmark"></span>
                    </label>
                    {(errors.register_type !== '') ? <p className="auth-form--row--error">{errors.register_type}</p> : ''}
                    {(errors.terms_of_use !== '') ? <p className="auth-form--row--error">{errors.terms_of_use}</p> : ''}
                </div>
                <div className="auth-form--row">
                    <button type="submit" className="nbs-btn nbs-btn--primary">Zarejestruj się</button>
                </div>
            </form> 
        )
    }
}

SignupForm.propTypes = {
    children: PropTypes.object,
    registerUser: PropTypes.func,
    auth: PropTypes.object,
    errors: PropTypes.object,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
});

export default withRouter(connect(mapStateToProps, { registerUser })(SignupForm));
