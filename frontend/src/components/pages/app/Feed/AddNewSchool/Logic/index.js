import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import $ from 'jquery';
import { socket } from '../../../../../../socket';

class AddNewSchool extends Component {

    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

    UNSAFE_componentWillMount() {
        if (!this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        }
    }

    componentDidMount() {
        
    }

    render() {
    
        return (
            <>

            </>
        )
    }
}

AddNewSchool.propTypes = {
    children: PropTypes.object,
    auth: PropTypes.object,
    history: PropTypes.object,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default withRouter(connect(mapStateToProps)(AddNewSchool));
