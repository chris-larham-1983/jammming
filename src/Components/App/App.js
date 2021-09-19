import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

const clientID = '8e745ae1d3484650a92817b6ec0bb0ad';
const redirectURI = 'https://codecademy-spotify-app.netlify.app';
const authenticationURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;

class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          searchResults: [],
          playlistName: "New Playlist",
          playlistTracks: []
      };
      this.addTrack = this.addTrack.bind(this);
      this.removeTrack = this.removeTrack.bind(this);
      this.updatePlaylistName = this.updatePlaylistName.bind(this);
      this.savePlaylist = this.savePlaylist.bind(this);
      this.search = this.search.bind(this);
  }

  addTrack(track) {
      let isInPlaylist = false;
      let newPlaylistTracks = this.state.playlistTracks;

      for(let i = 0; i < this.state.playlistTracks.length; i++) {
          if(track.id === this.state.playlistTracks[i].id) {
              isInPlaylist = true;
              return;
          }
      }

      if(!isInPlaylist) {
          newPlaylistTracks.push(track);
          this.setState({ playlistTracks: newPlaylistTracks });
      }
  }

  removeTrack(track) {
      let newPlaylistTracks = this.state.playlistTracks.filter(currentTrack => currentTrack.id !== track.id);
      this.setState({ playlistTracks: newPlaylistTracks });
  }

  updatePlaylistName(newPlaylistName) {
      this.setState({ playlistName: newPlaylistName });
  }

  savePlaylist() {
      const trackURIs = this.state.playlistTracks.map(currentTrack => currentTrack.id);
      if(this.state.playlistName.trim().length === 0 || !trackURIs.length) {
          return;
      }
      Spotify.savePlaylist(this.state.playlistName, trackURIs)
          .then(() => {
              this.setState({
                  playlistName: 'New Playlist',
                  playlistTracks: []
              })
          }
      );
  }

  search(term) {
      if(term.trim().length === 0) {
          return;
      }
      Spotify.search(term).then(newSearchResults => {
          this.setState({ searchResults: newSearchResults})
      });
  }

  render() {
      return (
          <div>
              <h1>Ja<span className="highlight">mmm</span>ing</h1>
              <div className="App">
                  <SearchBar onSearch={this.search}
                             authenticationURL={authenticationURL} />
                  <div className="App-playlist">
                      <SearchResults searchResults={this.state.searchResults}
                                     onAdd={this.addTrack}
                      />
                      <Playlist playlistName={this.state.playlistName}
                                playlistTracks={this.state.playlistTracks}
                                onRemove={this.removeTrack}
                                onNameChange={this.updatePlaylistName}
                                onSave={this.savePlaylist} />
                  </div>
              </div>
          </div>
      );
  }
}

export default App;
