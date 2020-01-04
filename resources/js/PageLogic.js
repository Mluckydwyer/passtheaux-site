let isJoining = false; // has the user chose to join a party
let loggedInStatus = 'not-logged-in'; // is the user logged into spotify
let spotifyAuthCode = ''; // if the user has logged in, this is the access code
let transistionState = 'initial';

function startParty() {
    transition('start');

    if (loggedInStatus === 'logged-in') {
        let player = document.getElementById("player-container");
        exchangeAuthCode(spotifyAuthCode)
            .then(function (response) {
                player.classList.remove("hide");
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    } else {
        let spotifySignInBtn = document.getElementById("spotify-login");
        spotifySignInBtn.classList.remove("hide");

        let partyCodeInput = document.getElementById("partyCodeEnter");
        partyCodeInput.classList.remove("hide");
    }
}

function enterPartyCode() {
    transition('join');
    if (!isJoining) isJoining = true;
}

function joinParty() {

}

async function validatePartyID(partyID) {
    let query = "{}";


}

async function queryGQL(query, url = 'http://localhost:8080/graphql') {
    let result;

    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({query: query})
    })
        .then(result => result.json())
        .then(data => result = data);
    return result;
}

function transition(state) {
    transistionState = state;
    let title = document.getElementById("title");
    let subtitle = document.getElementById("subtitle");
    let mainText = document.getElementById("mainText");
    let startBtn = document.getElementById("start-party");
    let joinBtn = document.getElementById("join-party");
    let backBtn = document.getElementById("back-btn");
    let loginBtn = document.getElementById("spotify-login");
    let partyCodeInput = document.getElementById("partyCodeEnter");

    joinBtn.onclick = enterPartyCode;
    joinBtn.textContent = "Join Party";
    partyCodeInput.value = '';

    if (state === 'initial') {
        if (title.classList.contains('up-title')) title.classList.remove("up-title");
        if (subtitle.classList.contains('up-subtitle')) subtitle.classList.remove("up-subtitle");
        if (mainText.classList.contains('up-text')) mainText.classList.remove("up-text");
        if (startBtn.classList.contains('hide')) startBtn.classList.remove("hide");
        if (joinBtn.classList.contains('hide')) joinBtn.classList.remove("hide");
        if (!backBtn.classList.contains('hide')) backBtn.classList.add("hide");
        if (!loginBtn.classList.contains('hide')) loginBtn.classList.add("hide");
        if (!partyCodeInput.classList.contains('hide')) partyCodeInput.classList.add("hide");
    } else if (state === 'join') {
        if (!title.classList.contains('up-title')) title.classList.add("up-title");
        if (!subtitle.classList.contains('up-subtitle')) subtitle.classList.add("up-subtitle");
        if (!mainText.classList.contains('up-text')) mainText.classList.add("up-text");
        if (!startBtn.classList.contains('hide')) startBtn.classList.add("hide");
        if (joinBtn.classList.contains('hide')) joinBtn.classList.remove("hide");
        if (backBtn.classList.contains('hide')) backBtn.classList.remove("hide");
        if (!loginBtn.classList.contains('hide')) loginBtn.classList.add("hide");
        if (partyCodeInput.classList.contains('hide')) partyCodeInput.classList.remove("hide");

        joinBtn.textContent = "Join";
        joinBtn.onclick = joinParty;
    } else if (state === 'start') {
        if (!title.classList.contains('up-title')) title.classList.add("up-title");
        if (!subtitle.classList.contains('up-subtitle')) subtitle.classList.add("up-subtitle");
        if (!mainText.classList.contains('up-text')) mainText.classList.add("up-text");
        if (!startBtn.classList.contains('hide')) startBtn.classList.add("hide");
        if (!joinBtn.classList.contains('hide')) joinBtn.classList.add("hide");
        if (backBtn.classList.contains('hide')) backBtn.classList.remove("hide");
        if (!loginBtn.classList.contains('hide')) loginBtn.classList.add("hide");
        if (!partyCodeInput.classList.contains('hide')) partyCodeInput.classList.add("hide");
    }
}

// Checks URL Query params for authorization code
function checkLogin() {
    urlParams = new URLSearchParams(window.location.search);

    try {
        spotifyAuthCode = urlParams.get('code');
        error = urlParams.get('error');

        console.log(spotifyAuthCode);

        if (spotifyAuthCode) loggedInStatus = 'logged-in';
        else if (error) loggedInStatus = 'error';
    } catch (e) {
        console.log("User not logged into Spotify");
    }
}

// Exchange auth code for access and refresh tokens
async function exchangeAuthCode(code) {
    url = 'https://accounts.spotify.com/api/token';
    redirect_url = 'http://localhost:63343/passtheaux-site/index.html';
    client_id = '24031b8a9bfa48a198a98cc90158e16c';
    client_secret = '';
    //             'Authorization': 'Basic ' + btoa(client_id + ':' + client_secrete)

    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic MjQwMzFiOGE5YmZhNDhhMTk4YTk4Y2M5MDE1OGUxNmM6OWRmM2UxNjY2ZDQ4NDZiYmI4YTY4ZmFmMDdkY2Q5MzQ=' //+ (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        params: JSON.stringify({
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': encodeURIComponent('http://localhost:63343/passtheaux-site/index.html')
        })
    });
    return await response.json();
}

// Redirects user to Spotify login page to obtain authorization code
function login() { // TODO add extra scope security
    response_type = 'response_type=code';
    client_id = '&client_id=24031b8a9bfa48a198a98cc90158e16c';
    redirect_uri = '&redirect_uri=' + encodeURIComponent('http://localhost:63343/passtheaux-site/index.html');
    scope = '&scope=' + encodeURIComponent('user-read-private');
    state = '&state=happy123';
    url = 'https://accounts.spotify.com/authorize?' + response_type + client_id + scope + redirect_uri + state;
    //url = 'https://accounts.spotify.com/authorize?' + ;

    window.open(url, '_self');
    //window.open(url, 'popup', 'height=500,width=500,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
}

function init() {
    // window.onSpotifyWebPlaybackSDKReady = () => {
    //     const token = 'BQDQl-k5BQWmkSBsfJ0EqQKUchZPGmm1sBf3R1JgVnNqlVGOndV60l076ResDbZbffVuU7cxEiIJQvqcFcPGiP_vDu3a3hAgqeuMRqNfKJIr-UkpiyEKFOORdDrUaeUXbvshQBUZDQ5LwaeNqMSqh9aSQgpQHCv26Lk8mhA';
    //     const player = new Spotify.Player({
    //         name: 'Web Playback SDK Quick Start Player',
    //         getOAuthToken: cb => { cb(token); }
    //     });
    //
    //     // Error handling
    //     player.addListener('initialization_error', ({ message }) => { console.error(message); });
    //     player.addListener('authentication_error', ({ message }) => { console.error(message); });
    //     player.addListener('account_error', ({ message }) => { console.error(message); });
    //     player.addListener('playback_error', ({ message }) => { console.error(message); });
    //
    //     // Playback status updates
    //     player.addListener('player_state_changed', state => { console.log(state); });
    //
    //     // Ready
    //     player.addListener('ready', ({ device_id }) => {
    //         console.log('Ready with Device ID', device_id);
    //         console.log(player.getCurrentState());
    //     });
    //
    //     // Not Ready
    //     player.addListener('not_ready', ({ device_id }) => {
    //         console.log('Device ID has gone offline', device_id);
    //     });
    //
    //     // Connect to the player!
    //     player.connect();
    // };

    // validatePartyID("123456").then(function (response) {
    //     console.log(response);
    // });

    checkLogin();
    if (loggedInStatus === 'logged-in' || loggedInStatus === 'error') startParty();
}

// let url = "https://accounts.spotify.com/authorize?client_id=24031b8a9bfa48a198a98cc90158e16c&redirect_uri=http://localhost:63343/passtheaux/index.html&scope=user-read-private%20user-read-email&response_type=token";
// window.open(url, 'popup', 'height=500,width=500,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
window.onload = init;
