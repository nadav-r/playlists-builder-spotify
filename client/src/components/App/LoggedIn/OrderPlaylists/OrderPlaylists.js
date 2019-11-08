import React, { useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Playlists from './Playlists/Playlists';
import Tracks from './Tracks/Tracks';
import NewPlaylist from './NewPlaylist/NewPlaylist';
import ListGroup from 'react-bootstrap/ListGroup'
import '../../../App/App.css'
import Button from 'react-bootstrap/Button';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyWebApi = new SpotifyWebApi()


function LoggedIn() {

    const [userName, setUserName] = useEffect('')
    const [userId, setUserId] = useEffect('')

    const [playlists, setPlaylists] = useEffect([])

    const getUserProfile = () => {
        spotifyWebApi.getMe()
            .then(
                res => {
                    setUserName(res.display_name)
                    setUserId(res.id)

                }
            )
            .catch(error => console.log('an error has occured'))
    }

    const getUserPlaylists = () => {
        spotifyWebApi.getUserPlaylists()
            .then(res => {
                let playlists = res.items.map(item => {
                    return {
                        name: item.name,
                        id: item.id,
                        bg: 'info'
                    }
                })
                setPlaylists({ playlists })
            })
            .catch(err => console.log('an error occured'))
    }

    useEffect(() => {
        getUserProfile()
        getUserPlaylists()
    })

    return (
        <div style={{ marginTop: 20, maxHeight: '80vh', overflow: 'auto' }}>
            <ListGroup >
                <Playlists list={playlists} />
            </ListGroup>
        </div>
    )



}