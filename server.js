const express = require('express');
const querystring = require('querystring');
const cors = require('cors');
const path = require('path');
const passport = require('passport')
const SpotifyStrategy = require('passport-spotify').Strategy;
const session = require('express-session')
const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "playlist-builderDB.sqlite"
    },
    useNullAsDefault: true
});
require('dotenv').config()

const port = process.env.PORT || 8888;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

const redirect_uri = /*"https://playlist-builder-spotify.herokuapp.com/callback/"*/'http://localhost:8888/callback/';


const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, '/client/build')));

function checkUser(accessToken, refreshToken,expires_in, profile, callback) {
    console.log('place 2' , profile.displayName)
    knex('users')
        .where('id', profile.id)
        .then(res => {
            if (res.length === 0) {
                knex('users')
                    .insert(
                        {
                            id: profile.id,
                            name: profile.displayName,
                            accessTocken: accessToken
                        }
                    )
                    .then(res => console.log('inserted a new user'))
                    .catch(err => console.log('failed to insert a new user'))
            }
            user = { accessToken, profile, expires_in, refreshToken }
            callback(null, user)
        })
}
passport.serializeUser(function (user, done) {
    done(null, user.profile.id);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});
app.use(cors());
app.use(passport.initialize());

//app.use(express.static(path.join(__dirname, '/client/build')));

passport.use(
    new SpotifyStrategy(
        {
            clientID: client_id,
            clientSecret: client_secret,
            callbackURL: redirect_uri
        },
        function (accessToken, refreshToken, expires_in, profile, done) {
            console.log('place 1' ,profile)
            checkUser(accessToken, refreshToken,expires_in, profile, (err, user) => {
                return done(null, user)
            })
        }
    )
);
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());
app.get('/', function (req, res) {
    res.redirect('http://localhost:3000')
})

app.get('/login', passport.authenticate('spotify'), function (req, res) {
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
});

app.get('/callback',
    passport.authenticate('spotify', { failureRedirect: '/login' }),
    function (req, res) {

        if (!req.session.userName) {
            req.session.userName = req.user.profile.userName
        }
        // Successful authentication, redirect home.
        res.redirect('http://localhost:3000/#access_token=' + req.user.accessToken);
    }
);

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
console.log(`listening on port ${port}`)
app.listen(port);
