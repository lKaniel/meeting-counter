import React, {useCallback, useEffect, useRef, useState} from 'react';
import classes from "./PostCreator.module.scss";
import {isOpen, setOpen} from "../../functions/сanOpen/canOpen";
import changeScrolling, {getScrollWidth} from "../../functions/changeScroll/changeScroll";
import {Transition} from "react-transition-group";
import {Map} from "google-maps-react";
import MapContainer from "../Map/MapContainer";
import Input from "../UI/Input/Input";
import axios from "axios";
import {getToken} from "../../App";

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
    position: "fixed"
};

const openedMobileMap = {
    width: '100%',
    height: '35%',
    transition: "height .4s ease-in-out",
    zIndex: 10000,
    position: "relative"
};

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

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
            }, 0)
            window.addEventListener('resize', debouncedHandleResize)
        });

        const [state, setState] = useState({
            isOpen: false,
            isClosing: false,
            markerLat: 0,
            markerLng: 0,
            zoom: 3,
            isFormValid: false,
            createPostForm: {
                radius: {
                    value: "0",
                    type: "text",
                    label: "Access radius",
                    hint: "radius",
                    errorMessage: "Enter correct access radius",
                    valid: false,
                    touched: false,
                    validation: {
                        required: true,
                        minLength: 1,
                        isInt: true
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
                description: {
                    value: "",
                    type: "text",
                    label: "Description",
                    hint: "Description",
                    errorMessage: "Enter correct description",
                    valid: false,
                    touched: false,
                    validation: {
                        required: true,
                        minLength: 10
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

        const validate = (value, validation) => {
            if (!validation) {
                return true;
            }
            let isValid = true;
            if (validation.required) {
                isValid = value.trim() !== "" && isValid;
            }
            if (validation.email) {
                isValid = validateEmail(value) && isValid;
            }
            if (validation.minLength) {
                isValid = value.length >= validation.minLength && isValid;
            }

            return isValid;
        }
        const updateFrame = useCallback((event, controllName) => {
            const form = {...state.createPostForm};
            const control = form[controllName];
            control.value = event.target.value;
            control.touched = true;
            control.valid = validate(control.value, control.validation);

            let isFormValid = true;
            if (controllName === "radius") {
                if (control.value === ""){
                    control.value = "0"
                }
                control.value = parseInt(control.value) ;
            }
            form[controllName] = control;

            Object.keys(form).forEach(name => {
                isFormValid = form[name].valid && isFormValid;
            })
            setState(prevState => {
                return {
                    ...prevState,
                    loginForm: form,
                    isFormValid
                }
            })
        }, []);

        const renderInputs = () => {
            const inputs = Object.keys(state.createPostForm).map((controllName, index) => {
                const control = state.createPostForm[controllName];
                return (
                    <Input
                        key={controllName + index}
                        label={control.label}
                        type={control.type}
                        value={control.value}
                        valid={control.valid}
                        touched={control.touched}
                        shouldValidate={!!control.validation}
                        errorMessage={control.errorMessage}
                        onChange={event => updateFrame(event, controllName)}
                        inverse={true}
                    />
                )
            });
            return inputs
        }

        const submitCreateForm = async (event) => {
            event.preventDefault();
            try {
                const headers = {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        "Authorization": `Bearer ${getToken()}`
                    }
                }
                const authData = {
                    title: state.createPostForm.title.value,
                    description: state.createPostForm.description.value,
                    longitude: state.markerLng,
                    latitude: state.markerLat,
                    available_distance: parseInt(state.createPostForm.radius.value),
                    zoom: state.zoom,
                    here_amount: 0,
                    start_date: "2017-01-13",
                    finish_date: "2017-01-14",
                }
                const response = await axios.post(`http://localhost:9090/meeting/create`, authData, headers);
                console.log(response.data);
            } catch (e) {
            }

        }

        const onClick = function (t, map, coord) {
            const {latLng} = coord;
            const lat = latLng.lat();
            const lng = latLng.lng();
            setState((prev => {
                return {
                    ...prev,
                    markerLng: lng,
                    markerLat: lat
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

        const openButtonCls = [classes.OpenButton];
        if (state.isOpen) {
            openButtonCls.push(classes.open);
        }
        return (
            <div className={postCreatorCls.join(" ")} ref={postCreatorRef}>
                <button className={openButtonCls.join(" ")} onClick={openPostCreator}>{state.isOpen ? "+" : "+"}</button>
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
                                <MapContainer lat={state.markerLat}
                                              lng={state.markerLng}
                                              markerLng={state.markerLng}
                                              markerLat={state.markerLat} zoom={state.zoom}
                                              radius={parseInt(state.createPostForm.radius.value)} onClick={onClick}
                                              onZoom={onZoom}
                                              styles={dimensions.width < 1100 ? openedMobileMap : openedMap}/>
                                <form className={classes.PostCreatorContent} onSubmit={submitCreateForm}>
                                    {renderInputs()}
                                    <input type="submit" value="Create"
                                           disabled={!((state.isFormValid) && !(getToken() === ""))}
                                           className={classes.RegisterBtn}/>
                                </form>
                            </div>
                        )
                    }}
                </Transition>
            </div>
        );
    }
;

export default PostCreator;