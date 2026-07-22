// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateLabel();
});

// Update the label preview based on form inputs
function updateLabel() {
    // Get all values
    const senderName = document.getElementById('senderName').value;
    const senderAddress = document.getElementById('senderAddress').value;
    const senderMobile = document.getElementById('senderMobile').value;

    const recipientName = document.getElementById('recipientName').value;
    const recipientCompany = document.getElementById('recipientCompany').value;
    const recipientAddress = document.getElementById('recipientAddress').value;
    const recipientPhone = document.getElementById('recipientPhone').value;

    const barcodeValue = document.getElementById('barcodeValue').value;

    // Update Sender Details
    document.getElementById('lblSenderName').textContent = senderName;
    document.getElementById('lblSenderAddress').innerHTML = senderAddress.replace(/\n/g, '<br>');
    document.getElementById('lblSenderMobile').textContent = senderMobile;

    // Update Recipient Details
    document.getElementById('lblRecipientName').textContent = recipientName;
    document.getElementById('lblRecipientCompany').textContent = recipientCompany;
    document.getElementById('lblRecipientAddress').innerHTML = recipientAddress.replace(/\n/g, '<br>');
    document.getElementById('lblRecipientPhone').textContent = recipientPhone;

    // Generate Barcode
    try {
        JsBarcode("#barcode", barcodeValue || "AWB123456789IN", {
            format: "CODE128",
            lineColor: "#000",
            width: 2,
            height: 60,
            displayValue: false
        });
    } catch (e) {
        console.error("Barcode generation failed:", e);
    }
}

// Download the label as an image
function downloadImage() {
    const labelElement = document.getElementById('labelPreview');
    
    // Add a temporary class to ensure it renders correctly if it was scaled down
    labelElement.style.transform = 'none';

    html2canvas(labelElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        backgroundColor: '#ffffff'
    }).then(canvas => {
        // Create an image and trigger download
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'india-post-label-' + new Date().getTime() + '.png';
        link.href = imgData;
        link.click();
    });
}
