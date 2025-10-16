# KEM Logistics And Solutions LLC

A modern, responsive, and fully accessible logistics website built with HTML5, CSS3, and vanilla JavaScript.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Setup Instructions](#setup-instructions)
- [Adding Images and Videos](#adding-images-and-videos)
- [Development Guide](#development-guide)
- [Deployment](#deployment)
- [Browser Support](#browser-support)
- [Accessibility](#accessibility)
- [Performance](#performance)
- [License](#license)

---

## Features

- **Fully Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **WCAG 2.1 AA Compliant** - Meets accessibility standards with semantic HTML and ARIA labels
- **Modern CSS** - Uses CSS Grid, Flexbox, and CSS Custom Properties (variables)
- **Interactive Forms** - Shipment tracking, quote requests, and contact forms
- **Smooth Animations** - Scroll-based animations and smooth transitions
- **Mobile-First Approach** - Optimized for mobile devices with responsive breakpoints
- **SEO Optimized** - Semantic HTML with proper meta tags and structured content
- **Fast Performance** - Optimized CSS and JavaScript with no external dependencies
- **Cross-Browser Compatible** - Works on all modern browsers

---

## Project Structure

```
KEM WEBSITE/
│
├── index.html              # Main HTML file
├── README.md               # This file
├── CLAUDE.md               # Code review and maintenance guide
├── SETUP-GUIDE.md          # Detailed step-by-step setup instructions
│
├── css/
│   └── styles.css          # Main stylesheet with responsive design
│
├── js/
│   └── main.js             # JavaScript for interactivity
│
└── assets/
    ├── images/             # Image files (logos, photos, etc.)
    ├── videos/             # Video files
    └── icons/              # Icons and favicons
```

---

## Getting Started

### Prerequisites

You need one of the following to run this project locally:

1. **VS Code with Live Server Extension** (Recommended)
2. **Python 3.x** (for simple HTTP server)
3. **Node.js** (for http-server or live-server npm package)
4. Any other local web server

---

## Setup Instructions

### Method 1: Using VS Code with Live Server (Recommended)

This is the easiest method for beginners.

#### Step 1: Install VS Code

1. Download Visual Studio Code from [https://code.visualstudio.com/](https://code.visualstudio.com/)
2. Install VS Code on your computer
3. Open VS Code

#### Step 2: Install Live Server Extension

1. Open VS Code
2. Click on the **Extensions** icon in the left sidebar (or press `Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for "**Live Server**" by Ritwick Dey
4. Click **Install**

#### Step 3: Open the Project

1. Open VS Code
2. Click **File** → **Open Folder**
3. Navigate to `C:\Users\emmat\KEM WEBSITE`
4. Click **Select Folder**

#### Step 4: Run the Website

1. In VS Code, right-click on `index.html` in the file explorer
2. Select **"Open with Live Server"**
3. Your default browser will automatically open the website at `http://127.0.0.1:5500`

**That's it!** The website is now running locally. Any changes you make will automatically refresh in the browser.

---

### Method 2: Using Python (Alternative)

If you have Python installed:

#### Step 1: Open Command Prompt

1. Press `Windows + R`
2. Type `cmd` and press Enter

#### Step 2: Navigate to Project Folder

```bash
cd "C:\Users\emmat\KEM WEBSITE"
```

#### Step 3: Start Python Server

**For Python 3.x:**
```bash
python -m http.server 8000
```

**For Python 2.x:**
```bash
python -m SimpleHTTPServer 8000
```

#### Step 4: Open in Browser

Open your web browser and go to:
```
http://localhost:8000
```

---

### Method 3: Using Node.js (Alternative)

If you have Node.js installed:

#### Step 1: Install http-server globally

Open Command Prompt and run:
```bash
npm install -g http-server
```

#### Step 2: Navigate to Project Folder

```bash
cd "C:\Users\emmat\KEM WEBSITE"
```

#### Step 3: Start the Server

```bash
http-server -p 8000
```

#### Step 4: Open in Browser

Open your web browser and go to:
```
http://localhost:8000
```

---

## Adding Images and Videos

### Adding Images

1. **Place your images** in the `assets/images/` folder

2. **Reference them in HTML** using relative paths:

   ```html
   <!-- For hero background image -->
   <img src="assets/images/warehouse.jpg" alt="KEM Logistics warehouse facility">

   <!-- For logo -->
   <img src="assets/images/logo.png" alt="KEM Logistics logo">
   ```

3. **Or add as CSS background** in `css/styles.css`:

   ```css
   .hero {
       background-image: url('../assets/images/hero-background.jpg');
       background-size: cover;
       background-position: center;
   }
   ```

### Adding Videos

1. **Place your videos** in the `assets/videos/` folder

2. **Add to HTML** in the About section (or anywhere else):

   ```html
   <video controls poster="assets/images/video-thumbnail.jpg">
       <source src="assets/videos/company-overview.mp4" type="video/mp4">
       <source src="assets/videos/company-overview.webm" type="video/webm">
       Your browser does not support the video tag.
   </video>
   ```

3. **Recommended video formats:**
   - MP4 (H.264) - Best browser support
   - WebM - Better compression, modern browsers
   - Provide both for maximum compatibility

### Adding a Favicon

1. Create or download a favicon (16x16 or 32x32 pixels)
2. Save it as `favicon.png` in `assets/icons/`
3. The HTML already references it:
   ```html
   <link rel="icon" type="image/png" href="assets/icons/favicon.png">
   ```

### Recommended Image Sizes

- **Hero background**: 1920x1080px (Full HD)
- **Service images**: 800x600px
- **Testimonial avatars**: 200x200px
- **Logo**: 300x100px (PNG with transparency)
- **Favicon**: 32x32px or 64x64px

### Image Optimization Tips

- Use **JPEG** for photos (smaller file size)
- Use **PNG** for logos and graphics with transparency
- Use **WebP** for modern browsers (better compression)
- Compress images using tools like:
  - [TinyPNG](https://tinypng.com/)
  - [ImageOptim](https://imageoptim.com/)
  - [Squoosh](https://squoosh.app/)

---

## Development Guide

### Editing the Website

#### Changing Text Content

1. Open `index.html` in VS Code
2. Find the section you want to edit
3. Modify the text between the HTML tags
4. Save the file (Ctrl+S / Cmd+S)
5. The browser will auto-refresh if using Live Server

#### Changing Colors

1. Open `css/styles.css`
2. Find the `:root` section at the top (lines 17-41)
3. Modify the CSS custom properties:

   ```css
   :root {
       --primary-color: #ff9900;      /* Change to your brand color */
       --secondary-color: #232f3e;    /* Change header/footer color */
       --accent-color: #00a8e1;       /* Change link color */
   }
   ```

4. Save the file - colors will update across the entire site

#### Changing Fonts

1. Open `css/styles.css`
2. Find the font variables in `:root`:

   ```css
   --font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
   ```

3. To use Google Fonts:
   - Go to [Google Fonts](https://fonts.google.com/)
   - Select a font
   - Copy the `<link>` tag to `index.html` `<head>`
   - Update the CSS variable with your font name

#### Adding New Sections

1. Copy an existing section from `index.html`
2. Paste it where you want the new section
3. Update the content and IDs
4. Add corresponding styles in `css/styles.css` if needed

### Code Organization

- **HTML**: Organized with semantic sections (`<header>`, `<main>`, `<section>`, `<footer>`)
- **CSS**: Organized by components with clear comments
- **JavaScript**: Modular functions for each feature

---

## Deployment

### Option 1: Netlify (Recommended - Free & Easy)

1. **Create a Netlify account** at [netlify.com](https://www.netlify.com/)

2. **Drag and drop deployment:**
   - Log in to Netlify
   - Drag the entire `KEM WEBSITE` folder onto the Netlify dashboard
   - Wait for deployment to complete
   - You'll get a free URL like `https://your-site-name.netlify.app`

3. **Custom domain** (optional):
   - Go to Site Settings → Domain Management
   - Add your custom domain
   - Follow DNS configuration instructions

### Option 2: Vercel (Free & Fast)

1. **Create account** at [vercel.com](https://vercel.com/)

2. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

3. **Deploy:**
   ```bash
   cd "C:\Users\emmat\KEM WEBSITE"
   vercel
   ```

4. Follow the prompts - your site will be live in seconds

### Option 3: GitHub Pages (Free)

1. **Create a GitHub account** at [github.com](https://github.com/)

2. **Create a new repository** named `kem-logistics`

3. **Upload your files:**
   - Click "Upload files"
   - Drag all your project files
   - Commit the changes

4. **Enable GitHub Pages:**
   - Go to Settings → Pages
   - Select `main` branch
   - Click Save
   - Your site will be at `https://yourusername.github.io/kem-logistics`

### Option 4: Traditional Web Hosting

1. Purchase hosting from providers like:
   - Bluehost
   - HostGator
   - SiteGround
   - GoDaddy

2. **Upload via FTP:**
   - Use FileZilla or your host's file manager
   - Upload all files to the `public_html` folder
   - Your site will be live at your domain

---

## Browser Support

This website supports all modern browsers:

- ✅ Chrome (last 2 versions)
- ✅ Firefox (last 2 versions)
- ✅ Safari (last 2 versions)
- ✅ Edge (last 2 versions)
- ✅ Opera (last 2 versions)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

**Not supported:**
- ❌ Internet Explorer (deprecated by Microsoft)

---

## Accessibility

This website follows **WCAG 2.1 Level AA** standards:

### Features

- ✅ Semantic HTML5 landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`)
- ✅ ARIA labels and roles for assistive technologies
- ✅ Keyboard navigation support
- ✅ Focus indicators for all interactive elements
- ✅ Sufficient color contrast ratios
- ✅ Skip to main content link
- ✅ Descriptive alt text for images
- ✅ Form labels properly associated with inputs
- ✅ Responsive text sizing (no text smaller than 14px)

### Testing Accessibility

Use these tools to test:

- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- Chrome Lighthouse (built into Chrome DevTools)

---

## Performance

### Current Optimizations

- ✅ No external dependencies (no jQuery, Bootstrap, etc.)
- ✅ Minified and optimized code structure
- ✅ CSS custom properties for efficient styling
- ✅ Efficient CSS Grid and Flexbox layouts
- ✅ Debounced scroll events
- ✅ Lazy loading ready for images
- ✅ Optimized animations using CSS transforms

### Further Optimization Tips

1. **Minify CSS and JavaScript** for production:
   - Use [CSS Minifier](https://cssminifier.com/)
   - Use [JavaScript Minifier](https://javascript-minifier.com/)

2. **Enable Gzip compression** on your server

3. **Add lazy loading** for images:
   ```html
   <img src="image.jpg" loading="lazy" alt="Description">
   ```

4. **Use a CDN** for faster global delivery

---

## Testing Checklist

Before deploying, test the following:

- [ ] All links work correctly
- [ ] Forms submit properly
- [ ] Tracking form displays results
- [ ] Quote form calculates and displays quotes
- [ ] Contact form shows success message
- [ ] Mobile menu opens and closes
- [ ] All sections scroll smoothly
- [ ] Website is responsive on mobile, tablet, and desktop
- [ ] Images load correctly (if added)
- [ ] Videos play correctly (if added)
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)

---

## Troubleshooting

### Website not loading?

1. Check if Live Server is running (bottom right of VS Code should show port)
2. Make sure you're accessing `http://127.0.0.1:5500` (or your server's URL)
3. Clear browser cache (Ctrl+Shift+Delete)

### Styles not applying?

1. Check that `styles.css` path is correct in `index.html`
2. Clear browser cache
3. Check browser console for errors (F12 → Console tab)

### JavaScript not working?

1. Check browser console for errors (F12 → Console tab)
2. Verify `main.js` path is correct in `index.html`
3. Make sure JavaScript is enabled in your browser

### Images not showing?

1. Verify image files are in `assets/images/` folder
2. Check file paths are correct (case-sensitive)
3. Make sure image file extensions match (.jpg, .png, etc.)

---

## Future Enhancements

Consider adding these features as the project grows:

- **Backend Integration**: Connect forms to a real backend API
- **Database**: Store shipment tracking data
- **User Authentication**: Login/signup functionality
- **Payment Gateway**: Accept online payments
- **Admin Dashboard**: Manage shipments and quotes
- **Real-time Tracking**: GPS integration for live tracking
- **Email Notifications**: Automated email confirmations
- **Multi-language Support**: Internationalization (i18n)
- **Dark Mode**: Toggle for dark/light themes
- **Analytics**: Google Analytics or similar
- **Live Chat**: Customer support chat widget

---

## Contributing

If you're working with a team:

1. Create a new branch for features: `git checkout -b feature-name`
2. Make your changes
3. Test thoroughly
4. Commit with clear messages: `git commit -m "Add new feature"`
5. Push and create a pull request

---

## Support

For questions or issues:

- Check the [CLAUDE.md](CLAUDE.md) file for code review guidelines
- Check the [SETUP-GUIDE.md](SETUP-GUIDE.md) for detailed setup instructions
- Review the code comments in HTML, CSS, and JavaScript files

---

## License

This project is created for KEM Logistics And Solutions LLC. All rights reserved.

---

## Credits

Built with:
- HTML5
- CSS3 (Flexbox, Grid, Custom Properties)
- Vanilla JavaScript (ES6+)
- No external frameworks or libraries

Developed with modern web standards and best practices.

---

**Last Updated**: January 2025
