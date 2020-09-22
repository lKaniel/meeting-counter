import React, {useCallback, useEffect, useRef, useState} from 'react';
import classes from "./PostCreator.module.scss";
import {isOpen, setOpen} from "../../functions/сanOpen/canOpen";
import changeScrolling, {getScrollWidth} from "../../functions/changeScroll/changeScroll";
import {Transition} from "react-transition-group";
import {Map} from "google-maps-react";
import MapContainer from "../Map/MapContainer";
import Input from "../UI/Input/Input";

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

const openedMap = {
    width: '50%',
    height: '100%',
    transition: "width .4s ease-in-out",
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

const PostCreator = () => {
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
            }, 20)
            window.addEventListener('resize', debouncedHandleResize)
        });

        const [state, setState] = useState({
            isOpen: false,
            isClosing: false,
            lat: 0,
            lng: 0,
            availableDistance: 30000,
            zoom: 3,
            markerLat: 0,
            markerLng: 0,
            createPostForm: {
                lat: {
                    value: 0,
                    type: "email",
                    label: "Latitude",
                    hint: "Latitude",
                    errorMessage: "Enter correct latitude",
                    valid: false,
                    touched: false,
                    validation: {
                        required: true,
                        minLength: 1
                    }
                },
                lng: {
                    value: 0,
                    type: "text",
                    label: "Longitude",
                    hint: "Longitude",
                    errorMessage: "Enter correct longitude",
                    valid: false,
                    touched: false,
                    validation: {
                        required: true,
                        minLength: 1
                    }
                },
                radius: {
                    value: 0,
                    type: "text",
                    label: "Access radius",
                    hint: "Access radius",
                    errorMessage: "Enter correct last Access radius",
                    valid: false,
                    touched: false,
                    validation: {
                        required: true,
                        minLength: 1
                    }
                },
                title: {
                    value: "",
                    type: "text",
                    label: "Title",
                    hint: "Title",
                    errorMessage: "Enter correct Title",
                    valid: false,
                    touched: false,
                    validation: {
                        required: true,
                        minLength: 3
                    }
                },
                repeatPassword: {
                    value: "",
                    type: "password",
                    label: "Repeat password",
                    hint: "password",
                    errorMessage: "Enter correct password",
                    valid: false,
                    touched: false,
                    validation: {
                        required: true,
                        minLength: 6
                    }
                }
            }
        })

        const openPostCreator = useCallback(() => {
            if (isOpen()) {
                setState(prevState => {
                        if (prevState.isOpen === true) {
                            changeScrolling("close");
                        } else {
                            changeScrolling("open");
                        }
                        return {
                            ...prevState,
                            isOpen: !prevState.isOpen
                        }
                    }
                )
            }
        }, [])

        const postCreatorRef = useRef();
        useEffect(() => {
            let vh = window.innerHeight * 0.01;
            postCreatorRef.current.style.setProperty('--vh', `${vh}px`);
            postCreatorRef.current.style.setProperty('--scroll', `${getScrollWidth()}px`);
        });


        const postCreatorCls = [classes.PostCreator];
        if (state.isOpen || state.isClosing) {
            postCreatorCls.push(classes.open);
        }
        const postWrapCls = [classes.PostCreatorWrap];


        const onClick = function (t, map, coord) {
            const {latLng} = coord;
            const lat = latLng.lat();
            const lng = latLng.lng();
            setState((prev => {
                return {
                    ...prev,
                    markerLat: lat,
                    markerLng: lng
                }
            }))
        }

        const onZoom = function (t, map, click) {
            setState((prev) => {
                return {
                    ...prev,
                    zoom: map.getZoom()
                }
            })
        }
        return (
            <div className={postCreatorCls.join(" ")} ref={postCreatorRef}>
                <button className={classes.OpenButton} onClick={openPostCreator}>{state.isOpen ? "-" : "+"}</button>
                <Transition
                    in={state.isOpen === true}
                    timeout={{
                        enter: 0,
                        exit: 500
                    }}
                    mountOnEnter
                    unmountOnExit
                >
                    {state1 => {
                        if (state1 === "entering") {
                            setOpen(false)
                        } else if (state1 === "entered") {
                            setOpen(true)
                            postWrapCls.push(classes.open)
                        } else if (state1 === "exiting") {
                            setOpen(false)
                            postWrapCls.push(classes.closing)
                        } else if (state1 === "exited") {
                            setOpen(true);
                        }
                        return (
                            <div className={postWrapCls.join(" ")}>
                                <MapContainer lat={state.markerLat} lng={state.markerLng} markerLng={state.markerLng}
                                              markerLat={state.markerLat} zoom={state.zoom}
                                              radius={state.availableDistance} onClick={onClick} onZoom={onZoom}
                                              styles={dimensions.width < 1100 ? openedMobileMap : openedMap}/>
                                <div className={classes.PostCreatorContent}>
                                    <Input/>
                                </div>
                            </div>
                        )
                    }}
                </Transition>
            </div>
        );
    }
;

export default PostCreator;