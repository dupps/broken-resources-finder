'use strict';

// todo: options anchor

function requestAllBrokenResources() {
    let sending = browser.runtime.sendMessage({
        command: "all-broken-resources-request",
        data: null
    });
    sending.then(handleResponse, handleError);
}

function handleResponse(response) {

    if (response.command === 'all-broken-resources-response') {

        console.log("Got following broken resources:");
        response.data.forEach(resource => console.log(resource.url));
    }
}

function handleError(error) {
    console.log(`Error: ${error}`);
}

requestAllBrokenResources();
