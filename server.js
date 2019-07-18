const express = require('express');
const querystring = require('querystring');
const cors = require('cors');
require('dotenv').config()





const client_id = process.env.CLIENT_ID;
console.log(client_id)
const redirect_uri = 'http://localhost:8888/callback/';


const app = express();
app.use(cors());




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


         res.redirect('http://localhost:3000');
        
});
console.log('listening on port 8888')
app.listen(8888);
