# Steganography Tool

A professional, browser-based steganography tool for hiding secret messages within images. Built with pure JavaScript and modern web technologies.

## Features

- 🔒 Hide messages within images using LSB steganography
- 🔐 Optional AES-256 encryption for enhanced security
- 📊 Multiple output formats (PNG, JPEG, WebP)
- 🎨 Quality control and compression options
- 🌓 Dark/Light theme support
- 📱 Responsive design for all devices
- 🚫 No server requirements - runs entirely in the browser

## Usage

1. **Encoding a Message**
   - Upload or drag & drop an image
   - Enter your secret message
   - (Optional) Enable encryption and enter a key
   - Click "Hide Message"
   - Download the encoded image

2. **Decoding a Message**
   - Upload the encoded image
   - Enter the encryption key (if used)
   - Click "Reveal Message"
   - View the hidden message

## Technical Details

### Steganography Method
- Uses Least Significant Bit (LSB) encoding
- Supports up to 3 bits per pixel
- Automatic capacity calculation
- End-of-message detection

### Security Features
- AES-256 encryption support
- Client-side only processing
- No data transmission
- Secure key handling

### Supported Formats
- Input: PNG, JPEG, BMP
- Output: PNG (lossless), JPEG (compressed)
- Quality control for compressed formats

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/stego-tool.git
   ```

2. Navigate to the project directory:
   ```bash
   cd stego-tool
   ```

3. Start a local server:
   ```bash
   python -m http.server 8000
   ```
   or use any other local server of your choice.

4. Open in browser:
   ```
   http://localhost:8000
   ```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

- CryptoJS (v4.1.1) - For AES encryption

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Security Notice

While this tool provides basic steganography and encryption capabilities, it's important to note that:
- The security of the hidden message depends on the encryption key used
- The tool doesn't guarantee protection against statistical analysis
- For maximum security, use secure channels to share encryption keys

## Acknowledgments

- Built with modern web technologies
- Uses the CryptoJS library for encryption
- Inspired by various steganography techniques and tools