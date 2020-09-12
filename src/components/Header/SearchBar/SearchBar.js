import React, {useCallback, useRef, useState} from 'react';
import classes from "./SearchBar.module.scss"
import Post from "../../Post/Post";
const SearchBar = () => {

    const [state, setState] = useState({
        searchValue: "",
        showedRows: 1,
        posts: [],
        isLoading: false,
        error: null,
        open: false
    })

    const row = 5;
    const searchInputCls = [classes.SearchInput];

    let searchedPosts = [];
    if (state.searchValue === ""){
        searchedPosts = state.posts
    }else{
        for (let i = 0; i < state.posts.length; i++){
            if (state.posts[i].title.toUpperCase().includes(state.searchValue.toUpperCase())){
                searchedPosts.push(state.posts[i]);
            }
        }
        if (searchedPosts.length === 0){
            searchedPosts = state.posts
            searchInputCls.push(classes.error);
        }
    }

    const length = searchedPosts.length;
    searchedPosts = searchedPosts.slice(0,Math.min(row*state.showedRows, length));


    searchedPosts  =  searchedPosts.map((element , index) =>{
        return(
            <Post title={element.title} text={element.text} key={index} someAdditor={()=>{}} isPost = {true} notSimple = {true} illnes={element.disease} classif={element.classification} practicy ={element.practice} important = {element.important} recomendations = {element.recommendation} />
        )
    });

    const searchRef = useRef();

    const search = useCallback(()=>{
        setState((prev)=>{
            return{
                ...prev,
                searchValue: searchRef.current.value
            }
        })
    },[]);

    const searchBarWrapCls = [classes.SearchBarWrap];

    if (state.open){
        searchBarWrapCls.push(classes.open)
    }

    return (
        <div className={searchBarWrapCls.join(" ")} id="search">
            <div className={classes.SearchBar}>
                <input className={searchInputCls.join(" ")} ref={searchRef} onChange={search}/>
                <div className={classes.SearchButton} onClick={() => (
                    setState((prev) => {
                        return {...prev, open: !prev.open}
                    }))}>
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