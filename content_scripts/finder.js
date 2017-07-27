function manipulateDocumentBody(request, sender, sendResponse) {
    removeEverything();
    insertText(request.bla);
    browser.runtime.onMessage.removeListener(manipulateDocumentBody);
}

function removeEverything() {
    while (document.body.firstChild) {
        document.body.firstChild.remove();
    }
}

function insertText(text) {
    var foo = document.createElement("span");
    foo.textContent = text;
    document.body.appendChild(foo);
}

browser.runtime.onMessage.addListener(manipulateDocumentBody);
