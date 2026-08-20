import React, { Component } from 'react';
import './App.css';
import Playlist from './components/Playlist.js'

import SpotifyWebApi from 'spotify-web-api-js';
import NowPlaying from './components/NowPlaying';
import CreatePlaylist from './components/CreatePlaylist';
const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor() {
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      userId: '',
      nowPlayingViewActive: false,
      nowPlaying: { name: '', albumArt: '' },
      playlistViewActive: false,
      playlists: [],
      createPlaylistViewActive: false,
      totalSaved: '',
      savedTracks: [],
      workoutTracks: []
    }
  }

  getUserId() {
    spotifyApi.getMe()
      .then((response) => {
        this.setState({
          userId: response.id
        })
      })
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
      e = r.exec(q);
    }
    return hashParams;
  }

  getNowPlaying() {
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying: {
            name: response.item.name,
            albumArt: response.item.album.images[0].url,
          }
        });
      });
  }

  getPlaylists() {
    this.getUserId();
    spotifyApi.getUserPlaylists({ limit: 40, offset: 50 })
      .then((response) => {
        this.setState({
          playlists: response.items
        });
        // response.items.forEach(playlist => {
        //   console.log(playlist.name + " " + playlist.id);
        //   this.getTracksInPlaylist(playlist.id);
        // })
      });
  }

  getMySavedTracks() {
    this.getUserId();
    const offset = 50;
    for (var i = 0; i < 2000; i += offset) {
      spotifyApi.getMySavedTracks({ limit: offset, offset: i })
        .then((response) => {
          this.setState({
            totalSaved: response.total
          })
          this.getTrackAudioFeatures(response.items);
          console.log(response.offset);
        })
        .catch((err) => {
          console.error(err);
          console.error("ERROR: Error getting saved tracks");
        })
    }
  }

  getTrackAudioFeatures(tracks) {
    const ids = [];
    tracks.forEach(t => {
      ids.push(t.track.id);
    })
    spotifyApi.getAudioFeaturesForTracks(ids)
      .then((response) => {
        var i = 0;
        response.audio_features.forEach(t => {
          this.state.savedTracks.push({
            id: t.id,
            uri: t.uri,
            name: tracks[i++].track.name,
            energy: t.energy,
            danceability: t.danceability,
            tempo: t.tempo
          })
        })
      });
  }

  flipNowPlayingView() {
    this.getNowPlaying();
    this.setState({
      nowPlayingViewActive: !this.state.nowPlayingViewActive
    });
  }

  flipPlaylistView() {
    this.getPlaylists();
    this.setState({
      playlistViewActive: !this.state.playlistViewActive
    })
  }

  flipCreatePlaylistView() {
    this.getMySavedTracks();
    this.setState({
      createPlaylistViewActive: !this.state.createPlaylistViewActive
    })
  }

  render() {
    return (
      <div className="App">

        <a href='http://achapcomputing.github.io:8888/pumpify' > Login to Spotify </a>

        {/* DISPLAYS SONG CURRENTLY PLAYING */}
        <div>
          <button onClick={() => this.flipNowPlayingView()}>
            {this.state.nowPlayingViewActive ? "Hide Now Playing" : "Show Now Playing"}
          </button>
          {this.state.loggedIn && this.state.nowPlayingViewActive &&
            <div>
              <NowPlaying nowPlaying={this.state.nowPlaying} />
            </div>
          }
        </div>

        {/* DISPLAYS USER PLAYLISTS */}
        <div>
          <button onClick={() => this.flipPlaylistView()}>
            {this.state.playlistViewActive ? "Hide Playlists" : "Show Playlists"}
          </button>
          {this.state.loggedIn && this.state.playlistViewActive &&
            <div>
              <Playlist userId={this.state.userId} playlists={this.state.playlists} />
            </div>
          }
        </div>

        {/* CREATES WORKOUT PLAYLIST */}
        <div>
          <button onClick={() => this.flipCreatePlaylistView()}>
            Create Workout Playlist
          </button>
          {
            this.state.loggedIn && this.state.createPlaylistViewActive &&
            <div>
              <CreatePlaylist userId={this.state.userId} savedTracks={this.state.savedTracks} workoutTracks={this.state.workoutTracks} />
            </div>
          }
        </div>

      </div>
    );
  }
}

export default App;

