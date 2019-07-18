import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'

const Playlists = (props) => {
    if (props.list === null) {
        return null;
    }

    let playlists = props.list.map(item => {
        return (
            <ListGroup.Item
                onClick = {()=>props.getCurPlaylist(item.id)}
                variant={item.bg}
                key={item.id}>{item.name}
                <i  onClick={()=>props.playPlaylistHandler(item.id)}
                    className="material-icons"
                    style ={{float:'right' ,cursor:'pointer'}}>
                    playlist_play
                </i>
            </ListGroup.Item>);
    })
    return playlists;
}

export default Playlists;