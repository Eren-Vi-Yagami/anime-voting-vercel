// Initialize entrance animations with delays
document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.animationDelay = el.getAttribute('style').match(/--delay:\s*(\d+ms)/)[1];
});

// Toast notification handler
const toast = document.getElementById('toast');
let toastTimeout;

function showToast(message) {
    if (message) toast.textContent = message;
    toast.classList.remove('hidden');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Global Category Card Click
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', (e) => {
        // Add a pulse effect on click
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);

        showToast();
    });

    // Mouse glow effect
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--x', `${x}%`);
        card.style.setProperty('--y', `${y}%`);
    });
});

// Subtle Background Particles
function createParticles() {
    const container = document.getElementById('particles');
    const count = 30;

    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';

        // Random properties
        const size = Math.random() * 3 + 1;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const dur = Math.random() * 10 + 10;
        const del = Math.random() * 5;

        Object.assign(p.style, {
            position: 'absolute',
            left: `${x}%`,
            top: `${y}%`,
            width: `${size}px`,
            height: `${size}px`,
            background: 'var(--primary)',
            borderRadius: '50%',
            opacity: Math.random() * 0.4,
            filter: 'blur(1px)',
            animation: `float ${dur}s infinite linear ${del}s`
        });

        container.appendChild(p);
    }
}

// Add particle animation to stylesheet dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% { transform: translate(0, 0); opacity: 0; }
        10% { opacity: 0.3; }
        90% { opacity: 0.3; }
        100% { transform: translate(20px, -50px); opacity: 0; }
    }
`;
document.head.appendChild(style);

createParticles();

// Acknowledge logic: Placeholder mode enabled
console.log("Anime Voting App: Landing Page Mode. Real voting is currently disabled.");
