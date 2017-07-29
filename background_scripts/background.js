'use strict';

let brokenResources = [];

function logURL(requestDetails) {

    if (requestDetails.statusCode >= 400) {

        console.log("Loading: " + requestDetails.url);
        console.log("Line: " + requestDetails.statusLine);

        brokenResources.push({
            url: requestDetails.url,
            reason: requestDetails.statusLine
        });
    }
}

function logError(requestDetails) {

    console.log("Loading: " + requestDetails.url);
    console.log("error: " + requestDetails.error);

    brokenResources.push({
        url: requestDetails.url,
        reason: requestDetails.error
    });
}

browser.webRequest.onCompleted.addListener(
    logURL,
    {urls: ["<all_urls>"], types: ["image", "stylesheet", "script"]}
);


browser.webRequest.onErrorOccurred.addListener(
    logError,
    {urls: ["<all_urls>"], types: ["image", "stylesheet", "script"]}
);


function handleActivated(activeInfo) {

    console.log("Tab " + activeInfo.tabId +
        " was activated");
}

browser.tabs.onActivated.addListener(handleActivated);
