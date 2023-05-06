import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { findDOMNode } from 'react-dom';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import $ from 'jquery';
import gsap from 'gsap';
import { socket } from '../../../../../../socket';
import update from 'immutability-helper';
import 'jquery-ui';
import 'jquery-ui/themes/base/core.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/themes/base/selectable.css';
import 'jquery-ui/ui/core';
import 'jquery-ui/ui/widgets/selectable';
import 'jquery-ui-bundle';
import 'jquery-ui-bundle/jquery-ui.css';

import LoadingBurger from '../../../../../partials/LoadingBurger';
import Icon from '../../../../../../public/icons/chat';

class Inbox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            section_choose: 0,
            conversations: [],
            loading_conversations: true
        };

        this.change_section = this.change_section.bind(this);
        this.segmented_control = this.segmented_control.bind(this);
    }

    UNSAFE_componentWillMount() {
        if (!this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        }
    }

    componentWillUnmount() {
        socket.removeListener("MESSAGE_SENT");
    }

    componentDidMount() {
        this.init_socket();
        this.segmented_control();

        const inbox_choose = localStorage.getItem('_inbox_type');
        if (inbox_choose != undefined) {
            this.setState({
                section_choose: inbox_choose
            })
            this.fetch_conversations(inbox_choose);
        } else {
            this.fetch_conversations(0);
       
        }
    }

    fetch_conversations(type) {
        axios.get(`${process.env.REACT_APP_GLOBAL_API_URL}/api/inbox/fetch-inbox`,{
            params: {
                type: type
            }
        })
        .then(result => {
            this.setState({
                conversations: result.data.conversations,
                loading_conversations: false      
            })
        })
    }

    init_socket() {
        socket.on('MESSAGE_SENT', (data) => {
            if (this.state.conversations.length > 0) {
                const message = data[0];
                const { conversations } = this.state;
                const current_conversation = conversations.findIndex((obj => obj.conv_id == message.conv_id));
                
                this.setState(prevState => {
                    const conversations = [...prevState.conversations];
                    conversations[current_conversation] = { ...conversations[current_conversation], message_id: message.id,message: message.message, sent_by: message.sent_by };
                    return { conversations };
                });
            }
        })
    }

    segmented_control() {
        $(".inbox-choose--toggler").each(function(){
        
            var io = $(this).data("io"),
                $opts = $(this).find(".io-options"),
                $clon = $opts.clone(),
                $span = $clon.find("div"),
                width = $opts.width()/2;
            
            $span.css('width', '100%');
            $(this).append($clon);
            
            function swap(x) {
                $clon.stop().animate({left:  x}, 300);
                $span.stop().animate({left: -x}, 300);
                $(this).data("io", x===0 ? 0 : 1);
            }
        
            $opts.on("click", function(){
                swap( $clon.position().left>0 ? 0 : width );
            });

            if(localStorage.getItem('_inbox_type') == 1) {
                const x = $clon.position().left>0 ? 0 : width;
                $clon.stop().animate({left:  x}, 0);
                $span.stop().animate({left: -x}, 0);
            }
            
            // Read and set initial predefined data-io
            if(!!io)$opts.trigger("click");
        });
    }

    change_section(event, choose) {
        this.setState({
            section_choose: choose,
            conversations: [],
            loading_conversations: true
        });
        localStorage.setItem('_inbox_type', choose);
        this.fetch_conversations(choose);
    }

    render() {
    
        return (
            <div className="inbox">
                <header className="inbox-header">
                    <h2>Skrzynka wiadomości</h2>
                </header>
                <div className="inbox-choose">
                    <div class="inbox-choose--toggler" data-io="0">
                        <div class="io-options">
                            <div onClick={(e) => {this.change_section(e, 0)}}>Wiadomości</div>
                            <div onClick={(e) => {this.change_section(e, 1)}}>Twoje zapytania</div>
                        </div>
                    </div>
                </div>
                <div className="inbox-container">
                    {this.state.loading_conversations == true ?
                    <div className="inbox-container--loading">
                        <LoadingBurger/>
                    </div>
                    : null} 

                    {this.state.conversations.length == 0 && this.state.loading_conversations == false ? 
                    <div className="inbox-container--empty">
                        <Icon name="chatconversation"/>
                        <p>Nie masz żadnych konwersacji.</p>
                    </div>
                    : null}

                    {this.state.conversations.sort((a, b) => b.message_id - a.message_id).map((conv, index) => {
                        return <Link to={`/inbox/${conv.conv_id}`} className="inbox-item">
                            <div className="inbox-item--image">
                                <img src={"https://res.cloudinary.com/dgzvc6fls/image/upload/v1575413544/" + conv.offer_image}/>
                            </div>
                            <div className="inbox-item--details">
                                <div className="inbox-item--details--left">
                                    <div className="inbox-item--details--offer">
                                        <h5>{conv.offer_name} <span>{conv.first_name} - {conv.offer_price + "zł"}</span></h5>
                                    </div>
                                    <div className="inbox-item--details--message">
                                        {conv.sent_by == this.props.auth.user.id ? <p>{"Ty: " + conv.message}</p>: <p>{conv.first_name + ": "}{conv.message}</p>}
                                    </div>
                                </div>
                                <div className="inbox-item--details--right">
                                    <p>{conv.sent_at}</p>
                                </div>
                            </div>
                        </Link>
                    })}
                </div>
            </div>
        )
    }
}

Inbox.propTypes = {
    children: PropTypes.object,
    auth: PropTypes.object,
    history: PropTypes.object,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default withRouter(connect(mapStateToProps)(Inbox));
