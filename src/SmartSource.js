import React, { Component } from 'react'
import FCSsourceJSON from '../build/contracts/FCSsource.json'

class SmartSource extends Component {
    constructor(props){
        super(props);
        this.state = {
            kWhValue: Math.floor(Math.random() * 500) + 1000,
            htmlLine: null
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
            {this.htmlLine}
        </div>;
    }

    componentDidMount() {
        this.deployContract();
        this.interval = window.setInterval(this.increaseValue.bind(this), 5000);
    }

    increaseValue() {
        let self = this;
        let newValue = self.state.kWhValue + Math.floor(Math.random() * 30) + 50;
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
            this.htmlLine = this.renderConnection();
        }
    }


    renderConnection() {
        if(this.props.domID !== 'SUP1') {
            return null;
        }
        let lines = [];
        for(let i = 1; i < 4; i++) {
            var div1 = document.getElementById('CRG'+i+'real');
            var div2 = document.getElementById('SUP1');
            var thickness = 5;

            var off1 = this.getOffset(div1);
            var off2 = this.getOffset(div2);
            // bottom right http://jsfiddle.net/cnmsc1tm/
            var x1 = off1.left + (off1.width / 2);
            var y1 = off1.top + (off1.height / 2);
            // top right
            var x2 = off2.left + (off2.width / 2);
            var y2 = off2.top + (off2.height / 2);
            // distance
            var length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
            // center
            var cx = ((x1 + x2) / 2) - (length / 2);
            var cy = ((y1 + y2) / 2) - (thickness / 2);
            // angle
            var angle = Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);
            // make hr
            cx = 0;
            cy = 0;
            if(i === 1) {
                cx = 40;
                cy = 100;
            }
            else if(i === 2) {
                cx = 0;
                cy = 126;
            }
            else if(i === 3) {
                cx = -18;
                cy = 140;
            }
            lines[i] = <div className="chargeLine" id={"chargeLine"+i} key={i} style={{padding:'0px',margin:'0px',height:"5px",backgroundColor:"#0F0",lineHeight:'1px', position:'absolute', left:cx+'px', top: cy + "px", width: length + "px", MozTransform:"rotate(" + angle + "deg)", WebkitTransform: "rotate(" + angle + "deg)", OTransform:"rotate(" + angle + "deg)", msTransform:"rotate(" + angle + "deg)", transform:"rotate(" + angle + "deg)"}} />;
            // lines[i] = <div style={{padding:'0px',margin:'0px',height:"5px",backgroundColor:"#0F0",lineHeight:'1px', position:'absolute', width: length + "px", MozTransform:"rotate(" + angle + "deg)", WebkitTransform: "rotate(" + angle + "deg)", OTransform:"rotate(" + angle + "deg)", msTransform:"rotate(" + angle + "deg)", transform:"rotate(" + angle + "deg)"}} />;
        }
        return lines;
    }

    getOffset( el ) {
        var rect = el.getBoundingClientRect();
        return {
            left: rect.left + window.pageXOffset,
            top: rect.top + window.pageYOffset,
            width: rect.width || el.offsetWidth,
            height: rect.height || el.offsetHeight
        };
    }
}

export default SmartSource;
