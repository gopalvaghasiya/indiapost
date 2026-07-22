# India Post Label Generator

A free, easy-to-use web application to generate custom India Post shipping labels. 

**Live Demo:** [https://gopalvaghasiya.github.io/indiapost/](https://gopalvaghasiya.github.io/indiapost/)

## Features

- **Live Preview:** See your label update instantly as you type the sender and recipient details.
- **Dynamic Barcode:** Automatically generates a scannable tracking barcode.
- **High-Quality Export:** Download your label as a high-resolution PNG image, ready for printing.
- **No Installation Required:** Runs entirely in your web browser. No server or backend needed.

## Usage

1. Open the [Live Demo](https://gopalvaghasiya.github.io/indiapost/).
2. Fill in the Sender Details (From) and Recipient Details (To).
3. The preview on the right will update automatically.
4. Click the **Download Label** button to save the label as an image to your computer.

## Technologies Used

- HTML5
- CSS3 (Custom Styling)
- JavaScript (Vanilla)
- [html2canvas](https://html2canvas.hertzen.com/) - For rendering the HTML element as an image canvas.
- [JsBarcode](https://lindell.me/JsBarcode/) - For generating the tracking barcode.

## Setup for Local Development

Since this is a simple static site, you don't need any complex build tools.

1. Clone this repository:
   ```bash
   git clone https://github.com/gopalvaghasiya/indiapost.git
   ```
2. Open the folder and double-click `index.html` to run it in your browser.

## License

This project is open-source and available for personal or commercial use.
