import React from 'react';
import Layout from "./hoc/Layout/Layout";
import PostsList from "./components/PostsList/PostsList";
import Header from "./components/Header/Header";
import PostCreator from "./components/PostCreator/PostCreator";

// const user =

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
