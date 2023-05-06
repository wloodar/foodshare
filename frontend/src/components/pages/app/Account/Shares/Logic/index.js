import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import moment from 'moment';

import LoadingBurger from '../../../../../partials/LoadingBurger';
import pizzaSharingSvg from '../img/pizza-sharing.svg';

import { socket } from '../../../../../../socket';

class AccountYourShares extends Component {

    constructor(props) {
        super(props);
        this.state = {
            offers: [],
            loadingOffers: true
        };
    }

    componentDidMount() {
        axios.get(`${process.env.REACT_APP_GLOBAL_API_URL}/api/offers/get/all-user`,{
            params: {
                school_id:  this.props.auth.user.school_id
            }
            })
            .then(result => {
                this.setState({
                    offers: result.data.offers,
                    loadingOffers: false
                });

                console.log(this.state);
                
            })
    }

    render() {

        const { offers } = this.state;
        
        return (
            <>
            <div className="ac-shares ac-wrap--content-margin">
                <Helmet>
                    <title>Twoje oferty podzielenia się - ShareFood</title>
                </Helmet>

                {this.state.loadingOffers === true ? <div className="ac-shares--loading">
                    <LoadingBurger/>
                </div> : null}
                
                {offers.length === 0 && this.state.loadingOffers === false ? <div className="ac-shares-empty">
                    <div className="ac-shares-empty--box">
                        <img src={pizzaSharingSvg}/>
                        <p>Wygląda na to, że nie dzielisz się swoim drugim śniadaniem w tym momencie...</p>
                        <Link to="/share" className="nbs-btn nbs-btn--primary">Podziel się</Link>
                    </div>
                </div> : null}

                {offers.length > 0 && this.state.loadingOffers === false ? 
                <div className="ac-shares--list">
                    <ul>
                        {offers.map((val, key) => 
                            <li key={key}>
                                <div className="ac-shares--item">
                                    <div className="ac-shares--item--image" style={{background: `url('${"https://res.cloudinary.com/dgzvc6fls/image/upload/v1575413544/" + val.img_url}')`,  backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}>
                                        {/* <img src={`${"https://res.cloudinary.com/dgzvc6fls/image/upload/v1575413544/" + val.img_url}`}/> */}
                                        <div className="ac-shares--item--image--overlay"></div>
                                    </div>
                                    <div className="ac-shares--item--content">
                                        <div className="ac-shares--item--info">
                                            <div className="ac-shares--item--info--name">
                                                <h3>{val.name}</h3>
                                            </div>
                                            <div className="ac-shares--item--info--details">
                                                <p><i class="fas fa-tags"></i><span>{ val.price == 0.00 ? "Za darmo" : val.price + "zł"}</span><i class="fas fa-clock"></i><span>{moment(new Date(val.available_to)).format("HH:mm")}</span></p>
                                            </div>
                                        </div>
                                        <div className="ac-shares--item--actions">
                                            <div className="ac-shares--item--actions--btn">
                                                <Link to={`/account/shares/${val.id}`}>Edycja</Link>
                                            </div>
                                        </div>
                                        {val.pickup_code != null && new Date(val.pickup_code_generated_at).setMinutes(new Date(val.pickup_code_generated_at).getMinutes() + 15) > new Date() ? <div className="ac-shares--item--pickup">
                                            <div className="ac-shares--item--pickup--code">
                                                <h5>Kod odbioru aktwyny do - <span>{moment(new Date(val.pickup_code_generated_at).setMinutes(new Date(val.pickup_code_generated_at).getMinutes() + 15)).format('HH:mm')}</span></h5>
                                                <p>{val.pickup_code}</p>
                                            </div>
                                        </div> : null}
                                    </div>
                                </div>


                            </li>
                        )}
                    </ul>   
                </div>
                : null}
                
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
