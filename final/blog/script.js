const player = document.getElementById("player");

const seekToTime = (second) => {
    player.contentWindow.postMessage(JSON.stringify({
        "event": "command",
        "func": "seekTo",
        "args": [second, true]
    }), "*");
}
