// Canvas Setup
const particleCanvas = document.getElementById('particleCanvas');
const particleCtx = particleCanvas.getContext('2d');
const bloomCanvas = document.getElementById('bloomCanvas');
const bloomCtx = bloomCanvas.getContext('2d');

function resizeCanvases() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
    bloomCanvas.width = window.innerWidth;
    bloomCanvas.height = window.innerHeight;
}

resizeCanvases();
window.addEventListener('resize', resizeCanvases);

// Particle Sparks
class Spark {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * particleCanvas.width;
        this.y = Math.random() * particleCanvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.life = Math.random() * 100 + 50;
        this.maxLife = this.life;
        this.opacity = Math.random() * 0.5 + 0.3;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;

        if (this.life <= 0) {
            this.reset();
        }
    }

    draw() {
        const lifeRatio = this.life / this.maxLife;
        const currentOpacity = this.opacity * lifeRatio;

        // Main spark
        particleCtx.fillStyle = `rgba(0, 255, 255, ${currentOpacity})`;
        particleCtx.beginPath();
        particleCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        particleCtx.fill();

        // Glow
        particleCtx.fillStyle = `rgba(0, 153, 255, ${currentOpacity * 0.3})`;
        particleCtx.beginPath();
        particleCtx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        particleCtx.fill();
    }
}

const sparks = Array.from({ length: 50 }, () => new Spark());
let sparkAnimationId = null; // Track spark animation frame ID

function animateSparks() {
    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    sparks.forEach(spark => {
        spark.update();
        spark.draw();
    });

    sparkAnimationId = requestAnimationFrame(animateSparks);
}

animateSparks();

// Holographic Bloom Effect
class BloomParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 8;
        this.speedY = (Math.random() - 0.5) * 8;
        this.life = 100;
        this.maxLife = 100;
        this.hue = Math.random() * 60 + 160; // Blue-cyan range
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedX *= 0.98;
        this.speedY *= 0.98;
        this.life--;
    }

    draw() {
        const lifeRatio = this.life / this.maxLife;
        const opacity = lifeRatio * 0.8;

        const gradient = bloomCtx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size * 4
        );
        gradient.addColorStop(0, `hsla(${this.hue}, 100%, 70%, ${opacity})`);
        gradient.addColorStop(0.5, `hsla(${this.hue}, 100%, 50%, ${opacity * 0.5})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 100%, 30%, 0)`);

        bloomCtx.fillStyle = gradient;
        bloomCtx.beginPath();
        bloomCtx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
        bloomCtx.fill();
    }

    isDead() {
        return this.life <= 0;
    }
}


let bloomParticles = [];
let bloomActive = false;
let bloomAnimationId = null; // Track the animation frame ID

function animateBloom() {
    if (!bloomActive) {
        // Clear any remaining particles when stopping
        bloomParticles = [];
        bloomCtx.clearRect(0, 0, bloomCanvas.width, bloomCanvas.height);
        if (bloomAnimationId) {
            cancelAnimationFrame(bloomAnimationId);
            bloomAnimationId = null;
        }
        return;
    }

    bloomCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    bloomCtx.fillRect(0, 0, bloomCanvas.width, bloomCanvas.height);

    // Add new particles (only if under strict limit)
    const MAX_PARTICLES = 30; // Reduced from 50

    if (bloomParticles.length < MAX_PARTICLES) {
        const centerX = bloomCanvas.width / 2;
        const centerY = bloomCanvas.height / 2;

        // Only add 1 particle per frame instead of 2
        bloomParticles.push(new BloomParticle(centerX, centerY));
    }

    // Update and draw particles
    bloomParticles = bloomParticles.filter(particle => {
        particle.update();
        particle.draw();
        return !particle.isDead();
    });

    bloomAnimationId = requestAnimationFrame(animateBloom);
}

function startBloom() {
    // Stop any existing bloom animation first
    if (bloomAnimationId) {
        cancelAnimationFrame(bloomAnimationId);
        bloomAnimationId = null;
    }

    bloomActive = true;
    bloomCanvas.classList.add('active');
    animateBloom();
}

function stopBloom() {
    bloomActive = false;
    if (bloomAnimationId) {
        cancelAnimationFrame(bloomAnimationId);
        bloomAnimationId = null;
    }

    setTimeout(() => {
        bloomCanvas.classList.remove('active');
        bloomParticles = [];
        bloomCtx.clearRect(0, 0, bloomCanvas.width, bloomCanvas.height);
    }, 500);
}

// Timestamp Update
function updateTimestamp() {
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
    document.getElementById('timestamp').textContent = `TIMESTAMP: ${timestamp}`;
}

updateTimestamp();
setInterval(updateTimestamp, 1000);

// Button Click Handler
const confirmButton = document.getElementById('confirmButton');
const messageBox = document.getElementById('messageBox');
const confirmationScreen = document.getElementById('confirmationScreen');

confirmButton.addEventListener('click', () => {
    // Prevent multiple clicks
    if (confirmButton.disabled) return;
    confirmButton.disabled = true;

    // Start single bloom effect
    startBloom();

    // Replace sparks array instead of growing it (CRITICAL FIX)
    const tempSparks = [];
    for (let i = 0; i < 8; i++) {
        const spark = new Spark();
        spark.x = bloomCanvas.width / 2;
        spark.y = bloomCanvas.height / 2;
        spark.speedX = (Math.random() - 0.5) * 5;
        spark.speedY = (Math.random() - 0.5) * 5;
        tempSparks.push(spark);
    }

    // Replace entire sparks array instead of pushing
    sparks.splice(0, sparks.length, ...tempSparks);

    // Fade out message box
    messageBox.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
    messageBox.style.opacity = '0';
    messageBox.style.transform = 'scale(0.95)';

    // Show confirmation after bloom
    setTimeout(() => {
        messageBox.classList.add('hidden');
        stopBloom();

        setTimeout(() => {
            confirmationScreen.classList.remove('hidden');
        }, 600);
    }, 2000);
});

// Add glitch effect periodically to title
const glitchText = document.querySelector('.glitch-text');
let glitchInterval;

function randomGlitch() {
    const shouldGlitch = Math.random() > 0.7;
    if (shouldGlitch) {
        glitchText.style.animation = 'none';
        setTimeout(() => {
            glitchText.style.animation = 'glitchToStable 0.3s ease-out';
        }, 10);
    }
}

// Start subtle glitches after initial animation
setTimeout(() => {
    glitchInterval = setInterval(randomGlitch, 5000);
}, 5000);

// Add hover effect to button
confirmButton.addEventListener('mouseenter', () => {
    // Don't add particles if button is already clicked
    if (confirmButton.disabled) return;

    // Limit hover particles
    if (sparks.length > 60) return;

    // Create small bloom preview
    const rect = confirmButton.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 3; i++) {
        const spark = new Spark();
        spark.x = centerX;
        spark.y = centerY;
        spark.speedX = (Math.random() - 0.5) * 2;
        spark.speedY = (Math.random() - 0.5) * 2;
        spark.opacity = 0.8;
        spark.life = 30; // Shorter life for hover sparks
        sparks.push(spark);
    }
});

// Global cleanup function
function stopAllAnimations() {
    if (sparkAnimationId) {
        cancelAnimationFrame(sparkAnimationId);
        sparkAnimationId = null;
    }
    if (bloomAnimationId) {
        cancelAnimationFrame(bloomAnimationId);
        bloomAnimationId = null;
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    stopAllAnimations();

    if (glitchInterval) {
        clearInterval(glitchInterval);
    }

    // Clear all particles
    sparks.length = 0;
    bloomParticles = [];

    // Clear canvases
    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    bloomCtx.clearRect(0, 0, bloomCanvas.width, bloomCanvas.height);
});

// Pause animations when tab is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopAllAnimations();
    } else {
        sparkAnimationId = requestAnimationFrame(animateSparks);
        if (bloomActive) {
            bloomAnimationId = requestAnimationFrame(animateBloom);
        }
    }
});
