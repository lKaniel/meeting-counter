import React, {useCallback, useEffect, useRef, useState} from 'react';
import classes from "./PostCreator.module.scss";
import {isOpen, setOpen} from "../../functions/сanOpen/canOpen";
import changeScrolling, {getScrollWidth} from "../../functions/changeScroll/changeScroll";
import {Transition} from "react-transition-group";

function debounce(fn, ms) {
    let timer;
    return _ => {
        clearTimeout(timer)
        timer = setTimeout(_ => {
            timer = null;
            fn.apply(this, arguments)
        }, ms)
    };
}

const PostCreator = () => {
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    });
    useEffect(() => {
        let isMounted = true;

        const debouncedHandleResize = debounce(function handleResize() {
            if (isMounted) {
                setDimensions({
                    height: window.innerHeight,
                    width: window.innerWidth
                })
            }
        }, 0)
        window.addEventListener('resize', debouncedHandleResize)
    });

    const [state, setState] = useState({
        isOpen: false,
        isClosing: false
    })

    const openPostCreator = useCallback(() => {
        if (isOpen()) {
            setState(prevState => {
                    if (prevState.isOpen === true) {
                        changeScrolling("close");
                    } else {
                        changeScrolling("open");
                    }
                    return {
                        ...prevState,
                        isOpen: !prevState.isOpen
                    }
                }
            )
        }
    }, [])

    const postCreatorRef = useRef();
    useEffect(() => {
        let vh = window.innerHeight * 0.01;
        postCreatorRef.current.style.setProperty('--vh', `${vh}px`);
        postCreatorRef.current.style.setProperty('--scroll', `${getScrollWidth()}px`);
    });


    const postCreatorCls = [classes.PostCreator];
    if (state.isOpen || state.isClosing){
        postCreatorCls.push(classes.open);
    }
    const postWrapCls = [classes.PostCreatorWrap];

    return (
        <div className={postCreatorCls.join(" ")} ref={postCreatorRef}>
            <button className={classes.OpenButton} onClick={openPostCreator}>+</button>
            <Transition
                in={state.isOpen === true}
                timeout={{
                    enter: 0,
                    exit: 500
                }}
                mountOnEnter
                unmountOnExit
            >
                {state1 => {
                    if (state1 === "entering") {
                        setOpen(false)
                    } else if (state1 === "entered") {
                        setOpen(true)
                        postWrapCls.push(classes.open)
                    } else if (state1 === "exiting") {
                        setOpen(false)
                        postWrapCls.push(classes.closing)
                    } else if (state1 === "exited") {
                        setOpen(true);
                    }
                    return (
                        <div className={postWrapCls.join(" ")}>

                        </div>
                    )
                }}
            </Transition>
        </div>
    );
};

export default PostCreator;