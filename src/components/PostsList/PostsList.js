import React, {useCallback, useEffect, useRef, useState} from 'react';
import classes from "./PostsList.module.scss"
import Post from "../Post/Post";
import axios from "axios";
import LoginButton from "../Header/LoginButton/LoginButton";

function roundDec(nbr, dec_places) {
    var mult = Math.pow(10, dec_places);
    return Math.round(nbr * mult) / mult;
}

const PostsList = ({posts, search}) => {
        const [state, setState] = useState({
            posts: []
        });

        useEffect(() => {
            const getPosts = async ()=>{
                let posts = []
                try{
                    const response = await axios.get(`http://localhost:9090/meeting/generate/1?title=${search}`);
                    posts = response.data;
                }catch (e){
                }
                console.log(posts);
                setState((prev) => {
                    return {
                        ...prev,
                        posts
                    }
                })
            }
            getPosts().then().catch();
            setInterval(()=>{
                getPosts().then().catch();
            },10000)
        }, []);

        if (posts === undefined) {
            posts = state.posts.map((element, index) => {
                let hereAmount = element.here_amount;
                if (hereAmount / 10000000 >= 1) {
                    hereAmount = roundDec(hereAmount / 1000000, 0) + "m"
                } else if (hereAmount / 1000000 >= 1) {
                    hereAmount = roundDec(hereAmount / 1000000, 1) + "m"
                } else if (hereAmount / 10000 >= 1) {
                    hereAmount = roundDec(hereAmount / 1000, 0) + "k"
                } else if (hereAmount / 1000 >= 1) {
                    hereAmount = roundDec(hereAmount / 1000, 1) + "k"
                }
                return (
                    <Post id={element.id} title={element.title} subTitle={element.description} key={index}
                          startDate={element.startDate} finishDate={element.finishDate} longitude={element.longitude}
                          latitude={element.latitude} hereAmount={hereAmount} availableDistance={element.available_distance}
                          zoom={element.zoom}
                    />
                )
            });
        } else {
            posts = posts.map((element, index) => {
                let hereAmount = element.here_amount;
                if (hereAmount / 10000000 >= 1) {
                    hereAmount = roundDec(hereAmount / 1000000, 0) + "m"
                } else if (hereAmount / 1000000 >= 1) {
                    hereAmount = roundDec(hereAmount / 1000000, 1) + "m"
                } else if (hereAmount / 10000 >= 1) {
                    hereAmount = roundDec(hereAmount / 1000, 0) + "k"
                } else if (hereAmount / 1000 >= 1) {
                    hereAmount = roundDec(hereAmount / 1000, 1) + "k"
                }
                return (
                    <Post id={element.id} title={element.title} subTitle={element.description} key={index}
                          startDate={element.startDate} finishDate={element.finishDate} longitude={element.longitude}
                          latitude={element.latitude} hereAmount={hereAmount} availableDistance={element.available_distance}
                    />
                )
            });

        }

        return (
            <div className={classes.PostsList}>
                {posts}
            </div>
        );
    }
;

export default PostsList;