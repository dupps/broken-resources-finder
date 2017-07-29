"use strict";

let brokenResources = new Map();
let brokenCount = new Map();
let activeTab;

function handleBrokenResource(url, status, reason, tabId) {

    if (brokenCount.get(tabId)) {
        brokenCount.set(tabId, brokenCount.get(tabId) + 1)
    } else {
        brokenCount.set(tabId, 1)
    }

    browser.browserAction.setBadgeText({text: (brokenCount.get(tabId)).toString(), tabId: tabId});

    let brokenResource = {
        url: url,
        status: status,
        reason: reason
    };

    if (!brokenResources.get(tabId)) {
        brokenResources.set(tabId, [])
    }
    brokenResources.get(tabId).push(brokenResource)
}

function logEmbeddedURLs(requestDetails) {

    let status = requestDetails.statusCode;

    if (status >= 400) {

        let url = requestDetails.url;
        let reason = requestDetails.statusLine;
        let tabId = requestDetails.tabId;

        handleBrokenResource(url, status, reason, tabId);
    }
}

function logResourceErrors(requestDetails) {

    let url = requestDetails.url;
    let status = requestDetails.status;
    let reason = requestDetails.error;
    let tabId = requestDetails.tabId;

    handleBrokenResource(url, status, reason, tabId);
}

function handleMessage(request, sender, sendResponse) {

    let command = request.command;

    if (command === "all-broken-resources-request") {

        sendResponse({
            command: "all-broken-resources-response",
            data: brokenResources.get(activeTab)
        });

    } else {
        console.error(`Unknown command: ${command}`)
    }
}

function handleActivated(activeInfo) {

    activeTab = activeInfo.tabId;
}

function handleUpdated(tabId, changeInfo, tabInfo) {

    brokenCount.delete(tabId);
}

browser.webRequest.onCompleted.addListener(
    logEmbeddedURLs,
    {urls: ["<all_urls>"], types: ["image", "stylesheet", "script"]}
);

browser.webRequest.onErrorOccurred.addListener(
    logResourceErrors,
    {urls: ["<all_urls>"], types: ["image", "stylesheet", "script"]}
);

browser.runtime.onMessage.addListener(handleMessage);
browser.tabs.onActivated.addListener(handleActivated);
browser.tabs.onUpdated.addListener(handleUpdated);
