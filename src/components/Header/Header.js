import React from 'react';
import classes from "./Header.module.scss"
import LoginButton from "./LoginButton/LoginButton";
import Boxer from "./boxer/Boxer";
import SearchBar from "./SearchBar/SearchBar";
const Header = () => {
    return (
        <div className={classes.Header} id="header">
            <LoginButton/>
            <SearchBar/>
            {/*<Boxer/>*/}
        </div>
    );
};

export default Header;