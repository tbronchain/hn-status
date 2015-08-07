// Copyright (c) 2015 Thibault Bronchain

'use strict';

run();

function run() {
    var url = window.location.href;

    // Error if no URI
    if (!url) {
        return 1;
    }

    // Ensure we are on a HN post
    // https://news.ycombinator.com/item?id=xxxxxxxx
    var uriRe = /https:\/\/news\.ycombinator\.com\/item\?id=(\d+)/;
    var reParse = uriRe.exec(url);
    if (reParse == null) {
        return 2;
    }
    var id = parseInt(reParse.pop());
    if (isNaN(id)) {
        return 3;
    }

    var subtext = document.getElementsByClassName("subtext")[0]
    if (subtext && subtext.innerHTML) {
        subtext.innerHTML += ' | <a id="hn-status-data" href="#">show status</a>'
    }

    document.getElementById('hn-status-data').addEventListener('click', function() {
        setPosition(id);
    });
}

function setPosition(id) {
    // Define api URI
    var apiTSUri = "https://hacker-news.firebaseio.com/v0/topstories.json";

    // Get JSon file request
    var xhr = new XMLHttpRequest();
    xhr.open('GET', apiTSUri, true);
    xhr.send(null);

    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
            var res = JSON.parse(this.responseText);
            if (res.constructor === Array) {
                for (var i = 0; i < res.length; i++) {
                    if (res[i] == id) {
                        updatePosition(i+1);
                        return;
                    }
                }
            }
        }
        updatePosition("absent");
    }
}

function updatePosition(position) {
    document.getElementById('hn-status-data').textContent = "home position: "+position
}
