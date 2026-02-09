// Helper to resolve image paths (Local vs Base64/URL)
function getImagePath(imageName) {
    if (!imageName) return 'https://via.placeholder.com/300';
    if (imageName.startsWith('data:') || imageName.startsWith('http')) {
        return imageName;
    }
    return `assets/products/${imageName}`;
}

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle icon or animation if needed
        });
    }

    // Sticky Navigation Shadow on Scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none'; // Or keep it subtle
        }
    });

    // Active Link Highlighting
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-links li a');

    navItems.forEach(item => {
        const itemPath = item.getAttribute('href');
        // Simple check - in production might need more robust URL parsing
        if (currentPath.endsWith(itemPath) || (currentPath === '/' && itemPath === 'index.html')) {
            item.classList.add('active');
        }
    });

    // Floating WhatsApp Button Injection (Exclude Admin)
    if (!window.location.pathname.includes('admin.html')) {
        const waBtn = document.createElement('a');
        waBtn.href = "https://wa.me/919947932323";
        waBtn.target = "_blank";
        waBtn.className = "floating-wa-btn fade-in-up";
        waBtn.style.animationDelay = "1s"; // Delay appearance slightly
        waBtn.innerHTML = `
            <i class="fab fa-whatsapp"></i>
            <span>WhatsApp</span>
            <span class="wave">👋</span>
        `;
        document.body.appendChild(waBtn);
    }
});
