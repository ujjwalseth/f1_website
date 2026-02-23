// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');

    // Animate hamburger to X
    const bars = document.querySelectorAll('.bar');
    if (navLinks.classList.contains('active')) {
        bars[0].style.transform = 'translateY(8px) rotate(45deg)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'translateY(-8px) rotate(-45deg)';
    } else {
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    }
});

// Close mobile menu on clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const bars = document.querySelectorAll('.bar');
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    });
});

// Scroll Reveal Animations using Intersection Observer
const scrollElements = document.querySelectorAll('[data-scroll]');

const elementInView = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
        elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
    );
};

const displayScrollElement = (element) => {
    element.classList.add('scrolled');
};

const hideScrollElement = (element) => {
    element.classList.remove('scrolled');
};

const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
        if (elementInView(el, 1.15)) {
            displayScrollElement(el);
        }
    });
};

// Initialize Observer for better performance
if ('IntersectionObserver' in window) {
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scrolled');
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: "0px 0px -100px 0px",
        threshold: 0.1
    });

    scrollElements.forEach((el) => {
        scrollObserver.observe(el);
    });
} else {
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
    handleScrollAnimation();
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// =============================================
// Hero Image Sequence Animation (Canvas)
// =============================================
(function () {
    const canvas = document.getElementById('hero-sequence');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const FRAME_COUNT = 40;
    const FPS = 12;
    const INTERVAL = 1000 / FPS;

    let frameIndex = 0;
    let lastTime = 0;
    let animationStarted = false;

    const images = [];
    let loadedCount = 0;

    // Build the path for a given frame number
    function framePath(n) {
        return 'assets/hero_shot/ezgif-frame-' + String(n).padStart(3, '0') + '.jpg';
    }

    // Size the canvas buffer to match the screen
    function sizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // Draw an image to fill the canvas (like object-fit: cover)
    function drawCover(img) {
        if (!img || !img.naturalWidth) return;

        const cW = canvas.width;
        const cH = canvas.height;
        const iW = img.naturalWidth;
        const iH = img.naturalHeight;

        const scale = Math.max(cW / iW, cH / iH);
        const dW = iW * scale;
        const dH = iH * scale;
        const dX = (cW - dW) / 2;
        const dY = (cH - dH) / 2;

        ctx.drawImage(img, dX, dY, dW, dH);
    }

    // Animation loop
    function tick(now) {
        requestAnimationFrame(tick);
        if (now - lastTime < INTERVAL) return;
        lastTime = now;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawCover(images[frameIndex]);
        frameIndex = (frameIndex + 1) % FRAME_COUNT;
    }

    // Start animation
    function start() {
        if (animationStarted) return;
        animationStarted = true;
        requestAnimationFrame(tick);
    }

    // Handle a frame finishing loading (success or error)
    function onFrameReady() {
        loadedCount++;
        // Show the first frame immediately so user sees something
        if (loadedCount === 1 && images[0] && images[0].naturalWidth) {
            sizeCanvas();
            drawCover(images[0]);
        }
        if (loadedCount >= FRAME_COUNT) {
            start();
        }
    }

    // Preload all frames
    for (let i = 1; i <= FRAME_COUNT; i++) {
        const img = new Image();
        img.onload = onFrameReady;
        img.onerror = onFrameReady; // count errors too so animation isn't blocked
        img.src = framePath(i);
        images.push(img);
    }

    // Size canvas now and on every resize
    sizeCanvas();
    window.addEventListener('resize', function () {
        sizeCanvas();
        // Redraw current frame after resize
        if (images[frameIndex] && images[frameIndex].naturalWidth) {
            drawCover(images[frameIndex]);
        }
    });
})();
