import React, {useEffect, useMemo, useRef, useState} from 'react';
import classes from "./Post.module.scss"
import {GoogleMap, LoadScript, Marker} from '@react-google-maps/api';
import MapContainer from "../Map/MapContainer";

const containerStyle = {
    width: '100%',
    height: '100%'
};

const center = {
    lat: -15.000,
    lng: -0.000
};

const Post = ({id, title, startDate, finishDate, longitude, latitude, isOpen, openPost}) => {
    const [map, setMap] = React.useState(null);

    const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds();
        map.fitBounds(bounds);
        setMap(map)
    }, []);

    const onUnmount = React.useCallback(function callback(map) {
        setMap(map);
    }, []);

    const [state, setState] = useState({
        isOpen: false,
        colors: ["#FFA737", "#DC851F"]
    })

    useEffect(() => {
        let col = [];
        // col.push(["#FFB627","#E2711D"])
        col.push(["#FFA737", "#DC851F"])
        col.push(["#607B7D", "#3A606E"])
        // col.push(["#03F7EB","#00B295"])
        // col.push(["#FFE5D4","#EFC7C2"])
        col.push(["#B0CA87", "#809848"])
        col.push(["#442220", "#2E0014"])
        col.push(["#93aba7", "#AD9BAA"])
        col.push(["#A13D63", "#8c4161"])
        let i = parseInt(Math.random() * col.length);
        setState((prev) => {
            return {
                ...prev,
                colors: col[i]
            };
        })
    }, [])


    const getMapOptions = () => {
        return {
            disableDefaultUI: false,
            mapTypeControl: false,
            streetViewControl: false,
            styles: [{featureType: 'poi', elementType: 'labels', stylers: [{visibility: 'on'}]}],
        };
    };

    const postRef = useRef();
    useEffect(() => {
        let vh = window.innerHeight * 0.01;
        postRef.current.style.setProperty('--vh', `${vh}px`);
    });

    const postCls = [classes.Post];

    if (isOpen === "open") {
        postCls.push(classes.open);
    }else if (isOpen === "recentlyClosed"){
        postCls.push(classes.recentlyClosed);
    }
    let background = {
        background: `linear-gradient(135deg, ${state.colors[0]},${state.colors[1]})`,
        boxShadow: `3px 3px 10px ${state.colors[1]}`
    }

    const onClick = ( map, coord) =>{
        const { latLng } = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();
        console.log(lat);
        console.log(lng);
    }

    return (
        <div className={classes.PostWrap}>
            <div className={postCls.join(" ")} style={background} ref={postRef} onClick={()=>{
                openPost(id)
            }}>
                {isOpen === "open" ? <MapContainer lat={latitude} lng={longitude}/> : null}
                <div className={classes.Title}></div>
            </div>
        </div>
    );
};

export default Post;