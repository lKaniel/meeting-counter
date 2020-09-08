import React, {useEffect} from 'react';
import {GoogleApiWrapper, Map, Marker} from "google-maps-react";
const mapStyles = {
    width: '100%',
    height: '100%',
};
const MapContainer = (props) => {
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    function showPosition(position) {
        console.log("Latitude: " + position.coords.latitude +
            "<br>Longitude: " + position.coords.longitude);
    }

    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log("Latitude is :", position.coords.latitude);
            console.log("Longitude is :", position.coords.longitude);
        });
    },[])
    // getLocation();
    return (
        <Map
            google={props.google}
            zoom={12}
            style={mapStyles}
            initialCenter={{ lat: 48.00, lng: -122.00}}
        >
            <Marker position={{ lat: 48.00, lng: -122.00}} />
        </Map>
    );
};

export default GoogleApiWrapper({
    apiKey: 'AIzaSyAXfDzhUc8l339Sf62f7MOiXBtqo7LBcYM'
})(MapContainer);

