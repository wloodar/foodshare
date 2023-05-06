import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class BasicNotification extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isClosed: false,
        };

        this.closeNotification = this.closeNotification.bind(this);
    }

    componentWillReceiveProps() {
        this.setState({
            isClosed: false
        })
    }

    closeNotification() {
        this.setState({
            isClosed: true
        })
    }
 
    render() {

        const { message, isClosed } = this.state;

        return (
            <>
                { isClosed ? null: <div className="bs-notification" onClick={this.closeNotification}>
                    <div className="bs-notification--inner">
                        <div className="bs-notification--content">
                            <p>{this.props.message}</p>
                            <button onClick={this.closeNotification} className="nbs-btn nbs-btn--primary">Rozumiem</button>
                        </div>
                    </div>
                </div>}
            </>
        )
    }
}

export default withRouter(BasicNotification);
