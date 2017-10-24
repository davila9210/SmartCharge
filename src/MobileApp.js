import React, { Component } from 'react';
import _ from 'underscore';

class MobileApp extends Component {
    constructor(props) {
        super(props);
        this.sources = this.suppliersAPI();
        this.dso = this.getDSOinfo();
        this.state = {
            balance: this.props.web3.eth.getBalance(this.props.account),
            step: 0,
            chargeAmount: 5
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
                    <button className="source" onClick={self.chooseSource.bind(self, source)}>{source.description}<br />
                        {(self.state.chargeAmount * source.price).toFixed(2) + ' (' + source.price + '/kwh)'}</button>
                </div>
            });

            phoneContent = <div>
                <img id="ethereumLogo" src="img/ethereumlogo.png" alt="ethereumLogo" />
                <span id="etherBalance">{this.props.web3.fromWei(this.state.balance, "ether").toFixed(2) + " ether"}</span>
                <div style={{clear:'both',textAlign: 'center'}}>
                    <div className="appDetailText" id="currStation">Current charge station: {this.props.chargeStation.description}</div>
                    <div className="appDetailText" id="currCar">Selected car: Volvo C30 - 24 kWh</div>
                    <div id="selectAmount">
                        How far do you want to drive?:<br />
                        <input id="slider" type="range" min="0" max="400" step="10" onChange={this.sliderChanged.bind(this)}/>
                        <span id="sliderOutput">50</span> km
                        {/*<button>(Almost)<br />empty</button>*/}
                        {/*<button>Half<br />full</button>*/}
                        {/*<button>(Almost)<br />full</button>*/}
                        <div className="appDetailText">You car will get <span id="chargeAmount">5</span> kwh</div>
                    </div>
                    <br />Current DSO price: {this.dso.price}<br/><br/>
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
            phoneContent = <div>You're ready to go!</div>
        }
        return <div>
            <img id="iPhone" src="img/iphone.png" alt="iphone" />
            <div id="phoneContent">
                <div id="phoneHeader">SmartCharge</div>
                {phoneContent}
            </div>
        </div>
    }

    sliderChanged(){
        let chosenValue = document.getElementById('slider').value;
        document.getElementById('sliderOutput').innerHTML = chosenValue;
        document.getElementById('chargeAmount').innerHTML = chosenValue / 10;
        this.setState({
            chargeAmount: chosenValue / 10
        })
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
        let lineId = this.props.chargeStation.description.slice(-1);
        document.getElementById('chargeLine' + lineId).style.display = 'block';

        let chargeAmount = document.getElementById('slider').value / 10;
        let price = chosenSource.price * chargeAmount;
        let self = this;
        this.props.FCSdeal.newDeal(chosenSource.contractAddress, chosenSource.price, chosenSource.supplier,
            this.stationInfo[1], this.dso.price, this.props.chargeStation.id, this.stationInfo[0], chargeAmount,
            { from: this.props.account, gas: 1000000, value: this.props.web3.toWei(price) }).then(function(transactionDetails){
                console.log(transactionDetails);
                // Listen to source (might not be available supply)
                chosenSource.contract.DropUser(function(error, result) {
                    if(result.args.chargestationId.c[0] === self.props.chargeStation.id) {
                        console.log('Dropping station ' + self.props.chargeStation.id + ', energy source not available' + result.args.meterValue.c[0]);
                        console.log('Deal ' + result.args.dealId.c[0] + ' falling back to 2nd source');
                        let lineId = self.props.chargeStation.description.slice(-1);
                        document.getElementById('chargeLine' + lineId).style.borderTop = '7px dashed red';
                        document.getElementById('chargeLineBackup').style.display = 'block';
                        //TODO switch from source (enddeal + newdeal)
                        self.props.FCSdeal.finishDeal(result.args.dealId.c[0], result.args.meterValue.c[0], { from: self.props.account });
                    }
                });
                // Listen to when charge stations stops
                let watch = self.props.FCSdeal.StopCharge(function(error, result){
                    if(result.args.chargeStation.c[0] === self.props.chargeStation.id) {
                        watch.stopWatching();
                        let lineId = self.props.chargeStation.description.slice(-1);
                        document.getElementById('chargeLine' + lineId).style.display = 'none';
                        console.log('lineid' + lineId);
                        if(lineId === 1){
                            document.getElementById('chargeLineBackup').style.display = 'none';
                        }
                        console.log(result);
                        if (self._mounted) {
                            self.setState({
                                step: 2,
                                stepInfo: {
                                    chargedAt: result.args.chargeStation,
                                    newValue: result.args.endValueStation
                                }
                            })
                        }
                    }
                });
                // Show display; car is charging now
                self.setState({
                    step: 1
                })
            });
    }

    componentDidMount() {
        this._mounted = true;
    }

    componentWillUnmount() {
        this._mounted = false;
    }
}

export default MobileApp;
