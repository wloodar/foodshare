import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import $ from 'jquery';
import moment from 'moment';
import { socket } from '../../../../../../socket';

import icon_user_white from '../../../../../../public/img/icons/user-icon-white.svg';
import graphic_success from '../../../../../../public/img/vectors/success.svg';
import MakeNewShareFooter from '../../../../../partials/Layout/MakeNewShareFooter';
import icon_user from '../../../../../../public/img/icons/user-icon.svg';
import Icon from '../../../../../../public/icons/account';
import Icon_basics from '../../../../../../public/icons/basics';
import BasicNotification from '../../../../../partials/BasicNotification';
import LoadingBurger from '../../../../../partials/LoadingBurger';

import icon_user_black from '../user-icon.svg';
import icon_verified from '../verified.png';
import image_sharingpizza from '../pizza-sharing.svg';

class MainSharesDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            offer: {
                phone_number: '000000000'
            },
            current_user_offer: false,
            loading_offer: true,
            fatal_error: false,
            loading: false,
            writted_pickup_code: '',
            pickup_rejected: '',
            pickup_consent_wait: false,
            pickup_response: 0
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.writeMessage = this.writeMessage.bind(this);
        this.generatePickupCode = this.generatePickupCode.bind(this);
        this.checkPickupCode = this.checkPickupCode.bind(this);
    }

    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
            pickup_rejected: '',
            pickup_response: 0
        });
    }

    UNSAFE_componentWillMount() {
        if (!this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        }
    }

    componentWillUnmount() {
        // $('.mn-nav').removeClass('mn-nav--transparent');
        socket.removeListener("PICKUP_REQUEST_REJECTED");
        socket.removeListener("PICKUP_CONSENT_REQUEST");
        socket.removeListener("PICKUP_CONSENT_RESPONSE");
        window.removeEventListener('scroll', this.handleScroll);
        if (this.state.offer == undefined) {
            $('.mn-nav--left h2 a').css('color', '');
        }
    }

    componentDidMount() {
        this.init_socket();
        // $('.mn-nav').addClass('mn-nav--transparent');
        window.addEventListener('scroll', this.handleScroll);
        this.bottomBarLogic();

        axios.get(`${process.env.REACT_APP_GLOBAL_API_URL}/api/offers/get/exact/${this.props.match.params.id}`)
            .then(res => {        
                if (res.data.offer == undefined) {
                    $('.mn-nav--left h2 a').css('color', '#333');
                }
                if (res.data.offer != undefined && res.data.offer.shared_by == this.props.auth.user.id) {
                    this.setState({
                        offer: res.data.offer,
                        current_user_offer: true,
                        loading_offer: false
                    })
                } else {
                    this.setState({
                        offer: res.data.offer,
                        current_user_offer: false,
                        loading_offer: false
                    })
                }
                
            })

        $('.fdsd-container--image').css('height', $('.fdsd-container--image').width() + "px");
        $(window).resize(() => {
            $('.fdsd-container--image').css('height', $('.fdsd-container--image').width() + "px");
        });
    }

    bottomBarLogic() {
        
    }

    writeMessage() {
        const { offer } = this.state;
        if (this.state.offer.conv_id != null) {
            // this.props.history.push(`/inbox/${this.state.offer.conv_id}`);
            this.props.history.push({
                pathname: `/inbox/${this.state.offer.conv_id}`,
                state: { current_back_destination: `/feed/offer/${this.props.match.params.id}` }
            })
        } else {
            this.setState({ loading: true })
            axios.post(`${process.env.REACT_APP_GLOBAL_API_URL}/api/inbox/create-conversation`, {
                offer_id: offer.id,
                offering_id: offer.shared_by,
                interested_id: this.props.auth.user.id
            })
                .then(res => {     
                    if (res.data.message) {
                        this.props.history.push({
                            pathname: `/inbox/${res.data.conv_id}`,
                            state: { current_back_destination: `/feed/offer/${this.props.match.params.id}` }
                        })
                    } else {
                        this.setState({
                            loading: false,
                            fatal_error: true
                        })
                    }
                })
        }           
    }

    init_socket() {
        socket.on('PICKUP_REQUEST_REJECTED', (data) => {
            $('.fdsd-content--pickup--form').css('opacity', '1');
            $('.fdsd-content--pickup--form button').attr('disabled', false);

            if (data.reject_reason == 1) {
                this.setState({ pickup_rejected: 'Podany kod odbioru jest nieprawidłowy.', writted_pickup_code: '' });
            } else if (data.reject_reason == 2) {
                this.setState({ pickup_rejected: 'Osoba, która wygenerowała ten kod odbioru musi mieć włączona aplikacje.' });
            }
        });

        socket.on('PICKUP_CONSENT_REQUEST', (data) => {
            if (data.requested_by == this.props.auth.user.id) {
                $('.fdsd-content--pickup--form').css('opacity', '1');
                $('.fdsd-content--pickup--form button').attr('disabled', false);
                this.setState({ pickup_consent_wait: true });
            }
        });

        socket.on('PICKUP_CONSENT_RESPONSE', (data) => {
            $('.fdsd-content--pickup--form').css('opacity', '1');
            $('.fdsd-content--pickup--form button').attr('disabled', false);
            this.setState({ pickup_consent_wait: false, pickup_response: data.response, writted_pickup_code: ''});
        });
    }

    handleScroll() {
        if ($(window).scrollTop() > 20) {
            // $('.mn-nav').removeClass('mn-nav--transparent');
        } else {
            // $('.mn-nav').addClass('mn-nav--transparent');
        }
    }

    generatePickupCode() {
        $('.acd-shares-pickup--generate').css('display', 'none');
        $('.acd-shares-pickup--loading').css('display', 'block');

        axios.post(`${process.env.REACT_APP_GLOBAL_API_URL}/api/offers/pickup/generate-code`, {offer_id: this.state.offer.id})
            .then(res => {
                $('.acd-shares-pickup--loading').css('display', 'none');
                if (res.data.error != undefined) {

                } else {
                    const active_to = new Date(res.data.generated_at);
                    active_to.setMinutes(active_to.getMinutes() + 15);
                    
                    $('.acd-shares-pickup--code p').text(res.data.code);
                    $('.acd-shares-pickup--time p span').text(moment(active_to).format('HH:mm'));
                    this.setState({ offer: { ...this.state.offer, pickup_code: res.data.code, pickup_code_generated_at: res.data.generated_at} });
                    $('.acd-shares-pickup--active').css('display', 'block');
                    console.log(this.state.offer);
                    
                }
            })
    }

    checkPickupCode() {
        $('.fdsd-content--pickup--form').css('opacity', '0.3');
        $('.fdsd-content--pickup--form button').attr('disabled', true);
        const { offer } = this.state;
        socket.emit("PICKUP_REQUEST_CHECK", {offer_id: offer.id, shared_by: offer.shared_by, requested_by: this.props.auth.user.id, code: this.state.writted_pickup_code, requested_at: Date.now()});
    }

    render() {

        const { offer, current_user_offer, loading_offer, pickup_rejected, pickup_consent_wait, pickup_response } = this.state;
        
        return (
            <>
            {this.state.fatal_error == true ? 
                <BasicNotification message={"Wystąpił nieoczekiwany błąd. Spróbuj ponownie."}/>
            :null}

            {this.state.loading ? 
            <div className="fdsd-container--loading">
                <div className="fdsd-container--loading--box">
                    <LoadingBurger/>
                </div>
            </div> : null}

            {offer != undefined ? <>
            <div className="fdsd-wrap">
                <div className="fdsd-container">
                    {/* <header className="fdsd-container--header" style={{backgroundImage: `url(https://res.cloudinary.com/dgzvc6fls/image/upload/v1575413544/${offer.img_url})`}}>
                        <div className="fdsd-container--header--overlay">

                            <div className="fdsd-container--header--overlay--inner">
                                <div className="fdsd-container--header--overlay--inner--box">
                                    <h2><span>
                                    <img src={icon_user_white}/><p>{current_user_offer ? "Twoja oferta" : offer.first_name}</p>
                                    </span>{offer.name}</h2>
                                </div>
                            </div>

                        </div>
                    </header> */}
                    <header className="fdsd-container--header">
                        <div className="fdsd-container--header--inner" style={{backgroundImage: `url(https://res.cloudinary.com/dgzvc6fls/image/upload/v1575413544/${offer.img_url})`}}>
                            <div className="fdsd-container--header--box">
                                <h2><span>
                                <img src={icon_user_white}/><p>{current_user_offer ? "Twoja oferta" : offer.first_name}</p>
                                </span>{offer.name}</h2>
                            </div>      
                        </div>
                    </header>
                    <main className="fdsd-content">
                        <div className="fdsd-content--info">
                            <section className="fdsd-section">
                                <div className="fdsd-section--header">
                                    <h3>Informacje o ofercie</h3>
                                </div>
                                <div className="fdsd-section--basic">

                                    <div className="fdsd-section--basic--row">
                                        <div className="fdsd-section--basic--icon">
                                            <i class="fas fa-signature"></i> Nazwa
                                        </div>
                                        <div className="fdsd-section--basic--info">
                                            <p>{offer.name}</p>
                                        </div>
                                    </div>
                                    <div className="fdsd-section--basic--row">
                                        <div className="fdsd-section--basic--icon">
                                            <i class="fas fa-tags"></i> Cena
                                        </div>
                                        <div className="fdsd-section--basic--info">
                                            <p>{ offer.price == 0.00 ? "Za darmo" : offer.price + "zł"}</p>
                                        </div>
                                    </div>
                                    {offer.description != '' ? 
                                    <div className="fdsd-section--basic--row">
                                        <div className="fdsd-section--basic--icon">
                                            <i class="fas fa-info-circle"></i> Opis
                                        </div>
                                        <div className="fdsd-section--basic--info">
                                            <p>{offer.description}</p>
                                        </div>
                                    </div> : null}
                                    <div className="fdsd-section--basic--row">
                                        <div className="fdsd-section--basic--icon">
                                            <i class="fas fa-clock"></i> Czas zakończenia oferty
                                        </div>
                                        <div className="fdsd-section--basic--info">
                                            <p>{moment(new Date(offer.available_to)).format("HH:mm")}</p>
                                        </div>
                                    </div>

                                </div>
                            </section>
                            <section className="fdsd-section">
                                <div className="fdsd-section--header">
                                    <h3>Wybrane zdjęcie </h3>
                                </div>
                                <div className="fdsd-section--preview-image">
                                    <img src={"https://res.cloudinary.com/dgzvc6fls/image/upload/v1575413544/" + offer.img_url}/>
                                </div>
                            </section>
                            {current_user_offer == false ? <section className="fdsd-section">
                                <div className="fdsd-section--header">
                                    <h3>Kontakt</h3>
                                </div>
                                <div className="fdsd-section--contact">
                                    <p>Zaciekawiła ciebie ta oferta? Świetnie! Wyślij wiadomość do osoby, która stworzyła tą ofertę aby dowiedzieć sie więcej lub umówić się na odbiór.</p>
                                    <button onClick={this.writeMessage}>Napisz wiadomość <Icon name="mail"/></button>
                                </div>
                            </section> : null}
                        </div>
                        {loading_offer == false ? ( 
                        <div className="fdsd-content--order">
                            {current_user_offer ? <div className="acd-shares-pickup" style={{ marginTop: "0" }}>
                                <div className="acd-shares-pickup--header">
                                    <h2>Odbiór oferty</h2>
                                </div>
                                <div className="acd-shares-pickup--loading">
                                    <LoadingBurger/>
                                    <p>Generuje kod odbioru...</p>
                                </div>
                                {offer.pickup_code == null || new Date(offer.pickup_code_generated_at).setMinutes(new Date(offer.pickup_code_generated_at).getMinutes() + 15) < new Date() ? (<div className="acd-shares-pickup--generate">
                                    <div className="acd-shares-pickup--info">
                                        <p>Znalazłeś osobę zainteresowaną twoją ofertą? Wygeneruj kod odbioru i poproś drugą osobę, aby weszła w tą ofertę i wybrała opcje "Odbiór". Wystarczy, że podasz jej ten kod i ty potwierdzisz na swoim telefonie. Kod ważny będzie przez 15 minut.</p>
                                    </div>
                                    <button onClick={this.generatePickupCode}>Wygeneruj kod odbioru</button>
                                </div> ) : (

                                <div className="acd-shares-pickup--active">
                                    <div className="acd-shares-pickup--info">
                                        <p>Poniżej znajduje się wygenerowany kod odbioru, który będzie aktywny przez następne 15 minut. Wystarczy podać osobie odbierającej ten kod i potweirdzić na swoim telefonie.</p>
                                    </div>
                                    <div className="acd-shares-pickup--code">
                                        <p>{offer.pickup_code}</p>
                                    </div>
                                    <div className="acd-shares-pickup--time">
                                        <p>Aktywny do: <span>{moment(new Date(offer.pickup_code_generated_at).setMinutes(new Date(offer.pickup_code_generated_at).getMinutes() + 15)).format('HH:mm')}</span></p>
                                    </div>
                                </div> )}

                            </div>  : <div className="fdsd-content--pickup">

                                    {pickup_response == 2 ? <div className="fdsd-content--pickup--succeed">
                                        <img src={graphic_success}/>
                                        <h5>Gratulacje! Oferta została pomyślnie odebrana.</h5>
                                    </div> : <>

                                    <div className="fdsd-content--pickup--header">
                                        <h2>Odbierz ofertę</h2>
                                    </div>
                                    
                                    <div className="fdsd-content--pickup--about">
                                        <p>Jeżeli jesteś zainteresowany tą ofertą i chcesz zlecić odbiór, <button onClick={this.writeMessage}>skontaktuj się</button> z osobą, która ją utworzyła, ustalcie godzine i miejsce odbioru. Następnie przy spotkaniu, poproś aby wygenerowała kod odbioru tej konkretnej oferty i ci go podała oraz w dalszym ciągu miała włączoną aplikacje aby potwierdzić transakcje.</p>
                                    </div>

                                    {pickup_consent_wait ? <div className="fdsd-content--pickup--wait">
                                        <LoadingBurger/>
                                        <p>oczekiwanie na potwierdzenie odbioru</p>
                                    </div> : <>
                                    <div className="fdsd-content--pickup--form">
                                        <input
                                            type="text"
                                            name="writted_pickup_code"
                                            placeholder="Kod odbioru ..."
                                            className="nbs-input"
                                            autoComplete="off"
                                            value={this.state.writted_pickup_code}
                                            onChange={this.handleInputChange}
                                        />
                                        <button type="button" onClick={this.checkPickupCode}>Potwierdź</button>
                                    </div>
                                    {pickup_rejected !== '' ? <div className="fdsd-content--pickup--form--error"><p>{pickup_rejected}</p></div> : null}</>}</>}
                                    {pickup_response == 1 ? <div className="fdsd-content--pickup--form--error"><p>Osoba, która zarządza tą ofertą odrzuciła prośbę odbioru. Dogadajcie się i spróbuj jeszcze raz.</p></div> : null}


                            </div>}


                        </div> ) : null}
                    </main>
                </div>
            </div>
            <div className="fdsd-footer">
            
            </div>
            <div className="fdsd-bottombar">
                <div className="fdsd-bottombar--content">
                    <div className="fdsd-bottombar--back">
                        <Link to="/feed" className="nbs-btn nbs-btn--primary">{'< oferty'}</Link>
                    </div>
                    <div className="fdsd-bottombar--info">
                        <div className="fdsd-bottombar--info--content">
                            <div className="fdsd-bottombar--info--user">
                                {/* <img src={icon_user}/> */}
                                <p>{loading_offer ? " - - " : current_user_offer ? "Twoja oferta":offer.first_name}</p>
                            </div>
                            <div className="fdsd-bottombar--info--message">
                                {loading_offer ? "" : current_user_offer ? <Link to={`/account/shares/${offer.id}`}>Edytuj ofertę <Icon name="edit"/></Link> : <button onClick={this.writeMessage}>Napisz wiadomość <Icon name="mail"/></button>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>  
            </>: <div className="fdsd-notfound">
                <div className="conv-container-notfound">
                    <div className="conv-container-notfound--box">
                        <div className="conv-container-notfound--warning">
                            <Icon_basics name="emptybox"/>
                            <p>Nie znaleźlismy takiej oferty...</p>
                            <Link to="/feed" className="nbs-btn nbs-btn--primary">Oferty</Link>
                        </div>
                        <div className="conv-container-notfound--info">
                            <div className="conv-container-notfound--info--title">
                                <h5>Dlaczego nie widzisz oferty:</h5>
                            </div>
                            <ul>
                                <li>- Oferta już się zakończyła</li>
                                <li>- Oferta została usunięta</li>
                                <li>- Minął czas do kiedy oferta była aktualna</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>}
            <MakeNewShareFooter/>
            </>
        )
    }
}

MainSharesDetails.propTypes = {
    children: PropTypes.object,
    auth: PropTypes.object,
    history: PropTypes.object,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

// export default withRouter(SignupForm);
export default withRouter(connect(mapStateToProps)(MainSharesDetails));
