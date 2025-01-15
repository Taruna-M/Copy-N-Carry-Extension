//service worker - runs seperately from main browser thread meaning it wont have access to webpage's content
//speaks to extension using messaging api
//can be used to cache resources, handle network requests, etc

//host permissions - defines which urls the extension can send cors requests to 
//content_scripts.matches - defines which urls the extension runs on

chrome.runtime.onMessage.addListener((msg, sender, sendRes) =>{
    if (msg.type === 'copy-cat-data'){ //listen to the correct event containing data sent by content.js
        try{
            chrome.tabs.query({ active: true, currentWindow: true }, async function (tab) { //to get the current tab title and url even a
                try{
                    const currentTab = tab[0];
                    const tabTitle = currentTab.title;
                    const tabUrl = currentTab.url;
                    const storage = await chrome.storage.local.get('copyData'); //gets the local storage data which initially will be empty
                    const dataFromStorage = storage.copyData || {}; //if data is not present in storage i.e first time then it will be an empty object
                    //else user has already used extension to copy things
                    
                    //if url is not in storage then add new object with url as key and data as value
                    if (!dataFromStorage[tabUrl]){
                        dataFromStorage[tabUrl] = {
                            title: tabTitle,
                            text: [],
                            links: []
                        };
                    }
                
                    //convert month (0-11) into month name
                    const months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    const month = months[new Date().getMonth()];
                
                    //create custom timestamp -> 15 January, 2025 - 23:16
                    const timestamp = `${new Date().getDate()} ${month}, ${new Date().getFullYear()} - ${new Date().getHours()}:${new Date().getMinutes()}`;
                    if (msg.data.text && !msg.data.link) dataFromStorage[tabUrl].text.push({ content: msg.data.text, timestamp  });
                    if (msg.data.link) dataFromStorage[tabUrl].links.push({ content: msg.data.link, linkTitle: msg.data.text || 'No Title', timestamp  });
                    await chrome.storage.local.set({ copyData: dataFromStorage }); //sets the newly edited data in local storage
                    sendRes({ success: true, message: 'Data copied successfully' });
                } catch (err) {
                    console.error("error copying data: ", err);
                    sendRes({ success: false, message: err.message });
                }
            });
        } catch (err) {
            console.error("error with chrome storage: ", err);
            sendRes({ success: false, message: err.message });
        }
    return true; //for async actions to keep the channel open it tells the browser to wait for response
    } 
});