import React from 'react';
import classes from "./Header.module.scss"
import LoginButton from "./LoginButton/LoginButton";
import Boxer from "./boxer/Boxer";
const Header = () => {
    return (
        <div className={classes.Header}>
            <LoginButton/>
            {/*<Boxer/>*/}
        </div>
    );
};

export default Header;