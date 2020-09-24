import React from 'react';
import classes from "./Header.module.scss"
import LoginButton from "./LoginButton/LoginButton";
import Boxer from "./boxer/Boxer";
import SearchBar from "./SearchBar/SearchBar";
const Header = ({search, onSearch}) => {
    return (
        <div className={classes.Header} id="header">
            <LoginButton/>
            <SearchBar search={search} onSearch={onSearch}/>
            {/*<Boxer/>*/}
        </div>
    );
};

export default Header;