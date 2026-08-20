import React from 'react'
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

export default function CreatePlaylist({ userId, savedTracks, workoutTracks }) {

    const workoutUris = [];
    const energyFilter = 0.7;
    const danceabilityFilter = 0.5;
    const tempoFilter = 120;

    function getWorkoutTracks() {
        savedTracks.forEach(t => {
          if (t.energy >= energyFilter && t.danceability >= danceabilityFilter && t.tempo >= tempoFilter) {
            workoutUris.push(t.uri);
          }
        });
       createPlaylist();
    }

    function createPlaylist() {
        spotifyApi.createPlaylist(userId, 
            { 
                name: "API Playlist", 
                description: `Liked Songs filtered by Energy: ${energyFilter}, Danceability: ${danceabilityFilter}, and Tempo: ${tempoFilter}.`,
                public: true
            })
            .then((response) => {
                console.log("MAKING PLAYLIST! " + response.id);
                addTracksToPlaylist(response.id);
            })
            .catch((err) => {
                console.error(err);
                console.error("ERROR: Error creating workout playlist");
            })
    }
    
    function addTracksToPlaylist(playlistId) {
        console.log(workoutUris);
        const offset = 100;
        for (var i = 0; i < workoutUris.length; i += offset) {
            const uris = workoutUris.slice(i, i + offset);
            spotifyApi.addTracksToPlaylist(userId, playlistId, uris)
            .then(() => {
                console.log("added!");
            })
            .catch((err) => {
                console.error(err);
                console.error("ERROR: Error adding workout tracks to playlist")
            })
        }
    }

    return (
        <div>
            <h3>Create Workout Playlist From {userId} Liked Songs</h3>
            <button onClick={() => getWorkoutTracks()}>Generate Playlist</button>
        </div>
    )
}
