import React from 'react';
import Layout from "./hoc/Layout/Layout";
import PostsList from "./components/PostsList/PostsList";
import Header from "./components/Header/Header";

function App() {
    return (
        <>
            <Header/>
            <Layout>
                <PostsList/>
            </Layout>
        </>
    );
}

export default App;
