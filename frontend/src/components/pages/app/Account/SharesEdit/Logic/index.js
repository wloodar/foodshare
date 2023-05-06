import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import $ from 'jquery';
import moment from 'moment';

import LoadingBurger from '../../../../../partials/LoadingBurger';
import pizzaSharingSvg from './pizza-sharing.svg';
import foodGraphic from '../food.svg';
import deletedGraphic from './deleted.svg';
import Icon from '../../../../../../public/icons/account';

import { socket } from '../../../../../../socket';

class AccountYourShares extends Component {

    constructor(props) {
        super(props);
        this.state = {
            offer: {},
            isLoading: true,
            delete_error: false,
            deleted: false,
            errors: {
                unexpected: '',
                ns_name: '',
                ns_price: '',
                ns_active_to: '',
                ns_descripton: '',
            }
        };

        this.updateOffer = this.updateOffer.bind(this);
        this.deleteOffer = this.deleteOffer.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.closeNotification = this.closeNotification.bind(this);
        this.generatePickupCode = this.generatePickupCode.bind(this);
    }

    UNSAFE_componentWillMount() {
        if (!this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        }
    }

    componentDidMount() {

        axios.get(`${process.env.REACT_APP_GLOBAL_API_URL}/api/offers/get/edit/${this.props.match.params.id}`)
            .then(res => {
                this.setState({
                    offer: res.data.offer,
                    isLoading: false
                })

                if (this.props.location.state != undefined && this.props.location.state.show_pickup) {
                    window.scrollTo(0,$('.acd-shares-pickup').offset().top);
                }
            })

        $(document).on('keydown', '#fdns-container--form--row--two--item--price', function(e){
            var input = $(this);
            var oldVal = input.val();
            var regex = new RegExp(input.attr('pattern'), 'g');
            
            setTimeout(function(){
                var newVal = input.val();
                if(!regex.test(newVal)){
                input.val(oldVal); 
                }
            }, 0);
        });
    }

    closeNotification() {
        this.setState({
            delete_error: false
        })
    }

    handleInputChange(e) {
        this.setState({
            offer: {
                  ...this.state.offer,
                  [e.target.name]: e.target.value
            }
        })
    }

    updateOffer(e) {
        e.preventDefault();
        const { offer } = this.state;

        const data = {
            offer_id: offer.id,
            ns_name: offer.name,
            ns_price: offer.price,
            ns_active_to: offer.available_to,
            ns_description: offer.description
        }

        axios.post(`${process.env.REACT_APP_GLOBAL_API_URL}/api/offers/edit`, data)
            .then(res => {
                if(res.data['success']) {
                    alert('success');
                    this.props.history.push('/account/shares');
                } else {
                    this.setState({ errors: res.data });
                }
            })
    }

    deleteOffer(e) {
        e.preventDefault();

        $('.acd-shares-content').css('opacity', '0.2');
        axios.post(`${process.env.REACT_APP_GLOBAL_API_URL}/api/offers/delete`, {offer_id: this.state.offer.id})
            .then(res => {
                $('.acd-shares-content').css('opacity', '1');
                if (res.data.error == true) {
                    this.setState({
                        delete_error: true
                    })
                } else {
                    $('html, body').animate({ scrollTop: $('.acd-shares').scrollTop() }, 'slow');
                    this.setState({
                        deleted: true
                    })
                }
            })
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

    render() {

        const { isLoading, offer, errors, delete_error, deleted } = this.state;

        return (
            <>
            <div className="acd-shares">
                {isLoading === true ? <div className="ac-shares--loading">
                    <LoadingBurger/>
                </div> : null}

                {deleted === true ? <div className="acd-shares--delete">
                    <div className="acd-shares--delete--image">
                        <img src={deletedGraphic}/>
                    </div>
                    <div className="acd-shares--delete--text">
                        <h5>Pomyślnie usunięto ofertę.</h5>
                        <Link to="/account/shares" className="nbs-btn nbs-btn--primary">Twoje oferty</Link>
                    </div>
                </div>: null}

                {delete_error == true ? 
                <div className="bs-notification" onClick={this.closeNotification}>
                    <div className="bs-notification--inner">
                        <div className="bs-notification--content">
                            <p>Wystąpił nieoczekiwany błąd podczas usuwania oferty. Spróbuj jescze raz.</p>
                            <button onClick={this.closeNotification}>Rozumiem</button>
                        </div>
                    </div>
                </div>
                :null}

                {offer === undefined && isLoading === false && deleted === false ? <div className="ac-shares-empty">
                    <div className="ac-shares-empty--box">
                        <img src={pizzaSharingSvg}/>
                        <h2>Nie znaleźliśmy takiej oferty ...</h2>
                        <Link to="/account/shares" className="nbs-btn nbs-btn--primary">Moje Oferty</Link>
                    </div>
                </div> : null}

                {offer !== undefined && isLoading === false && deleted === false ? 
                    <div className="acd-shares-content">
                        <div className="acd-shares-content--title">
                            <h5><span>Edytuj:</span>{offer.name}</h5>
                        </div>
                        <div className="acd-shares-content--image">
                            <img src={"https://res.cloudinary.com/dgzvc6fls/image/upload/v1575413544/" + offer.img_url}/>
                        </div>
                        <div className="acd-shares-content--form">
                            <form onSubmit={this.submitForm} autoComplete="off">

                                <div className="fdns-container--form--row">
                                    <label className="bs-label">Nazwa</label>
                                    <input 
                                        type="text"
                                        name="name"
                                        placeholder="Kanapka z serem ..."
                                        onChange={this.handleInputChange}
                                        value={offer.name}
                                        className="nbs-input"
                                    />
                                    {(errors.ns_name !== '') ? <p className="auth-form--row--error">{errors.ns_name}</p> : ''}
                                </div>
                                <div className="fdns-container--form--row fdns-container--form--row--two">
                                    <div className="fdns-container--form--row--two--item">
                                        <label className="bs-label">Oferowana cena - zł</label>
                                        <input 
                                            type="number"
                                            name="price"
                                            placeholder="Za darmo"
                                            onChange={this.handleInputChange}
                                            value={offer.price}
                                            className="nbs-input"
                                            pattern="^\d*(\.\d{0,2})?$"
                                            id="fdns-container--form--row--two--item--price"
                                        />
                                        {(errors.ns_price !== '') ? <p className="auth-form--row--error">{errors.ns_price}</p> : ''}
                                    </div>
                                    <div className="fdns-container--form--row--two--item">
                                        <label className="bs-label">Aktywne do</label>
                                        <input 
                                            type="time"
                                            name="available_to"
                                            placeholder="Aktywne do"
                                            onChange={this.handleInputChange}
                                            value={"15:00"}
                                            className="nbs-input timepicker"
                                        />
                                        {(errors.ns_active_to !== '') ? <p className="auth-form--row--error">{errors.ns_active_to}</p> : ''}
                                    </div>
                                </div>
                                <div className="fdns-container--form--row">
                                    <label className="bs-label">Opis</label>
                                    <textarea name="description" placeholder="Kanapka z serem ..." onChange={this.handleInputChange} value={offer.description} className="bs-textarea"></textarea>
                                    {(errors.ns_descripton !== '') ? <p className="auth-form--row--error">{errors.ns_descripton}</p> : ''}
                                </div>
                                {/* <div className="fdns-container--form--row fdns-container--form--row--buttons">
                                    <button type="button" className="nbs-btn nbs-btn--delete" onClick={this.deleteOffer}>Usuń</button>
                                    <button type="submit" className="nbs-btn nbs-btn--primary" onClick={this.updateOffer}>Edytuj</button>
                                </div> */}
                                <div className="acd-shares-content--buttons">
                                    {/* <button type="button" className="bs-color--primary-light"><Icon name="receive"/><span>Odbiór</span></button> */}
                                    <button type="button" className="bs-color--red" onClick={this.deleteOffer}><Icon name="trash"/><span>Usuń</span></button>
                                    <button type="button" className="bs-color--primary" onClick={this.updateOffer}><Icon name="edit"/><span>Edytuj</span></button>
                                </div>
                            </form>
                            {/* <div className="acd-shares-content--form--back">
                                <Link to="/account/shares">{'< Wróć do swoich ofert'}</Link>
                            </div> */}
                        </div>
                        <div className="acd-shares-pickup">
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

                        </div>  
                    </div>
                : null}

                <div className="acd-shares-back">
                    <Link to="/account/shares" className="nbs-btn nbs-btn--primary">{'< Twoje oferty'}</Link>
                </div>
            </div>
            </>
        )
    }
}

AccountYourShares.propTypes = {
    children: PropTypes.object,
    auth: PropTypes.object,
    history: PropTypes.object,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

// export default withRouter(SignupForm);
export default withRouter(connect(mapStateToProps)(AccountYourShares));
