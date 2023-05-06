import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { GET_ERRORS, SET_CURRENT_USER } from './types';
import setAuthToken from '../setAuthToken';
import { socket, connectPromise, resetSocket } from '../../socket';

export const registerUser = (user, history) => dispatch => {
    axios.post(`${process.env.REACT_APP_GLOBAL_API_URL}/api/auth/signup`, user)
            .then(res => {
                if (!res.data['message']) {
                    dispatch({
                        type: GET_ERRORS,
                        payload: res.data,
                    });
                } else {
                    dispatch({
                        type: GET_ERRORS,
                        payload:{},
                    });
                }
            })
};

export const loginUser = (user) => dispatch => {
    axios.post(`${process.env.REACT_APP_GLOBAL_API_URL}/api/auth/login`, user)
            .then(res => {
                if(res.data['success'] === undefined) {
                    dispatch({
                        type: GET_ERRORS,
                        payload: res.data,
                    });
                } else {
                    const { token } = res.data;
                    localStorage.setItem('jwtToken', token);
                    setAuthToken(token);
                    const decoded = jwt_decode(token);
                    socket.emit("USER_LOGIN", {userid: decoded.id});
                    dispatch(setCurrentUser(decoded, {}));
                }
            })
};

export const requestPasswordChange = (data) => dispatch => {
    axios.post(`${process.env.REACT_APP_GLOBAL_API_URL}/api/auth/password/reset`, data)
            .then(res => {
                dispatch({
                    type: GET_ERRORS,
                    payload:{},
                });
            })
}

export const changeUserInfo = (data) => dispatch => {
    const token = data;
    localStorage.setItem('jwtToken', token);
    setAuthToken(token);
    const decoded = jwt_decode(token);
    dispatch(setCurrentUser(decoded, {}));
}

export const setCurrentUser = (decoded, sock) => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded,
        socket: sock
    };
};

export const logoutUser = (history) => dispatch => {
    socket.emit("USER_LOGOUT", {userid: jwt_decode(localStorage.getItem('jwtToken')).id});
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
    dispatch(setCurrentUser({}));
}

