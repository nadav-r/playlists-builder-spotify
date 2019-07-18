const express = require('express');
const querystring = require('querystring');
const cors = require('cors');
const path = require('path');

require('dotenv').config()

const port = process.env.PORT || 8888;
const client_id = process.env.CLIENT_ID;

const redirect_uri = "https://git.heroku.com/playlist-builder-spotify.git/callback/"//'http://localhost:8888/callback/';


const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, '/client/build')));

   



app.get('/login', function (req, res) {
    // requesting authorization
    const scope = 'user-read-private user-read-email playlist-read-private user-library-read user-modify-playback-state playlist-modify-private playlist-modify-public user-top-read ';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'token',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            show_dialog: false,
        }));
});

app.get('/callback', function (req,res){
        console.log('in callback')


         res.redirect('https://git.heroku.com/playlist-builder-spotify.git');
        
});


app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
   });
console.log(`listening on port ${port}`)
app.listen(port);
