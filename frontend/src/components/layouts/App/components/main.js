import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { socket } from '../../../../socket';

class AppLayout extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            pickup_request: true,
            pickup_details: {}
        };

        this.pickup_response = this.pickup_response.bind(this);
    }

    UNSAFE_componentWillMount() {
        if (!this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        }
    }

    componentWillUnmount() {
        // socket.removeListener("PICKUP_CONSENT_REQUEST");
    }

    componentDidMount() {
        // $('.pickup-notify--wrapper').css('bottom', - $('.pickup-notify--wrapper').height());
        $(window).scroll(() => {
            if ($(window).scrollTop() > 20) {
                // $('.mn-nav').css('border-bottom', '1px solid #f4f4f4');
            } else {
                // $('.mn-nav').css('border-bottom', '0');
            }
        });

        socket.on('PICKUP_CONSENT_REQUEST', (data) => {
            if (data.offer_by == this.props.auth.user.id) {
                this.setState({
                    pickup_request: true,
                    pickup_details: {offer_id: data.offer_id, requested_by: data.requested_by}
                });
                $('.pickup-notify').removeClass('pickup-notify--active');
                $('.pickup-notify--wrapper').css('bottom', - $('.pickup-notify--wrapper').height());
                setTimeout(() => {
                    $('.pickup-notify').addClass('pickup-notify--active');
                    $('.pickup-notify--wrapper').css('bottom', 0);
                }, 100);                
            }
        });
    }

    pickup_response(response) {
        socket.emit("PICKUP_CONSENT_RESPONSE", {response: response, requested_by: this.state.pickup_details.requested_by, offer_id: this.state.pickup_details.offer_id});
        this.setState({
            pickup_request: true
        });
        $('.pickup-notify').removeClass('pickup-notify--active');
        $('.pickup-notify--wrapper').css('bottom', - $('.pickup-notify--wrapper').height());
    }

    render() {

        return (
            <>
                {this.state.pickup_request == true ? <div className="pickup-notify">
                    {/* <div className="pickup-notify--inner">
                        <div className="pickup-notify--header">
                            <h2><span>Food</span>Share</h2>
                            <p>Odbiór</p>
                        </div>
                        <div className="pickup-notify--content">
                            <div className="pickup-notify--title">
                                <h5>Jakub chciałby odebrać ofertę: <span>Kanapka z szynką i serem.</span></h5>
                            </div>
                            <div className="pickup-notify--image">
                                <img src="https://res.cloudinary.com/dgzvc6fls/image/upload/v1584465250/sharefood/shares/ww0l53f6di7cro2lsbv9.jpg"/>
                            </div>
                            <div className="pickup-notify--offer-info">
                                <p>Cena: <span>2zł</span> | Aktywna do: <span>15:40</span></p>
                            </div>
                        </div>
                        <div className="pickup-notify--bottom-bar">
                            <div className="pickup-notify--bottom-bar--inner">
                                <button className="nbs-btn bs-color--red" onClick={() => this.pickup_response(1)}>Rezygnuj</button>
                                <button className="nbs-btn bs-color--primary" onClick={() => this.pickup_response(2)}>Akceptuj</button>
                            </div>
                        </div>
                    </div> */}

                    <div className="pickup-notify--wrapper">
                        <div className="pickup-notify--inner">
                            <div className="pickup-notify--header">
                                <h5>Odbiór oferty</h5>
                                <p>Stefan</p>
                            </div>
                            <div className="pickup-notify--offer">
                                <div className="pickup-notify--offer--image">
                                    <img src="https://res.cloudinary.com/dgzvc6fls/image/upload/v1575413544/foodshare/shares/spcufwzlpt8b0jyorv9j"/>
                                </div>
                                <div className="pickup-notify--offer--details">
                                    <h4>Kanapka z szynką i serem.</h4>
                                    <p><i class="fas fa-tags"></i><span>2.00 zł</span><i class="fas fa-clock"></i><span>15:40</span></p>
                                </div>
                            </div>
                            {/* <div className="pickup-notify--user">
                                <p>Odbiera: Stefan</p>
                            </div> */}
                            <div className="pickup-notify--actions">
                                <button className="nbs-btn" onClick={() => this.pickup_response(1)}>Rezygnuj</button>
                                <button className="nbs-btn bs-color--primary" onClick={() => this.pickup_response(2)}>Potwierdź</button>
                            </div>
                        </div>
                    </div>
                </div> : null}
            </>
        )
    }
}

AppLayout.propTypes = {
    children: PropTypes.object,
    auth: PropTypes.object,
    history: PropTypes.object,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

// export default withRouter(SignupForm);
export default withRouter(connect(mapStateToProps)(AppLayout));
