import React, {useEffect, useState} from 'react';
import classes from "./PostsList.module.scss"
import Post from "../Post/Post";

const PostsList = ({id, title, startDate, finishDate}) => {
    const [state, setState] = useState({
        posts: []
    });

    useEffect(() => {
        setState((prev) => {
            const posts = [];
            posts.push({
                id: 0,
                title: "Simple Title",
                startDate: "Tuesday",
                finishDate: "Wednesday"
            })
            posts.push({
                id: 1,
                title: "Simple Title",
                startDate: "Tuesday",
                finishDate: "Wednesday"
            })
            posts.push({
                id: 2,
                title: "Simple Title",
                startDate: "Tuesday",
                finishDate: "Wednesday"
            })
            return {
                ...prev,
                posts
            }
        })
    }, []);

    const posts = state.posts.map((element, index) => {
        return (
            <Post id={element.id} title={element.title} key={index} startDate={element.startDate}
                  finishDate={element.finishDate}/>
        )
    });

    return (
        <div className={classes.PostsList}>
            {posts}
        </div>
    );
};

export default PostsList;