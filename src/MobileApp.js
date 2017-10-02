import React, { Component } from 'react';
import _ from 'underscore';

class MobileApp extends Component {
    constructor(props) {
        super(props);
        this.sources = this.suppliersAPI();
        this.dso = this.getDSOinfo();
        this.state = {
            balance: this.props.web3.eth.getBalance(this.props.account),
            step: 0
        };
        this.props.registerDevice({
            type: 'CustomerApp',
            description: this.props.description
        });
    }

    suppliersAPI() {
        return _.map(this.props.registeredSources, function(source){
            source.supplier = 'Nuon';
            source.price = (Math.random() * (0.1 - 0.2) + 0.2).toFixed(2) / 1;
            return source;
        });
    }

    getDSOinfo() {
        let self = this;
        this.props.FCSdeal.getChargestationInfo.call(this.props.chargeStation.id).then(function(stationInfo){
            self.stationInfo = stationInfo;
            console.log("Call URL " + stationInfo[1]);
        });
        return { price: 0.012 };
    }

    render() {
        let self = this;
        let phoneContent = null;
        if(this.state.step === 0) {
            let sourceElements = this.sources.map(function (source, t) {
                return <div key={t}>
                    <button onClick={self.chooseSource.bind(self, source)}>{source.price + self.dso.price}
                        - {source.description}</button>
                </div>
            });

            phoneContent = <div>
                <img id="ethereumLogo" src="img/ethereumlogo.png" alt="ethereumLogo" />
                <span id="etherBalance">{Math.round(this.props.web3.fromWei(this.state.balance, "ether")) / 100 + " ether"}</span>
                <div style={{clear:'both'}}>
                    <div id="currStation">Current charge station: {this.props.chargeStation.description}</div>
                    <div id="currCar">Selected car: Volvo C30 - 24 kWh</div>
                    <div id="selectAmount">
                        Select current car status:<br />
                        <button>(Almost)<br />empty</button>
                        <button>Half<br />full</button>
                        <button>(Almost)<br />full</button>
                    </div>
                    Current DSO price: {this.dso.price}<br/>
                    You want to charge for <input id="chargeAmount" size="10"/> kwh
                    {sourceElements}
                </div>
            </div>
        }
        else if(this.state.step === 1) {
            phoneContent = <div id="charging">
                <div className="battery" />
                <span>Your car is charging</span>
            </div>;
        }
        else {
            phoneContent = <div>Stopped charging</div>
        }
        return <div>
            <img id="iPhone" src="img/iphone.png" alt="iphone" />
            <div id="phoneContent">
                <div id="phoneHeader">SmartCharge</div>
                {phoneContent}
            </div>
        </div>
    }

    /**
     * this.props.FCSdeal is contract
     *
     * chosenSource.contractAddress is source
     * chosenSource.price is sourcePrice
     * chosenSource.supplier is supplier
     * this.stationInfo[1] is dso
     * this.dso.price is dsoPrice
     * this.props.chargeStation.id is chargeStationId
     * this.stationInfo[0] is startValueStation
     * document.getElementById('chargeAmount').value is chargeAmount (how many kwh)
     */
    chooseSource(chosenSource) {
        // console.log(this.props.chargeStation);
        // console.log(chosenSource);
        //
        // console.log(chosenSource.contractAddress);
        // console.log(chosenSource.price);
        // console.log(chosenSource.supplier);
        // console.log(this.stationInfo[1]);
        // console.log(this.dso.price);
        // console.log(this.stationInfo[0].c[0]);

        let chargeAmount = document.getElementById('chargeAmount').value;
        let self = this;
        this.props.FCSdeal.newDeal(chosenSource.contractAddress, chosenSource.price, chosenSource.supplier,
            this.stationInfo[1], this.dso.price, this.props.chargeStation.id, this.stationInfo[0], chargeAmount,
            { from: this.props.account, gas: 1000000, value: this.props.web3.toWei("1") }).then(function(transactionDetails){
                console.log(transactionDetails);
                // Show display; car is charging now
                self.props.FCSdeal.StopCharge(function(error, result){
                    console.log('change display because stopped charging');
                    console.log(result);
                    self.setState({
                        step: 2,
                        stepInfo: {
                            chargedAt: result.args.chargeStation,
                            newValue: result.args.endValueStation
                        }
                    })
                });
                self.setState({
                    step: 1
                })
            });
    }
}

export default MobileApp;
