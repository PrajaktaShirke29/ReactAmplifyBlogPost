import React from 'react';
import './App.css';
import DisplayPost from "./components/displayPost";
import CreatePost from './components/createPost';
import { withAuthenticator } from 'aws-amplify-react';
 
function App() {
  return (
    <div className="App card" >
      <CreatePost/>
      <DisplayPost />
    </div>
  );
}

export default withAuthenticator(App, {includeGreetings: true});
