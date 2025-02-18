# StegoCrypt 🔒

A modern, secure steganography tool for hiding messages in images. Built with clean, vanilla JavaScript and focused on user privacy.

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Security](https://img.shields.io/badge/security-AES--256-orange.svg)

</div>



## **🛸How to run?**

Visit 👉 [StegoCrypt Live](https://avil-xd.github.io/StegoCrypt) to try it instantly in your browser.


## ✨ Features

- **Secure Message Hiding** - Uses LSB steganography with AES-256 encryption
- **Multiple Output Options** - Choose between quality and file size
- **Client-Side Only** - Your data never leaves your browser
- **Modern UI/UX** - Clean interface with dark mode support
- **No Dependencies** - Pure JavaScript implementation
- **Mobile Responsive** - Works on all devices


## 🔍 How It Works

1. **Select an Image** - Upload or drag & drop any PNG/JPEG
2. **Enter Message** - Type your secret message
3. **Optional Encryption** - Add a password for extra security
4. **Download** - Get your image with hidden message

The tool uses LSB (Least Significant Bit) steganography to hide your message in the image's pixel data. When encryption is enabled, messages are secured with AES-256 before embedding.

## 🛡️ Security

- Client-side encryption using AES-256
- No server communication - everything happens in your browser
- Message capacity automatically calculated
- Optional password protection

## 💻 Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/Avil-XD/StegoCrypt.git
   ```

2. Start a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   # Or using Node.js
   npx serve
   ```

3. Open `http://localhost:8000` in your browser

## 🤝 Contributing

Contributions are welcome! Please check our [Contributing Guidelines](docs/CONTRIBUTING.md) for details on how to submit pull requests, report issues, and contribute to the project.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚡ Performance

- Fast processing even with large images
- Automatic image optimization
- Progressive loading
- Responsive UI with instant feedback

## 🔧 Browser Support

- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)

## 🌟 Features Coming Soon

- [x] Dark/Light theme support
- [x] Drag and drop interface
- [x] Mobile responsive design
- [ ] Multiple file processing
- [ ] Custom steganography algorithms
- [ ] Image preprocessing options

---

<div align="center">

Made with ❤️ by [Avil](https://github.com/Avil-XD)

</div>
