import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'

const Tracks = (props) => {
    if (props.list === null || props.list.length === 0) {
        return null;
    }

    let tracks = props.list.map((track, i) => {

        return (
            <ListGroup.Item
                onClick={() => { props.addTrackHandler(track, i) }}
                style={{ cursor: 'pointer' }}
                variant={track.bg}
                key={track.id}
                >
                {track.name } - { track.artist }
                {track.bg === 'danger' || track.bg === 'dark' ?
                    <i

                        className="material-icons" style={{ float: 'right' }}>playlist_add_check</i>
                    :
                    <i

                        className="material-icons" style={{ float: 'right' }}>playlist_add</i>

                }
            </ListGroup.Item>
        );
    })
    return tracks;
}

export default Tracks;