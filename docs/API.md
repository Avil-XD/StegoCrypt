# Steganography Tool API Documentation

## Core Functions

### Image Processing

```javascript
/**
 * Processes an image file for steganography
 * @param {File} file - The image file to process
 * @returns {Promise<ImageData>} - Processed image data
 * @throws {Error} - If file is invalid or too large
 */
async function processImage(file)

/**
 * Validates image file
 * @param {File} file - The image file to validate
 * @returns {boolean} - True if valid
 * @throws {Error} - With specific validation error
 */
function validateImage(file)

/**
 * Calculates message capacity for an image
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {number} - Maximum message length in characters
 */
function calculateCapacity(width, height)
```

### Steganography Operations

```javascript
/**
 * Embeds a message in an image
 * @param {Uint8ClampedArray} pixels - Image pixel data
 * @param {string} message - Message to hide
 * @param {boolean} useEncryption - Whether to encrypt
 * @param {string} [key] - Encryption key if using encryption
 * @returns {Uint8ClampedArray} - Modified pixel data
 */
function embedMessage(pixels, message, useEncryption, key)

/**
 * Extracts hidden message from image
 * @param {Uint8ClampedArray} pixels - Image pixel data
 * @param {boolean} isEncrypted - Whether message is encrypted
 * @param {string} [key] - Decryption key if encrypted
 * @returns {string} - Extracted message
 * @throws {Error} - If no message found or decryption fails
 */
function extractMessage(pixels, isEncrypted, key)
```

### Encryption

```javascript
/**
 * Encrypts a message using AES-256
 * @param {string} message - Message to encrypt
 * @param {string} key - Encryption key
 * @returns {string} - Encrypted message
 */
function encryptMessage(message, key)

/**
 * Decrypts an encrypted message
 * @param {string} encrypted - Encrypted message
 * @param {string} key - Decryption key
 * @returns {string} - Decrypted message
 * @throws {Error} - If decryption fails
 */
function decryptMessage(encrypted, key)
```

## Usage Examples

### Basic Message Hiding

```javascript
// Hide a message in an image
const file = await selectImage();
const imageData = await processImage(file);
const message = "Secret message";
const modifiedPixels = embedMessage(imageData.data, message, false);
saveImage(modifiedPixels);

// Extract a hidden message
const encodedFile = await selectImage();
const encodedData = await processImage(encodedFile);
const extractedMessage = extractMessage(encodedData.data, false);
console.log(extractedMessage);
```

### With Encryption

```javascript
// Hide an encrypted message
const message = "Secret message";
const key = "encryption-key";
const pixels = await getImagePixels();
const modifiedPixels = embedMessage(pixels, message, true, key);

// Extract and decrypt message
const extractedMessage = extractMessage(pixels, true, key);
```

## Error Handling

The API uses standard error throwing for various failure cases:

```javascript
try {
    const message = await extractMessage(pixels, true, key);
} catch (error) {
    switch(error.code) {
        case 'NO_MESSAGE':
            console.error('No hidden message found');
            break;
        case 'DECRYPT_FAILED':
            console.error('Invalid decryption key');
            break;
        case 'CAPACITY_EXCEEDED':
            console.error('Message too large for image');
            break;
        default:
            console.error('Unknown error:', error);
    }
}
```

## Events

The API emits events for various operations:

```javascript
// Progress events
tool.on('progress', (percent) => {
    console.log(`Operation ${percent}% complete`);
});

// Success events
tool.on('messageHidden', () => {
    console.log('Message successfully hidden');
});

tool.on('messageExtracted', (message) => {
    console.log('Message successfully extracted:', message);
});

// Error events
tool.on('error', (error) => {
    console.error('Operation failed:', error);
});
```

## Configuration

You can configure the tool's behavior:

```javascript
const config = {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    supportedFormats: ['png', 'jpg', 'jpeg', 'bmp'],
    encryption: {
        algorithm: 'AES-256',
        iterations: 1000
    },
    quality: {
        compression: 0.92,
        maxWidth: 2048,
        maxHeight: 2048
    }
};

initializeTool(config);
```

## Best Practices

1. **Image Selection**
   - Use PNG files for best results
   - Avoid heavily compressed images
   - Consider image dimensions for message capacity

2. **Message Encoding**
   - Always check message length against capacity
   - Use encryption for sensitive messages
   - Include error detection in messages

3. **Security**
   - Use strong encryption keys
   - Clear sensitive data after use
   - Implement rate limiting for operations

4. **Performance**
   - Process large images in chunks
   - Implement progress indicators
   - Cache processed images when appropriate

## Browser Support

The API requires these browser features:
- Canvas API
- FileReader API
- Uint8Array/ArrayBuffer
- Promises
- async/await
- Web Crypto API (for encryption)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:
- Code style
- Testing requirements
- Pull request process
- Security considerations