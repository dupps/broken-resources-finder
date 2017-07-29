"use strict";

let brokenResources = new Map();
let brokenCount = new Map();
let checkedCount = new Map();
let activeTab;

function handleBrokenResource(url, status, reason, tabId) {

    incrementCounter(tabId, brokenCount);

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

    let tabId = requestDetails.tabId;
    let status = requestDetails.statusCode;

    incrementCounter(tabId, checkedCount);

    if (status >= 400) {

        let url = requestDetails.url;
        let reason = requestDetails.statusLine;

        handleBrokenResource(url, status, reason, tabId);
    }
}

function logResourceErrors(requestDetails) {

    let url = requestDetails.url;
    let status = requestDetails.error;
    let reason = requestDetails.error;
    let tabId = requestDetails.tabId;

    if (reason) {

        incrementCounter(tabId, checkedCount);
        handleBrokenResource(url, status, reason, tabId);
    }
}

function incrementCounter(tabId, counter) {
    let oldCount = counter.get(tabId) || 0;
    counter.set(tabId, ++oldCount)
}

function handleMessage(request, sender, sendResponse) {

    let command = request.command;

    if (command === "all-broken-resources-request") {

        sendResponse({
            command: "all-broken-resources-response",
            data: {
                brokenResources: brokenResources.get(activeTab),
                checkedCount: checkedCount.get(activeTab)
            }
        });

    } else {
        console.error(`Unknown command: ${command}`)
    }
}

function handleActivated(activeInfo) {

    activeTab = activeInfo.tabId;
}

function handleUpdated(tabId, changeInfo, tabInfo) {

    if (changeInfo.status === "loading") {
        clearResources(tabId);
    }
}

function handleRemoved(tabId, removeInfo) {

    clearResources(tabId);
}

function clearResources(tabId) {
    brokenCount.delete(tabId);
    brokenResources.delete(tabId);
    checkedCount.delete(tabId);
}

browser.webRequest.onResponseStarted.addListener(
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
browser.tabs.onRemoved.addListener(handleRemoved);
