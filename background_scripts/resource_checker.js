'use strict';

let brokenResources = [];
let brokenCount = new Map();
let activeTab;

function logURL(requestDetails) {

    if (requestDetails.statusCode >= 400) {

        let url = requestDetails.url;
        let reason = requestDetails.statusLine;
        let tabId = requestDetails.tabId;

        handleBrokenResource(url, reason, tabId);
    }
}

function logError(requestDetails) {

    let url = requestDetails.url;
    let reason = requestDetails.error;
    let tabId = requestDetails.tabId;

    handleBrokenResource(url, reason, tabId)
}

function handleBrokenResource(url, reason, tabId) {

    console.debug("Loading: " + url);
    console.debug("Reason: " + reason);
    console.debug("TabId: " + tabId);

    if (brokenCount.get(tabId)) {
        brokenCount.set(tabId, brokenCount.get(tabId) + 1)
    } else {
        brokenCount.set(tabId, 1)
    }

    browser.browserAction.setBadgeText({text: (brokenCount.get(tabId)).toString(), tabId: tabId});

    brokenResources.push({
        url: url,
        reason: reason
    });
}

function handleMessage(request, sender, sendResponse) {

    let command = request.command;

    console.log("Command from the popup script: " + command);

    if (command === 'all-broken-resources-request') {

        sendResponse({
            command: 'all-broken-resources-response',
            data: brokenResources
        });

    } else {
        console.error(`Unknown command: ${command}`);
    }
}

function handleActivated(activeInfo) {

    console.log("Tab " + activeInfo.tabId + " was activated");

    activeTab = activeInfo.tabId;
}

function handleUpdated(tabId, changeInfo, tabInfo) {

    brokenCount.delete(tabId);
}

browser.webRequest.onCompleted.addListener(
    logURL,
    {urls: ["<all_urls>"], types: ["image", "stylesheet", "script"]}
);

browser.webRequest.onErrorOccurred.addListener(
    logError,
    {urls: ["<all_urls>"], types: ["image", "stylesheet", "script"]}
);

browser.runtime.onMessage.addListener(handleMessage);
browser.tabs.onActivated.addListener(handleActivated);
browser.tabs.onUpdated.addListener(handleUpdated);
