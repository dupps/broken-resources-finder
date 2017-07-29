"use strict";

function clearPanel() {

    let container = document.getElementById("results");

    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

function handleResponse(response) {

    clearPanel();

    if (response.command === "all-broken-resources-response" && response.data) {

        response.data.forEach((resource) => createBrokenResourcesListing(resource));
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

function createBrokenResourcesListing(resource) {

    let url = resource.url;
    let status = resource.status;
    let reason = resource.reason;

    let container = document.getElementById("results");

    let listingItem = document.createElement("div");
    listingItem.className = "resultElement";

    let urlSpan = document.createElement("span");
    urlSpan.className = "url";

    let resourceName = document.createTextNode(url.substring(url.lastIndexOf("/") + 1, url.length));
    urlSpan.appendChild(resourceName);

    let statusSpan = document.createElement("span");
    statusSpan.className = "status error-" + status;

    let statusSpanText = document.createTextNode(status);

    statusSpan.appendChild(statusSpanText);

    let moreInfo = document.createElement("span");
    moreInfo.className = "moreinfo";

    let moreInfoText = document.createTextNode("more");
    moreInfo.appendChild(moreInfoText);

    // toggle 'more details' visibility
    moreInfo.onclick = function () {

        let toggleElem = this.nextSibling;

        if (toggleElem.style.display === "none") {

            toggleElem.style.display = "block";

        } else {
            toggleElem.style.display = "none";
        }
    };

    let detailDiv = document.createElement("div");
    detailDiv.className = "details";
    detailDiv.style.display = "none";

    let detailParagraph = document.createElement("p");

    let detailUrl = document.createElement("span");
    let detailUrlText = document.createTextNode("Full URL: " + url);
    detailUrl.appendChild(detailUrlText);

    let detailReason = document.createElement("span");
    let detailReasonText = document.createTextNode("Reason: " + reason);
    detailReason.appendChild(detailReasonText);

    detailParagraph.appendChild(detailUrl);
    detailParagraph.appendChild(detailReason);

    detailDiv.appendChild(detailParagraph);

    listingItem.appendChild(urlSpan);
    listingItem.appendChild(statusSpan);
    listingItem.appendChild(moreInfo);
    listingItem.appendChild(detailDiv);

    if (container) {
        container.appendChild(listingItem);
    }
}

requestAllBrokenResources();
