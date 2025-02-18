# Project Structure

```
steganography-tool/
├── assets/                 # Static assets
│   └── icons/             # App icons and favicons
│
├── css/                   # Stylesheets
│   └── styles.css        # Main stylesheet
│
├── js/                   # JavaScript files
│   └── steg.js          # Main application logic
│
├── docs/                 # Documentation
│   ├── API.md           # API documentation
│   └── CONTRIBUTING.md  # Contribution guidelines
│
├── .gitignore           # Git ignore rules
├── LICENSE              # MIT License
├── README.md           # Project documentation
├── STRUCTURE.md        # This file
├── config.json         # Configuration file
├── index.html          # Main application entry
├── manifest.json       # Web app manifest
├── robots.txt          # Search engine rules
└── security.txt        # Security policy
```

## Directory Details

### /assets
Contains all static assets including icons, images, and other media files used in the application.

### /css
Contains all stylesheet files:
- `styles.css`: Main stylesheet with all UI components and responsive design

### /js
Contains all JavaScript files:
- `steg.js`: Core application logic including steganography implementation

### /docs
Contains detailed documentation:
- `API.md`: Technical documentation for the steganography implementation
- `CONTRIBUTING.md`: Guidelines for contributing to the project

## Key Files

### index.html
The main entry point of the application. Contains the structure of the user interface.

### manifest.json
Web app manifest file for PWA support and installation capabilities.

### config.json
Configuration file containing application settings, browser requirements, and feature specifications.

### security.txt
Security policy and contact information for reporting vulnerabilities.

### robots.txt
Instructions for web crawlers and search engines.

## Development

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Push to your branch
5. Open a Pull Request

## Building

This is a static web application that requires no build process. Simply serve the files through any static file server.

## Deployment

Can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static file hosting service

## Notes

- All operations are performed client-side
- No server-side processing is required
- Follows modern web development best practices
- Mobile-first responsive design