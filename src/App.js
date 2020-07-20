import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import ClientOAuth2 from 'client-oauth2';

const githubAuth = new ClientOAuth2({
    clientId: '',
    clientSecret: '',
    accessTokenUri: 'https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token',
    authorizationUri: 'https://github.com/login/oauth/authorize',
    redirectUri: 'http://localhost:3000/',
    scopes: ['notifications', 'gist']
});

function App() {

    const [data, setData] = useState({});


    window.oauth2Callback = function (uri) {
        debugger;
        githubAuth.code.getToken(uri)
            .then(function (user) {
                debugger;
                console.log(user) //=> { accessToken: '...', tokenType: 'bearer', ... }

                fetch('https://api.github.com/user', {
                    headers: {
                        'Authorization': `${user.tokenType} ${user.accessToken}`
                    }
                }).then(result => result.json()).then((data)=>{
                        window.opener.updateInfo(data);
                        window.close();
                });
            })
    };

    window.updateInfo = ((info) => {
        setData(info);

    });

// Open the page in a new window, then redirect back to a page that calls our global `oauth2Callback` function.

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
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
                <pre>{JSON.stringify(data, null, 2)}</pre>
                <button onClick={handleClick}>Login</button>
            </header>
        </div>
    );
}

export default App;
