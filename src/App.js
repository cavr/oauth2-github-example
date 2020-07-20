import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import ClientOAuth2 from 'client-oauth2';

const githubAuth = new ClientOAuth2({
    clientId: process.env.REACT_APP_GITHUB_CLIENT_ID,
    clientSecret: process.env.REACT_APP_GITHUB_CLIENT_SECRET,
    accessTokenUri: 'https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token',
    authorizationUri: 'https://github.com/login/oauth/authorize',
    redirectUri: 'http://localhost:3000/',
    scopes: ['notifications', 'gist']
});

function App() {
    const [data, setData] = useState({});

    window.oauth2Callback = async function (uri) {
        const user = await githubAuth.code.getToken(uri);

        const result = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `${user.tokenType} ${user.accessToken}`
            }
        });

        const data = await result.json();

        window.opener.updateInfo(data);

        window.close();
    };

    window.updateInfo = ((info) => {
        setData(info);

    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const hasCode = params.has('code');

        hasCode && window.oauth2Callback && window.oauth2Callback(window.location.href);
    }, []);


    const handleClick = () => {
        window.open(githubAuth.token.getUri());
    };
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <pre>{JSON.stringify(data, null, 2)}</pre>
                <button onClick={handleClick}>Login</button>
            </header>
        </div>
    );
}

export default App;
