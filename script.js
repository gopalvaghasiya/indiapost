// Current active tab state
let currentTab = 'international';
let currentIntSubTab = 'shipping'; // 'shipping' or 'cn22'

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateIntLabel();
    updateLabel();
});

// Tab switching logic (Domestic vs International)
function switchTab(tabName) {
    currentTab = tabName;
    
    // Update header tab buttons
    document.getElementById('tab-btn-domestic').classList.remove('active');
    document.getElementById('tab-btn-international').classList.remove('active');
    document.getElementById(`tab-btn-${tabName}`).classList.add('active');

    // Update form sections
    document.getElementById('form-domestic').style.display = tabName === 'domestic' ? 'block' : 'none';
    document.getElementById('form-international').style.display = tabName === 'international' ? 'block' : 'none';

    // Sub-tabs in preview header
    const intPreviewSubTabs = document.getElementById('intPreviewSubTabs');
    if (intPreviewSubTabs) {
        intPreviewSubTabs.style.display = tabName === 'international' ? 'flex' : 'none';
    }

    // Update label previews
    const domesticPreview = document.getElementById('labelPreview-domestic');
    const intPreview = document.getElementById('labelPreview-international');
    const cn22Preview = document.getElementById('labelPreview-cn22');
    const previewMainTitle = document.getElementById('previewMainTitle');

    if (tabName === 'domestic') {
        domesticPreview.style.display = 'flex';
        domesticPreview.classList.add('active-label');
        intPreview.style.display = 'none';
        intPreview.classList.remove('active-label');
        if (cn22Preview) {
            cn22Preview.style.display = 'none';
            cn22Preview.classList.remove('active-label');
        }
        if (previewMainTitle) previewMainTitle.textContent = 'Live Preview (6" × 4" Sticker)';
        updateLabel();
    } else {
        domesticPreview.style.display = 'none';
        domesticPreview.classList.remove('active-label');
        switchIntPreviewSubTab(currentIntSubTab);
        updateIntLabel();
    }
}

// Switch between International Shipping Label and CN 22 Declaration in preview
function switchIntPreviewSubTab(subTab) {
    currentIntSubTab = subTab;

    const btnShipping = document.getElementById('subtab-btn-shipping');
    const btnCn22 = document.getElementById('subtab-btn-cn22');
    const intPreview = document.getElementById('labelPreview-international');
    const cn22Preview = document.getElementById('labelPreview-cn22');
    const previewMainTitle = document.getElementById('previewMainTitle');

    if (btnShipping && btnCn22) {
        if (subTab === 'shipping') {
            btnShipping.classList.add('active');
            btnCn22.classList.remove('active');
        } else {
            btnCn22.classList.add('active');
            btnShipping.classList.remove('active');
        }
    }

    if (subTab === 'shipping') {
        if (intPreview) {
            intPreview.style.display = 'flex';
            intPreview.classList.add('active-label');
        }
        if (cn22Preview) {
            cn22Preview.style.display = 'none';
            cn22Preview.classList.remove('active-label');
        }
        if (previewMainTitle) previewMainTitle.textContent = 'Live Preview (6" × 4" Sticker)';
    } else {
        if (cn22Preview) {
            cn22Preview.style.display = 'flex';
            cn22Preview.classList.add('active-label');
        }
        if (intPreview) {
            intPreview.style.display = 'none';
            intPreview.classList.remove('active-label');
        }
        if (previewMainTitle) previewMainTitle.textContent = 'Live Preview (CN 22 Customs Declaration)';
        updateCN22();
    }
}

// Print active preview
function printActivePreview() {
    window.print();
}

// Print shipping label
function printLabel() {
    if (currentTab === 'international' && currentIntSubTab !== 'shipping') {
        switchIntPreviewSubTab('shipping');
    }
    window.print();
}

// Print dedicated CN 22 Customs Declaration
function printCN22() {
    if (currentTab !== 'international') {
        switchTab('international');
    }
    switchIntPreviewSubTab('cn22');
    updateCN22();
    setTimeout(() => {
        window.print();
    }, 50);
}

// Toggle 'Other' category field in CN22
function toggleCn22Other() {
    const catSelect = document.getElementById('intCategory');
    const groupOther = document.getElementById('groupCn22Other');
    if (catSelect && groupOther) {
        groupOther.style.display = catSelect.value === 'Other' ? 'block' : 'none';
    }
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

    const rowSenderMobile = document.getElementById('rowSenderMobile');
    const divSenderMobile = document.getElementById('divSenderMobile');
    if (rowSenderMobile) rowSenderMobile.style.display = senderMobile.trim() ? 'flex' : 'none';
    if (divSenderMobile) divSenderMobile.style.display = senderMobile.trim() ? 'block' : 'none';

    // Update Recipient Details
    document.getElementById('lblRecipientName').textContent = recipientName;
    document.getElementById('lblRecipientCompany').textContent = recipientCompany;
    document.getElementById('lblRecipientAddress').innerHTML = recipientAddress.replace(/\n/g, '<br>');
    document.getElementById('lblRecipientPhone').textContent = recipientPhone;

    const rowRecipientPhone = document.getElementById('rowRecipientPhone');
    const divRecipientPhone = document.getElementById('divRecipientPhone');
    if (rowRecipientPhone) rowRecipientPhone.style.display = recipientPhone.trim() ? 'flex' : 'none';
    if (divRecipientPhone) divRecipientPhone.style.display = recipientPhone.trim() ? 'block' : 'none';

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

// Calculate Total Value = QTY * Unit Value
function calculateTotalValue() {
    const qtyStr = document.getElementById('intProdQty') ? document.getElementById('intProdQty').value.trim() : '';
    const unitStr = document.getElementById('intProdUnit') ? document.getElementById('intProdUnit').value.trim() : '';
    
    if (qtyStr !== '' && unitStr !== '') {
        const qty = parseFloat(qtyStr);
        const unitVal = parseFloat(unitStr);
        
        if (!isNaN(qty) && !isNaN(unitVal)) {
            const total = qty * unitVal;
            const totalInput = document.getElementById('intProdTotal');
            if (totalInput) {
                totalInput.value = Number.isInteger(total) ? total : parseFloat(total.toFixed(2));
            }
        }
    }
}

// Convert weight input in grams to kg display format
function formatWeightInKg(rawWeight) {
    if (rawWeight === null || rawWeight === undefined) return '';
    let str = rawWeight.toString().trim();
    if (str === '') return '';
    
    // If user explicitly entered kg (e.g. 0.022 kg, 1.5kg)
    if (/kg/i.test(str)) {
        let num = parseFloat(str.replace(/[^0-9.]/g, ''));
        return isNaN(num) ? str : `${num} kg`;
    }
    
    // Otherwise treat input as grams and convert to kg
    let grams = parseFloat(str.replace(/[^0-9.]/g, ''));
    if (isNaN(grams) || grams <= 0) return '';
    
    let kg = grams / 1000;
    let kgFormatted = parseFloat(kg.toFixed(4));
    return `${kgFormatted} kg`;
}

// Toggle IOSS field visibility in form & label
function toggleIossField() {
    const chk = document.getElementById('chkIncludeIoss');
    const group = document.getElementById('groupIntIoss');
    if (group && chk) {
        group.style.display = chk.checked ? 'block' : 'none';
    }
    updateIntLabel();
}

// Toggle VAT field visibility in form & label
function toggleVatField() {
    const chk = document.getElementById('chkIncludeVat');
    const group = document.getElementById('groupIntVat');
    if (group && chk) {
        group.style.display = chk.checked ? 'block' : 'none';
    }
    updateIntLabel();
}

// Update INTERNATIONAL label & CN 22 sticker
function updateIntLabel() {
    // Sender
    document.getElementById('lblIntSenderName').textContent = document.getElementById('intSenderName').value;
    document.getElementById('lblIntSenderSub').textContent = document.getElementById('intSenderSub').value;
    document.getElementById('lblIntSenderAddress').innerHTML = document.getElementById('intSenderAddress').value.replace(/\n/g, '<br>');
    
    const intSenderPhoneVal = document.getElementById('intSenderPhone').value;
    document.getElementById('lblIntSenderPhone').textContent = intSenderPhoneVal;
    const rowIntSenderPhone = document.getElementById('rowIntSenderPhone');
    if (rowIntSenderPhone) {
        rowIntSenderPhone.style.display = intSenderPhoneVal.trim() ? 'block' : 'none';
    }

    // Recipient
    document.getElementById('lblIntRecipientName').textContent = document.getElementById('intRecipientName').value;
    document.getElementById('lblIntRecipientAddress').innerHTML = document.getElementById('intRecipientAddress').value.replace(/\n/g, '<br>');
    
    const intRecipientMobileVal = document.getElementById('intRecipientMobile').value;
    document.getElementById('lblIntRecipientMobile').textContent = intRecipientMobileVal;
    const rowIntRecipientMobile = document.getElementById('rowIntRecipientMobile');
    if (rowIntRecipientMobile) {
        rowIntRecipientMobile.style.display = intRecipientMobileVal.trim() ? 'block' : 'none';
    }

    const intRecipientEmailVal = document.getElementById('intRecipientEmail').value;
    document.getElementById('lblIntRecipientEmail').textContent = intRecipientEmailVal;
    const rowIntRecipientEmail = document.getElementById('rowIntRecipientEmail');
    if (rowIntRecipientEmail) {
        rowIntRecipientEmail.style.display = intRecipientEmailVal.trim() ? 'block' : 'none';
    }

    // Product
    document.getElementById('lblIntProdDesc').innerHTML = document.getElementById('intProdDesc').value.replace(/\n/g, '<br>');
    document.getElementById('lblIntProdQty').textContent = document.getElementById('intProdQty').value;
    document.getElementById('lblIntProdUnit').textContent = document.getElementById('intProdUnit').value;
    document.getElementById('lblIntProdTotal').textContent = document.getElementById('intProdTotal').value;
    document.getElementById('lblIntProdOrigin').textContent = 'INDIA';

    // Customs
    const chkIoss = document.getElementById('chkIncludeIoss');
    const chkVat = document.getElementById('chkIncludeVat');
    const tdIntIoss = document.getElementById('tdIntIoss');
    const tdIntVat = document.getElementById('tdIntVat');

    if (tdIntIoss && chkIoss) {
        tdIntIoss.style.display = chkIoss.checked ? 'table-cell' : 'none';
    }
    if (tdIntVat && chkVat) {
        tdIntVat.style.display = chkVat.checked ? 'table-cell' : 'none';
    }

    document.getElementById('lblIntIoss').textContent = document.getElementById('intIoss').value;
    document.getElementById('lblIntVatMsg').innerHTML = document.getElementById('intVatMsg').value.replace(/\n/g, '<br>');
    document.getElementById('lblIntCurrency').textContent = document.getElementById('intCurrency').value;
    
    const intWeightRaw = document.getElementById('intWeight').value;
    document.getElementById('lblIntWeight').textContent = formatWeightInKg(intWeightRaw);

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

    // Synchronize CN 22 sticker values
    updateCN22();
}

// Update CN 22 Customs Declaration Sticker fields
function updateCN22() {
    const operator = document.getElementById('intOperator') ? document.getElementById('intOperator').value : 'India Post';
    const category = document.getElementById('intCategory') ? document.getElementById('intCategory').value : 'Gift';
    const categoryOther = document.getElementById('intCategoryOther') ? document.getElementById('intCategoryOther').value : '';
    const prodDesc = document.getElementById('intProdDesc') ? document.getElementById('intProdDesc').value : 'wooden stick';
    const prodQty = document.getElementById('intProdQty') ? document.getElementById('intProdQty').value : '';
    const prodTotal = document.getElementById('intProdTotal') ? document.getElementById('intProdTotal').value : '';
    const currency = document.getElementById('intCurrency') ? document.getElementById('intCurrency').value : 'INR';
    const weight = document.getElementById('intWeight') ? document.getElementById('intWeight').value : '';
    const formattedWeight = formatWeightInKg(weight);
    const hsTariff = document.getElementById('intHsTariff') ? document.getElementById('intHsTariff').value : '44209090';
    const senderSub = document.getElementById('intSenderSub') ? document.getElementById('intSenderSub').value : '';
    const senderName = document.getElementById('intSenderName') ? document.getElementById('intSenderName').value : '';

    // Operator
    const lblOperator = document.getElementById('lblCn22Operator');
    if (lblOperator) lblOperator.textContent = operator || 'India Post';

    // Category Checkboxes
    const boxes = {
        'Gift': document.getElementById('boxGift'),
        'Documents': document.getElementById('boxDocuments'),
        'Sale of goods': document.getElementById('boxSaleOfGoods'),
        'Commercial sample': document.getElementById('boxCommercialSample'),
        'Returned goods': document.getElementById('boxReturnedGoods'),
        'Other': document.getElementById('boxOther')
    };

    Object.values(boxes).forEach(box => {
        if (box) box.textContent = '';
    });

    if (boxes[category]) {
        boxes[category].textContent = '✓';
    }

    const lblOtherText = document.getElementById('lblCn22OtherText');
    if (lblOtherText) {
        lblOtherText.textContent = category === 'Other' ? categoryOther : '';
    }

    // Description & Quantity
    const lblDesc = document.getElementById('lblCn22ProdDesc');
    if (lblDesc) {
        const qtyPrefix = prodQty ? `Qty: ${prodQty} - ` : '';
        lblDesc.innerHTML = (qtyPrefix + prodDesc).replace(/\n/g, '<br>');
    }

    // Net Weight
    const lblNetWeight = document.getElementById('lblCn22NetWeight');
    if (lblNetWeight) {
        lblNetWeight.textContent = formattedWeight;
    }

    // Value and currency
    const lblVal = document.getElementById('lblCn22Value');
    if (lblVal) {
        lblVal.textContent = prodTotal ? `${prodTotal} ${currency}` : '';
    }

    // HS Tariff
    const lblHs = document.getElementById('lblCn22HsTariff');
    if (lblHs) lblHs.textContent = hsTariff;

    // Origin
    const lblOrigin = document.getElementById('lblCn22Origin');
    if (lblOrigin) lblOrigin.textContent = 'INDIA';

    // Total Weight
    const lblTotalWeight = document.getElementById('lblCn22TotalWeight');
    if (lblTotalWeight) {
        lblTotalWeight.textContent = formattedWeight;
    }

    // Total Value
    const lblTotalValue = document.getElementById('lblCn22TotalValue');
    if (lblTotalValue) {
        lblTotalValue.textContent = prodTotal ? `${prodTotal} ${currency}` : '';
    }

    // Date
    const lblDate = document.getElementById('lblCn22Date');
    if (lblDate) {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        lblDate.textContent = `${dd}/${mm}/${yyyy}`;
    }

    // Signature
    const lblSignature = document.getElementById('lblCn22Signature');
    if (lblSignature) {
        lblSignature.textContent = senderSub || senderName || 'Authorized Signatory';
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

// Download CN 22 Sticker as PNG Image
function downloadCN22Image() {
    const labelElement = document.getElementById('labelPreview-cn22');
    if (!labelElement) return;

    // Temporarily make sure it's rendered for html2canvas
    const prevDisplay = labelElement.style.display;
    labelElement.style.display = 'flex';
    labelElement.style.transform = 'none';

    updateCN22();

    html2canvas(labelElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
    }).then(canvas => {
        labelElement.style.display = prevDisplay;
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        const orderNo = document.getElementById('intOrderNo') ? document.getElementById('intOrderNo').value.trim() : '';
        const barcodeVal = document.getElementById('intBarcodeValue') ? document.getElementById('intBarcodeValue').value.trim() : '';
        link.download = `CN22_Customs_Declaration_${barcodeVal || orderNo || new Date().getTime()}.png`;
        link.href = imgData;
        link.click();
    }).catch(err => {
        labelElement.style.display = prevDisplay;
        console.error('Failed to generate CN 22 image:', err);
    });
}

// Official Base64 Template for India Post PBE / DNK Bulk Upload

const INDIA_POST_TEMPLATE_BASE64 = "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";

// US State Lookup for address parsing
const US_STATES = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
    'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
    'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
    'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
    'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
    'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
    'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
    'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
};

// Smart Address Parser for recipient address
function parseRecipientAddress(rawAddress) {
    let lines = rawAddress.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    let destCountryName = 'United States of America';

    // Remove country line if present
    if (lines.length > 0 && /^(united states|usa|us|u\.s\.a\.|u\.s\.)$/i.test(lines[lines.length - 1])) {
        lines.pop();
    }

    let zipCode = '';
    let state = '';
    let city = '';

    // Check lines from bottom for Zip and State
    for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i];
        const zipMatch = line.match(/\b(\d{5}(?:-\d{4})?)\b/);
        if (zipMatch) {
            zipCode = zipMatch[1];
            let remaining = line.replace(zipCode, '').replace(/[, ]+/g, ' ').trim();

            for (const [code, name] of Object.entries(US_STATES)) {
                const stateRegex = new RegExp('\\b(' + code + '|' + name + ')\\b', 'i');
                if (stateRegex.test(remaining)) {
                    state = name;
                    remaining = remaining.replace(stateRegex, '').replace(/[, ]+/g, ' ').trim();
                    break;
                }
            }
            if (remaining) {
                city = remaining;
            }
            lines.splice(i, 1);
            break;
        }
    }

    // If state wasn't on zip line, check other lines
    if (!state && lines.length > 0) {
        for (let i = lines.length - 1; i >= 0; i--) {
            for (const [code, name] of Object.entries(US_STATES)) {
                if (lines[i].toUpperCase() === code || lines[i].toLowerCase() === name.toLowerCase()) {
                    state = name;
                    lines.splice(i, 1);
                    break;
                }
            }
            if (state) break;
        }
    }

    // If city wasn't on zip line, take next bottom line
    if (!city && lines.length > 0) {
        city = lines.pop();
    }

    const line1 = lines[0] || '';
    const line2 = lines[1] || '';
    const line3 = lines.slice(2).join(', ') || '';

    return { line1, line2, line3, city, state, zipCode, destCountryName };
}

// Download Excel Sheet using template XML modification
// Preserves 100% Data Validation dropdowns, formulas, styles, and all YELLOW template columns!
async function downloadExcelSheet() {
    if (typeof JSZip === 'undefined') {
        alert('JSZip library is loading. Please try again in a moment.');
        return;
    }

    try {
        // 1. Gather dynamic form values
        const recipientName = document.getElementById('intRecipientName').value.trim();
        const recipientAddressRaw = document.getElementById('intRecipientAddress').value.trim();
        const recipientMobile = document.getElementById('intRecipientMobile').value.trim();
        const recipientEmail = document.getElementById('intRecipientEmail').value.trim();

        const prodTotal = parseFloat(document.getElementById('intProdTotal').value.trim()) || 0;
        const weightVal = parseFloat(document.getElementById('intWeight').value.trim()) || 0;
        const netWeightVal = weightVal > 25 ? (weightVal - 25) : weightVal;

        const iossVal = document.getElementById('intIoss').value.trim();
        const vatMsgVal = document.getElementById('intVatMsg').value.trim();
        const orderNo = document.getElementById('intOrderNo').value.trim();
        const barcodeVal = document.getElementById('intBarcodeValue').value.trim();

        // 2. Parse Recipient Address
        const parsedAddr = parseRecipientAddress(recipientAddressRaw);

        // 3. Load Template ZIP using JSZip
        const zip = await JSZip.loadAsync(INDIA_POST_TEMPLATE_BASE64, { base64: true });
        let sheet1Xml = await zip.file('xl/worksheets/sheet1.xml').async('text');
        let sheet2Xml = await zip.file('xl/worksheets/sheet2.xml').async('text');

        function escapeXml(str) {
            if (str === null || str === undefined) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&apos;');
        }

        function setXmlCell(xmlStr, cellRef, val) {
            const pattern = new RegExp(`<c r="${cellRef}"(?:\\s+[^/>]*)?(?:/>|>(?:.*?)</c>)`, 's');
            const match = xmlStr.match(pattern);

            if (!match) return xmlStr;

            const fullMatch = match[0];
            const sMatch = fullMatch.match(/\s+s="([^"]*)"/);
            const sAttr = sMatch ? ` s="${sMatch[1]}"` : '';

            let newCell = '';
            if (val === null || val === undefined || val === '') {
                newCell = `<c r="${cellRef}"${sAttr}/>`;
            } else if (typeof val === 'number') {
                newCell = `<c r="${cellRef}"${sAttr}><v>${val}</v></c>`;
            } else {
                newCell = `<c r="${cellRef}"${sAttr} t="inlineStr"><is><t>${escapeXml(val)}</t></is></c>`;
            }

            return xmlStr.substring(0, match.index) + newCell + xmlStr.substring(match.index + fullMatch.length);
        }

        // 4. Update ONLY Dynamic (Non-Yellow) Columns in ArticleDetails (sheet1.xml)
        // Yellow columns in ArticleDetails: E (Nature), F (Transport), I (IPC), J (Non-delivery),
        // K (Sender Name), L (Sender Company), M (Sender Add 1), N (Sender Add 2), O (Sender Add 3),
        // P (City), Q (State), R (Country Name), S (Country Code), T (Pincode), AL (Sender Mobile),
        // AR (POD Flag), AS (Bulk Ref) are strictly PRESERVED from the template!
        sheet1Xml = setXmlCell(sheet1Xml, 'C2', parsedAddr.destCountryName || 'United States of America');
        sheet1Xml = setXmlCell(sheet1Xml, 'G2', weightVal);
        sheet1Xml = setXmlCell(sheet1Xml, 'H2', prodTotal);
        sheet1Xml = setXmlCell(sheet1Xml, 'X2', iossVal);
        sheet1Xml = setXmlCell(sheet1Xml, 'Y2', recipientName);
        sheet1Xml = setXmlCell(sheet1Xml, 'AA2', parsedAddr.line1);
        sheet1Xml = setXmlCell(sheet1Xml, 'AB2', parsedAddr.line2);
        sheet1Xml = setXmlCell(sheet1Xml, 'AC2', parsedAddr.line3);
        sheet1Xml = setXmlCell(sheet1Xml, 'AD2', parsedAddr.city);
        sheet1Xml = setXmlCell(sheet1Xml, 'AE2', parsedAddr.state);
        sheet1Xml = setXmlCell(sheet1Xml, 'AF2', parsedAddr.zipCode);
        sheet1Xml = setXmlCell(sheet1Xml, 'AG2', recipientEmail);
        sheet1Xml = setXmlCell(sheet1Xml, 'AH2', recipientMobile);
        sheet1Xml = setXmlCell(sheet1Xml, 'AI2', vatMsgVal);
        sheet1Xml = setXmlCell(sheet1Xml, 'AK2', barcodeVal);
        sheet1Xml = setXmlCell(sheet1Xml, 'AM2', '');

        // 5. Update ONLY Dynamic (Non-Yellow) Columns in SubPieces (sheet2.xml)
        // Yellow columns in SubPieces: B (HS Code), C (HS Description), D (Unit CD),
        // E (SP Item Count = 100), J (HTSUS Code) are strictly PRESERVED from the template!
        sheet2Xml = setXmlCell(sheet2Xml, 'F2', weightVal);
        sheet2Xml = setXmlCell(sheet2Xml, 'G2', netWeightVal);
        sheet2Xml = setXmlCell(sheet2Xml, 'H2', prodTotal);

        // Save updated XML back to ZIP
        zip.file('xl/worksheets/sheet1.xml', sheet1Xml);
        zip.file('xl/worksheets/sheet2.xml', sheet2Xml);

        // 6. Generate Blob and Download
        const blob = await zip.generateAsync({
            type: 'blob',
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const fileName = `India_Post_BulkUpload_${barcodeVal || orderNo || 'Export'}.xlsx`;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(link.href);

    } catch (err) {
        console.error('Failed to generate Excel sheet:', err);
        alert('Error generating Excel sheet: ' + err.message);
    }
}
