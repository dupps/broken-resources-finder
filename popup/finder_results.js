document.addEventListener("click", (e) => {

    if (e.target.classList.contains("foo")) {

        var chosenText = e.target.textContent;

        browser.tabs.executeScript(null, {
            file: "/content_scripts/finder.js"
        });

        var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
        gettingActiveTab.then((tabs) => {
            browser.tabs.sendMessage(tabs[0].id, {bla: chosenText});
        });

    } else if (e.target.classList.contains("clear")) {

        browser.tabs.reload();
        window.close();
    }
});
