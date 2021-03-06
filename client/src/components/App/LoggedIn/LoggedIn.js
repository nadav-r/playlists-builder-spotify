import React, { Component } from 'react';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Playlists from './Playlists/Playlists';
import Tracks from './Tracks/Tracks';
import NewPlaylist from './NewPlaylist/NewPlaylist';
import ListGroup from 'react-bootstrap/ListGroup'
import '../../App/App.css'
import Button from 'react-bootstrap/Button';
import SpotifyWebApi from 'spotify-web-api-js';

const spotifyWebApi = new SpotifyWebApi()

class LoggedIn extends Component {
    state = {
        name: '',
        userId: null,
        playlists: [],
        currentPlaylist: [],
        newPlaylist: [],
        newPlaylistName: '',
        widgetPlaylist: null,
        showDefaultList: true
    }

    getUserProfile = () => {
        spotifyWebApi.getMe()
            .then(
                res => {
                    this.setState({
                        name: res.display_name,
                        userId: res.id
                    })
                }
            )
            .catch(error => console.log('an error has occured'))
    }

    getUserPlaylists = () => {
        spotifyWebApi.getUserPlaylists()
            .then(res => {
                let playlists = res.items.map(item => {
                    return {
                        name: item.name,
                        id: item.id,
                        bg: 'info'
                    }
                })
                this.setState({ playlists })
                if (this.state.showDefaultList == true) {
                    this.getCurPlaylist(playlists[0].id);
                    this.setState({ showDefaultList: false })
                }
            })
            .catch(err => console.log('an error occured'))
    }

    getCurPlaylist = (playListId) => {
        //first change playlist bg
        let playlists = [...this.state.playlists]
        const playlist_i = playlists.findIndex(p => p.id === playListId)
        playlists.forEach((p, i) => {
            if (i === playlist_i) {
                p.bg = 'light'
            } else {
                p.bg = 'info'
            }
        })
        this.setState({ playlists })

        spotifyWebApi.getPlaylistTracks(playListId)
        .then(res => {
            let currentPlaylist = res.items.map(item => {
                let bg = 'info'
                const newPlaylist_i =
                    this.state.newPlaylist.findIndex(track => track.id === item.track.id);
                if (newPlaylist_i !== -1) {
                    bg = 'dark'
                }
                return {
                    name: item.track.name,
                    artist: item.track.artists[0].name,
                    spotifyURI: item.track.uri,
                    id: item.track.id,
                    externalURL: item.track.external_urls.spotify,
                    bg
                }
            })
            this.setState({ currentPlaylist })
        })
        .catch(err => console.log('an error has occured'))
    }

    addTrackHandler = (newTrack, i) => {
        let dup_i = this.state.newPlaylist.findIndex(track => track.id === newTrack.id);
        if (dup_i !== -1) {
            let currentPlaylist = [...this.state.currentPlaylist]
            newTrack.bg = 'danger'
            currentPlaylist[i] = newTrack
            this.setState({ currentPlaylist })
            setTimeout(() => {

                currentPlaylist = [...this.state.currentPlaylist]
                newTrack.bg = 'dark';
                currentPlaylist[i] = newTrack
                this.setState({ currentPlaylist })
            }, 500)
            return;
        }
        let currentPlaylist = [...this.state.currentPlaylist]
        let newTrackCopy = { ...newTrack }
        this.setState({
            newPlaylist: [...this.state.newPlaylist, newTrackCopy]
        })

        newTrack.bg = 'dark'
        currentPlaylist[i] = newTrack
        this.setState({ currentPlaylist })
    }

    removeTrackHandler = (trackId) => {
        let newPlaylist = [...this.state.newPlaylist]
        newPlaylist = newPlaylist.filter(t => t.id !== trackId);
        this.setState({ newPlaylist });
        //if removed track is in curren playlist, change its bg
        let currentPlaylist = [...this.state.currentPlaylist]
        let track = currentPlaylist.find(t => t.id === trackId);
        if (track) {
            track.bg = 'info'
            this.setState({ currentPlaylist })
        }
    }
    playPlaylistHandler = (playlistId) => {
        this.setState({ widgetPlaylist: playlistId });
    }

    createNewPlaylist = () => {
        // 1.)generate new playlist      
        let url = `https://api.spotify.com/v1/users/${this.state.userId}/playlists`;
        let playlistName = prompt('Choose a name for your new playlist', 'Cool Playlist');
        if (playlistName === null || playlistName === undefined) {
            return;
        }
        let options = {
        
            
                name: playlistName,
                public: false
            
        }

        spotifyWebApi.createPlaylist(this.state.userId, options)
        .then(playlist => {
            const uriList = this.state.newPlaylist.map(track => track.spotifyURI)
            options = {

                'uris': uriList

            }
            spotifyWebApi.addTracksToPlaylist(playlist.id, uriList)
                .then(res => {
                    if (res.snapshot_id) {
                        alert('A new playlist was created')
                        this.setState({ newPlaylist: [] })
                        this.getUserPlaylists();
                    }
                    else {
                        alert('Sorry, an error occured. could not create a new playlist')
                        options = {
                            method: 'DELETE',
                            headers: {
                                'Authorization': 'Bearer ' + this.props.accessToken,
                            }
                        }
                        spotifyWebApi.unfollowPlaylist(playlist.id, options)

                    }
                }).catch(e => console.log('error'))
        }).catch(e => console.log('error'))

    }

    componentDidMount() {
        spotifyWebApi.setAccessToken(this.props.accessToken);
        this.getUserProfile();
        this.getUserPlaylists();
    }

    render() {
        return (
            <Container fluid={true} style={{ marginTop: '20px', marginLeft: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px', borderBottom: '1px dashed white' }}>
                    <span><h2>Hello {this.state.name}!</h2>
                        <p>Have fun playing with your playlists...</p>
                    </span>
                    <div>
                        {this.state.widgetPlaylist !== null ?
                            <iframe title='spotify-widget' src={`https://open.spotify.com/embed/playlist/${this.state.widgetPlaylist}?si=lSaPNgcxS3aVh5GcUZ2Wyg`} width="300" height="100" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                            :
                            null
                        }
                    </div>

                </div>
                <Row>
                    <Col xs={12} md={3}>
                        <h4 style={{ marginTop: '15px', marginLeft: '5px', textAlign: 'center' }}>Your Playlists</h4>
                        <div style={{ marginTop: 20, maxHeight: '80vh', overflow: 'auto' }}>
                            <ListGroup >
                                <Playlists
                                    list={this.state.playlists}
                                    getCurPlaylist={this.getCurPlaylist}
                                    playPlaylistHandler={this.playPlaylistHandler} />
                            </ListGroup>
                        </div>
                    </Col>
                    <Col xs={12} md={4}>
                        <h4 style={{ marginTop: '15px', marginLeft: '5px', textAlign: 'center' }}>Tracks</h4>
                        <div style={{  marginTop: 20, maxHeight: '80vh', overflow: 'auto' }}>
                            <ListGroup >
                                <Tracks
                                    list={this.state.currentPlaylist}
                                    addTrackHandler={this.addTrackHandler}
                                />
                            </ListGroup>
                        </div>
                    </Col>
                    <Col xs={12} md={4}>

                        <h4

                            style={{ marginTop: '15px', marginLeft: '5px', textAlign: 'center' }}>
                            Create New Playlist?
                            <Button variant='success'
                                onClick={this.createNewPlaylist}
                                style={{ paddingLeft: '.35em', marginLeft: '10px' }}
                            >
                                <i className="material-icons" style={{ padding: '10px', cursor: 'pointer', marginLeft: '10px' }}> thumb_up</i>
                            </Button>

                        </h4>

                        <div style={{ marginTop: 20, maxHeight: '80vh', overflow: 'auto' }}>
                            <ListGroup >
                                <NewPlaylist
                                    list={this.state.newPlaylist}
                                    removeTrackHandler={this.removeTrackHandler}
                                />
                            </ListGroup>
                        </div>
                    </Col>
                </Row>
            </Container>

        )
    };
}


export default LoggedIn;