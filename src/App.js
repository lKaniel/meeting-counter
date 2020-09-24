import React, {useCallback, useState} from 'react';
import Layout from "./hoc/Layout/Layout";
import PostsList from "./components/PostsList/PostsList";
import Header from "./components/Header/Header";
import PostCreator from "./components/PostCreator/PostCreator";

let token = "";

const saveToken = (payload)=>{
    token = payload.split("=")[1].split(")")[0];
    console.log(token);
    console.log(token);
    console.log(token);
    // const obj = JSON.parse(payload);
    // console.log(obj)
}

const getToken = ()=>{
    return token;
}

function App() {

    const [state, setState] = useState({
        search:""
    })

    const updateSearchState = useCallback((event) => {
        //todo
        // console.log(state)
        // console.log(event)
        // setState(prevState => {
        //     return {
        //         ...prevState,
        //         search: event.target.value
        //     }
        // })
    }, []);

    return (
        <>
            <Header search={state.search} onSearch={updateSearchState}/>
            <PostCreator/>
            <Layout>
                <PostsList search={state.search}/>
            </Layout>
        </>
    );
}

export default App;
export {saveToken, getToken};