// Current active tab state
let currentTab = 'domestic';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateLabel();
    updateIntLabel();
});

// Tab switching logic
function switchTab(tabName) {
    currentTab = tabName;
    
    // Update buttons
    document.getElementById('tab-btn-domestic').classList.remove('active');
    document.getElementById('tab-btn-international').classList.remove('active');
    document.getElementById(`tab-btn-${tabName}`).classList.add('active');

    // Update form sections
    document.getElementById('form-domestic').style.display = tabName === 'domestic' ? 'block' : 'none';
    document.getElementById('form-international').style.display = tabName === 'international' ? 'block' : 'none';

    // Update label previews
    document.getElementById('labelPreview-domestic').style.display = tabName === 'domestic' ? 'flex' : 'none';
    document.getElementById('labelPreview-international').style.display = tabName === 'international' ? 'flex' : 'none';
}

// Update DOMESTIC label
function updateLabel() {
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
        JsBarcode("#barcode-domestic", barcodeValue || "AWB123456789IN", {
            format: "CODE128",
            lineColor: "#000",
            width: 2,
            height: 60,
            displayValue: false
        });
    } catch (e) {
        console.error("Domestic barcode generation failed:", e);
    }
}

// Update INTERNATIONAL label
function updateIntLabel() {
    // Sender
    document.getElementById('lblIntSenderName').textContent = document.getElementById('intSenderName').value;
    document.getElementById('lblIntSenderSub').textContent = document.getElementById('intSenderSub').value;
    document.getElementById('lblIntSenderAddress').innerHTML = document.getElementById('intSenderAddress').value.replace(/\n/g, '<br>');
    document.getElementById('lblIntSenderPhone').textContent = document.getElementById('intSenderPhone').value;

    // Recipient
    document.getElementById('lblIntRecipientName').textContent = document.getElementById('intRecipientName').value;
    document.getElementById('lblIntRecipientAddress').innerHTML = document.getElementById('intRecipientAddress').value.replace(/\n/g, '<br>');
    document.getElementById('lblIntRecipientMobile').textContent = document.getElementById('intRecipientMobile').value;
    document.getElementById('lblIntRecipientEmail').textContent = document.getElementById('intRecipientEmail').value;

    // Product
    document.getElementById('lblIntProdDesc').innerHTML = document.getElementById('intProdDesc').value.replace(/\n/g, '<br>');
    document.getElementById('lblIntProdHSN').innerHTML = document.getElementById('intProdHSN').value.replace(/\n/g, '<br>');
    document.getElementById('lblIntProdQty').textContent = document.getElementById('intProdQty').value;
    document.getElementById('lblIntProdUnit').textContent = document.getElementById('intProdUnit').value;
    document.getElementById('lblIntProdTotal').textContent = document.getElementById('intProdTotal').value;
    document.getElementById('lblIntProdOrigin').textContent = document.getElementById('intProdOrigin').value;

    // Customs
    document.getElementById('lblIntIoss').textContent = document.getElementById('intIoss').value;
    document.getElementById('lblIntVatMsg').innerHTML = document.getElementById('intVatMsg').value.replace(/\n/g, '<br>');
    document.getElementById('lblIntCurrency').textContent = document.getElementById('intCurrency').value;
    document.getElementById('lblIntWeight').textContent = document.getElementById('intWeight').value;

    // Order No
    const orderNo = document.getElementById('intOrderNo').value;
    document.getElementById('lblIntOrderNo').textContent = orderNo;

    // Barcode
    const barcodeValue = document.getElementById('intBarcodeValue').value;
    try {
        JsBarcode("#barcode-international", barcodeValue || orderNo || "4100569160", {
            format: "CODE128",
            lineColor: "#000",
            width: 2,
            height: 50,
            displayValue: false
        });
    } catch (e) {
        console.error("International barcode generation failed:", e);
    }
}

// Download the currently active label as an image
function downloadImage() {
    const labelId = currentTab === 'domestic' ? 'labelPreview-domestic' : 'labelPreview-international';
    const labelElement = document.getElementById(labelId);
    
    // Ensure styles are correct
    labelElement.style.transform = 'none';

    html2canvas(labelElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        backgroundColor: '#ffffff'
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `india-post-${currentTab}-label-${new Date().getTime()}.png`;
        link.href = imgData;
        link.click();
    });
}
