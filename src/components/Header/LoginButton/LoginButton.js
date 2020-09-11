import React, {useEffect, useRef, useState} from 'react';
import classes from "./LoginButton.module.scss";
const LoginButton = () => {

    const [state, setState] = useState({
        isOpen: false
    });

    const loginRef = useRef();
    useEffect(() => {
        let vh = window.innerHeight * 0.01;
        loginRef.current.style.setProperty('--vh', `${vh}px`);
    });


    return (
        <div className={classes.LoginButton} ref={loginRef}>
            <div className={classes.LoginText}>Login</div>
        </div>
    );
};

export default LoginButton;