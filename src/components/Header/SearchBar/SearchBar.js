import React, {useCallback, useRef, useState} from 'react';
import classes from "./SearchBar.module.scss"
import Post from "../../Post/Post";
const SearchBar = ({search, onSearch}) => {

    const [state, setState] = useState({
        searchValue: "",
        showedRows: 1,
        posts: [],
        isLoading: false,
        error: null,
        open: false
    })
    const searchInputCls = [classes.SearchInput];

    const searchBarWrapCls = [classes.SearchBarWrap];

    if (state.open){
        searchBarWrapCls.push(classes.open)
    }

    return (
        <div className={searchBarWrapCls.join(" ")} id="search">
            <div className={classes.SearchBar}>
                <input type="text" className={searchInputCls.join(" ")} value={search} onChange={onSearch}/>
                <div className={classes.SearchButton} onClick={null
                    //todo
                    // () =>
                    // (
                    // setState((prev) => {
                    //     return {...prev, open: !prev.open}
                    // })
                    // )
                }>
                    <div className={classes.LensWrap}>
                        <div className={classes.Line}/>
                        <div className={classes.Circle}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;