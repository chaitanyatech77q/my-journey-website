// Admin Configuration - CHANGE THIS PASSWORD!
const ADMIN_PASSWORD = 'Chaitanya@7726'; // Change this to your desired password

// Hosting Configuration (fill these to make uploads visible to everyone)
// 1) Create a free Cloudinary account → create an unsigned upload preset
// 2) Create a free JSONBin bin (public read) → get BIN ID and API key
const CLOUDINARY_CLOUD_NAME = 'chaitanya-journey';
const CLOUDINARY_UPLOAD_PRESET = 'chaitu';
const JSONBIN_BIN_ID = '7726';
const JSONBIN_API_KEY = '7726';

// Admin State
let isAdminMode = false;

// Check if admin mode is active (from localStorage)
function checkAdminStatus() {
    const adminStatus = localStorage.getItem('adminMode');
    if (adminStatus === 'true') {
        isAdminMode = true;
        enableAdminMode();
    } else {
        disableAdminMode();
    }
}

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Admin Modal Functions (defined early)
let adminModal, adminToggle, adminPasswordInput, adminLoginBtn, closeModal;

function showAdminModal() {
    if (!adminModal) return;
    adminModal.classList.add('active');
    if (adminPasswordInput) adminPasswordInput.focus();
}

function hideAdminModal() {
    if (!adminModal) return;
    adminModal.classList.remove('active');
    if (adminPasswordInput) adminPasswordInput.value = '';
}

// Image Upload Functionality
const categories = ['education', 'internship', 'freelancing', 'mern', 'content'];
const uploadedImages = {
    education: [],
    internship: [],
    freelancing: [],
    mern: [],
    content: []
};

function isHostingConfigured() {
    return Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET && JSONBIN_BIN_ID);
}

function ensureHostingConfigured() {
    if (isHostingConfigured()) return true;
    alert('Image hosting is not configured yet. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET, and JSONBIN_BIN_ID in script.js to make uploads visible to everyone.');
    return false;
}

// Initialize file inputs for each category
categories.forEach(category => {
    const input = document.getElementById(`${category}-upload`);
    const container = document.getElementById(`${category}-images`);
    const uploadArea = input.closest('.upload-area');
    const label = uploadArea.querySelector('.upload-label');
    const card = uploadArea.closest('.image-upload-card');

    // Click to upload (only if admin)
    label.addEventListener('click', () => {
        if (!isAdminMode) {
            showAdminModal();
            return;
        }
        if (!ensureHostingConfigured()) return;
        input.click();
    });

    // Drag and drop (only if admin)
    uploadArea.addEventListener('dragover', (e) => {
        if (!isAdminMode) {
            e.preventDefault();
            return;
        }
        e.preventDefault();
        label.style.borderColor = '#ec4899';
        label.style.background = 'rgba(255, 255, 255, 0.15)';
    });

    uploadArea.addEventListener('dragleave', () => {
        label.style.borderColor = '';
        label.style.background = '';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        label.style.borderColor = '';
        label.style.background = '';
        
        if (!isAdminMode) {
            showAdminModal();
            return;
        }
        if (!ensureHostingConfigured()) return;
        
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files, category, container);
    });

    // File input change
    input.addEventListener('change', (e) => {
        if (!isAdminMode) return;
        if (!ensureHostingConfigured()) return;
        const files = Array.from(e.target.files);
        handleFiles(files, category, container);
    });
});

// Handle uploaded files
function handleFiles(files, category, container) {
    if (!isHostingConfigured()) {
        alert('Hosting not configured. Configure Cloudinary and JSONBin in script.js to proceed.');
        return;
    }
    files.forEach(async (file) => {
        if (!file.type.startsWith('image/')) return;

        // If Cloudinary config is provided, upload to Cloudinary for globally visible URLs
        if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET) {
            try {
                const uploaded = await uploadToCloudinary(file, category);
                const imageData = {
                    id: Date.now() + Math.random(),
                    src: uploaded.secureUrl,
                    name: file.name,
                    provider: 'cloudinary',
                    publicId: uploaded.publicId,
                    category
                };
                uploadedImages[category].push(imageData);
                displayImage(imageData, category, container);
                updateGallery();
                await saveManifest();
                saveToLocalStorage(); // optional local cache
            } catch (err) {
                console.error('Cloud upload failed.', err);
                alert('Upload failed. Please check your Cloudinary credentials in script.js.');
            }
            return;
        }

        alert('Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET in script.js.');
    });
}

// Display uploaded image
function displayImage(imageData, category, container) {
    const imageItem = document.createElement('div');
    imageItem.className = 'uploaded-image-item';
    imageItem.dataset.id = imageData.id;
    imageItem.dataset.category = category;

    imageItem.innerHTML = `
        <img src="${imageData.src}" alt="${imageData.name}">
        <button class="remove-image" style="${isAdminMode ? '' : 'display:none;'}" onclick="removeImage('${imageData.id}', '${category}')" title="Remove image">×</button>
    `;

    container.appendChild(imageItem);
}

// Remove image
function removeImage(imageId, category) {
    // Remove from array
    uploadedImages[category] = uploadedImages[category].filter(
        img => img.id !== imageId
    );

    // Remove from DOM
    const imageItem = document.querySelector(
        `.uploaded-image-item[data-id="${imageId}"]`
    );
    if (imageItem) {
        imageItem.remove();
    }

    updateGallery();
    saveToLocalStorage();
    // Persist to shared manifest if configured
    try { saveManifest(); } catch (_) {}
}

// Update gallery with all images
function updateGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    // Remove only dynamically generated items, keep any static items in HTML
    Array.from(galleryGrid.querySelectorAll('.gallery-item.generated')).forEach(el => el.remove());

    // Collect all images from all categories
    const allImages = [];
    categories.forEach(category => {
        uploadedImages[category].forEach(img => {
            allImages.push({
                ...img,
                category: category
            });
        });
    });

    // Display in gallery
    allImages.forEach(imageData => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item generated';
        galleryItem.innerHTML = `
            <img src="${imageData.src}" alt="${imageData.name}">
            ${isAdminMode ? `<button class="gallery-remove" title="Remove image" onclick="removeImage('${imageData.id}', '${imageData.category}')">×</button>` : ''}
        `;
        galleryGrid.appendChild(galleryItem);
    });
}

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(15, 23, 42, 0.9)';
        navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.75)';
        navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Make removeImage globally accessible
window.removeImage = removeImage;

// Save images to localStorage (optional - for persistence)
function saveToLocalStorage() {
    try {
        localStorage.setItem('journeyImages', JSON.stringify(uploadedImages));
    } catch (e) {
        console.warn('Could not save to localStorage:', e);
    }
}

// Load images from localStorage on page load
function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('journeyImages');
        if (saved) {
            const parsed = JSON.parse(saved);
            categories.forEach(category => {
                if (parsed[category]) {
                    uploadedImages[category] = parsed[category];
                    const container = document.getElementById(`${category}-images`);
                    parsed[category].forEach(imageData => {
                        displayImage(imageData, category, container);
                    });
                }
            });
            updateGallery();
        }
    } catch (e) {
        console.warn('Could not load from localStorage:', e);
    }
}

// ---- Remote Hosting Helpers ----
async function uploadToCloudinary(file, category) {
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', `my-journey/${category}`);
    const res = await fetch(url, { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Cloudinary upload failed');
    const data = await res.json();
    return { secureUrl: data.secure_url, publicId: data.public_id };
}

async function loadManifest() {
    if (!JSONBIN_BIN_ID) throw new Error('Manifest not configured');
    // Try with key (private bin), then without key (public bin)
    let res = null;
    try {
        if (JSONBIN_API_KEY) {
            res = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
                headers: { 'X-Master-Key': JSONBIN_API_KEY }
            });
        }
        if (!res || !res.ok) {
            res = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`);
        }
    } catch (e) {
        throw new Error('Manifest load failed');
    }
    if (!res.ok) throw new Error('Manifest load failed');
    const data = await res.json();
    const parsed = data.record || {};
    categories.forEach(category => {
        if (parsed[category]) {
            uploadedImages[category] = parsed[category];
            const container = document.getElementById(`${category}-images`);
            parsed[category].forEach(imageData => {
                displayImage(imageData, category, container);
            });
        }
    });
    updateGallery();
}

async function saveManifest() {
    if (!JSONBIN_BIN_ID || !JSONBIN_API_KEY) return; // allow working without manifest
    await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': JSONBIN_API_KEY
        },
        body: JSON.stringify(uploadedImages)
    });
}

// Initialize Admin Modal Elements
function initAdminModal() {
    adminModal = document.getElementById('admin-modal');
    adminToggle = document.getElementById('admin-toggle');
    adminPasswordInput = document.getElementById('admin-password');
    adminLoginBtn = document.getElementById('admin-login-btn');
    closeModal = document.querySelector('.close-modal');
    
    if (!adminModal || !adminToggle) return;
    
    adminToggle.addEventListener('click', () => {
        if (isAdminMode) {
            // Logout
            isAdminMode = false;
            localStorage.setItem('adminMode', 'false');
            disableAdminMode();
        } else {
            // Show login modal
            showAdminModal();
        }
    });
    
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', () => {
            const password = adminPasswordInput.value;
            if (password === ADMIN_PASSWORD) {
                isAdminMode = true;
                localStorage.setItem('adminMode', 'true');
                enableAdminMode();
                hideAdminModal();
            } else {
                alert('Incorrect password!');
                adminPasswordInput.value = '';
                adminPasswordInput.focus();
            }
        });
    }
    
    if (adminPasswordInput) {
        adminPasswordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                adminLoginBtn.click();
            }
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', hideAdminModal);
    }
    
    if (adminModal) {
        adminModal.addEventListener('click', (e) => {
            if (e.target === adminModal) {
                hideAdminModal();
            }
        });
    }
}


// Enable Admin Mode
function enableAdminMode() {
    if (adminToggle) {
        adminToggle.textContent = '✅ Admin Mode';
        adminToggle.classList.add('active');
    }
    
    // Enable all upload areas
    document.querySelectorAll('.upload-label').forEach(label => {
        label.classList.remove('disabled');
    });
    
    // Remove view-only messages
    document.querySelectorAll('.view-only-message').forEach(msg => {
        msg.remove();
    });

    // Show delete buttons
    document.querySelectorAll('.remove-image').forEach(btn => {
        btn.style.display = '';
    });
}

// Disable Admin Mode
function disableAdminMode() {
    if (adminToggle) {
        adminToggle.textContent = '🔐 Admin';
        adminToggle.classList.remove('active');
    }
    
    // Disable all upload areas
    document.querySelectorAll('.upload-label').forEach(label => {
        label.classList.add('disabled');
    });
    
    // Add view-only messages to each upload card
    document.querySelectorAll('.image-upload-card').forEach(card => {
        // Check if message already exists
        if (!card.querySelector('.view-only-message')) {
            const message = document.createElement('div');
            message.className = 'view-only-message';
            message.innerHTML = '<p>👀 View Only - Login as admin to upload images</p>';
            card.appendChild(message);
        }
    });

    // Hide delete buttons
    document.querySelectorAll('.remove-image').forEach(btn => {
        btn.style.display = 'none';
    });
}

// Load on page load
document.addEventListener('DOMContentLoaded', () => {
    initAdminModal();
    checkAdminStatus();
    // Try to load from remote manifest first; fallback to local cache
    loadManifest().catch(() => {
        loadFromLocalStorage();
    });
});

