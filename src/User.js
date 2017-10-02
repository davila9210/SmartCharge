import React, { Component } from 'react';

class User extends Component {

    render() {
        return <div id={this.props.domID + 'real'} className="mapsElement">
            <img className="iconCircle" src="img/user.png" alt="Solarpanel" />
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

export default User;
