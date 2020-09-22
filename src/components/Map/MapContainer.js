import React, {useEffect, useState} from 'react';
import {Circle, GoogleApiWrapper, Map, Marker} from "google-maps-react";
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

        useEffect(() => {

        }, [])

        useEffect(() => {
            navigator.geolocation.getCurrentPosition(function (position) {
                console.log("Latitude is :", position.coords.latitude);
                console.log("Longitude is :", position.coords.longitude);
            });
        }, [])


        // getLocation();
        return (
            <Map
                google={props.google}
                zoom={props.zoom}
                style={props.styles}
                initialCenter={{lat: props.lat, lng: props.lng}}
                onClick={props.onClick}
                onZoomChanged={props.onZoom}
                onRecenter={props.onMove}
                options={{
                    disableDefaultUI: true,
                    mapTypeControl: true,
                    streetViewControl: true,
                    styles: [{featureType: 'poi', elementType: 'labels', stylers: [{visibility: 'off'}]}],
                }}

            >
                <Marker position={{lat: props.markerLat, lng: props.markerLng}}/>
                <Circle
                    radius={props.radius}
                    center={{lat: props.markerLat, lng: props.markerLng}}
                    strokeColor='transparent'
                    strokeOpacity={0}
                    strokeWeight={5}
                    fillColor='#FF0000'
                    fillOpacity={0.2}
                />
            </Map>
        );
    }
;

export default GoogleApiWrapper({
    apiKey: 'AIzaSyAXfDzhUc8l339Sf62f7MOiXBtqo7LBcYM'
})(MapContainer);

