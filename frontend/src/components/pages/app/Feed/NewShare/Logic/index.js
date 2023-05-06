import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import $ from 'jquery';
import { socket } from '../../../../../../socket';
import cloudinary from 'cloudinary-jquery-file-upload';
import Resizer from 'react-image-file-resizer';

import icon_pin from '../../../../../../public/img/icons/pin.svg';
import dish_image from '../../../../../../public/img/layout/dish.jpg';
import icon_user from '../../../../../../public/img/icons/user-icon.svg';
import Icon from '../../../../../../public/icons/account';

import DiscoverSharesFooter from '../../../../../partials/Layout/DiscoverSharesFooter';

import schoolGraphic from './school.svg';
import successGraphic from './success.svg';
import LoadingBurger from '../../../../../partials/LoadingBurger';

class MainShares extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ns_name: '',
            ns_price: '',
            ns_active_to: '00:00',
            ns_descripton: '',
            ns_photo: null,

            school_id: null,
            school_name: null,
            school_city: null,
            school_street: null,
            upload_progress: 0,

            errors: {
                unexpected: '',
                ns_name: '',
                ns_price: '',
                ns_active_to: '',
                ns_descripton: '',
                image: ''
            }
        };

        this.showImagePreview = this.showImagePreview.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.price_keypress = this.price_keypress.bind(this);
        this.price_keyup = this.price_keyup.bind(this);
    }

    UNSAFE_componentWillMount() {
        if (!this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        }
    }
    
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        window.addEventListener("resize", this.updateDimensions);
        $('.fdns-container--right--offer--image').css('height', ($('.fdns-container--right--offer--image').width() - $('.fdns-container--right--offer--image').width() / 4) + "px");

        var current_hours = (new Date().getHours() + 2 <10?'0':'') + (new Date().getHours() + 2);
        var current_minutes = (new Date().getMinutes()<10?'0':'') + new Date().getMinutes();

        this.setState({
            ns_active_to: current_hours + ':' + current_minutes
        })

        axios.get(`${process.env.REACT_APP_GLOBAL_API_URL}/api/user/current/general`)
        .then(res => {
            if (res.data.school_id === null) {
                this.props.history.push('/feed/search-school');
            } else {
                this.setState({
                    school_id: res.data.school_id,
                    school_name: res.data.school_name,
                    school_city: res.data.school_city,
                    school_street: res.data.school_street,
                });           
                
                $('.fds-wrap--header--inner--content--loading').remove();
                $('.fds-wrap--header--inner--content').append('<h3>' + this.state.school_name + '</h3>');
                $('.fds-wrap--header--inner--content').append('<p>' + this.state.school_street + ', ' + this.state.school_city + '</p>');
            }
        });

        $('.fdns-container--right--float').css('left', $('.fdns-container--right').offset().left);
        $('.fdns-container--right--float').css('right', $(window).width() - ($('.fdns-container--right').offset().left + $('.fdns-container--right').outerWidth()));
    }

    price_keypress(event) {
        const current_target = event.target.value;
        if (((event.which != 46 || (event.which == 46 && current_target == '')) || current_target.indexOf('.') != -1) && (event.which < 48 || event.which > 57) ) {
            event.preventDefault();
        } else {
            if (current_target.split('.')[0].length + 1 > 3 && event.which !== 46) {
                if (current_target.length + 1 >= 3  && current_target.indexOf('.') == -1) {
                    event.preventDefault();
                }              
            }
        }
    }

    price_keyup(e) {
        var key = e.keyCode || e.charCode;
        if (key == 8 || key == 46) {
            return false;
        };

        let correctValue = e.target.value;

        if (correctValue.indexOf('.') !== -1) {
            if (correctValue.toString().split(".")[1].length === 1) {
                correctValue += '0'
            }

            if (correctValue.toString().split(".")[1].length > 2) {
                correctValue = correctValue.substring(0, correctValue.length - (correctValue.toString().split(".")[1].length - 2));
            }
        }

        this.setState({ ns_price: correctValue });        
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener("resize", this.updateDimensions);
    }

    handleScroll() {
        if ($('.fdns-container--left').offset().top + $('.fdns-container--left').height() < $('.fdns-container--right--item').offset().top + $('.fdns-container--right--item').height()) {
            $('.fdns-container--right--content').css('opacity', '0');
        } else {
            $('.fdns-container--right--content').css('opacity', '1');
        }
    }

    updateDimensions() {
        $('.fdns-container--right--float').css('left', $('.fdns-container--right').offset().left);
        $('.fdns-container--right--float').css('right', $(window).width() - ($('.fdns-container--right').offset().left + $('.fdns-container--right').outerWidth()));
    }

    showImagePreview(event) {
        // $('.fdns-container--form--row--photo-added').css('display', 'block');
        $('.fdns-container--form--row--submit').css('display', 'block');
        this.setState({
            [event.target.name]: event.target.value,
        });

        try {
            var reader = new FileReader();
            reader.onload = function(){
            var output = document.getElementById('fdns-added-photo-output');
            output.src = reader.result;

            $('.fdns-container--right--offer--image p').css('display', 'none');
            if ($('.fdns-container--right--offer--image img').length) {
                $('.fdns-container--right--offer--image img').attr('src', reader.result);
            } else {
                const previewImage = document.createElement('img');
                previewImage.src = reader.result;
                $('.fdns-container--right--offer--image').append(previewImage);
            }

            };
            reader.readAsDataURL(event.target.files[0]);
        } catch (err) {

        }
    }

    handleInputChange(e) {
        const current_target = [e.target.name].toString();
        
        this.setState({
            [e.target.name]: e.target.value,
        });        
    }

    submitForm(e) {
        e.preventDefault();
        if ($('#file-upload').prop('files')[0] === undefined) {
            this.setState({
                errors: {image: 'Proszę wybierz zdjęcie'}
            });
        } else if (this.state.ns_active_to < (new Date().getHours() + 2 <10?'0':'') + (new Date().getHours()) + ':' + (new Date().getMinutes()<10?'0':'') + new Date().getMinutes()) {
            this.setState({
                errors: {ns_active_to: 'Podaj poprawny czas zakończenia oferty.'}
            });
            $('html, body').animate({ scrollTop: $('.fdns-container--form form').scrollTop() }, 'slow');
        } else {
        $('.fdns-container--form--row--submit button').prop('disabled', true);
        $('.fdns-container--loading').css('display', 'block');
        $('.fdns-container--content').css('opacity', '0.2');
        $('html, body').animate({ scrollTop: $('.fdns-container--form form').scrollTop() }, 'slow');

        // var file = $('#file-upload').prop('files')[0];
        // var formData = new FormData();
        // formData.append("file", file);
        // formData.append("fileName", "offer");
        // formData.append("folder", "foodshare");
        // formData.append("publicKey", "public_XDF3xQo+u9sCogZ2TO3gsZ/M+9I=");
    
        // Let's get the signature, token and expire from server side
        // axios.get(`${process.env.REACT_APP_GLOBAL_API_URL}/api/auth/upload-auth`)
        //     .then((body) => {
        //         console.log(body);
                
        //         formData.append("signature", body.data.signature || "");
        //         formData.append("expire", body.data.expire || 0);
        //         formData.append("token", body.data.token);
    
        //         axios({
        //             url : "https://upload.imagekit.io/api/v1/files/upload",
        //             method : "POST",
        //             mimeType : "multipart/form-data",
        //             dataType : "json",
        //             data : formData,
        //             onUploadProgress: (progressEvent) => {
        //                 var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        //                 this.setState({ upload_progress: percentCompleted });
        //             },
        //             processData : false,
        //             contentType : false
        //         }).then((inserted_image) => {
                   
        //             axios.post(`${process.env.REACT_APP_GLOBAL_API_URL}/api/offers/share-new`, {
        //                 school_id: this.state.school_id,
        //                 ns_name: this.state.ns_name,
        //                 ns_price: this.state.ns_price,
        //                 ns_active_to: this.state.ns_active_to,
        //                 ns_description: this.state.ns_descripton,
        //                 image_path: inserted_image.data.filePath,
        //                 image_id: inserted_image.data.fileId
        //             })
        //                 .then(res => {
        //                     if(res.data['success']) {
        //                         $('.fdns-container--loading').css('display', 'none');
        //                         $('.fdns-container--content').css('opacity', '1');
        //                         $('.fdns-container--content').css('display', 'none');
        //                         $('.fdns-container--success').css('display', 'block');
        //                     } else {
        //                         $('.fdns-container--loading').css('display', 'none');
        //                         $('.fdns-container--content').css('opacity', '1');
        //                         $('.fdns-container--form--row--submit button').prop('disabled', false);

        //                         this.setState({ errors: res.data });
        //                     }
        //                 })
        //         }).catch((err) => {
        //             console.log(err);
        //         });
        //     });

        const data = new FormData();
        data.append('photo', $('#file-upload').prop('files')[0]);
        data.append('school_id', this.state.school_id);
        data.append('ns_name', this.state.ns_name);
        data.append('ns_price', this.state.ns_price);
        data.append('ns_active_to', this.state.ns_active_to);
        data.append('ns_description', this.state.ns_descripton);

        // data.append('photo', uri.replace('data&colon;image/png;base64,',''));
        axios.post(`${process.env.REACT_APP_GLOBAL_API_URL}/api/offers/share-new`, data, {onUploadProgress: (progressEvent) => {
            var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            this.setState({ upload_progress: percentCompleted });
        }})
            .then(res => {
                console.log(res);
                
                if(res.data['success']) {
                    $('.fdns-container--loading').css('display', 'none');
                    $('.fdns-container--content').css('opacity', '1');
                    $('.fdns-container--content').css('display', 'none');
                    $('.fdns-container--success').css('display', 'block');
                } else {
                    $('.fdns-container--loading').css('display', 'none');
                    $('.fdns-container--content').css('opacity', '1');
                    $('.fdns-container--form--row--submit button').prop('disabled', false);

                    this.setState({ errors: res.data });
                }
            })
        // if (1 == 0) {
        //     this.setState({
        //         errors: {ns_active_to: 'Podaj poprawny czas zakończenia oferty.'}
        //     });
        // } else {
        //     Resizer.imageFileResizer(
        //         $('#file-upload').prop('files')[0],
        //         600,
        //         1000,
        //         'PNG',
        //         100,
        //         0,
        //         uri => {
        //             data.append('photo', uri.replace('data&colon;image/png;base64,',''));
        //             axios.post(`${process.env.REACT_APP_GLOBAL_API_URL}/api/offers/share-new`, data, {onUploadProgress: (progressEvent) => {
        //                 var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        //                 this.setState({ upload_progress: percentCompleted });
        //             }, contentType: 'application/x-www-form-urlencoded' })
        //             .then(res => {
        //                 console.log(res);
                        
        //                 if(res.data['success']) {
        //                     $('.fdns-container--loading').css('display', 'none');
        //                     $('.fdns-container--content').css('opacity', '1');
        //                     $('.fdns-container--content').css('display', 'none');
        //                     $('.fdns-container--success').css('display', 'block');
        //                 } else {
        //                     $('.fdns-container--loading').css('display', 'none');
        //                     $('.fdns-container--content').css('opacity', '1');
        //                     $('.fdns-container--form--row--submit button').prop('disabled', false);
    
        //                     this.setState({ errors: res.data });
        //                 }
        //             })
        //         },
        //         'base64'
        //     );
        // }
        
        }
    }

    render() {

        const { errors } = this.state;

        return (
            <>
            <div className="fdns-container">
                <div className="fdns-container--left">
                    <section className="fdns-container--loading">
                        <div className="fdns-container--loading--box">
                            <div className="fdns-container--loading--text">
                                {this.state.upload_progress <= 50 ? <p>Twoja fota się przesyła ...</p> : null}
                                {this.state.upload_progress > 50 && this.state.upload_progress <= 90 ? <p>Już coraz bliżej ...</p> : null}
                                {this.state.upload_progress > 90 ? <p>Ostatnie formalności ...</p> : null}
                            </div>
                            <div className="fdns-container--loading--animation">
                                <LoadingBurger/>
                            </div>
                        </div>
                        <div className="fdns-container--loading--progress-bar">
                            <div className="fdns-container--loading--progress-bar--indicator" style={{ "width": this.state.upload_progress + "%" }}></div>
                        </div>
                    </section>

                    <section className="fdns-container--success">
                        <div className="fdns-container--success--inner">
                            <div className="fdns-container--success--image">
                                <img src={successGraphic}/>
                            </div>
                            <div className="fdns-container--success--text">
                                <h5>Pomyślnie dodano ofertę!</h5>
                            </div>
                        </div>
                        <div className="fdns-container--success--buttons">
                                <Link to="/feed" className="nbs-btn nbs-btn--primary">Wszystkie oferty</Link>
                                <Link to="/account/shares">Moje oferty</Link>
                        </div>
                    </section>

                    <section className="fdns-container--content">
                        <div className="fdns-container--content--inner">
                            <header className="fdns-container--header">
                                <div className="fdns-container--header--title">
                                    <h2>Podziel się</h2>
                                </div>
                                {/* <div className="fdns-container--header--image">
                                    <img src={schoolGraphic}/>
                                </div> */}
                            </header>
                            <div className="fdns-container--form">
                            <div className="fdns-container--form--header">
                                <div className="fdns-container--form--header--content">
                                    <h3>{this.state.school_name}</h3>
                                    <p className="bs-color--primary-light">{this.state.school_street}, {this.state.school_city}</p>
                                </div>
                            </div>
                            <form onSubmit={this.submitForm} autoComplete="off">

                                <div className="fdns-container--form--row">
                                    <label className="bs-label">Nazwa</label>
                                    <input 
                                        type="text"
                                        name="ns_name"
                                        placeholder="Kanapka z serem ..."
                                        onChange={this.handleInputChange}
                                        value={this.state.ns_name}
                                        className="nbs-input"
                                    />
                                    {(errors.ns_name !== '') ? <p className="auth-form--row--error">{errors.ns_name}</p> : ''}
                                </div>
                                <div className="fdns-container--form--row fdns-container--form--row--two">
                                    <div className="fdns-container--form--row--two--item">
                                        <label className="bs-label">Oferowana cena - zł</label>
                                        <input 
                                            type="text"
                                            name="ns_price"
                                            placeholder="Za darmo"
                                            onChange={this.handleInputChange}
                                            onKeyPressCapture={this.price_keypress}
                                            onKeyUpCapture={this.price_keyup}
                                            onPaste={(e) => (e.preventDefault())}
                                            value={this.state.ns_price}
                                            className="nbs-input"
                                            id="fdns-container--form--row--two--item--price"
                                        />
                                        {(errors.ns_price !== '') ? <p className="auth-form--row--error">{errors.ns_price}</p> : ''}
                                    </div>
                                    <div className="fdns-container--form--row--two--item">
                                        <label className="bs-label">Aktywne do</label>
                                        <input 
                                            type="time"
                                            name="ns_active_to"
                                            placeholder="Aktywne do"
                                            onChange={this.handleInputChange}
                                            value={this.state.ns_active_to}
                                            className="nbs-input timepicker"
                                        />
                                        {(errors.ns_active_to !== '') ? <p className="auth-form--row--error">{errors.ns_active_to}</p> : ''}
                                    </div>
                                </div>
                                <div className="fdns-container--form--row">
                                    <label className="bs-label">Opis</label>
                                    <textarea name="ns_descripton" placeholder="Kanapka z serem ..." onChange={this.handleInputChange} value={this.state.ns_descripton} className="bs-textarea"></textarea>
                                    {(errors.ns_descripton !== '') ? <p className="auth-form--row--error">{errors.ns_descripton}</p> : ''}
                                </div>
                                <div className="fdns-container--form--row-photo">
                                    <label htmlFor="file-upload" className="nbs-btn nbs-btn--primary">
                                        {this.state.ns_photo === null ? "Dodaj Zdjęcie" : "Zmień fote"}
                                    </label>
                                    <input id="file-upload" type="file" name="ns_photo" accept="image/*" onChange={this.showImagePreview.bind(this)} />
                                    {(errors.image !== '') ? <p className="auth-form--row--error">{errors.image}</p> : ''}
                                </div>
                                <div className="fdns-container--form--row">
                                    <div className="fdns-container--form--row--photo-added">
                                        <p>Dodane zdjęcie</p>
                                        <img id="fdns-added-photo-output"/>
                                    </div>
                                </div>
                                <div className="fdns-container--form--row fdns-container--form--row--submit fdns-container--form--row--submit--form">
                                    <button type="submit" className="nbs-btn nbs-btn--primary">Dodaj ofertę</button>
                                </div>

                            </form>
                            </div>
                        </div>
                    </section>

                </div>
                <div className="fdns-container--right">
                    <div className="fdns-container--right--float">
                        <div className="fdns-container--right--inner">
                            <div className="fdns-container--right--content">
                                
                                <div className="fdns-container--right--header">
                                    <h3>Podgląd</h3>
                                </div>
                                <div className="fdns-container--right--item">
                                    {/* <div className="fdns-container--right--offer--image">
                                        <p>Zdjęcie</p>
                                    </div>
                                    <div className="fdns-container--right--offer">
                                        <div className="fdns-container--right--offer--left">
                                            <div className="fdns-container--right--offer--details">
                                                <h3 className="bs-title bs-title--small">{ this.state.ns_name }</h3>
                                                <p><span>{ this.state.ns_price + "zł"}</span> | 15:00</p>
                                            </div>
                                        </div>
                                        <div className="fdns-container--right--offer--right">
                                            <div className="fdns-container--right--offer--right--phone">
                                                <p>{ this.props.auth.user.phone_number }</p>
                                            </div>
                                            <div className="fdns-container--right--offer--right--name">
                                                <p>{this.props.auth.user.first_name}</p>
                                                <Icon name="user"/>
                                            </div>
                                        </div>
                                    </div> */}
                                    <div className="fds-offers--list--item--image fdns-container--right--offer--image">
                                        <p>Zdjęcie</p>
                                    </div>
                                    <div className="fds-offers--list--item">
                                        <div className="fds-offers--list--item--left">
                                            <div className="fds-offers--list--item--details">
                                                <h3 className="bs-title bs-title--small">{(this.state.ns_name.length > 0 ? this.state.ns_name : "( Nazwa oferty )")}</h3>
                                                <p><i class="fas fa-tags"></i><span>{ this.state.ns_price == '' ? "Za darmo" : this.state.ns_price + "zł"}</span><i class="fas fa-clock"></i><span>{this.state.ns_active_to}</span></p>
                                            </div>
                                        </div>
                                        <div className="fds-offers--list--item--right">
                                            <div className="fds-offers--list--item--right--name">
                                                <p>{this.props.auth.user.first_name}</p>
                                                <Icon name="user"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>  

                            </div>
                        </div>
                    </div>
                    <div className="fdns-container--right--mobile fdns-container--form--row fdns-container--form--row--submit">
                        <button type="submit" className="nbs-btn nbs-btn--primary" onClick={this.submitForm}>Dodaj ofertę</button>
                    </div>
                </div>
            </div>
            <DiscoverSharesFooter/>
            </>
        )
    }
}

MainShares.propTypes = {
    children: PropTypes.object,
    auth: PropTypes.object,
    history: PropTypes.object,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

// export default withRouter(SignupForm);
export default withRouter(connect(mapStateToProps)(MainShares));
