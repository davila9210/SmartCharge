import React, { Component } from 'react'

class SmartChargestation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            kWhValue: Math.floor(Math.random() * 2000) + 1000
        };
        this.props.registerDevice({
            type: 'SmartChargestation',
            description: this.props.description,
            id: this.props.deviceID
        });
        this.props.FCSdeal.registerChargestation(this.props.deviceID, "http://www.DSO.ext/API/price/" + this.props.deviceID, { from: this.props.accounts[0] }); //this.props.deviceID, 1501574400, this.state.kWhValue, { from: this.props.accounts[0], gasLimit: 6706583 });
        this.props.FCSdeal.newMeterValue(this.props.deviceID, this.props.currentTime.valueOf(), this.state.kWhValue, { from: this.props.accounts[0] });
    }

    componentDidMount() {
        let self = this;
        this.props.FCSdeal.StartCharge(function(error, result){
            if (!error && result.args.chargeStation.c[0] === self.props.deviceID) {
                self.startCharging(result.args.chargeAmount.c[0], result.args.dealId.c[0]);
                console.log(result);
            }
        });
    }

    startCharging(amount, dealId) {
        console.log(this.props.deviceID + ' start charging for ' + amount + ' kwh for deal' + dealId);
        this.chargeSession = {
            stopAt: this.state.kWhValue + amount,
            dealId: dealId
        };
        this.interval = window.setInterval(this.increaseValue.bind(this), 5000);
    }

    increaseValue() {
        let self = this;
        let newValue = self.state.kWhValue + 2; //charges 2 kwh per minute/5 sec (normally +-11kwh/hour)
        if(newValue > this.chargeSession.stopAt) {
            // Stop charging
            clearInterval(this.interval);
            newValue = this.chargeSession.stopAt;
            console.log(this.props.deviceID + ' stops charging for deal ' + this.chargeSession.dealId);
            this.props.FCSdeal.finishDeal(this.chargeSession.dealId, newValue, { from: this.props.accounts[0] });
            this.chargeSession = null;
        }
        this.props.FCSdeal.newMeterValue(this.props.deviceID, this.props.currentTime.valueOf(), newValue, { from: this.props.accounts[0] });
        this.setState({
            kWhValue: newValue
        });
    }

    render() {
        return <div id={this.props.domID + 'real'} className="mapsElement">
            <img className="iconCircle" src="img/evcharge.png" alt="Solarpanel" />
            <span>{this.state.kWhValue} kwh</span>
        </div>;
    }

    // Adjust location on google map
    componentDidUpdate() {
        if(document.getElementById(this.props.domID) && document.getElementById(this.props.domID +'real')) {
            var mapsElement = document.getElementById(this.props.domID).getBoundingClientRect();
            document.getElementById(this.props.domID + 'real').style.top = mapsElement.y - 35 + 'px';
            document.getElementById(this.props.domID + 'real').style.left = mapsElement.x - 35 + 'px';
        }
    }
}

export default SmartChargestation;
