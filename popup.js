//interaction in extension used in popup.html -> whatever data stored in local from bg.js we will access here
//then display in popup.html

async function getExtensionData() {
    const storage = await chrome.storage.local.get('copyData'); //gets the local storage data which initially will be empty
    const dataFromStorage = storage.copyData || {};
    const copyCatDiv = document.getElementById('copyCatDiv');
    copyCatDiv.innerHTML = '';
    if (Object.keys(dataFromStorage).length === 0) {
        copyCatDiv.innerHTML = `<p style="color: #FBF5E5; text-align: center; font-size: 20px">No data copied</p>`;
    }
    else {
        for (const [tabUrl, tabContent] of Object.entries(dataFromStorage)) {
            //tabcontent = {title<string>, text<arr>, links<arr>}
            const tabTitle = tabContent.title;
            const tabText = tabContent.text;
            const tabLinks = tabContent.links;

            const tabDiv = document.createElement('div');
            tabDiv.className = 'tab';

            const title = document.createElement('div');
            title.innerHTML = `<h3> <a href=${tabUrl}> ${tabTitle} </a> </h3>`;
            tabDiv.appendChild(title);

            //copy content within tab button
            const copyAllButton = document.createElement('button');
            copyAllButton.className = 'copyAllButton';
            copyAllButton.innerText = 'Copy All Data';
            copyAllButton.style.marginBottom = '10px';
            copyAllButton.addEventListener('click', async () => await copyTabData(tabUrl));
            tabDiv.appendChild(copyAllButton);

            //clear all copied content within tab
            const clearButton = document.createElement('button');
            clearButton.className = 'clearButton';
            clearButton.innerText = 'Clear Tab Data';
            clearButton.style.marginBottom = '10px';
            clearButton.addEventListener('click', async () => await clearTabData(tabUrl));
            tabDiv.appendChild(clearButton);

            //append text arr
            if (tabText && tabText.length > 0) {
                const textDiv = document.createElement('div');
                textDiv.className = 'content';
                textDiv.innerHTML = '<h3>Copied Texts</h3>';
                tabText.forEach((text, index) => {
                    const textWithinDiv = document.createElement('div');
                    textWithinDiv.innerHTML = `<div>
                    <span style="color: #A12568; font-size: 20px">${index+1}. ${text.content}</span>
                    <button class="deleteButton" data-tab-url="${tabUrl}" data-type="text" data-index="${index}">Delete</button>
                    </div>
                    <div class="timestamp">Timestamp: ${text.timestamp}</div>`;
                    textDiv.appendChild(textWithinDiv);
                });
                tabDiv.appendChild(textDiv);
            }

            //append links arr
            if (tabLinks && tabLinks.length > 0) {
                const linksDiv = document.createElement('div');
                linksDiv.className = 'content';
                linksDiv.innerHTML = '<h3>Copied Links</h3>';
                tabLinks.forEach((link, index) => {
                    const linkWithinDiv = document.createElement('div');
                    linkWithinDiv.innerHTML = `<div>${index+1}. 
                    <a href="${link.content}" target="_blank">${link.linkTitle}</a>
                    <button class="deleteButton" data-tab-url="${tabUrl}" data-type="link" data-index="${index}">Delete</button>
                    </div>
                    <div class="timestamp">Timestamp: ${link.timestamp}</div>`;
                    linksDiv.appendChild(linkWithinDiv);
                });
                tabDiv.appendChild(linksDiv);
            }
        copyCatDiv.appendChild(tabDiv);
        }

        //event listeners to delete individual text/links btns
        const deleteButtons = [...document.querySelectorAll('.deleteButton')];
        deleteButtons.forEach((button) => {
            button.addEventListener('click', async (event) => {
                const tabUrl = event.target.getAttribute('data-tab-url');
                const type = event.target.getAttribute('data-type');
                const index = event.target.getAttribute('data-index');
                await deleteItem(tabUrl, type, index);
            });
        });

        //event listener to links re-naviagte
        const links =[...document.querySelectorAll('a')];
        links.map((link)=>{
            link.addEventListener('click', function() {
                chrome.tabs.create({ url: link.href });
            })
        });
    }
}

//clear entire tab
async function clearTabData(tabUrl) {
    const storage = await chrome.storage.local.get('copyData');
    const dataFromStorage = storage.copyData || {};

    //clear the data from the specific tab
    if (dataFromStorage[tabUrl]) delete dataFromStorage[tabUrl];

    //update the local storage
    await chrome.storage.local.set({ copyData: dataFromStorage });

    //refresh the popup
    getExtensionData();
}

//delete individual text/link
async function deleteItem(tabUrl, type, index) {
    const storage = await chrome.storage.local.get('copyData');
    const dataFromStorage = storage.copyData || {};

    if (dataFromStorage[tabUrl]) {
        if (type === 'text') dataFromStorage[tabUrl].text.splice(index, 1);
        else if (type === 'link') dataFromStorage[tabUrl].links.splice(index, 1);
    }

    //update the local storage
    await chrome.storage.local.set({ copyData: dataFromStorage });

    // Refresh the displayed data in the popup
    getExtensionData();
}

//copy entire tab data
async function copyTabData(tabUrl) {
    const storage = await chrome.storage.local.get('copyData');
    const dataFromStorage = storage.copyData || {};

    if (dataFromStorage[tabUrl]) {
        const tabContent = dataFromStorage[tabUrl];
        const tabTitle = tabContent.title;
        const tabText = tabContent.text || [];
        const tabLinks = tabContent.links || [];

        
        let dataToCopy = `Tab Title: ${tabTitle}\n\n`;

        if (tabText.length > 0) {
            dataToCopy += "Copied Texts:\n";
            tabText.forEach((text, index) => dataToCopy += `${index + 1}. ${text.content}\n`);
            dataToCopy += "\n";
        }

        if (tabLinks.length > 0) {
            dataToCopy += "Copied Links:\n";
            tabLinks.forEach((link, index) => dataToCopy += `${index + 1}. ${link.linkTitle} - ${link.content}\n`);
            dataToCopy += "\n";
        }

        //copy to clipboard
        try {
            await navigator.clipboard.writeText(dataToCopy);
            alert('Data copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy data: ', err);
        }
    }
}



document.addEventListener('DOMContentLoaded', getExtensionData);
