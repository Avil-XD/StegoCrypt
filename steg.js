// DOM Elements
const elements = {
    canvas: null,
    ctx: null,
    // Buttons
    encodeBtn: null,
    decodeBtn: null,
    downloadBtns: null,
    themeSwitch: null,
    // Inputs
    fileInput: null,
    decodeFileInput: null,
    messageInput: null,
    keyInput: null,
    decodeKeyInput: null,
    // Toggles
    encryptionToggle: null,
    qualityToggle: null,
    // Other elements
    dropZone: null,
    decodeDropZone: null,
    imageInfo: null,
    downloadSection: null,
    toast: null,
    messageOutput: null
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    setupEventListeners();
    setupDragAndDrop();
    initializeTheme();
    checkBrowserCompatibility();
});

// Browser Compatibility Check
function checkBrowserCompatibility() {
    if (!window.FileReader || !window.Uint8ClampedArray) {
        showToast('Your browser may not support all features. Please use a modern browser.', 'warning');
    }
}

// File Validation
function validateFile(file) {
    if (!file.type.match(/image\/(png|jpeg|jpg|bmp)/)) {
        throw new Error('Please select a valid image file (PNG, JPG, or BMP)');
    }
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        throw new Error(`File size (${sizeMB}MB) exceeds maximum limit of 10MB`);
    }
    
    // Basic image dimension check (will be validated after loading)
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            if (img.width * img.height > 30000 * 30000) {
                reject(new Error('Image dimensions are too large'));
            } else if (img.width < 8 || img.height < 8) {
                reject(new Error('Image dimensions are too small'));
            } else {
                resolve();
            }
        };
        img.onerror = () => reject(new Error('Invalid or corrupted image file'));
        img.src = URL.createObjectURL(file);
    });
}

function initializeElements() {
    elements.canvas = document.createElement('canvas');
    elements.ctx = elements.canvas.getContext('2d');
    
    // Initialize all element references
    elements.encodeBtn = document.getElementById('encodeBtn');
    elements.decodeBtn = document.getElementById('decodeBtn');
    elements.themeSwitch = document.getElementById('themeSwitch');
    elements.fileInput = document.getElementById('fileInput');
    elements.decodeFileInput = document.getElementById('decodeFileInput');
    elements.messageInput = document.getElementById('messageInput');
    elements.keyInput = document.getElementById('keyInput');
    elements.decodeKeyInput = document.getElementById('decodeKeyInput');
    elements.encryptionToggle = document.getElementById('encryptionToggle');
    elements.qualityToggle = document.getElementById('qualityToggle');
    elements.dropZone = document.getElementById('dropZone');
    elements.decodeDropZone = document.getElementById('decodeDropZone');
    elements.imageInfo = document.getElementById('imageInfo');
    elements.downloadSection = document.getElementById('downloadSection');
    elements.toast = document.getElementById('toast');
    elements.messageOutput = document.querySelector('.message-output');
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => switchPanel(item.dataset.tab));
    });

    // Theme toggle
    elements.themeSwitch?.addEventListener('click', toggleTheme);

    // Help modal
    const helpBtn = document.getElementById('helpBtn');
    const helpModal = document.getElementById('helpModal');
    const closeBtn = document.querySelector('.close-btn');
    
    helpBtn?.addEventListener('click', () => {
        if (helpModal) {
            helpModal.hidden = false;
            helpModal.animate([
                { opacity: 0, transform: 'scale(0.95)' },
                { opacity: 1, transform: 'scale(1)' }
            ], { duration: 200, easing: 'ease' });
        }
    });

    closeBtn?.addEventListener('click', () => {
        if (helpModal) helpModal.hidden = true;
    });

    // Click outside modal to close
    helpModal?.addEventListener('click', e => {
        if (e.target === helpModal) helpModal.hidden = true;
    });

    // Encode/Decode buttons
    elements.encodeBtn?.addEventListener('click', handleEncode);
    elements.decodeBtn?.addEventListener('click', handleDecode);

    // File inputs and upload areas
    elements.fileInput?.addEventListener('change', e => handleFileSelect(e, false));
    elements.decodeFileInput?.addEventListener('change', e => handleFileSelect(e, true));

    // Click handling for upload areas
    elements.dropZone?.addEventListener('click', () => elements.fileInput?.click());
    elements.decodeDropZone?.addEventListener('click', () => elements.decodeFileInput?.click());

    // Message input counter
    elements.messageInput?.addEventListener('input', updateCharCounter);

    // Password visibility toggles
    document.querySelectorAll('.toggle-visibility').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            if (!input) return;
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
            
            // Update icon
            const svg = btn.querySelector('svg');
            if (!svg) return;
            if (type === 'text') {
                svg.innerHTML = '<line x1="3" y1="3" x2="21" y2="21"></line><line x1="3" y1="21" x2="21" y2="3"></line>';
            } else {
                svg.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
            }
        });
    });

    // Toggle listeners
    // Initial encryption section state
    const encryptionSection = document.getElementById('encryptionSection');
    if (encryptionSection) {
        encryptionSection.style.display = 'none';
    }

    // Encryption toggle handler
    elements.encryptionToggle?.addEventListener('change', e => {
        const encryptionSection = document.getElementById('encryptionSection');
        if (encryptionSection) {
            const keyInputs = document.querySelectorAll('#keyInput, #decodeKeyInput');
            if (e.target.checked) {
                encryptionSection.style.display = 'block';
                encryptionSection.classList.add('visible');
                keyInputs.forEach(input => input.required = true);
            } else {
                encryptionSection.style.display = 'none';
                encryptionSection.classList.remove('visible');
                keyInputs.forEach(input => {
                    input.required = false;
                    input.value = '';
                });
            }
        }
    });

    elements.qualityToggle?.addEventListener('change', e => {
        const formatSelect = document.getElementById('outputFormat');
        if (formatSelect) {
            formatSelect.value = e.target.checked ? 'png' : 'jpeg';
        }
    });

    // Download buttons
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const quality = btn.dataset.quality || 'original';
            downloadImage(quality);
        });
    });
}

function setupDragAndDrop() {
    [elements.dropZone, elements.decodeDropZone].forEach(zone => {
        if (!zone) return;
        
        zone.addEventListener('dragover', e => {
            e.preventDefault();
            zone.classList.add('dragover');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('dragover');
        });

        zone.addEventListener('drop', e => {
            e.preventDefault();
            zone.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            handleFileSelect({ target: { files: [file] } }, zone === elements.decodeDropZone);
        });
    });
}

// UI Functions
function switchPanel(tabId) {
    document.querySelectorAll('.panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    document.getElementById(`${tabId}-panel`)?.classList.add('active');
    document.querySelector(`[data-tab="${tabId}"]`)?.classList.add('active');
}

// Theme Handling
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else if (prefersDark) {
        document.body.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark');
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.body.setAttribute('data-theme', newTheme);
            updateThemeIcon(newTheme);
        }
    });
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = elements.themeSwitch?.querySelector('svg');
    if (!icon) return;
    
    if (theme === 'dark') {
        icon.innerHTML = '<path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 2.992z"/>';
    } else {
        icon.innerHTML = '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
    }
}

// File Handling
function handleFileSelect(event, isDecode = false) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        validateFile(file);
        loadImage(file, isDecode);
    } catch (error) {
        showToast(error.message, 'error');
    }
}

function validateFile(file) {
    if (!file.type.match(/image\/(png|jpeg|jpg|bmp)/)) {
        throw new Error('Please select a valid image file (PNG, JPG, or BMP)');
    }
    if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
    }
}

function loadImage(file, isDecode) {
    const reader = new FileReader();
    reader.onload = e => {
        const img = new Image();
        img.onload = () => {
            setupCanvas(img);
            updateImageInfo(file, img);
            updateImagePreview(e.target.result);
            if (isDecode) {
                elements.decodeBtn.disabled = false;
            } else {
                elements.encodeBtn.disabled = false;
            }
            showToast('Image loaded successfully', 'success');
        };
        img.onerror = () => showToast('Error loading image', 'error');
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function updateImagePreview(dataUrl) {
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    
    if (preview && previewImg) {
        previewImg.src = dataUrl;
        preview.hidden = false;
        
        // Add click to view full size
        previewImg.style.cursor = 'zoom-in';
        previewImg.onclick = () => {
            const fullSize = window.open();
            fullSize.document.write(`
                <style>
                    body { margin: 0; background: #000; height: 100vh; display: flex; align-items: center; justify-content: center; }
                    img { max-width: 100%; max-height: 100vh; object-fit: contain; }
                </style>
                <img src="${dataUrl}" alt="Full size preview">
            `);
        };
    }
}

function setupCanvas(img) {
    elements.canvas.width = img.width;
    elements.canvas.height = img.height;
    elements.ctx.drawImage(img, 0, 0);
}

// Message Handling
async function handleEncode() {
    const btn = elements.encodeBtn;
    try {
        setLoading(true, btn);
        
        const message = elements.messageInput.value;
        const key = elements.keyInput.value;
        
        if (!message) throw new Error('Please enter a message');
        if (message.length > 10000) throw new Error('Message exceeds maximum length of 10,000 characters');
        if (elements.encryptionToggle.checked && !key) {
            throw new Error('Please enter an encryption key');
        }
        if (elements.encryptionToggle.checked && key.length < 8) {
            throw new Error('Encryption key must be at least 8 characters');
        }

        const encrypted = elements.encryptionToggle.checked ?
            CryptoJS.AES.encrypt(message, key).toString() :
            message;

        await embedMessage(encrypted);
        elements.downloadSection.hidden = false;
        showToast('Message hidden successfully! You can now download the image.', 'success');
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        setLoading(false, btn);
    }
}

async function handleDecode() {
    const btn = elements.decodeBtn;
    try {
        setLoading(true, btn);
        
        const key = elements.decodeKeyInput.value;
        if (elements.encryptionToggle.checked && !key) {
            throw new Error('Please enter the decryption key');
        }

        const extracted = await extractMessage();
        let decrypted;
        
        if (elements.encryptionToggle.checked) {
            try {
                decrypted = CryptoJS.AES.decrypt(extracted, key).toString(CryptoJS.enc.Utf8);
                if (!decrypted) throw new Error('Invalid decryption key');
            } catch {
                throw new Error('Invalid decryption key or corrupted message');
            }
        } else {
            decrypted = extracted;
        }

        if (!decrypted) throw new Error('No hidden message found in this image');
        
        showDecodedMessage(decrypted);
        showToast('Message successfully revealed!', 'success');
    } catch (error) {
        showToast(error.message, 'error');
        elements.messageOutput.hidden = true;
    } finally {
        setLoading(false, btn);
    }
}

// Loading State Helper
function setLoading(isLoading, element) {
    if (!element) return;
    
    if (isLoading) {
        element.classList.add('loading');
        element.disabled = true;
        element.originalText = element.textContent;
        element.textContent = 'Processing...';
    } else {
        element.classList.remove('loading');
        element.disabled = false;
        if (element.originalText) {
            element.textContent = element.originalText;
        }
    }
}

// Steganography Functions
async function embedMessage(message) {
    const imageData = elements.ctx.getImageData(0, 0, elements.canvas.width, elements.canvas.height);
    const binary = stringToBinary(message + '[END]');
    
    if (binary.length > calculateCapacity()) {
        throw new Error('Message too large for this image');
    }

    const encoded = embedDataInPixels(imageData.data, binary);
    imageData.data.set(encoded);
    elements.ctx.putImageData(imageData, 0, 0);
}

async function extractMessage() {
    const imageData = elements.ctx.getImageData(0, 0, elements.canvas.width, elements.canvas.height);
    const binary = extractDataFromPixels(imageData.data);
    const message = binaryToString(binary);
    
    const endIndex = message.indexOf('[END]');
    if (endIndex === -1) throw new Error('No hidden message found');
    
    return message.substring(0, endIndex);
}

// Helper Functions
function updateCharCounter() {
    const counter = document.querySelector('.char-counter');
    if (!counter || !elements.messageInput) return;
    
    const length = elements.messageInput.value.length;
    counter.textContent = `${length}/10000`;
    counter.style.color = length > 10000 ? 'var(--error)' : 'var(--text-secondary)';
}

function calculateCapacity() {
    return Math.floor((elements.canvas.width * elements.canvas.height * 3) / 8);
}

function updateImageInfo(file, img) {
    if (!elements.imageInfo) return;

    const size = (file.size / 1024).toFixed(2) + ' KB';
    const dimensions = `${img.width} × ${img.height}`;
    const capacity = Math.floor(calculateCapacity() / 8) + ' characters';

    document.getElementById('imageSize').textContent = size;
    document.getElementById('imageDimensions').textContent = dimensions;
    document.getElementById('imageCapacity').textContent = capacity;
    
    elements.imageInfo.hidden = false;
}

function showToast(message, type = 'info') {
    if (!elements.toast) return;
    
    elements.toast.textContent = message;
    elements.toast.className = `toast show ${type}`;
    setTimeout(() => elements.toast.classList.remove('show'), 3000);
}

function showDecodedMessage(message) {
    if (!elements.messageOutput) return;
    
    const content = elements.messageOutput.querySelector('.message-content');
    if (content) {
        content.textContent = message;
        elements.messageOutput.hidden = false;
    }
}

// Utility Functions
function stringToBinary(str) {
    return str.split('').map(char => 
        char.charCodeAt(0).toString(2).padStart(8, '0')
    ).join('');
}

function binaryToString(binary) {
    const bytes = binary.match(/.{8}/g) || [];
    return bytes.map(byte => 
        String.fromCharCode(parseInt(byte, 2))
    ).join('');
}

function embedDataInPixels(pixels, binary) {
    const data = new Uint8ClampedArray(pixels);
    let bitIndex = 0;
    
    for (let i = 0; i < data.length && bitIndex < binary.length; i += 4) {
        for (let j = 0; j < 3 && bitIndex < binary.length; j++) {
            data[i + j] = (data[i + j] & 254) | parseInt(binary[bitIndex]);
            bitIndex++;
        }
    }
    
    return data;
}

function extractDataFromPixels(pixels) {
    let binary = '';
    for (let i = 0; i < pixels.length; i += 4) {
        for (let j = 0; j < 3; j++) {
            binary += pixels[i + j] & 1;
        }
    }
    return binary;
}

// Download Functions
function downloadImage(quality = 'original') {
    if (!elements.canvas) return;
    
    const qualities = {
        'original': 1.0,
        'compressed': 0.8,
        'optimized': 0.92
    };
    
    const link = document.createElement('a');
    link.download = `stego-image-${quality}.png`;
    link.href = elements.canvas.toDataURL('image/png', qualities[quality] || 1.0);
    link.click();
}
