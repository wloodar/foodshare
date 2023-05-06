import React from 'react'
import { Helmet } from 'react-helmet';
import Main from './Logic';

export default function MainShares() {
  return (
    <div className="dashboard">
        <Helmet>
            <title> Nowa oferta - ShareFood</title>
        </Helmet>
        <Main/>
        <div className="gl-notification">
            <div className="gl-notification--inner">
                <span class="close hairline"></span>
                <div className="gl-notification--box">
                    <div className="gl-notification--box--header">
                        <h6>Coś poszło nie tak ...</h6>
                    </div>
                    <div className="gl-notification--box--content">
                        <p>Posiadasz już aktywne oferty w innej szkole. Przed podzieleniem się w innej szkole musisz najpierw zakończyć oferty w aktualnej szkole.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}