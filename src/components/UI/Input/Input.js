import React from 'react';
import classes from "./Input.module.scss";

const isInvalid = (valid, touched, shouldValidate) => {
    return !valid && shouldValidate && touched;
}

const Input = ({type, hint, onChange, label, value, valid, touched, shouldValidate, errorMessage, inverse}) => {
    const htmlFor = `${type}-${Math.random()}`
    const wrapperCls = [classes.Wrapper];
    if (isInvalid(valid, touched, shouldValidate)) {
        wrapperCls.push(classes.invalid);
    }
    if (inverse){
        wrapperCls.push(classes.inverse)
    }
    return (
        <div className={wrapperCls.join(" ")}>
            <label htmlFor={htmlFor} className={classes.Label}>{label}</label>
            <input id={htmlFor} className={classes.Input} placeholder={hint} type={type || "text"} onChange={onChange}
                   value={value}/>
            <span>{errorMessage}</span>
        </div>
    );
};

export default Input;