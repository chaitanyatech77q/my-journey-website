# 🚀 My Journey So Far - Personal Portfolio Website

A beautiful, interactive website showcasing my journey from Electronics & Communication Engineering to AI, Data Science, and Full Stack Development.

## ✨ Features

- **Animated Background**: Cool gradient background with stars and clouds animation
- **Smooth Navigation**: Fixed navbar with smooth scrolling to sections
- **Admin-Protected Image Upload**: Only you can upload images (password protected)
  - Visitors can view but cannot upload
  - Upload photos for each journey phase:
    - Education photos
    - Internship photos
    - Freelancing project photos
    - MERN Stack project photos
    - Content creation photos
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Interactive Gallery**: View all uploaded images in a beautiful gallery grid
- **Local Storage**: Images and admin status are saved locally in your browser

## 🛠️ Technologies Used

- HTML5
- CSS3 (with animations and gradients)
- JavaScript (Vanilla JS)
- Netlify (for deployment)

## 📦 Deployment on Netlify

### Method 1: Drag and Drop (Easiest)

1. Go to [Netlify](https://www.netlify.com/)
2. Sign up or log in
3. Drag and drop the entire project folder onto the Netlify dashboard
4. Your site will be live in seconds!

### Method 2: Git Integration

1. Push your code to GitHub
2. Connect your GitHub repository to Netlify
3. Netlify will automatically deploy your site

### Method 3: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

## 📁 Project Structure

```
.
├── index.html          # Main HTML file
├── styles.css          # All styling and animations
├── script.js           # JavaScript for interactivity
├── netlify.toml        # Netlify configuration
└── README.md          # This file
```

## 🔐 Admin Access

**Important**: The website has admin protection to prevent unauthorized uploads.

- **Default Password**: `Chaitanya@7726` (as set in script.js)
- **To Change Password**: Edit `ADMIN_PASSWORD` in `script.js` (line 2)
- **How to Login**: Click the "🔐 Admin" button in the navigation bar
- **Admin Mode**: Once logged in, you can upload images. Click the button again to logout.

**Note**: This is client-side protection. For production use, consider implementing server-side authentication.

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Notes

- Images are stored in browser's localStorage (client-side only)
- For production, consider using a backend service for image storage
- The site is fully static and can be hosted on any static hosting service

## 🔗 Live Demo

Once deployed, your site will be available at: `https://your-site-name.netlify.app`

---

Built with ❤️ for sharing my journey in tech!
