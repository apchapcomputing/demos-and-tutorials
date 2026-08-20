import React from 'react'

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

export default function Playlist({ userId, playlists }) {

    const tracks = {};

    function getPlaylistTracks(id) {
        // console.log(id);
        spotifyApi.getPlaylistTracks(userId, id)
            .then((response) => {
                response.items.forEach(t => {
                    tracks[t.track.id] = [t.track.name,
                        t.track.album, t.track.artists];
                })
            });
            sortTracks();
    }

    function sortTracks() {
        console.log(tracks);
        // const parsedTracks = JSON.parse(tracks);
        // for (let t in tracks) {
            // const name = tracks[parsedTracks];
            // console.log("hi~");
        // }
    }

    return (
        <div>
            <h2>{userId} Playlists:</h2>

            <div>
                <ul>
                    {
                        playlists.map(post => (
                            <li key={post.id}>
                                <button onClick={() => getPlaylistTracks(post.id)}>
                                    {post.name}
                                </button>
                            </li>
                        ))
                    }
                </ul>
            </div>

            {/* <p> {JSON.stringify(playlists)} </p> */}
        </div>
    )
}
