import React, {useCallback, useEffect, useState} from 'react';
import classes from "./PostsList.module.scss"
import Post from "../Post/Post";
import LoginButton from "../Header/LoginButton/LoginButton";
import SearchBar from "../SearchBar/SearchBar";

const PostsList = () => {
        const [state, setState] = useState({
            posts: []
        });

        const openPost = (id) => {
            if (state.posts[id].isOpen === "open") {
                setState((prev) => {
                    const newPosts = [...prev.posts];
                    console.log(id);
                    console.log(newPosts[id]);
                    for (let i = 0; i < newPosts.length; i++) {
                        newPosts[i].isOpen = "closed"
                    }
                    newPosts[id].isOpen = "recentlyClosed";
                    return {
                        ...prev,
                        posts: newPosts
                    }
                })
            } else {
                setState((prev) => {
                    const newPosts = [...prev.posts];
                    console.log(id);
                    console.log(newPosts[id]);
                    for (let i = 0; i < newPosts.length; i++) {
                        newPosts[i].isOpen = "closed"
                    }
                    newPosts[id].isOpen = "open";
                    return {
                        ...prev,
                        posts: newPosts
                    }
                })
        }
    }
;

useEffect(() => {
    setState((prev) => {
        const posts = [];
        for (let i = 0; i < 30; i++) {
            posts.push({
                id: i,
                title: "Simple Title",
                startDate: "Tuesday",
                finishDate: "Wednesday",
                latitude: 48.00,
                longitude: -122.00,
                isOpen: "closed"
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
        <Post id={element.id} title={element.title} key={index} startDate={element.startDate}
              finishDate={element.finishDate} longitude={element.longitude} latitude={element.latitude}
              isOpen={element.isOpen}
              openPost={openPost}/>
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