'use strict';

// todo: options anchor

function notifyPopup() {
    let sending = browser.runtime.sendMessage({
        greeting: "Greeting from the content script"
    });
    sending.then(handleResponse, handleError);
}

function handleResponse(message) {
    console.log(`Message from the popup script:  ${message.response}`);
}

function handleError(error) {
    console.log(`Error: ${error}`);
}

notifyPopup();
