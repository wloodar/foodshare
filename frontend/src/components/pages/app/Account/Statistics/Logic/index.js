import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { socket } from '../../../../../../socket';
import { Line } from 'react-chartjs-2';

import LoadingBurger from '../../../../../partials/LoadingBurger';

class AccountStatisctics extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {
                labels: ["1","2","3","4","5"],
                datasets: [
                    {
                        label: "Videos Mades",
                        backgroundColor: "rgba(255, 0, 255, 0.75)",
                        data: [4, 5, 1, 10, 32, 2, 12]
                    },
                    {
                        label: "Subscriptions",
                        backgroundColor: "rgba(0, 255, 0, 0.75)",
                        data: [14, 15, 21, 0, 12, 4, 2]
                    }
                ]
            }
        };
    }

    componentDidMount() {
        
    }

    setGradientColor = (canvas, color) => {
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0,0, 600, 400);
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.95, "rgba(133, 255, 144, 0.5)");

        return gradient;
    }

    getChartData = canvas => {
        const { data } = this.state;
        if (data.datasets) {
            let colors = ["rgba(255, 0, 255, 0.75)", "rgba(0, 255, 0, 0.75)"];
            data.datasets.forEach((set, i) => {
                set.backgroundColor = this.setGradientColor(canvas, colors[i]);
                set.borderColor = "white";
                set.borderWidth = 2;
            });
        }
        return data;
    }
    
    render() {

        return (
            <>
                stats
                {/* <div style={{ position: "relative", width: "50%", height: "auto" }}>
                    <Line 
                        options = {{
                            responsive: true
                        }}
                        data = {this.getChartData}
                    />
                </div> */}
            </>
        )
    }
}

AccountStatisctics.propTypes = {
    children: PropTypes.object,
    auth: PropTypes.object,
    history: PropTypes.object,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default withRouter(connect(mapStateToProps)(AccountStatisctics));
