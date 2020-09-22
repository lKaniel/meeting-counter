import React, {useCallback, useEffect, useRef, useState} from 'react';
import classes from "./LoginButton.module.scss";
import {Transition} from "react-transition-group";
import Input from "../../UI/Input/Input";
import changeScrolling from "../../../functions/changeScroll/changeScroll";
import {isOpen, setOpen} from "../../../functions/сanOpen/canOpen";
import GoogleLogin, {useGoogleLogin} from "react-google-login";
import jwt from "jwt-simple";
import axios from "axios";
import {getToken, saveToken} from "../../../App";
import PostsList from "../../PostsList/PostsList";

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

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const failureResponseGoogle = (response) => {
    console.log(response.profileObj);
    console.log(response.tokenId);
    return true;
}

const LoginButton = () => {
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
        isFormValid: false,
        display: "login",
        loginForm: {
            mail: {
                value: "",
                type: "email",
                label: "E-mail",
                hint: "example@mail.com",
                errorMessage: "Enter correct email",
                valid: false,
                touched: false,
                validation: {
                    required: true,
                    email: true
                }
            },
            password: {
                value: "",
                type: "password",
                label: "Password",
                hint: "password",
                errorMessage: "Enter correct password",
                valid: false,
                touched: false,
                validation: {
                    required: true,
                    minLength: 6
                }
            }
        },
        registerForm: {
            mail: {
                value: "",
                type: "email",
                label: "E-mail",
                hint: "example@mail.com",
                errorMessage: "Enter correct email",
                valid: false,
                touched: false,
                validation: {
                    required: true,
                    email: true
                }
            },
            name: {
                value: "",
                type: "text",
                label: "Name",
                hint: "Jhon",
                errorMessage: "Enter correct name",
                valid: false,
                touched: false,
                validation: {
                    required: true,
                    minLength: 1
                }
            },
            lastName: {
                value: "",
                type: "text",
                label: "Last name",
                hint: "Jhonson",
                errorMessage: "Enter correct last name",
                valid: false,
                touched: false,
                validation: {
                    required: true,
                    minLength: 1
                }
            },
            password: {
                value: "",
                type: "password",
                label: "Password",
                hint: "password",
                errorMessage: "Enter correct password",
                valid: false,
                touched: false,
                validation: {
                    required: true,
                    minLength: 6
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
        },
        user: {
            name: "",
            lastName: "",
            posts: []
        }
    });

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

    const updateLoginFrame = useCallback((event, controllName) => {
        const loginForm = {...state.loginForm};
        const controll = loginForm[controllName];
        controll.value = event.target.value;
        controll.touched = true;
        controll.valid = validate(controll.value, controll.validation);
        loginForm[controllName] = controll;

        let isFormValid = true;

        Object.keys(loginForm).forEach(name => {
            isFormValid = loginForm[name].valid && isFormValid;
        })
        setState(prevState => {
            return {
                ...prevState,
                loginForm,
                isFormValid
            }
        })
    }, []);

    const updateRegisterForm = useCallback((event, controllName) => {
        const registerForm = {...state.registerForm};
        const controll = registerForm[controllName];
        controll.value = event.target.value;
        controll.touched = true;
        controll.valid = validate(controll.value, controll.validation);
        registerForm[controllName] = controll;

        let isFormValid = true;

        Object.keys(registerForm).forEach(name => {
            isFormValid = registerForm[name].valid && isFormValid;
        })
        setState(prevState => {
            return {
                ...prevState,
                registerForm,
                isFormValid
            }
        })
    }, []);

    const openLogin = useCallback(() => {
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

    const loginRef = useRef();
    useEffect(() => {
        let vh = window.innerHeight * 0.01;
        loginRef.current.style.setProperty('--vh', `${vh}px`);
    });

    const LoginFrameCls = [classes.LoginFrame]

    const renderLoginInputs = () => {
        const inputs = Object.keys(state.loginForm).map((controllName, index) => {
            const control = state.loginForm[controllName];
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
                    onChange={event => updateLoginFrame(event, controllName)}
                />
            )
        });
        return inputs
    }

    const renderRegisterInputs = () => {
        const inputs = Object.keys(state.registerForm).map((controllName, index) => {
            const control = state.registerForm[controllName];
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
                    onChange={event => updateRegisterForm(event, controllName)}
                />
            )
        });
        return inputs
    }

    const submitLoginForm = async (event) => {
        event.preventDefault();
        try {
            const authData = {
                email: state.loginForm.mail.value,
                password: state.loginForm.password.value
            }
            const response = await axios.post(`http://localhost:9090/login`, authData);
            // const response = await axios.get(`http://localhost:9090/user/hello`, authData);
            console.log(response);
            if (response.status === 200 && response.data.status === 200) {
                saveToken(response.data.message);
            }
        } catch (e) {
            console.log(e)
        }
    }

    const submitRegisterForm = async (event) => {
        event.preventDefault();
        try {
            const authData = {
                email: state.registerForm.mail.value,
                first_name: state.registerForm.name.value,
                last_name: state.registerForm.lastName.value,
                password: state.registerForm.password.value,
                confirm_password: state.registerForm.repeatPassword.value
            }
            const response = await axios.post(`http://localhost:9090/registration`, authData);
            console.log(response.data);
        } catch (e) {
            console.log(e)
        }

    }

    const loginButtonClick = () => {
//todo
//        authorisation handler
    }

    const openRegisterButtonClick = () => {
        setState((prev) => {
            return {
                ...prev,
                display: "register"
            }
        })
    }

    const registerButtonClick = async () => {
        axios.post("http://localhost:3000", state.loginForm.password)
            .then(r => {
                console.log(r)
            })
            .catch(error => console.log(error));
    }

    const successResponseGoogle = async (response) => {
        try {
            const serverResponse = await axios.post(`http://localhost:9090/google-login?token=${response.tokenId}`);
            if (serverResponse.status === 200 && serverResponse.data.status === 200) {
                saveToken(serverResponse.data.message);
                getInfoFromToken();
            }
        } catch (e) {
            console.log(e)
        }
        return true;
    }

    const getInfoFromToken = async () => {
        const authData = {
            // ...authData,
            headers: {
                "Access-Control-Allow-Origin" : "*",
                "Content-type": "Application/json",
                "Authorization": `Bearer ${getToken()}`
            }
        }
        const response = await axios.get(`http://localhost:9090/user/getUser`, authData);
        console.log(response);
        const user = {
            name: "Bob",
            lastName: "Marley",
            posts: [
                {
                    id: 0,
                    title: "Simple Title",
                    subTitle: "This is description and here you can write something.",
                    startDate: "Tuesday",
                    finishDate: "Wednesday",
                    latitude: 48.00,
                    longitude: -122.00,
                    zoom: 12,
                    hereAmount: 32200000,
                    availableDistance: 5000 * Math.random(),
                    canOpen: true
                },
                {
                    id: 2,
                    title: "Simple Title",
                    subTitle: "This is description and here you can write something.",
                    startDate: "Tuesday",
                    finishDate: "Wednesday",
                    latitude: 48.00,
                    longitude: -122.00,
                    zoom: 12,
                    hereAmount: 32200000,
                    availableDistance: 5000 * Math.random(),
                    canOpen: true
                },
            ]
        };
        console.log(123)
        setState((prev) => {
            return {
                ...prev,
                user
            }
        })
    }

    return (
        <div className={classes.LoginContainer} ref={loginRef}>
            <div className={classes.LoginText}
                 onClick={openLogin}>{state.isOpen ? "Close" : state.user.name !== "" ? "Account" : "Login"}</div>
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
                        LoginFrameCls.push(classes.open)
                    } else if (state1 === "exiting") {
                        setOpen(false)
                        LoginFrameCls.push(classes.closing)
                    } else if (state1 === "exited") {
                        setOpen(true);
                    }
                    return (
                        <div className={LoginFrameCls.join(" ")}>
                            {
                                getToken() !== "" ?
                                    <div className={classes.ProfileFrame}>
                                        <div className={classes.Name}>
                                            Your meetings
                                        </div>
                                        <PostsList posts={state.user.posts}/>
                                    </div>
                                    : state.display === "login" ?
                                    <form className={classes.LoginForm} onSubmit={submitLoginForm}>
                                        <div className={classes.LoginTitle}>Sign in</div>
                                        {renderLoginInputs()}
                                        <input type="submit" value="Login" disabled={!state.isFormValid}
                                               onClick={loginButtonClick} className={classes.LoginBtn}/>
                                        <GoogleLogin
                                            clientId="552928003235-0flet39ibonp7pi29k6tseoadkp5pv8a.apps.googleusercontent.com"
                                            buttonText="Login"
                                            render={renderProps => (
                                                <button onClick={renderProps.onClick}
                                                        disabled={renderProps.disabled}
                                                        className={classes.GoogleBtn}>Google</button>
                                            )}
                                            onSuccess={successResponseGoogle}
                                            onFailure={failureResponseGoogle}
                                            cookiePolicy={'single_host_origin'}
                                        />
                                        <input type="button" value="Register"
                                               onClick={openRegisterButtonClick} className={classes.RegisterBtn}/>
                                    </form>
                                    :
                                    <form className={classes.RegisterForm} onSubmit={submitRegisterForm}>
                                        <div className={classes.LoginTitle}>Register</div>
                                        {renderRegisterInputs()}
                                        <input type="submit" value="Register" disabled={!state.isFormValid}
                                               className={classes.RegisterBtn}/>
                                    </form>
                            }

                        </div>
                    )
                }
                }

            </Transition>
        </div>
    );
};

export default LoginButton;