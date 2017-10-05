import React from 'react'
import FCSsourceJSON from '../build/contracts/FCSsource.json'
import DemoControllerSource from './DemoControllers/DemoControllerSource';

class SmartSource extends DemoControllerSource {
    constructor(props){
        super(props);
        this.state = {
            kWhValue: Math.floor(Math.random() * 500) + 1000,
            htmlLine: null
        };
        this.standardIncrease = 50;
        this.variableIncrease = 30;
        this.extraClass = '';
    }

    deployContract() {
        let abi = FCSsourceJSON.abi;
        let bytecode = FCSsourceJSON.unlinked_binary;
        let gasEstimate = this.props.web3.eth.estimateGas({data: bytecode});
        let MyContract = this.props.web3.eth.contract(abi);

        let self = this;
        MyContract.new(this.props.accounts[8], {
            from: this.props.accounts[0],
            data: bytecode,
            gas: gasEstimate + 100000
        }, function(err, myContract){
            if(!err && myContract.address) {
                self.props.registerDevice({
                    type: 'SmartSource',
                    contractAddress: myContract.address,
                    description: self.props.description,
                    contract: myContract
                });
                self.setState({
                    contract: myContract
                });
                myContract.newMeterValue(self.props.currentTime.valueOf(), self.state.kWhValue, { from: self.props.accounts[0] });
            }
            else if(err) {
                console.log('error deploying smart source contract: ' + err)
            }
        });
    }

    render() {
        if(!this.state.contract) {
            return null;
        }

        return <div id={this.props.domID + 'real'} className={"mapsElement " + this.extraClass}>
            <img onClick={this.clickedSource.bind(this)} className="iconCircle" src={"img/"+this.props.type+".png"} alt="Solarpanel" />
            <span>{this.state.kWhValue} kwh</span>
            {this.htmlLine}
        </div>;
    }

    clickedSource() {
        console.log('Clicked source - supply to 2kwh/min');
        console.log(this);
        this.variableIncrease = 0;
        this.standardIncrease = 4;
        this.extraClass = 'lageOpwek';
    }

    componentDidMount() {
        this.deployContract();
        this.interval = window.setInterval(this.increaseValue.bind(this), 5000);
    }

    increaseValue() {
        let self = this;
        let newValue = self.state.kWhValue + Math.floor(Math.random() * this.variableIncrease) + this.standardIncrease;
        this.state.contract.newMeterValue(this.props.currentTime.valueOf(), newValue, { from: this.props.accounts[0], gas: 1000000 });
        this.setState({
            kWhValue: newValue
        });
    }

    // Adjust location on google map
    componentDidUpdate() {
        if(document.getElementById(this.props.domID) && document.getElementById(this.props.domID +'real')) {
            var mapsElement = document.getElementById(this.props.domID).getBoundingClientRect();
            document.getElementById(this.props.domID + 'real').style.top = mapsElement.y - 35 + 'px';
            document.getElementById(this.props.domID + 'real').style.left = mapsElement.x - 35 + 'px';
            this.htmlLine = this.renderConnection();
        }
    }
}

export default SmartSource;
