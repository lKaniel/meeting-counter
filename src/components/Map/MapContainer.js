import React, {useEffect} from 'react';
import {GoogleApiWrapper, Map, Marker} from "google-maps-react";
import classes from "./MapContainer.module.scss";
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
        console.log(1);
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log("Latitude is :", position.coords.latitude);
            console.log("Longitude is :", position.coords.longitude);
        });
    },[])

    const onClick = function (t, map, coord)
    {
        const {latLng} = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();
        console.log(lng);
        console.log(lat);
    }
    // getLocation();
    return (
        <Map
            google={props.google}
            zoom={12}
            style={props.styles}
            initialCenter={{ lat: props.lat, lng: props.lng}}
            onClick={onClick}
        >
            <Marker position={{ lat: props.lat, lng: props.lng}} />
        </Map>
    );
};

export default GoogleApiWrapper({
    apiKey: 'AIzaSyAXfDzhUc8l339Sf62f7MOiXBtqo7LBcYM'
})(MapContainer);

