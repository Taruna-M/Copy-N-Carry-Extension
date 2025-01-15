//runs on the webpage for which extension is on -> manipulates the DOM of the webpage
document.addEventListener('copy', ()=>{
    try{
        let data = {
            text: null,
            link: null
        }
        const selection = window.getSelection();
        const text = selection.toString();
        if (text.length!==0) data.text = text;
        if (selection.focusNode && selection.focusNode.parentElement) {
            const linkElement = selection.focusNode.parentElement;
            if (linkElement.hasAttribute('href')) {
                data.link = linkElement.getAttribute('href');
            }
        }
        //send the data to the background script
        chrome.runtime.sendMessage({
            type: 'copy-cat-data',
            data: data
        }, (res) => {
            if (chrome.runtime.lastError) {
                console.error('error sending message to background script:', chrome.runtime.lastError.message);
            } else if (res && res.success) {
                console.log('data sent successfully:', res.message);
            } else {
                console.error('failed to send data:', res ? res.message : 'no msg');
            }
        })
    } catch (err) {
        console.error('error in copy event listener:', err.message);
    }
});



