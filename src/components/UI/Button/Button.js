import React from 'react';
import classes from "./Button.module.scss";
const Button = ({type, onClick, disabled, styles}) => {
    const btnClass = [classes.Button, classes[type]]

    return (
        <button
            className={btnClass.join(" ")}
            onClick={onClick}
            disabled={disabled}
            style={styles}
        >
            
        </button>
    );
};

export default Button;