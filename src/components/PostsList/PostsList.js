import React, {useCallback, useEffect, useRef, useState} from 'react';
import classes from "./PostsList.module.scss"
import Post from "../Post/Post";

function roundDec(nbr, dec_places) {
    var mult = Math.pow(10, dec_places);
    return Math.round(nbr * mult) / mult;
}

const PostsList = () => {
        const [state, setState] = useState({
            posts: []
        });

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
                        hereAmount: 32200000,
                        availableDistance: 5000 * Math.random(),
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
            let hereAmount = element.hereAmount;
            if (hereAmount / 10000000 >= 1) {
                hereAmount = roundDec(hereAmount / 1000000, 0) + "m"
            }else if (hereAmount / 1000000 >= 1) {
                hereAmount = roundDec(hereAmount / 1000000, 1) + "m"
            }else if (hereAmount / 10000 >= 1) {
                hereAmount = roundDec(hereAmount / 1000, 0) + "k"
            }else if (hereAmount / 1000 >= 1) {
                hereAmount = roundDec(hereAmount / 1000, 1) + "k"
            }
            return (
                <Post id={element.id} title={element.title} subTitle={element.subTitle} key={index}
                      startDate={element.startDate} finishDate={element.finishDate} longitude={element.longitude}
                      latitude={element.latitude} hereAmount={hereAmount} availableDistance={element.availableDistance}
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