import React, { Component } from 'react'
import FCSsourceJSON from '../build/contracts/FCSsource.json'

class SmartSource extends Component {
    constructor(props){
        super(props);
        this.state = {
            kWhValue: Math.floor(Math.random() * 500) + 1000
        }
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
                // self.state.contract = myContract;
                // self.forceUpdate();
                myContract.newMeterValue(3, self.state.kWhValue, { from: self.props.accounts[0] });
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

        return <div id={this.props.domID + 'real'} className="mapsElement">
            <img className="iconCircle" src={"img/"+this.props.type+".png"} alt="Solarpanel" />
            <span>{this.state.kWhValue} kwh</span>
        </div>;
    }

    componentDidMount() {
        this.deployContract();
        this.interval = window.setInterval(this.increaseValue.bind(this), 5000);
    }

    increaseValue() {
        let self = this;
        let newValue = self.state.kWhValue + Math.floor(Math.random() * 50) + 50;
        this.state.contract.newMeterValue(9, newValue, { from: this.props.accounts[0] });
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
        }
    }
}

export default SmartSource;
