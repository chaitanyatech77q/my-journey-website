# APIs and Services Used in This Project

## Summary
**This project does NOT use any external REST APIs or third-party API services.** It is a **100% static website** that uses only browser-native APIs and external CDN services for fonts.

---

## 1. Browser Native APIs (Built-in JavaScript APIs)

### 1.1 LocalStorage API
**Purpose:** Store images and admin login status locally in the browser
**Location:** `script.js` (lines 253-281)
**Usage:**
```javascript
localStorage.setItem('journeyImages', JSON.stringify(uploadedImages));
localStorage.getItem('journeyImages');
localStorage.setItem('adminMode', 'true');
```
**Explanation:** Saves uploaded images and admin session state in the browser's local storage.

---

### 1.2 FileReader API
**Purpose:** Read image files from user's device
**Location:** `script.js` (lines 130-151)
**Usage:**
```javascript
const reader = new FileReader();
reader.readAsDataURL(file);
reader.onload = (e) => { /* handle image */ };
```
**Explanation:** Converts uploaded image files to base64 data URLs for display.

---

### 1.3 Intersection Observer API
**Purpose:** Animate sections when they scroll into view
**Location:** `script.js` (lines 226-247)
**Usage:**
```javascript
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
        }
    });
}, observerOptions);
```
**Explanation:** Detects when sections enter the viewport and triggers fade-in animations.

---

### 1.4 DOM API (Document Object Model)
**Purpose:** Manipulate HTML elements dynamically
**Location:** Throughout `script.js`
**Usage:**
```javascript
document.querySelector(), document.getElementById(), 
document.createElement(), element.addEventListener()
```
**Explanation:** Standard browser API for interacting with HTML elements.

---

## 2. External CDN Services (Not APIs)

### 2.1 Google Fonts CDN
**Purpose:** Load Poppins font family
**Location:** `index.html` (lines 8-10)
**URL:** `https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap`
**Type:** CSS stylesheet from Google Fonts CDN
**Explanation:** Loads custom fonts from Google's CDN - this is NOT an API call, just a stylesheet link.

---

## 3. External Links (Not API Integrations)

### 3.1 WhatsApp Link
**Purpose:** Direct link to WhatsApp chat
**Location:** `index.html` (line 211)
**URL:** `https://wa.me/917729934148`
**Type:** Simple URL link (not an API)
**Explanation:** Opens WhatsApp with a pre-filled phone number - no API integration.

---

### 3.2 LinkedIn Link
**Purpose:** Link to LinkedIn profile
**Location:** `index.html` (line 215)
**URL:** `https://www.linkedin.com/in/chaitanya-geddam-59b999218/`
**Type:** Simple URL link (not an API)
**Explanation:** Direct link to LinkedIn profile - no API integration.

---

### 3.3 Instagram Link
**Purpose:** Link to Instagram profile
**Location:** `index.html` (line 219)
**URL:** `https://www.instagram.com/tech_with_chay?igsh=NjJlaG5qOHhwNWVh`
**Type:** Simple URL link (not an API)
**Explanation:** Direct link to Instagram profile - no API integration.

---

## 4. What This Project Does NOT Use

❌ **No REST APIs** - No fetch() calls to external servers
❌ **No Third-party APIs** - No weather, news, social media APIs
❌ **No Backend APIs** - No Node.js, Express, or server-side APIs
❌ **No Database APIs** - No Firebase, MongoDB, or SQL APIs
❌ **No Authentication APIs** - No OAuth, JWT, or third-party auth
❌ **No Image Upload APIs** - Images stored only in browser localStorage
❌ **No Payment APIs** - No Stripe, PayPal, or payment gateways
❌ **No Analytics APIs** - No Google Analytics, Mixpanel, etc.

---

## 5. Data Storage

### Current Implementation
- **Storage Method:** Browser localStorage
- **Data Type:** JSON strings
- **Persistence:** Only on the same browser/device
- **Limitations:** 
  - Data is lost if browser cache is cleared
  - Not synced across devices
  - Limited storage size (~5-10MB)

### If You Want to Add APIs (Future Enhancements)

#### Option 1: Backend API
```javascript
// Example: Upload images to server
fetch('https://your-api.com/upload', {
    method: 'POST',
    body: formData
})
```

#### Option 2: Firebase/Firestore
```javascript
// Example: Store images in Firebase
firebase.firestore().collection('images').add(imageData)
```

#### Option 3: Cloudinary (Image Hosting)
```javascript
// Example: Upload to Cloudinary
fetch('https://api.cloudinary.com/v1_1/your-cloud/image/upload', {
    method: 'POST',
    body: formData
})
```

---

## 6. Technical Stack Summary

| Component | Technology | Type |
|-----------|-----------|------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript | Static |
| **Storage** | Browser localStorage | Client-side only |
| **Fonts** | Google Fonts CDN | External stylesheet |
| **Hosting** | Netlify | Static hosting |
| **APIs Used** | None (Browser APIs only) | Native JavaScript |

---

## 7. Why No External APIs?

This project is designed as a **static portfolio website** that:
- ✅ Works offline (after initial load)
- ✅ Has no server costs
- ✅ Loads fast (no API calls)
- ✅ Simple to deploy (just static files)
- ✅ No backend required

**Trade-off:** Images are stored locally and not synced across devices.

---

## 8. Browser APIs Reference

All browser APIs used are **native JavaScript APIs** that come built-in with modern browsers:

1. **localStorage** - Web Storage API
2. **FileReader** - File API
3. **IntersectionObserver** - Intersection Observer API
4. **DOM APIs** - Document Object Model API
5. **Event APIs** - Event handling APIs

These require **no installation** and work in all modern browsers.

---

## Conclusion

**This is a pure static website with zero external API dependencies.** All functionality uses browser-native APIs and simple HTML/CSS/JavaScript. The only external resource is Google Fonts CDN for loading custom fonts.

