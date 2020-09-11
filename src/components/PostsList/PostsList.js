import React, {useCallback, useEffect, useRef, useState} from 'react';
import classes from "./PostsList.module.scss"
import Post from "../Post/Post";
import {CSSTransition} from 'react-transition-group';
import LoginButton from "../Header/LoginButton/LoginButton";
import SearchBar from "../SearchBar/SearchBar";

let scrollable = true;

const changeScrolling = () => {
    if (scrollable) {
        document.getElementsByTagName("html")[0].style.overflow = "hidden";

        let div = document.createElement('div');
        div.style.overflowY = 'scroll';
        div.style.width = '50px';
        div.style.height = '50px';
        document.body.append(div);
        let scrollWidth = div.offsetWidth - div.clientWidth;
        div.remove();
        document.getElementsByClassName("layout")[0].style.paddingRight = `${scrollWidth}px`;
        // document.getElementById("header").style.paddingRight = `${scrollWidth}px`;
        scrollable = false;
    } else {
        document.getElementsByTagName("html")[0].style.overflowY = "auto";
        document.getElementsByClassName("layout")[0].style.paddingRight = `0px`;
        scrollable = true;
    }
}

const PostsList = () => {
        const [state, setState] = useState({
            posts: [],
            canOpen: true
        });

        // const openPost = useCallback((id) => {
        //     setState((prev) => {
        //         if (prev.canOpen) {
        //             console.log(prev.canOpen);
        //             changeScrolling();
        //             if (prev.posts[id].isOpen === "open") {
        //                 const newPosts = [...prev.posts];
        //                 for (let i = 0; i < newPosts.length; i++) {
        //                     newPosts[i].isOpen = "closed"
        //                 }
        //                 newPosts[id].isOpen = "recentlyClosed";
        //                 newPosts[id].canOpen = false;
        //                 console.log("TIMEOUT SET");
        //                 setTimeout(() => {
        //                     console.log("TIMEOUTET");
        //                     setState((prev) => {
        //                         newPosts[id].canOpen = true;
        //                         const posts = newPosts.slice();
        //                         return {
        //                             ...prev,
        //                             canOpen: true,
        //                             posts
        //                         }
        //                     })
        //                 }, 500)
        //                 return {
        //                     ...prev,
        //                     posts: newPosts,
        //                     canOpen: false
        //                 }
        //             } else {
        //                 const newPosts = [...prev.posts];
        //                 for (let i = 0; i < newPosts.length; i++) {
        //                     newPosts[i].isOpen = "closed"
        //                 }
        //                 newPosts[id].isOpen = "open";
        //                 newPosts[id].canOpen = false;
        //                 console.log("TIMEOUT SET");
        //                 setTimeout(() => {
        //                     console.log("TIMEOUTET");
        //                     setState((prev) => {
        //                         newPosts[id].canOpen = true;
        //                         const posts = newPosts.slice();
        //                         return {
        //                             ...prev,
        //                             canOpen: true,
        //                             posts
        //                         }
        //                     })
        //                 }, 500)
        //                 return {
        //                     ...prev,
        //                     posts: newPosts,
        //                     canOpen: false
        //                 }
        //             }
        //         } else {
        //             return prev;
        //         }
        //     })
        //     // if (state.canOpen) {
        //     //     changeScrolling();
        //     //     if (state.posts[id].isOpen === "open") {
        //     //         setState((prev) => {
        //     //             const newPosts = [...prev.posts];
        //     //             for (let i = 0; i < newPosts.length; i++) {
        //     //                 newPosts[i].isOpen = "closed"
        //     //             }
        //     //             newPosts[id].isOpen = "recentlyClosed";
        //     //             return {
        //     //                 ...prev,
        //     //                 posts: newPosts,
        //     //                 canOpen: false
        //     //             }
        //     //         })
        //     //     } else {
        //     //         setState((prev) => {
        //     //             const newPosts = [...prev.posts];
        //     //             for (let i = 0; i < newPosts.length; i++) {
        //     //                 newPosts[i].isOpen = "closed"
        //     //             }
        //     //             newPosts[id].isOpen = "open";
        //     //             return {
        //     //                 ...prev,
        //     //                 posts: newPosts,
        //     //                 canOpen: false
        //     //             }
        //     //         })
        //     //     }
        //     //     setTimeout(()=>{
        //     //         setState((prev)=>{
        //     //             return{
        //     //                 ...prev,
        //     //                 canOpen: true
        //     //             }
        //     //         })
        //     //     },500)
        //     //     return true;
        //     // }
        //     // return false;
        // }, [state.posts]);

        const changeOpennes = useCallback((id, status) => {
            setState((prev) => {
                // let posts = prev.posts;
                // if (prev.canOpen === true) {
                //     for (let i = 0; i < posts.length; i++) {
                //         posts[i].isOpen = "closed";
                //     }
                //     posts[id].isOpen = status;
                // }
                return {
                    ...prev,
                    canOpen: !prev.canOpen,
                    // posts
                }
            })
        })

        useEffect(() => {
            setState((prev) => {
                const posts = [];
                for (let i = 0; i < 30; i++) {
                    posts.push({
                        id: i,
                        title: "Simple Title",
                        subTitle: "This is description and here you can write something.",
                        startDate: "Tuesday",
                        finishDate: "Wednesday",
                        latitude: 48.00,
                        longitude: -122.00,
                        isOpen: "closed",
                        hereAmount: 32,
                        availableDistance: 999,
                        canOpen: true
                    })
                }
                return {
                    ...prev,
                    posts
                }
            })
        }, []);

        const posts = state.posts.map((element, index) => {
            return (
                <Post id={element.id} title={element.title} subTitle={element.subTitle} key={index}
                      startDate={element.startDate} finishDate={element.finishDate} longitude={element.longitude}
                      latitude={element.latitude} additor={changeOpennes} isOpen={element.isOpen}
                      hereAmount={element.hereAmount} availableDistance={element.availableDistance}
                />
            )
        });

        return (
            <div className={classes.PostsList}>
                {posts}
            </div>
        );
    }
;

export default PostsList;