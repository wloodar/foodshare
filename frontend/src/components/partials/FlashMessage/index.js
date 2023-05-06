import React from 'react';
import FlashMessage from 'react-flash-message';

const FlashMessageComp = ({message}) => (
    <FlashMessage duration={4000}>
        <div className="flash-message">
            <div className="flash-message--inner">
                <h6>Sukces!</h6>
                <p>{message}</p>
            </div>
        </div>
    </FlashMessage>
);

export default FlashMessageComp;