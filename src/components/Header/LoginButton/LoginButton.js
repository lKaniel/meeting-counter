import React, {useCallback, useEffect, useRef, useState} from 'react';
import classes from "./LoginButton.module.scss";
import {Transition} from "react-transition-group";
import Input from "./Input/Input";
import changeScrolling from "../../../functions/changeScroll/changeScroll";

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

    const openLogin = useCallback(() => {
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

    const submitLoginForm = (event) => {
        event.preventDefault()
    }

    const loginButtonClick = () => {
//todo
//        authorisation handler
    }

    const registerButtonClick = async () => {
//todo
//        registration handler
    }

    return (
        <div className={classes.LoginContainer} ref={loginRef}>
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
                    if (state1 === "entered") {
                        LoginFrameCls.push(classes.open)
                    } else if (state1 === "exiting") {
                        LoginFrameCls.push(classes.closing)
                    }
                    return (
                        <div className={LoginFrameCls.join(" ")}>
                            <form className={classes.LoginForm} onSubmit={submitLoginForm}>
                                <div className={classes.LoginTitle}>Sign in</div>
                                {renderLoginInputs()}
                                {/*<input name="mail" className={classes.LoginInput} placeholder="example@mail.com" type={"mail"} ref={loginMailRef} onChange={updateLogin}></input>*/}
                                {/*<input name="password" className={classes.LoginInput} placeholder="password" type={"password"} ref={loginPasswordRef} onChange={updateLogin}></input>*/}
                                <input type="submit" value="Submit" disabled={!state.isFormValid} onClick={loginButtonClick}/>
                            </form>
                        </div>
                    )
                }
                }

            </Transition>
            <div className={classes.LoginText} onClick={openLogin}>{state.isOpen ? "Close" : "Login"}</div>
        </div>
    );
};

export default LoginButton;