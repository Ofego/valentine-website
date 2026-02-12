// Canvas Setup
const starfieldCanvas = document.getElementById('starfield');
const starfieldCtx = starfieldCanvas.getContext('2d');
const particlesCanvas = document.getElementById('particles');
const particlesCtx = particlesCanvas.getContext('2d');
const portalCanvas = document.getElementById('portal');
const portalCtx = portalCanvas.getContext('2d');

// Resize canvases
function resizeCanvases() {
    starfieldCanvas.width = window.innerWidth;
    starfieldCanvas.height = window.innerHeight;
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
    portalCanvas.width = window.innerWidth;
    portalCanvas.height = window.innerHeight;
}

resizeCanvases();
window.addEventListener('resize', resizeCanvases);

// Parallax Starfield
class Star {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * starfieldCanvas.width;
        this.y = Math.random() * starfieldCanvas.height;
        this.z = Math.random() * 1000;
        this.size = Math.random() * 2;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.twinkleSpeed = Math.random() * 0.02 + 0.01;
        this.twinklePhase = Math.random() * Math.PI * 2;
    }

    update() {
        this.z -= 0.5;
        if (this.z <= 0) {
            this.reset();
            this.z = 1000;
        }
        this.twinklePhase += this.twinkleSpeed;
    }

    draw() {
        const scale = 1000 / (1000 + this.z);
        const x = (this.x - starfieldCanvas.width / 2) * scale + starfieldCanvas.width / 2;
        const y = (this.y - starfieldCanvas.height / 2) * scale + starfieldCanvas.height / 2;
        const size = this.size * scale;
        const twinkle = Math.sin(this.twinklePhase) * 0.3 + 0.7;

        starfieldCtx.fillStyle = `rgba(255, 255, 255, ${this.opacity * twinkle})`;
        starfieldCtx.beginPath();
        starfieldCtx.arc(x, y, size, 0, Math.PI * 2);
        starfieldCtx.fill();

        // Add glow for brighter stars
        if (this.opacity > 0.6) {
            starfieldCtx.fillStyle = `rgba(142, 197, 252, ${(this.opacity - 0.6) * 0.3 * twinkle})`;
            starfieldCtx.beginPath();
            starfieldCtx.arc(x, y, size * 2, 0, Math.PI * 2);
            starfieldCtx.fill();
        }
    }
}

const stars = Array.from({ length: 400 }, () => new Star());

function animateStarfield() {
    starfieldCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    starfieldCtx.fillRect(0, 0, starfieldCanvas.width, starfieldCanvas.height);

    stars.forEach(star => {
        star.update();
        star.draw();
    });

    requestAnimationFrame(animateStarfield);
}

animateStarfield();

// Floating Light Particles
class FloatingParticle {
    constructor() {
        this.x = Math.random() * particlesCanvas.width;
        this.y = Math.random() * particlesCanvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = this.getRandomColor();
    }

    getRandomColor() {
        const colors = [
            'rgba(142, 197, 252, ',
            'rgba(224, 195, 252, ',
            'rgba(255, 255, 255, '
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > particlesCanvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > particlesCanvas.height) this.speedY *= -1;
    }

    draw() {
        particlesCtx.fillStyle = this.color + this.opacity + ')';
        particlesCtx.beginPath();
        particlesCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        particlesCtx.fill();

        // Soft glow
        particlesCtx.fillStyle = this.color + (this.opacity * 0.3) + ')';
        particlesCtx.beginPath();
        particlesCtx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        particlesCtx.fill();
    }
}

const floatingParticles = Array.from({ length: 60 }, () => new FloatingParticle());

function animateFloatingParticles() {
    particlesCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);

    floatingParticles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animateFloatingParticles);
}

animateFloatingParticles();

// Heart Constellation Animation
const heartConstellation = document.getElementById('heartConstellation');
const heartPoints = [
    { x: 0.5, y: 0.3 },
    { x: 0.35, y: 0.2 },
    { x: 0.2, y: 0.25 },
    { x: 0.15, y: 0.4 },
    { x: 0.2, y: 0.55 },
    { x: 0.35, y: 0.7 },
    { x: 0.5, y: 0.85 },
    { x: 0.65, y: 0.7 },
    { x: 0.8, y: 0.55 },
    { x: 0.85, y: 0.4 },
    { x: 0.8, y: 0.25 },
    { x: 0.65, y: 0.2 }
];

function createHeartConstellation() {
    heartPoints.forEach((point, index) => {
        setTimeout(() => {
            const star = document.createElement('div');
            star.style.position = 'absolute';
            star.style.left = (point.x * 100) + '%';
            star.style.top = (point.y * 100) + '%';
            star.style.width = '8px';
            star.style.height = '8px';
            star.style.borderRadius = '50%';
            star.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(142, 197, 252, 0.8) 50%, transparent 100%)';
            star.style.boxShadow = '0 0 20px rgba(142, 197, 252, 0.8), 0 0 40px rgba(142, 197, 252, 0.4)';
            star.style.transform = 'translate(-50%, -50%) scale(0)';
            star.style.animation = `starAppear 0.8s ease-out ${index * 0.1}s forwards`;

            heartConstellation.appendChild(star);

            // Draw connecting lines
            if (index > 0) {
                const line = document.createElement('div');
                const prevPoint = heartPoints[index - 1];
                const dx = (point.x - prevPoint.x) * 300;
                const dy = (point.y - prevPoint.y) * 300;
                const length = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx) * 180 / Math.PI;

                line.style.position = 'absolute';
                line.style.left = (prevPoint.x * 100) + '%';
                line.style.top = (prevPoint.y * 100) + '%';
                line.style.width = '0';
                line.style.height = '1px';
                line.style.background = 'linear-gradient(90deg, rgba(142, 197, 252, 0.4), rgba(224, 195, 252, 0.4))';
                line.style.transformOrigin = '0 0';
                line.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
                line.style.animation = `lineGrow 0.6s ease-out ${index * 0.1 + 0.2}s forwards`;
                line.style.setProperty('--line-length', length + 'px');

                heartConstellation.appendChild(line);
            }
        }, index * 100);
    });
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes starAppear {
        to {
            transform: translate(-50%, -50%) scale(1);
        }
    }
    @keyframes lineGrow {
        to {
            width: var(--line-length);
        }
    }
`;
document.head.appendChild(style);

createHeartConstellation();

// Portal Animation
class PortalParticle {
    constructor(centerX, centerY) {
        this.angle = Math.random() * Math.PI * 2;
        this.radius = Math.random() * 200 + 50;
        this.centerX = centerX;
        this.centerY = centerY;
        this.speed = Math.random() * 0.02 + 0.01;
        this.size = Math.random() * 4 + 2;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.spiralSpeed = Math.random() * 2 + 1;
    }

    update() {
        this.angle += this.speed;
        this.radius -= this.spiralSpeed;
    }

    draw() {
        const x = this.centerX + Math.cos(this.angle) * this.radius;
        const y = this.centerY + Math.sin(this.angle) * this.radius;

        const gradient = portalCtx.createRadialGradient(x, y, 0, x, y, this.size * 2);
        gradient.addColorStop(0, `rgba(142, 197, 252, ${this.opacity})`);
        gradient.addColorStop(0.5, `rgba(224, 195, 252, ${this.opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(142, 197, 252, 0)');

        portalCtx.fillStyle = gradient;
        portalCtx.beginPath();
        portalCtx.arc(x, y, this.size * 2, 0, Math.PI * 2);
        portalCtx.fill();
    }

    isDead() {
        return this.radius <= 0;
    }
}

let portalParticles = [];
let portalActive = false;

function animatePortal() {
    if (!portalActive) return;

    portalCtx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    portalCtx.fillRect(0, 0, portalCanvas.width, portalCanvas.height);

    // Add new particles
    const centerX = portalCanvas.width / 2;
    const centerY = portalCanvas.height / 2;

    for (let i = 0; i < 5; i++) {
        portalParticles.push(new PortalParticle(centerX, centerY));
    }

    // Update and draw particles
    portalParticles = portalParticles.filter(particle => {
        particle.update();
        particle.draw();
        return !particle.isDead();
    });

    requestAnimationFrame(animatePortal);
}

// Button Click Handler
const yesButton = document.getElementById('yesButton');
const messageContainer = document.getElementById('messageContainer');
const confirmationContainer = document.getElementById('confirmationContainer');

yesButton.addEventListener('click', () => {
    // Start portal animation
    portalActive = true;
    portalCanvas.classList.add('active');
    animatePortal();

    // Fade out message
    messageContainer.style.transition = 'opacity 1.5s ease-out';
    messageContainer.style.opacity = '0';

    // After portal animation
    setTimeout(() => {
        messageContainer.classList.add('hidden');
        portalActive = false;

        setTimeout(() => {
            portalCanvas.classList.remove('active');
            confirmationContainer.classList.remove('hidden');
            confirmationContainer.style.opacity = '0';
            confirmationContainer.style.transition = 'opacity 1.5s ease-in';

            setTimeout(() => {
                confirmationContainer.style.opacity = '1';
            }, 50);
        }, 500);
    }, 2500);
});
