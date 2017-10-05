import React, { Component } from 'react';

class User extends Component {
    constructor(props){
        super(props);
        this.rendered = 0;
    }
    render() {
        return <div id={this.props.domID + 'real'} className="mapsElement">
            <img className="iconCircleSmall" src="img/car_small.png" alt="Solarpanel" />
        </div>;
    }

    // Adjust location on google map
    componentDidUpdate() {
        if(this.rendered < 3 && document.getElementById(this.props.domID) && document.getElementById(this.props.domID +'real')) {
            let mapsElement = document.getElementById(this.props.domID).getBoundingClientRect();
            document.getElementById(this.props.domID + 'real').style.top = mapsElement.y - 20 + 'px';
            document.getElementById(this.props.domID + 'real').style.left = mapsElement.x - 20 + 'px';
            this.rendered++;
        }
        else if(this.rendered === 3){
            console.log('Ready');
            this.rendered++;
        }
    }
}

export default User;
