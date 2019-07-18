import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'

const NewPlaylists = (props) => {
    if (props.list === null || props.list.length === 0) {
        return null;
    }

    let newPlaylist = props.list.map(item => {
        return (
            <ListGroup.Item
                variant='info'
                key={item.id}>
                {item.name} - {item.artist}
                <i className="material-icons"
                    onClick={() => props.removeTrackHandler(item.id)}
                    style={{ float: 'right',cursor:'pointer' }}>not_interested</i>

            </ListGroup.Item>);
    })
    return newPlaylist;
}

export default NewPlaylists;