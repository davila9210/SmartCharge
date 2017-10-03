import { Component } from 'react'; //React,
import _ from 'underscore';

class DemoController extends Component {
    constructor(props) {
        super(props);
        this.nextChargestationId = 444; //444 222 143
    }
    closePopup() {
        document.getElementById('popup').className = '';
        document.getElementById('overlay').className = '';
        this.setState({
            showMobileApp: false
        });
        // set right sizes for popup and overlay
    }

    playNow() {
        document.getElementById('playButton').style.display = 'none';
        console.log('start moving car visually, takes 10 seconds (2 real life minutes)');
        let chargeElement = document.getElementById('CRG1').getBoundingClientRect();

        document.getElementById('USR1real').style.top = chargeElement.y - 35 + 'px';
        document.getElementById('USR1real').style.left = chargeElement.x + 15 + 'px';
        setTimeout(this.popupVideo.bind(this), 10000)
    }

    popupVideo() {
        document.getElementById('overlay').className = 'show';
        document.getElementById('popup').className = 'show';
        document.getElementById('videoPlayer').play();
        console.log('vid screen');
        setTimeout(this.popupWindow.bind(this), 8000)
        //new react component
    }

    popupWindow() {
        console.log('popup');
        document.getElementById('videoPlayer').pause();
        document.getElementById('overlay').className = 'show';
        document.getElementById('popup').className = 'show';
        document.getElementById('popup').style.width = '300px';
        document.getElementById('popup').style.marginLeft = '-150px';
        document.getElementById('popup').style.height = '600px';
        document.getElementById('popup').style.marginTop = '-300px';
        setTimeout(this.showApp.bind(this), 500)
    }

    showApp() {
        this.currentChargeStation = _.filter(this.state.registeredDevices, {type: 'SmartChargestation'});
        this.currentChargeStation = _.find(this.currentChargeStation, {id: this.nextChargestationId});
        this.setState({
            showMobileApp: true
        })
    }
}

export default DemoController;
