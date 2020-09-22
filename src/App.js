import React from 'react';
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
    return (
        <>
            <Header/>
            <PostCreator/>
            <Layout>
                <PostsList/>
            </Layout>
        </>
    );
}

export default App;
export {saveToken, getToken};