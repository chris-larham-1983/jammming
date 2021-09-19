
const Spotify = {
    getAccessToken() {
        let accessToken = localStorage.getItem("accessToken"); //retrieve the accessToken from localStorage
        return accessToken; //return the accessToken
    },
    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {Authorization: `Bearer ${accessToken}`}
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if(!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        });
    },
    savePlaylist(playlistName, trackUris) {
        for(let i = 0; i < trackUris.length; i++) {
            let uri = trackUris[i];
            let prefixedUri = `spotify:track:${uri}`; //format the track uris in the manner that Spotify accepts
            trackUris[i] = prefixedUri;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userID;
        return fetch("https://api.spotify.com/v1/me", {headers: headers})
         .then(response => response.json()
         ).then(jsonResponse => {
            userID = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({name: playlistName})
            }).then(response => response.json()
            ).then(jsonResponse => {
                const playlistID = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({uris: trackUris})
                });
            });
         });
    }
};

export default Spotify;