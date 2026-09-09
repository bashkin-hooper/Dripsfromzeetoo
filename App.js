// --- Shopping Cart State & Management ---
let cart = [];

function toggleCart() {
    const drawer = document.getElementById('cartDrawer');
    if (drawer) {
        drawer.classList.toggle('hidden');
    }
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCartUI();
    toggleCart(); // Open cart drawer automatically when item added
}

function updateCartUI() {
    const cartCountEl = document.getElementById('cartCount');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartSubtotalEl = document.getElementById('cartSubtotal');

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Update badge count across all pages
    document.querySelectorAll('#cartCount').forEach(el => {
        el.textContent = totalCount;
    });

    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `<p class="text-gray-500 text-sm text-center py-8">Your cart is currently empty.</p>`;
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                    <div>
                        <h4 class="text-sm font-bold text-white">${item.name}</h4>
                        <p class="text-xs text-gray-400">$${item.price} x ${item.quantity}</p>
                    </div>
                    <span class="text-sm font-semibold text-pulseAccent">$${item.price * item.quantity}</span>
                </div>
            `).join('');
        }
    }

    if (cartSubtotalEl) {
        cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    }
}

// --- Virtual Try-On Camera Feed & Shade Filter Logic ---
let videoStream = null;

async function startCamera() {
    const videoElement = document.getElementById('webcam');
    const placeholder = document.getElementById('cameraPlaceholder');
    const shadeOverlay = document.getElementById('shadeOverlay');

    try {
        videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        videoElement.srcObject = videoStream;
        videoElement.classList.remove('hidden');
        placeholder.classList.add('hidden');
        shadeOverlay.classList.remove('opacity-0');
    } catch (err) {
        alert("Unable to access camera. Please check your browser permissions.");
        console.error("Camera access error:", err);
    }
}

function stopCamera() {
    const videoElement = document.getElementById('webcam');
    const placeholder = document.getElementById('cameraPlaceholder');
    const shadeOverlay = document.getElementById('shadeOverlay');

    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
    if (videoElement) {
        videoElement.srcObject = null;
        videoElement.classList.add('hidden');
    }
    if (placeholder) {
        placeholder.classList.remove('hidden');
    }
    if (shadeOverlay) {
        shadeOverlay.classList.add('opacity-0');
    }
}

function selectShade(shadeName, styleClasses) {
    const shadeOverlay = document.getElementById('shadeOverlay');
    const label = document.getElementById('activeShadeLabel');
    
    if (label) {
        label.textContent = shadeName;
    }
    
    // Update visual styling frame dynamically
    const innerBox = shadeOverlay.firstElementChild;
    if (innerBox) {
        innerBox.className = `w-48 h-16 border-4 rounded-2xl backdrop-blur-[2px] shadow-lg flex items-center justify-center transition-all duration-300 ${styleClasses}`;
    }
}

// Initial UI sync on load
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
});
