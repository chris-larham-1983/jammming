import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { term: '' }
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
        this.authenticate = this.authenticate.bind(this);
    }

    authenticate() {
        window.location = this.props.authenticationURL;
    }

    search() {
        this.props.onSearch(this.state.term);
    }

    handleTermChange(event) {
        let newTerm = event.target.value;
        this.setState({ term: newTerm });
    }

    render() {
        return (
            <div className="SearchBar">
                <div className="UserInfo">
                    <p className="FirstPara">This app allows you to create custom playlists and save them to your <span className="italic">Spotify</span> account.</p>
                    <p>User authentication is required for this app to become functional.  Re-authentication is required periodically.</p>
                </div>
                <button className="AuthenticateButton"
                        onClick={this.authenticate}>AUTHENTICATE</button>
                <input placeholder="Enter A Song, Album, or Artist"
                       onChange={this.handleTermChange} />
                <button className="SearchButton"
                        onClick={this.search}>SEARCH</button>
            </div>
        );
    }
}

export default SearchBar;