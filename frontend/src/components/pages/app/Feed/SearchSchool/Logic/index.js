import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';

import $ from 'jquery';

import { socket } from '../../../../../../socket';
import { changeUserInfo } from '../../../../../../redux/actions/authentication';

import icon_pin from '../../../../../../public/img/icons/pin.svg';
import schoolImage from './school.svg';

class AppLayout extends Component {

    constructor(props) {
        super(props);
        this.state = {
            schools: [
                {
                    "id": 5,
                    "name": "IV Liceum Ogólnokształcące w Toruniu im. Tadeusza Kościuszki",
                    "address": "Warszawska 1/5, 87-100 Toruń"
                },
                {
                    "id": 4,
                    "name": "Zespół Szkół Mechanicznych Elektrycznych i Elektronicznych im. prof. Sylwestra Kaliskiego w Toruniu",
                    "address": "Świętego Józefa 26, 87-100 Toruń"
                }
            ],
            search_school: '',
        };

        this.moveSearchBarTop = this.moveSearchBarTop.bind(this);
        this.moveSearchBarDown = this.moveSearchBarDown.bind(this);
        this.find_school = this.find_school.bind(this);
        this.choosedSchool = this.choosedSchool.bind(this);
    }

    UNSAFE_componentWillMount() {
        if (!this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        }
    }

    componentDidMount() {
        if (this.props.auth.user.school_id !== null) {
            this.props.history.push('/feed');
        }
    }

    choosedSchool(id) {
        axios.post(`${process.env.REACT_APP_GLOBAL_API_URL}/api/user/current/school/update`, {school_id: id})
            .then(res => {
                if(res.data['message'] === true) {
                    this.props.changeUserInfo(res.data["token"]);
                    this.props.history.push('/feed');
                } else {
                    alert(res.data['message']);
                }
            })
    }

    moveSearchBarTop(e) {
        $('.aps-wrap--inner').css('top', '30%');
        if ($.trim(e.target.value).length > 0) {
            $('.bs-search--results').css('opacity', '1');
            $('.bs-search--results').css('visibility', 'visible');
            $('.aps-wrap--content').css('margin-bottom', $('.bs-search--results--absolute').height() + 27 + "px");
        }
    }
    
    moveSearchBarDown() {
        $('.aps-wrap--inner').css('top', '50%');
        $('.bs-search--results').css('opacity', '0');
        $('.bs-search--results').css('visibility', 'hidden');
        $('.aps-wrap--content').css('margin-bottom', '');
    }

    find_school(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });

        if ($.trim(e.target.value).length > 0) {
            $('.bs-search--results').css('opacity', '1');
            $('.bs-search--results').css('visibility', 'visible');
            $('.aps-wrap--content').css('margin-bottom', $('.bs-search--results--absolute').height() + 27 + "px");
            
        } else {
            $('.bs-search--results').css('opacity', '0');
            $('.bs-search--results').css('visibility', 'hidden');
            $('.aps-wrap--content').css('margin-bottom', '');
        }
    } 

    render() {

        return (
            <div className="aps-wrap">
                <div className="aps-wrap--image">
                    <img src={schoolImage}/>
                </div>
                <div className="aps-wrap--content">
                    <div className="aps-wrap--inner">
                        <div className="aps-wrap--header">
                            <h5>Znajdź swoją szkołe</h5>
                            <Link to="/feed/add-school">Nie znalazłeś swojej szkoły?</Link>
                        </div>
                        <div className="aps-wrap--search">
                            <label>
                                <input 
                                    type="text"
                                    name="search_school"
                                    placeholder="Wpisz nazwę szkoły"
                                    value={this.state.search_school}
                                    id="n_find_school"
                                    onFocus={this.moveSearchBarTop}
                                    onBlur={this.moveSearchBarDown}
                                    onChange={this.find_school.bind(this)}
                                    autoComplete="off"
                                />
                            </label>
                            <div className="bs-search--results">
                            <div className="bs-search--results--absolute">
                                <ul>
                                    {this.state.schools.map((item, i) => {
                                        return <li key={i} onClick={(e) => this.choosedSchool(item.id)}>
                                                    <div className="bs-search--results--item">
                                                        <div className="bs-search--results--item--icon">
                                                            <img src={icon_pin}/>
                                                        </div>
                                                        <div className="bs-search--results--item--content">
                                                            <h5>{item.name}</h5>
                                                            <p>{item.address}</p>
                                                        </div>  
                                                    </div>
                                                </li>
                                    })}
                                    <li>
                                        <div className="bs-search--results--item bs-search--results--item--alert">
                                            <p>Ograniczony wybór szkół ze względu na prowadzenie testów aplikacji.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

AppLayout.propTypes = {
    children: PropTypes.object,
    auth: PropTypes.object,
    history: PropTypes.object,
    changeUserInfo: PropTypes.func,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

// export default withRouter(SignupForm);
export default withRouter(connect(mapStateToProps, { changeUserInfo })(AppLayout));
