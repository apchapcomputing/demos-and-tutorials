import React from 'react'
import Artwork from './Artwork';

export default function NowPlaying({ nowPlaying }) {
    return (
        <div>
            Now Playing: { nowPlaying.name }
            <Artwork artwork={ nowPlaying.albumArt } />
        </div>
    )
}
