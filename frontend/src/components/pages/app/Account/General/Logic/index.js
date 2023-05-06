import React, { Component } from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import axios from 'axios';
import $ from 'jquery';

import LoadingBurger from '../../../../../partials/LoadingBurger';
import BasicNotification from '../../../../../partials/BasicNotification';
import { changeUserInfo, logoutUser } from '../../../../../../redux/actions/authentication';

import { socket } from '../../../../../../socket';

class AccountGeneral extends Component {

    constructor(props) {
        super(props);
        this.state = {
            is_waiting: true,
            first_name: '',
            last_name: '',
            email: '',
            school_name: '',
            school_error: false,
            updated_user: {
                first_name: '',
                phone_number: '',
                email: '',
            }
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.changeSchoolAction = this.changeSchoolAction.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    UNSAFE_componentWillMount() {
        if (!this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        }
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        axios.get(`${process.env.REACT_APP_GLOBAL_API_URL}/api/user/current/general`)
            .then(res => {
                this.setState(res.data);
                this.setState({ is_waiting: false });
            })

            
            const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
            const currentTheme = localStorage.getItem('theme');
            
            if (currentTheme) {
                document.documentElement.setAttribute('data-theme', currentTheme);
              
                if (currentTheme === 'dark') {
                    toggleSwitch.checked = true;
                }
            }
            
            function switchTheme(e) {
                if (e.target.checked) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    localStorage.setItem('theme', 'dark');
                }
                else {        document.documentElement.setAttribute('data-theme', 'light');
                      localStorage.setItem('theme', 'light');
                }    
            }
            
            toggleSwitch.addEventListener('change', switchTheme, false);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    handleInputChange(e) {
        const current_target = [e.target.name].toString();
        const updated_target = "updated_user." + [e.target.name].toString() 
        
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    submitForm(e) {
        e.preventDefault();
        const state = this.state;
        const userCredentials = {
            first_name: state.first_name,
            phone_number: state.phone_number,
            email: state.email
        }

        axios.post(`${process.env.REACT_APP_GLOBAL_API_URL}/api/user/current/credentials/update`, userCredentials)
            .then(res => {
                console.log(res);
            })
    }

    changeSchoolAction() {
        $('.ac-general--form--row--school').css('opacity', '0.3');
        $('.ac-general--form--row--school button').attr('disabled', true);
        axios.post(`${process.env.REACT_APP_GLOBAL_API_URL}/api/user/current/school/update`, {school_id: null})
            .then(res => {
                $('.ac-general--form--row--school').css('opacity', '1');
                $('.ac-general--form--row--school button').attr('disabled', false);
                if(res.data['message'] === true) {
                    this.props.changeUserInfo(res.data["token"]);
                    this.props.history.push('/feed/search-school');
                } else {
                    this.setState({
                        school_error: true
                    })
                }
            })
    }
 
    onLogout(e) {
        e.preventDefault();
        this.props.logoutUser(this.props.history);
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        this.props.history.push({
            pathname: '/',
            state: { logout: true, flash_text: 'Pomyślnie wylogowano.' }
        })
    }

    render() {

        const { is_waiting, school_error } = this.state;

        return (
            <>
            {school_error == true ? 
                <BasicNotification message={"Przed zmianą szkoły musisz zakończyć swoje dotychczasowe oferty podzielenia się."}/>
            :null}
            <div className="ac-general ac-wrap--content-margin">
                <Helmet>
                    <title>Ustawienia profilu - ShareFood</title>
                </Helmet>
                <div className="ac-general--form">
                    {is_waiting ? <div className="ac-general--form--loading"><LoadingBurger/></div> : null}
                    <div className="ac-general--form--row--title">
                        <h5 className="bs-title bs-title--medium">Twoje dane</h5>
                    </div>
                    <form onSubmit={this.submitForm} autoComplete="off">

                        <div className="ac-general--form--row">
                            <label className="bs-label">Imię</label>
                            <input 
                                type="text"
                                name="first_name"
                                placeholder="Stefan"
                                onChange={this.handleInputChange}
                                value={this.state.first_name}
                                className="nbs-input"
                            />
                        </div>
                        <div className="ac-general--form--row">
                            <label className="bs-label">Nazwisko</label>
                            <input 
                                type="text"
                                name="last_name"
                                placeholder="000000000"
                                onChange={this.handleInputChange}
                                value={this.state.last_name}
                                className="nbs-input"
                            />
                        </div>
                        <div className="ac-general--form--row">
                            <label className="bs-label">Adres email</label>
                            <input 
                                type="email"
                                name="email"
                                placeholder="stefan@poczta.com"
                                onChange={this.handleInputChange}
                                value={this.state.email}
                                className="nbs-input"
                            />
                        </div>
                        <div className="ac-general--form--row">
                            <button type="submit" className="nbs-btn nbs-btn--primary" onClick={this.submitForm.bind(this)}>Zapisz zmiany</button>
                        </div>

                        <div className="ac-general--form--row--title">
                            <h5 className="bs-title bs-title--medium">Szkoła</h5>
                        </div>
                        <div className="ac-general--form--row ac-general--form--row--school">
                            <label className="bs-label">Szkoła</label>
                            {this.state.school_name === null ? (
                                <Link to="/feed/search-school" style={{float: "left", marginTop: "0"}} className="nbs-btn nbs-btn--primary">Znajdź szkołe</Link>
                            ) : (
                                <><input 
                                    type="text"
                                    name="email"
                                    defaultValue={this.state.school_name}
                                    className="nbs-input"
                                    readOnly
                                />
                                <button type="button" className="nbs-btn nbs-btn--delete" onClick={this.changeSchoolAction.bind(this)}>Zmień szkołe</button></>
                            )}
                        </div>
                    </form>
                </div>
                <div className="ac-general-settings">
                    <div className="ac-general--form--row--title">
                        <h5 className="bs-title bs-title--medium">Ustawienia ogólne</h5>
                    </div>
                    <div className="ac-general-settings--switch">
                        <div class="theme-switch-wrapper">
                            <p><i class="fas fa-moon"></i> Tryb ciemny</p>
                            <label class="theme-switch" for="checkbox">
                                <input type="checkbox" id="checkbox" />
                                <div class="slider round"></div>
                            </label>
                        </div>
                    </div>
                    <div className="ac-general-settings--link">
                        <p><i class="fas fa-key"></i>Logowanie</p>
                        <Link to="#">Zmień hasło</Link>
                    </div>
                    <div className="ac-general-settings--link ac-general-settings--logout">
                        <button onClick={this.onLogout.bind(this)}>Wyloguj się</button>
                    </div>
                </div>
            </div>
            </>
        )
    }
}

AccountGeneral.propTypes = {
    children: PropTypes.object,
    auth: PropTypes.object,
    history: PropTypes.object,
    logoutUser: PropTypes.func,
    changeUserInfo: PropTypes.func,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default withRouter(connect(mapStateToProps, { changeUserInfo, logoutUser })(AccountGeneral));
