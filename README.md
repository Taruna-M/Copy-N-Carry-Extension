# Copy Cat Extension

This Chrome extension captures text and link data when a user copies content from a webpage. The captured data is then sent to the background script for further processing and displayed onto the popup based on the tab from which it has been copied from. 

## Features

- **Text Capture**: Captures the selected text when a user copies content.
- **Link Capture**: Captures the link associated with the selected text (if any).
- **Data Transmission**: Sends the captured data to the background script for further processing.
- **Cop To Clipboard**: From the popup you can copy the content grouped by tabs and paste it wherever you want. 

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Taruna-M/CopyCat-Extension.git
   ```
2. **Load the Extension in Chrome**:
   - Open Chrome and go to `chrome://extensions/`.
   - Enable "Developer mode" in the top right corner.
   - Click "Load unpacked" and select the directory where you cloned the repository.

## Usage

- Navigate to any webpage.
- Select and copy any text / link.
- The extension will capture the text and any associated link, and send the data to the background script.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
