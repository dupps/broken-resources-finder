"use strict";

function toggleDetails() {

    let list = this.parentElement.parentElement;
    let details = list.nextElementSibling;
    details.classList.toggle("open");
    details.classList.toggle("closed");

    if (this.textContent === "more") {
        this.textContent = "less";
    } else {
        this.textContent = "more";
    }
}

function clearPanel() {

    let container = document.getElementById("results");

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

function handleResponse(response) {

    clearPanel();

    if (response.command === "all-broken-resources-response" && response.data) {

        document.getElementById("statsCheckedResources").innerText = response.data.checkedCount;
        if (response.data.brokenResources) {
            document.getElementById("statsHits").innerText = response.data.brokenResources.length;
            response.data.brokenResources.forEach((resource) => createBrokenResourcesList(resource));
        }
    }
}

function handleError(error) {

    console.log(`Error: ${error}`);
}

function requestAllBrokenResources() {

    let sending = browser.runtime.sendMessage({
        command: "all-broken-resources-request",
        data: null
    });
    sending.then(handleResponse, handleError);
}

function createBrokenResourcesList(resource) {

    let url = resource.url;
    let status = resource.status;
    let reason = resource.reason;

    let container = document.getElementById("results");

    let listItem = createPrimaryListItem(url, status);
    let detailListItem = createDetailListItem(url, reason);


    if (container) {
        container.appendChild(listItem);
        container.appendChild(detailListItem);
    }
}

function createPrimaryListItem(url, status) {

    let listItem = createTwoItemList();
    let primaryContent = createPrimaryContent();
    let urlDiv = createUrlDiv(url);
    let statusDiv = createStatusDiv(status);

    primaryContent.appendChild(urlDiv);
    primaryContent.appendChild(statusDiv);

    let secondaryContent = createSecondaryContent();
    let moreButton = createMoreButton();

    secondaryContent.appendChild(moreButton);

    listItem.appendChild(primaryContent);
    listItem.appendChild(secondaryContent);

    return listItem;

}

function createDetailListItem(url, reason) {

    let threeItemList = createThreeItemList();
    let primaryContent = createPrimaryContent();
    let detail = createSmall("Details:");
    let textBody = createTextBody();

    let reasonText = createSmall(reason);
    reasonText.appendChild(document.createElement("br"));

    let fullUrl = createSmall(url);

    textBody.appendChild(reasonText);
    textBody.appendChild(fullUrl);

    primaryContent.appendChild(detail);
    primaryContent.appendChild(textBody);
    threeItemList.appendChild(primaryContent);

    return threeItemList;
}

function createTwoItemList() {

    let listItem = document.createElement("li");
    listItem.className = "mdl-list__item mdl-list__item--two-line";
    componentHandler.upgradeElement(listItem);

    return listItem;
}

function createThreeItemList() {

    let listItem = document.createElement("li");
    listItem.className = "mdl-list__item mdl-list__item--three-line details closed";
    componentHandler.upgradeElement(listItem);

    return listItem;
}

function createPrimaryContent() {

    let primary = document.createElement("div");
    primary.className = "mdl-list__item-primary-content";
    componentHandler.upgradeElement(primary);

    return primary;
}

function createSmall(text) {

    let small = document.createElement("small");
    let smallText = document.createTextNode(text);
    small.appendChild(smallText);

    return small;
}

function createTextBody() {

    let bodyDiv = document.createElement("div");
    bodyDiv.className = "mdl-list__item-text-body";

    return bodyDiv;
}

function createUrlDiv(url) {

    let urlDiv = document.createElement("div");
    let resourceName = url.split('/').pop().split('#')[0].split('?')[0];
    let resourceNameText = document.createTextNode(resourceName);
    urlDiv.appendChild(resourceNameText);

    return urlDiv;
}

function createStatusDiv(status) {

    let statusDiv = document.createElement("div");
    statusDiv.className = "mdl-list__item-sub-title short";
    componentHandler.upgradeElement(statusDiv);

    let statusText = document.createTextNode(status);
    statusDiv.appendChild(statusText);

    return statusDiv;
}

function createSecondaryContent() {

    let secondary = document.createElement("div");
    secondary.className = "mdl-list__item-secondary-content";
    componentHandler.upgradeElement(secondary);

    return secondary;
}

function createMoreButton() {

    let moreButton = document.createElement("button");
    moreButton.className = "more mdl-list__item-secondary-action mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--primary";
    componentHandler.upgradeElement(moreButton);

    let moreInfoText = document.createTextNode("more");
    moreButton.appendChild(moreInfoText);
    moreButton.onclick = toggleDetails.bind(moreButton);

    return moreButton;
}

requestAllBrokenResources();
