import React, {useCallback, useEffect, useRef, useState} from 'react';
import classes from "./Post.module.scss"
import MapContainer from "../Map/MapContainer";
import {Transition} from "react-transition-group";
import {Map, Marker} from "google-maps-react";
import people from "../../icons/people.svg";
import peopleWhite from "../../icons/people-white.svg";
import changeScrolling from "../../functions/changeScroll/changeScroll";
import {getOpenedId, isOpen, setOpen, setOpenedId} from "../../functions/сanOpen/canOpen";
import axios from "axios";
import {getToken, saveToken} from "../../App";

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

const Post = ({id, title, subTitle, startDate, finishDate, longitude, latitude, hereAmount, availableDistance, zoom}) => {
    const [state, setState] = useState({
        isOpen: "closed",
        colors: ["#FFA737", "#DC851F", "#4C5B5C"],
        icon: peopleWhite,
        style: {
            background: `linear-gradient(135deg, #FFA737, #DC851F)`
        },
        isJoined: true
    })

    const openPost = useCallback(() => {
        const offset = getElementOffset(postRef.current);
        let transform;
        if (dimensions.width < 700) {
            transform = `translate3d(0px,${-offset.top + 20}px,0)`;
        } else {
            transform = `translate3d(${-offset.left + 10}px,${-offset.top + 20}px,0)`;
        }
        if (isOpen()) {
            setState((prev) => {
                if (prev.isOpen === "open") {
                    setOpen(false);
                    // additor(id, "recentlyClosed");
                    setTimeout(() => {
                        setOpen(true);
                        setOpenedId(-1);
                        changeScrolling("closed")
                        setState((prev) => {
                            // additor(id, "closed");
                            return {
                                ...prev,
                                isOpen: "closed"
                            }
                        })
                    }, 500)
                    return {
                        ...prev,
                        isOpen: "recentlyClosed",
                        style: {
                            ...prev.style,
                            transform: `translate3d(0px,0px,0)`,
                        }
                    }
                } else {
                    if (getOpenedId() === -1 || getOpenedId() === id) {
                        setOpen(false);
                        changeScrolling("open")
                        // additor(id, "open");
                        setTimeout(() => {
                            setOpen(true);
                            // additor(id, "open");
                        }, 500)
                        setOpenedId(id)
                        return {
                            ...prev,
                            isOpen: "open",
                            style: {
                                ...prev.style,
                                transform: transform
                            }
                        }
                    } else {
                        return {
                            ...prev
                        }
                    }
                }

            })
        }
    }, [id])

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
        col.push(["#B0CA87", "#809848", "#8C5E58"])
        col.push(["#442220", "#2E0014", "#CFCFEA"])
        col.push(["#93aba7", "#AD9BAA", "#39393A"])
        // col.push(["#93aba7", "#AD9BAA", "#39393A"])
        col.push(["#A13D63", "#8c4161", "#E3D7FF"])
        let i = parseInt(Math.random() * col.length);
        let icon = peopleWhite
        if (i === 1) {
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
        postCls.push(classes.closing);
    }
    const onClick = (map, coord) => {
        // const {latLng} = coord;
        // const lat = latLng.lat();
        // const lng = latLng.lng();
        // console.log(lat);
        // console.log(lng);
    }

    const onHereButtonClick = async ()=>{
        try {
            const authData = {
                // ...authData,
                headers: {
                    "Access-Control-Allow-Origin" : "*",
                    "Content-type": "Application/json",
                    "Authorization": `Bearer ${getToken()}`
                }
            }
            const response = await axios.post(`http://localhost:9090/user/add/${id}?longitude=${longitude}&latitude=${latitude}`, authData);
            console.log(response);
        } catch (e) {
            console.log(e)
        }
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
                    {state => <MapContainer inPost={true} zoom={zoom} lat={latitude} lng={longitude} markerLat={latitude} markerLng={longitude} onClick={onClick} radius={availableDistance}
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
                            {hereAmount}
                        </button>
                        {state.isOpen === "open" ?
                            <>
                                <button className={classes.HereButton} style={{
                                    background: state.colors[2],
                                    color: state.colors[0]
                                }}
                                onClick={onHereButtonClick}>
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