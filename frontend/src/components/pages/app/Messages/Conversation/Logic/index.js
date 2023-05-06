import React, { Component, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import $ from 'jquery';
import { socket } from '../../../../../../socket';
import Moment from 'moment';

import Icon from '../../../../../../public/icons/chat';
import LoadingBurger from '../../../../../partials/LoadingBurger';
import BuddiesGraphic from '../../../../../../public/img/vectors/buddies.svg';

import { Parallax, Background } from 'react-parallax';

class Conversation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages_per_request: 20,
            width: 0, height: 0,
            section_choose: 0,
            writted_message: '',
            typingTimeout: 0,
            conv_id: 0,
            conversation: {},
            messages: [],
            loading_messages: true,
            pagination: true,
            current_pagination: 1,
            current_back_destination: '/inbox'
        };

        this.handleMessageWritting = this.handleMessageWritting.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    UNSAFE_componentWillMount() {
        if (!this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        }
    }

    componentWillUnmount(data) {
        socket.removeListener("MESSAGE_SENT");
        socket.removeListener("MESSAGE_VIEWED");
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.updateWindowDimensions);
        $('.mn-footer').css('display', 'block');
    }

    componentDidMount() {
        this.init_socket();
        $('.mn-footer').css('display', 'none');
        
        this.updateWindowDimensions();
        window.addEventListener('scroll', this.handleScroll);
        window.addEventListener('resize', this.updateWindowDimensions);

        this.setState({
            conv_id: this.props.match.params.id
        });

        if (this.props.location.state !== undefined) {
            this.setState({ 
                current_back_destination: this.props.location.state.current_back_destination
            });
        }

        $('.conv-container').css('margin-top', $('.mn-nav').height() + "px");
        $('.conv-container').css('padding-bottom', $('.conv-bottom-bar').height() + 20 + "px");

        axios.get(`${process.env.REACT_APP_GLOBAL_API_URL}/api/inbox/fetch-conversation`,{
            params: {
                convId: this.props.match.params.id
            }
        })
        .then(result => {
            this.setState({
                conversation: result.data.conversation[0]
            })
            
            if (result.data.conversation[0] != undefined) {

                axios.get(`${process.env.REACT_APP_GLOBAL_API_URL}/api/inbox/get-messages`,{
                    params: {
                        conv_id: this.props.match.params.id,
                        page: 1,
                        limit: this.state.messages_per_request
                    }
                })
                .then(result => {
                    const { conversation } = this.state;

                    this.setState({
                        messages: result.data.messages,
                        loading_messages: false
                    })
                    
                    if (this.state.messages != undefined && this.state.messages.length > 0) {
                        if (this.props.auth.user.id != this.state.messages.slice(-1)[0].sent_by) {
                            if (this.state.conversation.interested_id == this.props.auth.user.id) {
                                socket.emit('MESSAGE_VIEWED', {conv_id: conversation.conv_id, message_id: this.state.messages.slice(-1)[0].id, viewed_by: conversation.interested_id, who: 0, emit_to: conversation.offering_id});
                            } else {
                                socket.emit('MESSAGE_VIEWED', {conv_id: conversation.conv_id, message_id: this.state.messages.slice(-1)[0].id, viewed_by: conversation.offering_id, who: 1, emit_to: conversation.interested_id});
                            }
                        }
                    }
                    window.scrollTo(0,document.body.scrollHeight);
                })
            }
        })
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    init_socket() {
        socket.on('MESSAGE_SENT', (data) => {
            const { conversation } = this.state;

            this.setState(prevState => ({
                messages: [...(prevState.messages || []), data[0]]
            }));

            if (this.props.auth.user.id != data[0].sent_by) {
                if (this.state.conversation.interested_id == this.props.auth.user.id) {
                    socket.emit('MESSAGE_VIEWED', {conv_id: conversation.conv_id, message_id: data[0].id, viewed_by: conversation.interested_id, who: 0, emit_to: conversation.offering_id});
                } else {
                    socket.emit('MESSAGE_VIEWED', {conv_id: conversation.conv_id, message_id: data[0].id, viewed_by: conversation.offering_id, who: 1, emit_to: conversation.interested_id});
                }
            }

            window.scrollTo(0,document.body.scrollHeight);
        })

        socket.on('MESSAGE_VIEWED', (data) => {
            if (data.conv_id == this.state.conversation.conv_id) {
                if (data.who == 0) {
                    this.setState({ conversation: { ...this.state.conversation, interested_viewed: data.message_id} });
                } else {
                    this.setState({ conversation: { ...this.state.conversation, offering_viewed: data.message_id} });
                }
            }
        })
    }

    handleScroll(event) {
        if ($(window).scrollTop() <= 100 && this.state.loading_messages == false && this.state.pagination == true && this.state.messages_per_request > this.state.messages) {
            this.setState({ loading_messages: true });

            axios.get(`${process.env.REACT_APP_GLOBAL_API_URL}/api/inbox/get-messages`,{
                params: {
                    page: this.state.current_pagination + 1,
                    limit: 20,
                    conv_id: this.props.match.params.id
                }
            })
            .then(result => {
                if (result.data.pagination != undefined) {
                    this.setState({ pagination: false });
                    this.setState({ loading_messages: false });
                } else {
                    // window.scrollTo(0, document.getElementById('message-bubble-1').offsetTop);
                    this.setState({
                        messages: this.state.messages.concat(result.data.messages),
                        current_pagination: this.state.current_pagination + 1,
                        loading_messages: false
                    });
                    this.windowScrollTo(2000);
                    // if ($('#message-bubble-20').length) {
                    //     this.windowScrollTo($('#message-bubble-20').offset().top);
                    // }
                }
            })
        } 

        if (this.state.conversation != undefined && $(window).scrollTop() > ($('.conv-header--inner').offset().top) + $('.conv-header--inner').height() - 20) {
            $('.conv-topbar--offer').css('opacity', '1');
        } else {
            $('.conv-topbar--offer').css('opacity', '0');
        }
    }

    windowScrollTo(number) {
        $(window).scrollTop(number);
    }

    handleMessageWritting(e) {
        const current_target = [e.target.name].toString();
        this.setState({
            [e.target.name]: e.target.value,
        });

        if (e.target.value.trim().length > 0) {
            $('.conv-bottom-bar--input').addClass('conv-bottom-bar--input--active');
            $('.conv-bottom-bar--send').addClass('conv-bottom-bar--send--active');
        } else {
            $('.conv-bottom-bar--input').removeClass('conv-bottom-bar--input--active');
            $('.conv-bottom-bar--send').removeClass('conv-bottom-bar--send--active');
        }

    }

    handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            this.sendMessage();
        }
    }

    sendMessage() {
        const { state } = this;

        if (state.writted_message.trim() != "" || state.writted_message.length <= 255) {
            if (state.conversation.interested_id != this.props.auth.user.id) {
                socket.emit("MESSAGE_SENT", {convId: state.conv_id, sendingTo: state.conversation.interested_id, sentBy: this.props.auth.user.id, message: state.writted_message});
            } else {
                socket.emit("MESSAGE_SENT", {convId: state.conv_id, sendingTo: state.conversation.offering_id, sentBy: this.props.auth.user.id, message: state.writted_message});
            }

            this.setState({ writted_message: '' });
            $('.conv-bottom-bar--input').removeClass('conv-bottom-bar--input--active');
            $('.conv-bottom-bar--send').removeClass('conv-bottom-bar--send--active');
        }
    }

    render() {

        const { conversation, messages, loading_messages, writted_message } = this.state;        

        console.log(conversation);
        
        
        return (
            <>
            <div className="conv-topbar">
                <div className="conv-topbar--container">
                    {conversation != undefined ? 
                    <Link to={`/feed/offer/${conversation.offer_id}`}>
                    <div className="conv-topbar--offer">
                        <div className="conv-topbar--offer--image">
                            <img src={"https://res.cloudinary.com/dgzvc6fls/image/upload/v1575413544/" + conversation.offer_image}/>
                        </div>
                        <div className="conv-topbar--offer--info">
                            <div className="conv-topbar--offer--info--user">
                                <p>{conversation.offer_name == undefined ? "- -" : null}</p>
                                {this.props.auth.user.id == conversation.offering_id ? <p><span>Twoja oferta</span></p> : <p><span>{conversation.first_name}</span></p>}
                                    
                                    {/* <span>Dodał: </span>{conversation.offer_name == undefined ? "- -" : conversation.first_name}</p> */}
                            </div>
                            <div className="conv-topbar--offer--info--name">
                                <p>{conversation.offer_name == undefined ? "- - - -" : conversation.offer_name}</p>
                            </div>
                        </div>
                    </div></Link>: null}
                    <div className="conv-topbar--back">
                        <Link to={this.state.current_back_destination}><i class="fas fa-chevron-left"></i>{" powrót"}</Link>
                    </div>
                </div>
            </div>

            <div className="conv-container">
            {conversation == undefined ? 
                <div className="conv-container-notfound">
                    <div className="conv-container-notfound--box">
                        <div className="conv-container-notfound--warning">
                            <Icon name="chatgroup"/>
                            <p>Nie znaleźlismy takiej konwersacji...</p>
                            <Link to="/inbox" className="nbs-btn nbs-btn--primary">Wiadomości</Link>
                        </div>
                        <div className="conv-container-notfound--info">
                            <div className="conv-container-notfound--info--title">
                                <h5>Dlaczego nie widzisz konwersacji:</h5>
                            </div>
                            <ul>
                                <li>- Oferta się już zakończyła</li>
                                <li>- Taka konwersacja nigdy nie istniała</li>
                                <li>- Nie masz dostępu do konwersacji</li>
                            </ul>
                        </div>
                    </div>
                </div>
            : <>
                <div className="conv-header">
                    <div className="conv-header--inner">
                        <div className="conv-header--image">
                            <img src={"https://res.cloudinary.com/dgzvc6fls/image/upload/v1575413544/" + conversation.offer_image}/>
                        </div>
                        <div className="conv-header--overlay">
                            <div className="conv-header--info">
                                <h5>{conversation.offer_name == undefined ? "- - - -" : conversation.offer_name}</h5>
                                <p><i class="fas fa-tags"></i><span>{conversation.offer_price == undefined ? "- -" : conversation.offer_price == 0.00 ? "Za darmo" : conversation.offer_price + "zł"}</span> <i class="fas fa-clock"></i> <span>{conversation.offer_price == undefined ? "- -" : Moment(new Date(conversation.offer_available_to)).format("HH:mm")}</span> <i class="fas fa-user"></i> <span>{conversation.first_name == undefined ? "- -" : this.props.auth.user.id == conversation.offering_id ? "Twoja oferta" : conversation.first_name}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="conv-info">
                    <div className="conv-info--inner">
                        <div className="conv-info--image">
                            <img src={BuddiesGraphic}/>
                        </div>
                        <div className="conv-info--message">
                            <h5>Pamiętaj!</h5>
                            <p>Zachowaj kulturę podczas rozmowy ;)</p>
                        </div>
                    </div>
                </div>

                {loading_messages ? <div className="conv-loading">
                    <div className="conv-loading--box">
                        <div className="conv-loading--animation">
                            <LoadingBurger/>
                        </div>
                        <div className="conv-loading--text">
                            <p>Ładowanie wiadomości...</p>
                        </div>
                    </div>
                </div> : null}

                <div className="conv-messages">
                    {messages !== undefined && conversation != undefined ?
                        messages.sort((a, b) => a.id - b.id).map(
                            (item, i) => <div className="conv-messages--row" key={i} id={"message-bubble-" + (i + 1)}>
                                            <div className={item.sent_by == this.props.auth.user.id ? "conv-messages--right":"conv-messages--left"}>
                                                <div className={`conv-messages--date ${item.sent_by == this.props.auth.user.id ? "conv-messages--date--right":"conv-messages--date--left"}`}>
                                                    {/* <p>{Moment(item.created_at).format("D/MM HH:mm")}</p> */}
                                                    <p>{Moment(item.created_at).format("HH:mm")}</p>
                                                </div>
                                                <div className={`conv-messages--content ${item.sent_by == this.props.auth.user.id ? "conv-messages--content--right":"conv-messages--content--left"}`}>
                                                    <p>{item.message}</p>
                                                    {conversation.interested_id == this.props.auth.user.id && item.id == conversation.offering_viewed ? <div className="conv-messages--content--viewed"><i class="fas fa-eye"></i>{item.message.length >= 9 ? <span>wyświetlone</span> : null}</div> : null}
                                                    {conversation.offering_id == this.props.auth.user.id && item.id == conversation.interested_viewed ? <div className="conv-messages--content--viewed"><i class="fas fa-eye"></i>{item.message.length >= 9 ? <span>wyświetlone</span> : null}</div> : null}
                                                </div>

                                                {conversation.interested_id == this.props.auth.user.id && item.id == conversation.offering_viewed ? <div className="conv-messages--viewed"><p>wyświetlone <i class="fas fa-check-circle"></i></p></div> : null}
                                                {conversation.offering_id == this.props.auth.user.id && item.id == conversation.interested_viewed ? <div className="conv-messages--viewed"><p>wyświetlone <i class="fas fa-check-circle"></i></p></div> : null}
                                            </div>
                                        </div>
                        )
                    : null}
                </div></>}
            </div>
            {conversation == undefined ? null : <>
            {writted_message.length > 255 ? 
            <div className="conv-bottom-bar--issue">
                <div className="conv-bottom-bar--issue--inner">
                    <div className="conv-bottom-bar--issue--content">
                        <p>Wiadomośc nie może zawierać więcej niż 255 znaków.</p>
                    </div>
                </div>
            </div> : null}
            <div className="conv-bottom-bar">
                <div className="conv-bottom-bar--inner">
                    <div className="conv-bottom-bar--input">
                        <input
                            type="text"
                            name="writted_message"
                            placeholder="Twoja wiadomość ..."
                            autoComplete="off"
                            onChange={this.handleMessageWritting}
                            value={this.state.writted_message}
                            onKeyPress={this.handleKeyPress}
                        />
                    </div>
                    <div className="conv-bottom-bar--send">
                        {/* <button className="bs-color--primary-light" onClick={this.sendMessage}>Wyślij</button> */}
                        <button className="bs-color--primary-light" onClick={this.sendMessage}><i class="fas fa-paper-plane"></i></button>
                        {/* <button><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 64 64" enable-background="new 0 0 64 64"><g><g><path fill="none" stroke="#000000" stroke-width="4" stroke-miterlimit="10" d="M11.5,34.3"/></g></g><g><g><path d="M61.1,1.1L1.3,24.2c-1.5,0.6-1.8,2.7-0.5,3.7L13,37l4,26l15-12l12.9,9.4c1.2,0.9,2.9,0.3,3.3-1.1L63.9,3.7 C64.4,2,62.8,0.5,61.1,1.1z M19,50.2L18,39L57,8L22,43L19,50.2z M23,52l3-6l2,2L23,52z"/></g></g></svg></button> */}
                    </div>
                </div>
            </div>
            </>}</>
        )
    }
}

Conversation.propTypes = {
    children: PropTypes.object,
    auth: PropTypes.object,
    history: PropTypes.object,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default withRouter(connect(mapStateToProps)(Conversation));
