import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cloneDeep from 'lodash.clonedeep';

import { registerUser } from '../../../../../redux/actions/authentication';

class SignupForm extends Component {

    constructor() {
        super();
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            errors: {
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

    handleInputChange(e) {
        const current_target = [e.target.name].toString();

        this.setState({
            [e.target.name]: e.target.value,
        });

        if (!isNaN(e.target.value)) { 
            // if ([e.target.name] === "first_name") { this.state.errors[e.target.name] = 'Please enter your first name'; } 
            // if ([e.target.name] === "first_name") { this.setState({errors: [e.target.name] = 'Please enter your first name'}); } 
            // if ([e.target.name] === "first_name") {  }
            // if ([e.target.name] === "last_name") { this.state.errors[e.target.name] = 'Please enter your last name'; }
            // if ([e.target.name] === "email") { this.state.errors[e.target.name] = 'Please enter your email address'; }
            // if ([e.target.name] === "password") { this.state.errors[e.target.name] = 'Please enter your password'; }
            // if ([e.target.name] == "terms_of_use") { this.state.errors[e.target.name] = 'You must agreee to our terms of use' }

            if (current_target === "first_name") { this.setErrorMessage(current_target, 'Please enter your first name'); } 
            if (current_target === "last_name") { this.setErrorMessage(current_target, 'Please enter your last name'); } 
            if (current_target === "email") { this.setErrorMessage(current_target, 'Please enter your email address'); } 
            if (current_target === "password") { this.setErrorMessage(current_target, 'Please enter your password'); } 
            if (current_target === "terms_of_use") { this.setErrorMessage(current_target, 'You must agreee to our terms of use'); } 
        } else { this.setErrorMessage(current_target, ''); }

    }

    setErrorMessage(target_name, message) {
        const errors = cloneDeep(this.state.errors);

        errors[target_name] = message;

        this.setState({ errors }, () => {
            console.log(this.state);
        });
    }

    submitForm(e) {
        e.preventDefault();


    }

    render() {

        const { errors } = this.state;

        return (
            <form onSubmit={this.submitForm} autoComplete="off">
                <div className="auth-form--row auth-form--row--two">

                    <div className="auth-form--row--two--item">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="first_name"
                            placeholder="Eg. Jakub"
                            onChange={this.handleInputChange}
                            value={this.state.first_name}
                            className={(errors.first_name !== '') ? 'auth-form--input-error' : ''}
                        />
                        {(errors.first_name !== '') ? <p className="auth-form--row--error">{errors.first_name}</p> : ''}
                    </div>
                    <div className="auth-form--row--two--item">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            placeholder="Eg. Kowalski"
                            onChange={this.handleInputChange}
                            value={this.state.last_name}
                            className={(errors.last_name !== '') ? 'auth-form--input-error' : ''}
                        />
                        {(errors.last_name !== '') ? <p className="auth-form--row--error">{errors.last_name}</p> : ''}
                    </div>

                </div>
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
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Minimum 6 characters"
                        onChange={this.handleInputChange}
                        value={this.state.password}
                        className={(errors.password !== '') ? 'auth-form--input-error' : ''}
                    />
                    {(errors.password !== '') ? <p className="auth-form--row--error">{errors.password}</p> : ''}
                </div>
                <div className="auth-form--row">
                    <label>I agree to the <Link to="/">terms of use</Link>
                        <input 
                            type="checkbox"
                            name="terms_of_use"
                            onChange={this.handleInputChange}
                        />
                        <span className="custom-checkbox--checkmark"></span>
                    </label>
                    {(errors.terms_of_use !== '') ? <p className="auth-form--row--error">{errors.terms_of_use}</p> : ''}
                </div>
                <div className="auth-form--row">
                    <button type="submit">Sign Up</button>
                </div>
                <div className="auth-form--row--bottom-text">
                    <p>Already a member? <Link to="/login">Login now</Link></p>
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
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, { registerUser })(SignupForm);
