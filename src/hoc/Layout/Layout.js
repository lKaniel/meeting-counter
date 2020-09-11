import React from 'react';
import classes from "./Layout.scss"
const Layout = ({children}) => {
    return (
        <div className={"layout"}>
            {children}
        </div>
    );
};

export default Layout;