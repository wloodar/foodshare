import React, { Component } from 'react';
import { Router ,Route, Switch, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import jwt_decode from 'jwt-decode';
import ScrollToTop from './functions/ScrollToTop';
import setAuthToken from './redux/setAuthToken';
import { setCurrentUser, logoutUser } from './redux/actions/authentication';
import SocketContext from './socket-context';
import socketIOClient from 'socket.io-client';

// import socketIOClient from "socket.io-client";
import { socket, connectPromise } from './socket.js';

import './public/css/main.min.css';
import store from './redux/store';

import ConversationLayout from './components/layouts/Conversation';
import MainLayout from './components/layouts/Main';
import AuthLayout from './components/layouts/Auth';

import LandingPage from './components/pages/other/LandingPage';
import SignUpPage from './components/pages/auth/SignUp';
import LoginPage from './components/pages/auth/Login';
import PasswordReset from './components/pages/auth/PasswordReset';
import PasswordResetChange from './components/pages/auth/PasswordResetChange';

// main app 
import AppLayout from './components/layouts/App';
import WelcomePage from './components/pages/app/Others/WelcomePage';
import Feed from './components/pages/app/Feed/MainShares';
import FeedDetails from './components/pages/app/Feed/ShareDetails';
import FeedSearchSchool from './components/pages/app/Feed/SearchSchool';
import FeedAddNewSchool from './components/pages/app/Feed/AddNewSchool';
import NewShare from './components/pages/app/Feed/NewShare';
import Account_General from './components/pages/app/Account/General';
import Account_Your_Shares from './components/pages/app/Account/Shares';
import Account_Your_Shares_Edit from './components/pages/app/Account/SharesEdit';
import Account_Statisctics from './components/pages/app/Account/Statistics';

// messages
import Inbox_Main from './components/pages/app/Messages/Inbox';
import Conversation from './components/pages/app/Messages/Conversation';

// admin panel
import { connect } from 'net';

connectPromise(0).then(
  res => {
      socket.on('connect', () => {
          // alert('Połączono ponownie');
          window.location.reload();
      });
  
      socket.io.on('connect_error', function(err) {
          // alert('Wystąpił problem z połączeniem z serwerem');
      });
  }
)

if (localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);
  const decoded = jwt_decode(localStorage.jwtToken);
  store.dispatch(setCurrentUser(decoded, {}));

  if (socket !== null) {
      socket.emit("USER_LOGIN", {userid: decoded.id});
  }

  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
      store.dispatch(logoutUser());
      window.location.href = '/login';
  }
}

const AppRoute = ({ component: Component, layout: Layout, ...rest }) => (
  <ScrollToTop>
    <Route {...rest} render={props => (
      <Layout>
        <Component {...props} />
      </Layout>
    )} />
  </ScrollToTop>
)
 
class App extends Component {

  constructor() {
      super();
      this.state = {
          socket: null
      };

      // socket = socketIOClient('http://127.0.0.1:7000/');
  }

  componentDidMount() {
      // let socket = io('http://127.0.0.1:7000');
      // this.setState({socket});
      
      // socket.on('connect', () => {
      //     console.log('works');
      // });
      const currentTheme = localStorage.getItem('theme');
            
      if (currentTheme) {
          document.documentElement.setAttribute('data-theme', currentTheme);
      }
  }

  UNSAFE_componentWillReceiveProps(nexProps) {
      console.log(nexProps);
  }

  render() {

    return(
    // <SocketContext.Provider value={this.state.socket}>
      <Provider store={store}>
        <Router history={createBrowserHistory()}>
          <Switch>
            <AppRoute exact path="/" layout={MainLayout} component={LandingPage} />
            <AppRoute exact path="/signup" layout={AuthLayout} component={SignUpPage} />
            <AppRoute exact path="/login" layout={AuthLayout} component={LoginPage} />
            <AppRoute exact path="/reset-password" layout={MainLayout} component={PasswordReset} />
            <AppRoute exact path="/reset-password-change/:id" layout={MainLayout} component={PasswordResetChange} />

            {/* main app */}
            <AppRoute exact path="/welcome" layout={AppLayout} component={WelcomePage} />

            <AppRoute exact path="/feed" layout={AppLayout} component={Feed} />
            <AppRoute exact path="/feed/offer/:id" layout={AppLayout} component={FeedDetails} />
            <AppRoute exact path="/feed/search-school" layout={AppLayout} component={FeedSearchSchool} />
            <AppRoute exact path="/feed/add-school" layout={AppLayout} component={FeedAddNewSchool} />
            <AppRoute exact path="/share" layout={AppLayout} component={NewShare} />
            <AppRoute exact path="/account" layout={AppLayout} component={Account_General} />
            <AppRoute exact path="/account/shares" layout={AppLayout} component={Account_Your_Shares} />
            <AppRoute exact path="/account/shares/:id" layout={AppLayout} component={Account_Your_Shares_Edit} />
            <AppRoute exact path="/account/statistics" layout={AppLayout} component={Account_Statisctics} />

            {/* Messages */}
            <AppRoute exact path="/inbox" layout={AppLayout} component={Inbox_Main} />
            {/* <AppRoute exact path="/inbox/:id" layout={ConversationLayout} component={Conversation} /> */}
            <AppRoute exact path="/inbox/:id" layout={AppLayout} component={Conversation} />

          </Switch>
        </Router>
      </Provider>
    // </SocketContext.Provider>
    )
  }
}

export default App;
