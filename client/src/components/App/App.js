import React from 'react';
import Button from 'react-bootstrap/Button';
import LoggedIn from './LoggedIn/LoggedIn';
import './App.css';


const getHashParams = () => {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
  e = r.exec(q);
  while ( e ) {
     hashParams[e[1]] = decodeURIComponent(e[2]);
     e = r.exec(q);
  }
  return hashParams;
}
function App() {
  
  const accessToken = getHashParams().access_token;
  
  const loginScreen = (
    <div className="app_title">
      <h1 >Playlist Builder</h1>
      <Button
        href="https://git.heroku.com/playlist-builder-spotify.git/login"//'http://localhost:8888/login'
        variant="success"
        style={{ 'marginTop': '20px' }}>Login
      </Button>
    </div>
  );
  return (
    <div>
      {
        !accessToken? 
        loginScreen:
        <LoggedIn accessToken={accessToken}/>
      }
    </div>
  );
}

export default App;
