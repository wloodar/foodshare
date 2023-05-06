import React from 'react';
import { Link } from 'react-router-dom'
import MainNav from '../../partials/navs/MainNav';

export default ({ children }) => (
    
    <div className="mn-wrap">
        <MainNav/>
        { children }
        <footer className="mn-footer">
            <div className="mn-footer--inner">
                <div className="mn-footer--content">

                    <div className="mn-footer--left mn-footer--float">
                        <div className="mn-footer--left--logo">
                            <h2 className="bs-logo-text bs-logo-text--dark"><Link to="/">FoodShare</Link></h2>
                        </div>
                    </div>
                    <div className="mn-footer--right mn-footer--float">
                        <div className="mn-footer--right--list">
                            <div className="mn-footer--right--list--header">
                                <h5>Informacje</h5>
                            </div>
                            <ul>
                                <li><Link to="#">O aplikacji</Link></li>
                                <li><Link to="#">Pomóż rozwijać aplikacje</Link></li>
                                <li><Link to="#">Wyraź opinie</Link></li>
                            </ul>
                        </div>
                        <div className="mn-footer--right--list">
                            <div className="mn-footer--right--list--header">
                                <h5>Pomoc i Blog</h5>
                            </div>
                            <ul>
                                <li><Link to="#">Najczęściej zadawane pytania</Link></li>
                                <li><Link to="#">Nasz Blog</Link></li>
                            </ul>
                        </div>
                        <div className="mn-footer--right--list">
                            <div className="mn-footer--right--list--header">
                                <h5>Prywatność</h5>
                            </div>
                            <ul>
                                <li><Link to="#">Polityka prywatności</Link></li>
                                <li><Link to="#">Warunki korzystania z usługi</Link></li>
                            </ul>
                        </div>
                    </div>

                </div>
                <div className="mn-footer--copyright">
                    <p>© 2020 FoodShare.</p>
                </div>
            </div>
        </footer>
    </div>
);