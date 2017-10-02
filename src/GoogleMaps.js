import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ domID }) => <div id={domID} />;

class GoogleMaps extends Component {
    static defaultProps = {
        center: {lat: 51.9877763, lng: 5.9110103},
        zoom: 12
    };

    render() {
        return (
            <GoogleMapReact
                defaultCenter={this.props.center}
                defaultZoom={this.props.zoom}
                style={{height: '400px', width: '400px'}}
                size={{width: '400px', height:'400px' }}
            >
                <AnyReactComponent
                    lat={52.018084}
                    lng={5.839690}
                    domID={'SUP1'}
                />
                <AnyReactComponent
                    lat={51.963963}
                    lng={6.034176}
                    domID={'SUP2'}
                />
                <AnyReactComponent
                    lat={51.918600}
                    lng={5.891661}
                    domID={'SUP3'}
                />
                <AnyReactComponent
                    lat={51.996511}
                    lng={5.870495}
                    domID={'CRG1'}
                />
                <AnyReactComponent
                    lat={51.980294}
                    lng={5.982290}
                    domID={'USR1'}
                />
            </GoogleMapReact>
        );
    }
}

export default GoogleMaps;