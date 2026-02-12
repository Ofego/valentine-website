// Create floating hearts background
function createFloatingHeart() {
    const heartsBackground = document.getElementById('heartsBackground');
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.textContent = ['❤️', '💕', '💖', '💗', '💝'][Math.floor(Math.random() * 5)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 3 + 5) + 's';
    heart.style.fontSize = (Math.random() * 20 + 15) + 'px';

    heartsBackground.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 8000);
}

// Create hearts periodically
setInterval(createFloatingHeart, 300);

// Button interactions
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const questionCard = document.getElementById('questionCard');
const celebrationCard = document.getElementById('celebrationCard');

let noBtnClickCount = 0;

yesBtn.addEventListener('click', () => {
    // Hide question card
    questionCard.style.animation = 'fadeInScale 0.5s ease-out reverse';

    setTimeout(() => {
        questionCard.classList.add('hidden');
        celebrationCard.classList.remove('hidden');

        // Create explosion of hearts
        createHeartExplosion();
    }, 500);
});

noBtn.addEventListener('click', () => {
    noBtnClickCount++;

    // Make "No" button shrink and "Yes" button grow
    noBtn.classList.add('shrinking');
    yesBtn.style.transform = `scale(${1 + noBtnClickCount * 0.1})`;

    // Change the message to be more persuasive
    const messages = [
        "Are you sure? Think about all our amazing moments together! 💕",
        "Really? But we're perfect together! 🥺",
        "Come on... you know you want to say yes! 💖",
        "The 'Yes' button is looking pretty good right now, isn't it? 😊",
        "I'll keep asking until you say yes! 💝"
    ];

    const messageElement = document.querySelector('.message');
    if (noBtnClickCount <= messages.length) {
        messageElement.textContent = messages[noBtnClickCount - 1];
        messageElement.style.animation = 'none';
        setTimeout(() => {
            messageElement.style.animation = 'fadeInScale 0.5s ease-out';
        }, 10);
    }

    // After 3 clicks, make the No button really small
    if (noBtnClickCount >= 3) {
        noBtn.style.transform = `scale(${1 - noBtnClickCount * 0.15})`;
        noBtn.style.opacity = `${1 - noBtnClickCount * 0.15}`;
    }

    // After 5 clicks, hide the No button
    if (noBtnClickCount >= 5) {
        noBtn.style.display = 'none';
        messageElement.textContent = "Okay, okay... there's only one option left! 😄💕";
    }
});

// Create heart explosion effect
function createHeartExplosion() {
    const container = document.getElementById('mainContainer');
    const hearts = ['❤️', '💕', '💖', '💗', '💝', '💓', '💞'];

    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.position = 'fixed';
            heart.style.fontSize = (Math.random() * 30 + 20) + 'px';
            heart.style.left = '50%';
            heart.style.top = '50%';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '1000';

            const angle = (Math.PI * 2 * i) / 30;
            const velocity = Math.random() * 200 + 100;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            heart.style.animation = 'none';
            document.body.appendChild(heart);

            heart.animate([
                {
                    transform: 'translate(-50%, -50%) scale(0) rotate(0deg)',
                    opacity: 1
                },
                {
                    transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1.5) rotate(${Math.random() * 360}deg)`,
                    opacity: 0
                }
            ], {
                duration: 1500,
                easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
            });

            setTimeout(() => heart.remove(), 1500);
        }, i * 30);
    }
}

// Add hover effect to buttons
[yesBtn, noBtn].forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        btn.style.position = 'relative';
        btn.style.zIndex = '1';
    });
});
