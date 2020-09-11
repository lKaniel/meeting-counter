import React, {useCallback, useEffect, useRef, useState} from 'react';
import classes from "./Post.module.scss"
import MapContainer from "../Map/MapContainer";
import {Transition} from "react-transition-group";
import {Map, Marker} from "google-maps-react";
import people from "../../icons/people.svg";
import peopleWhite from "../../icons/people-white.svg";
const closedMap = {
    width: '0%',
    height: '0%',
    transition: "width .5s ease-in-out",
    zIndex: 10000,
    position: "relative"
};

const enteringMobileMap = {
    width: '100%',
    height: '0%',
    transition: "height .4s ease-in-out",
    zIndex: 10000,
    position: "relative"
};

const openedMobileMap = {
    width: '100%',
    height: '35%',
    transition: "height .4s ease-in-out",
    zIndex: 10000,
    position: "relative"
};

const enteringMap = {
    width: '0%',
    height: '100%',
    transition: "width .4s ease-in-out",
    zIndex: 10000,
    position: "relative"
};

const openedMap = {
    width: '50%',
    height: '100%',
    transition: "width .4s ease-in-out",
    zIndex: 10000,
    position: "relative"
};

const center = {
    lat: -15.000,
    lng: -0.000
};

function getElementOffset(element) {

    const de = document.documentElement;
    const box = element.getBoundingClientRect();
    const top = box.top;
    const left = box.left;
    return {top: top, left: left};
}

function debounce(fn, ms) {
    let timer;
    return _ => {
        clearTimeout(timer)
        timer = setTimeout(_ => {
            timer = null;
            fn.apply(this, arguments)
        }, ms)
    };
}

let scrollable = true;
let prevString = "";
const changeScrolling = (string) => {
    if (string === prevString) return;
    prevString = string;
    if (scrollable) {
        document.getElementsByTagName("html")[0].style.overflow = "hidden";

        let div = document.createElement('div');
        div.style.overflowY = 'scroll';
        div.style.width = '50px';
        div.style.height = '50px';
        document.body.append(div);
        let scrollWidth = div.offsetWidth - div.clientWidth;
        div.remove();
        document.getElementsByClassName("layout")[0].style.paddingRight = `${scrollWidth}px`;
        // document.getElementById("header").style.paddingRight = `${scrollWidth}px`;
        scrollable = false;
    } else {
        document.getElementsByTagName("html")[0].style.overflowY = "auto";
        document.getElementsByClassName("layout")[0].style.paddingRight = `0px`;
        scrollable = true;
    }
}

const Post = ({id, title, subTitle, startDate, finishDate, longitude, latitude, additor, hereAmount, availableDistance, isOpen}) => {
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
        isOpen: "closed",
        canOpen: true,
        colors: ["#FFA737", "#DC851F", "#4C5B5C"],
        icon: peopleWhite,
        style: {
            background: `linear-gradient(135deg, #FFA737, #DC851F)`
        }
    })

    const openPost = useCallback(()=>{
        const offset = getElementOffset(postRef.current);
        let transform;
        if (dimensions.width < 700) {
            transform = `translate3d(0px,${-offset.top + 20}px,0)`;
        } else {
            transform = `translate3d(${-offset.left + 10}px,${-offset.top + 20}px,0)`;
        }
        setState((prev) => {
            if (prev.canOpen && state.canOpen) {
                if (prev.isOpen === "open") {
                    changeScrolling("closed")
                    // additor(id, "recentlyClosed");
                    setTimeout(() => {
                        setState((prev) => {
                            // additor(id, "closed");
                            return {
                                ...prev,
                                canOpen: true
                            }
                        })
                    }, 500)
                    return {
                        ...prev,
                        isOpen: "recentlyClosed",
                        canOpen: false,
                        style: {
                            ...prev.style,
                            transform: `translate3d(0px,0px,0)`,
                        }
                    }
                } else {
                    changeScrolling("open")
                    // additor(id, "open");
                    setTimeout(() => {
                        setState((prev) => {
                            additor(id, "open");
                            return {
                                ...prev,
                                canOpen: true
                            }
                        })
                    }, 500)
                    return {
                        ...prev,
                        isOpen: "open",
                        canOpen: false,
                        style: {
                            ...prev.style,
                            transform: transform
                        }
                    }
                }
            } else {
                return prev;
            }
        })
    },[additor, id])

    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    });
    useEffect(() => {
        let isMounted = true;

        const debouncedHandleResize = debounce(function handleResize() {
            if (isMounted) {
                setDimensions({
                    height: window.innerHeight,
                    width: window.innerWidth
                })
            }
        }, 0)
        window.addEventListener('resize', debouncedHandleResize)
    });
    useEffect(() => {
        let col = [];
        // col.push(["#FFB627","#E2711D"])
        col.push(["#FFA737", "#DC851F", "#4C5B5C"])
        col.push(["#607B7D", "#3A606E", "#E0FBFC"])
        // col.push(["#03F7EB","#00B295"])
        // col.push(["#FFE5D4","#EFC7C2"])
        // col.push(["#B0CA87", "#809848","#8C5E58"])
        // col.push(["#442220", "#2E0014","#CFCFEA"])
        col.push(["#93aba7", "#AD9BAA", "#39393A"])
        // col.push(["#93aba7", "#AD9BAA", "#39393A"])
        // col.push(["#A13D63", "#8c4161","#E3D7FF"])
        let i = parseInt(Math.random() * col.length);
        let icon = peopleWhite
        if (i === 1){
            icon = people
        }
        setState((prev) => {
            return {
                ...prev,
                colors: col[i],
                style: {
                    transform: "translate3d(0,0,0)",
                    background: `linear-gradient(135deg, ${col[i][0]},${col[i][1]})`,
                    boxShadow: `3px 3px 10px ${col[i][1]}`,
                    color: `${col[i][2]}`,
                    icon: icon
                }
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

    if (state.isOpen === "open") {
        postCls.push(classes.open);
    } else if (state.isOpen === "recentlyClosed") {
        postCls.push(classes.recentlyClosed);
    }
    const onClick = (map, coord) => {
        const {latLng} = coord;
        const lat = latLng.lat();
        const lng = latLng.lng();
        console.log(lat);
        console.log(lng);
    }


    return (
        <div className={classes.PostWrap}>
            <div className={postCls.join(" ")} style={state.style} ref={postRef}>
                <Transition
                    in={state.isOpen === "open"}
                    timeout={{
                        enter: 200,
                        exit: 500
                    }}
                    mountOnEnter
                    unmountOnExit
                >
                    {state => <MapContainer lat={latitude} lng={longitude} onClick={onClick} radius={availableDistance}
                                            styles={dimensions.width < 1100 ?
                                                state === "entering" || state === "exiting" ? enteringMobileMap
                                                    : openedMobileMap
                                                :
                                                state === "entering" || state === "exiting" ? enteringMap
                                                    : openedMap}/>}
                </Transition>
                <div className={classes.PostContent}>
                    <div className={classes.Title}>{title}</div>
                    <div className={classes.SubTitle}>{subTitle}</div>
                    <div className={classes.ButtonWrap}>
                        <button className={classes.Button} style={{
                            background: state.colors[2],
                            color: state.colors[0]
                        }}
                                onClick={() => {
                                    openPost();
                                }}>
                            {state.isOpen !== "open" ? "Open" : "Close"}
                        </button>
                        <button className={classes.AddFriend} style={{
                            background: state.colors[2],
                            color: state.colors[0]
                        }}>
                            +
                        </button>
                        {state.isOpen === "open" ?
                            <>
                                <button className={classes.HereButton} style={{
                                    background: state.colors[2],
                                    color: state.colors[0]
                                }}>
                                    I'M HERE
                                </button>
                                <div>

                                </div>
                            </>
                            : null}
                    </div>
                    {/*{state.isOpen === "open" ?*/}
                    {/*    <div className={classes.StatWrap}>*/}
                    {/*        <div className={classes.Stat} style={{color: state.color}}>*/}
                    {/*            <img src={state.icon}/>{hereAmount}*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*:null}*/}
                </div>
            </div>
        </div>
    );
};

export default React.memo(Post, (prevProps, nextProps) => {
    return true;
});