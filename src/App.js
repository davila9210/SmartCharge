import React from 'react'
import FCSdealJSON from '../build/contracts/FCSdeal.json'
import getWeb3 from './utils/getWeb3'
import DemoController from './DemoControllers/DemoControllerApp';
import SmartSource from './SmartSource';
import SmartChargestation from './SmartChargestation';
import MobileApp from './MobileApp';
import User from './User';
import _ from 'underscore';
import moment from 'moment';
import GoogleMaps from './GoogleMaps';

import './App.css'

class App extends DemoController {
    constructor(props) {
        super(props);

        this.state = {
            storageValue: 0,
            web3: null,
            accounts: null,
            FCSdeal: null,
            registeredDevices: [],
            currentTime: moment.unix(1505646000),
            showMobileApp: false
        }
    }

    componentWillMount() {
        getWeb3.then(results => {
            results.web3.eth.getAccounts((error, accounts) => {
                this.setState({
                    web3: results.web3,
                    accounts: accounts
                });

                this.instantiateContract()
            })
        }).catch(() => {
            console.log('Error finding web3.')
        })
    }

    instantiateContract() {
        const contract = require('truffle-contract');
        const FCSdeal = contract(FCSdealJSON);
        FCSdeal.setProvider(this.state.web3.currentProvider);

        let self = this;

        FCSdeal.deployed().then((instance) => {
            console.log('FCSdeal was deployed at ' + FCSdeal.address);
            self.setState({
                FCSdeal: instance
            })
        })
    }

    render() {
        if(!this.state.web3 || !this.state.accounts || !this.state.FCSdeal){
            console.log('Geen web3 nog');
            return null;
        }

        let regDevices = _.map(this.state.registeredDevices, function(device, t){
            return <div key={t}>{device.type} : {device.contractAddress} {device.id} </div>;
        });

        let popupContent;
        if(!this.state.showMobileApp) {
            popupContent = <video id="videoPlayer" width="890" height="510">
                {/*<source src="http://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_1080p_h264.mov" type="video/mp4" />*/}
                Your browser does not support the video tag.
            </video>;
        }
        else {
            popupContent =
                <MobileApp
                    web3={this.state.web3}
                    account={this.state.accounts[5]}
                    FCSdeal={this.state.FCSdeal}
                    registeredSources={_.where(this.state.registeredDevices, { type: 'SmartSource' })}
                    chargeStation={this.currentChargeStation}
                    registerDevice={this.registerDevice.bind(this)}
                    description={'User David'}
                />;
        }

        return (
            <div className="App">
                <div>
                    <div data-pop="anvil" id="popup">
                        <div className="popupcontent">
                            {popupContent}
                        </div>
                    </div>
                    <div onClick={this.closePopup.bind(this)} id="overlay" />
                </div>
                <div className="leftContainer">
                    <SmartSource
                        web3={this.state.web3}
                        accounts={this.state.accounts}
                        registerDevice={this.registerDevice.bind(this)}
                        description={'Grey Duiven'}
                        type={"grey"}
                        domID={'SUP2'}
                        currentTime={this.state.currentTime}
                    />
                    <SmartSource
                        web3={this.state.web3}
                        accounts={this.state.accounts}
                        registerDevice={this.registerDevice.bind(this)}
                        description={'Wind Aam'}
                        type={"wind"}
                        domID={'SUP3'}
                        currentTime={this.state.currentTime}
                    />
                    <SmartSource
                        web3={this.state.web3}
                        accounts={this.state.accounts}
                        registerDevice={this.registerDevice.bind(this)}
                        description={'Solar Driel'}
                        type={"solar"}
                        domID={'SUP4'}
                        currentTime={this.state.currentTime}
                    />
                    <SmartSource
                        web3={this.state.web3}
                        accounts={this.state.accounts}
                        registerDevice={this.registerDevice.bind(this)}
                        description={'Green solar'}
                        type={"solar"}
                        domID={'SUP1'}
                        currentTime={this.state.currentTime}
                    />
                    <SmartChargestation
                        accounts={this.state.accounts}
                        FCSdeal={this.state.FCSdeal}
                        registerDevice={this.registerDevice.bind(this)}
                        deviceID={222}
                        description={'A12 Connection 3'}
                        domID={'CRG3'}
                        currentTime={this.state.currentTime}
                    />
                    <SmartChargestation
                        accounts={this.state.accounts}
                        FCSdeal={this.state.FCSdeal}
                        registerDevice={this.registerDevice.bind(this)}
                        deviceID={143}
                        description={'A12 Connection 2'}
                        domID={'CRG2'}
                        currentTime={this.state.currentTime}
                    />
                    <SmartChargestation
                        accounts={this.state.accounts}
                        FCSdeal={this.state.FCSdeal}
                        registerDevice={this.registerDevice.bind(this)}
                        deviceID={444}
                        description={'A12 Connection 1'}
                        domID={'CRG1'}
                        currentTime={this.state.currentTime}
                    />
                    <User
                        domID={'USR1'}
                    />
                    <User
                        domID={'USR2'}
                    />
                    <User
                        domID={'USR3'}
                    />
                    <GoogleMaps />
                </div>
                <div className="rightContainer">
                    <button id="playButton" onClick={this.popupWindow.bind(this)}>Start car 1</button>
                    <button id="playButton2" onClick={this.popupCar2.bind(this)}>Start car 2</button>
                    <button id="playButton3" className="last" onClick={this.popupCar3.bind(this)}>Start car 3</button>
                    {regDevices}
                    <button style={{width:'300px'}} onClick={this.retrieveChargestations.bind(this)}>Retrieve registered charge stations</button>
                    <button style={{width:'300px'}} onClick={this.retrieveSmartSources.bind(this)}>Retrieve source information</button>
                    <br />
                    <div className="dial">
                        <div className="dot" />
                        <div className="min-hand" />
                        <div className="min-hand shadow" />
                        <div className="hour-hand" />
                        <div className="hour-hand shadow" />
                        <span className="twelve">12</span>
                        <span className="three">3</span>
                        <span className="six">6</span>
                        <span className="nine">9</span>
                        <div className="date" />
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        this.interval = window.setInterval(this.increaseTime.bind(this), 5000);
    }

    increaseTime() {
        this.setState({
            time: this.state.currentTime.add(60, 'seconds')
        });
        this.setAnalogClock();
    }

    setAnalogClock() {
        let newTime = this.state.currentTime;
        let seconds = newTime.seconds();
        let minutes = newTime.minutes();
        let hours = newTime.hours();
        let day = newTime.date();

        let minAngle = minutes * 6 + seconds * (360/3600);
        let hourAngle = hours * 30 + minutes * (360/720);

        document.getElementsByClassName('min-hand')[0].style.transform = 'rotate(' + minAngle + 'deg)';
        document.getElementsByClassName('min-hand')[1].style.transform = 'rotate(' + minAngle + 'deg)';
        document.getElementsByClassName('hour-hand')[0].style.transform = 'rotate(' + hourAngle + 'deg)';
        document.getElementsByClassName('hour-hand')[1].style.transform = 'rotate(' + hourAngle + 'deg)';
        document.getElementsByClassName('date')[0].innerHTML = day;
    }

    registerDevice(data) {
        this.state.registeredDevices.push(data);
        this.setState({
            registeredDevices: this.state.registeredDevices
        })
    }

    retrieveChargestations() {
        let chargeStations = _.where(this.state.registeredDevices, { type: 'SmartChargestation' });
        let self = this;
        _.each(chargeStations, function(chargeStation){
            console.log(chargeStation);
            self.state.FCSdeal.getChargestationInfo.call(chargeStation.id).then(function(result){
                console.log(result);
            });
        })
    }

    retrieveSmartSources() {
        let smartSources = _.where(this.state.registeredDevices, { type: 'SmartSource' });
        _.each(smartSources, function(smartSource) {
            console.log(smartSource.contractAddress);
            console.log(smartSource.contract.getLastMeterValue.call().c[0]);
            console.log(smartSource.contract.activeDealsLength.call().c[0]);
        });
    }
}

export default App
