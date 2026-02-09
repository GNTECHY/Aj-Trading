// Admin Panel Logic

// Selectors
const loginSection = document.getElementById('login-section');
const dashboardInterface = document.getElementById('dashboard-interface');
const productTableBody = document.querySelector('#product-table tbody');
const activityLogContainer = document.getElementById('activity-log');
const statTotal = document.getElementById('stat-total');
const statRecent = document.getElementById('stat-recent');

// Login State
let isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';

// Temporary storage for uploaded file base64
let currentFileBase64 = null;
let currentFileName = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (isAdminLoggedIn) {
        showDashboard();
    } else {
        loginSection.style.display = 'flex';
    }
});

function login() {
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const errorMsg = document.getElementById('login-error');

    // Mock Credentials
    if (usernameInput === 'admin' && passwordInput === 'admin') {
        localStorage.setItem('isAdminLoggedIn', 'true');
        isAdminLoggedIn = true;
        showDashboard();
        errorMsg.style.display = 'none';
        logActivity('Login', 'Admin user logged in');
    } else {
        errorMsg.style.display = 'block';
    }
}

function logout() {
    localStorage.removeItem('isAdminLoggedIn');
    isAdminLoggedIn = false;
    loginSection.style.display = 'flex';
    dashboardInterface.style.display = 'none';
}

function showDashboard() {
    loginSection.style.display = 'none';
    dashboardInterface.style.display = 'flex';
    renderProducts();
    renderLogs();
    renderStats();
}

// File Handling
function handleFileSelect(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];

        // Show loading state or name
        document.getElementById('file-name-display').innerText = `Selected: ${file.name}`;

        const reader = new FileReader();
        reader.onload = function (e) {
            currentFileBase64 = e.target.result;
            currentFileName = file.name;
        };
        reader.readAsDataURL(file);
    }
}

// Product Management
function getProducts() {
    return JSON.parse(localStorage.getItem('aj_products')) || [];
}

function saveProducts(products) {
    localStorage.setItem('aj_products', JSON.stringify(products));
    renderProducts();
    renderStats();
}

function addProduct() {
    const category = document.getElementById('new-category').value;

    if (!currentFileBase64) {
        alert('Please upload an image first.');
        return;
    }

    const products = getProducts();

    // Create unique ID
    const newId = `product_${Date.now()}`;

    const newProduct = {
        id: newId,
        image: currentFileBase64, // Store Base64 string
        category: category,
        rating: 5.0,
        tempName: currentFileName // For logging (optional)
    };

    products.unshift(newProduct);
    saveProducts(products);
    logActivity('Add Product', `Added ${category} product (Image: ${currentFileName})`);

    // Reset inputs
    document.getElementById('file-name-display').innerText = 'Click or Drag to upload image';
    document.getElementById('file-upload').value = '';
    currentFileBase64 = null;
    currentFileName = null;

    alert('Product added successfully!');
}

function deleteProduct(index) {
    const products = getProducts();
    if (confirm('Are you sure you want to delete this product?')) {
        const removed = products.splice(index, 1)[0];
        saveProducts(products);
        logActivity('Delete Product', `Removed ${removed.category} product`);
    }
}

function renderProducts() {
    const products = getProducts();
    productTableBody.innerHTML = '';

    products.forEach((p, index) => {
        const tr = document.createElement('tr');
        // Use getImagePath from script.js (if loaded) or handle manually
        // Since admin.html loads script.js, getImagePath is available globally.
        // We will assume script.js is loaded.

        const imgSrc = (typeof getImagePath === 'function') ? getImagePath(p.image) : p.image;

        tr.innerHTML = `
            <td><img src="${imgSrc}" class="product-thumb"></td>
            <td>
                <div style="font-weight: 500;">${p.category} Product</div>
                <div style="font-size: 0.8rem; color: #888; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${p.id}</div>
            </td>
            <td><span class="badge" style="background: #eef2f7; color: #555; padding: 4px 8px; border-radius: 4px; font-size: 0.85rem;">${p.category}</span></td>
            <td style="text-align: right;">
                <button onclick="deleteProduct(${index})" class="btn-danger"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        productTableBody.appendChild(tr);
    });
}

// Activity Log
function logActivity(action, details) {
    const logs = JSON.parse(localStorage.getItem('aj_logs')) || [];
    const newLog = {
        action,
        details,
        timestamp: new Date().toLocaleString()
    };
    logs.unshift(newLog); // Add to top
    if (logs.length > 50) logs.pop();

    localStorage.setItem('aj_logs', JSON.stringify(logs));
    renderLogs();
}

function renderLogs() {
    const logs = JSON.parse(localStorage.getItem('aj_logs')) || [];
    activityLogContainer.innerHTML = '';

    if (logs.length === 0) {
        activityLogContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">No activities recorded</div>';
        return;
    }

    logs.forEach(log => {
        const div = document.createElement('div');
        div.style.padding = '12px';
        div.style.borderBottom = '1px solid #f0f0f0';
        div.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <strong style="font-size: 0.9rem; color: var(--primary-color);">${log.action}</strong>
                <span style="font-size: 0.75rem; color: #999;">${log.timestamp}</span>
            </div>
            <div style="font-size: 0.85rem; color: #555;">${log.details}</div>
        `;
        activityLogContainer.appendChild(div);
    });
}

// Stats
function renderStats() {
    const products = getProducts();
    statTotal.innerText = products.length;

    // Calculate added today (simple string match on date)
    const today = new Date().toLocaleDateString();

    // Since products don't have a timestamp field in the current data structure, we can't accurately calculate "Added Today" from the product list itself unless we add a timestamp field. 
    // However, we can approximate it from the logs or just show 0 for now as a placeholder or refactor product structure.
    // For now, let's just count how many products we have.

    // Check logs for 'Add Product' today
    const logs = JSON.parse(localStorage.getItem('aj_logs')) || [];
    const addedToday = logs.filter(l => l.action === 'Add Product' && l.timestamp.includes(today)).length;
    statRecent.innerText = addedToday;
}
