function startParty() {
    transition();
}

let isJoining = false;

function joinParty() {
    transition();
    if (!isJoining) isJoining = true;

    let partyCodeInput = document.getElementById("partyCodeEnter");
    partyCodeInput.classList.remove("hide");

    let joinBtn = document.getElementById("join-party");
    joinBtn.textContent = "Join";

    if (loggedin) {
        let player = document.getElementById("player-container");
        player.classList.remove("hide");
    } else {
        let spotifySignInBtn = document.getElementById("spotify-sign-in");
        spotifySignInBtn.classList.remove("hide");
    }
}

async function validatePartyID(partyID) {
    let data = {
        partyID: partyID
    };

    url = 'https://us-central1-pass-the-aux-257801.cloudfunctions.net/validateID';
    const returnData = await getData(url, data);
    console.log(returnData);

    return returnData;
}

function transition() {
    let title = document.getElementById("title");
    title.classList.add("up-title");

    let subtitle = document.getElementById("subtitle");
    subtitle.classList.add("up-subtitle");

    let mainText = document.getElementById("mainText");
    mainText.classList.add("up-text");

    let startBtn = document.getElementById("start-party");
    startBtn.classList.add("hide");
}

let loggedin = false;
let access_token;

function checkLogin() {
    try {
        access_token = window.location.href.match(/\#(?:access_token)\=([\S\s]*?)\&/)[1];
        if (access_token) loggedin = true;
    } catch (e) {
        console.log("USer not logged in");
    }
}

function init() {
    // validatePartyID("123456").then(function (response) {
    //     console.log(response);
    // });

    checkLogin();
    
    
    window.onSpotifyWebPlaybackSDKReady = () => {
        const token = 'BQDQl-k5BQWmkSBsfJ0EqQKUchZPGmm1sBf3R1JgVnNqlVGOndV60l076ResDbZbffVuU7cxEiIJQvqcFcPGiP_vDu3a3hAgqeuMRqNfKJIr-UkpiyEKFOORdDrUaeUXbvshQBUZDQ5LwaeNqMSqh9aSQgpQHCv26Lk8mhA';
        const player = new Spotify.Player({
            name: 'Web Playback SDK Quick Start Player',
            getOAuthToken: cb => { cb(token); }
        });

        // Error handling
        player.addListener('initialization_error', ({ message }) => { console.error(message); });
        player.addListener('authentication_error', ({ message }) => { console.error(message); });
        player.addListener('account_error', ({ message }) => { console.error(message); });
        player.addListener('playback_error', ({ message }) => { console.error(message); });

        // Playback status updates
        player.addListener('player_state_changed', state => { console.log(state); });

        // Ready
        player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            console.log(player.getCurrentState());
        });

        // Not Ready
        player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
        });

        // Connect to the player!
        player.connect();
    };
}

async function getData(url = '', data = {}) {
    // Default options are marked with *
    // const response = await fetch(url, {
    //     method: 'POST', // *GET, POST, PUT, DELETE, etc.
    //     mode: 'no-cors', // no-cors, *cors, same-origin
    //     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //     credentials: 'same-origin', // include, *same-origin, omit
    //     headers: {
    //         'Content-Type': 'application/json'
    //         // 'Content-Type': 'application/x-www-form-urlencoded',
    //     },
    //     redirect: 'follow', // manual, *follow, error
    //     referrer: 'no-referrer', // no-referrer, *client
    //     body: JSON.stringify(data) // body data type must match "Content-Type" header
    // });
    // console.log(response);
    //
    // return await response.json(); // parses JSON response into native JavaScript objects


    var xhttp = new XMLHttpRequest(); // Build new request
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4 && xhttp.status === 200) { // On sucessful response
            console.log("############################################");
            console.log(xhttp.responseText);
        } else if (xhttp.status >= 400){ // Handle errors
            console.log("An error occured when contacting Google APIs");
        }
    };

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhttp.setRequestHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, HEAD, OPTIONS");
    xhttp.send(JSON.stringify(data)); // Send request

}





let url = "https://accounts.spotify.com/authorize?client_id=24031b8a9bfa48a198a98cc90158e16c&redirect_uri=http://localhost:63343/passtheaux/index.html&scope=user-read-private%20user-read-email&response_type=token&state=123";
// window.open(url, 'popup', 'height=500,width=500,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
window.onload = init;
