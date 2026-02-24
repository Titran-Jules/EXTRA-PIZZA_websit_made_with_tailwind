(function initHeroBgSlider() {
  const layers  = document.querySelectorAll('.hero-bg-layer');
  const dots    = document.querySelectorAll('.hero-bg-dot');
  const btnPrev = document.getElementById('hero-bg-prev');
  const btnNext = document.getElementById('hero-bg-next');
  const section = document.getElementById('heroSection');

  if (!layers.length || !btnPrev || !btnNext) return;

  const AUTOPLAY_DELAY = 6000;
  let   current        = 0;
  let   autoplayTimer;

  function goTo(targetIndex) {
    layers[current].style.opacity = '0';
    dots[current].classList.remove('bg-red-600', 'w-8');
    dots[current].classList.add('bg-white/30', 'w-3');

    current = (targetIndex + layers.length) % layers.length;

    layers[current].style.opacity = '1';
    dots[current].classList.remove('bg-white/30', 'w-3');
    dots[current].classList.add('bg-red-600', 'w-8');

    resetAutoplay();
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => goTo(current + 1), AUTOPLAY_DELAY);
  }

  layers.forEach(layer => {
    const src = layer.style.backgroundImage.replace(/url\(['"]?|['"]?\)/g, '');
    if (src) { const preload = new Image(); preload.src = src; }
  });

  btnNext.addEventListener('click', () => goTo(current + 1));
  btnPrev.addEventListener('click', () => goTo(current - 1));
  dots.forEach(dot => dot.addEventListener('click', () => goTo(+dot.dataset.index)));

  section.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
  section.addEventListener('mouseleave', resetAutoplay);

  resetAutoplay();
})();

const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    mobileMenu.classList.toggle('flex');
    const icon = menuToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-xmark');
});

(function initHeroReveal() {
    const content = document.getElementById('heroContent');
    if (!content) return;

    const children = Array.from(content.children);

    children.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(32px)';
        el.style.transition = `opacity 0.7s ease, transform 0.7s ease`;
    });

    window.addEventListener('load', () => {
        children.forEach((el, i) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 150 + i * 130);
        });
    });
})();

(function initHeroCounters() {
    const statEls = document.querySelectorAll('[data-target]');
    if (!statEls.length) return;

    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const duration = 2000;

    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const isK    = target >= 1000;
        const start  = performance.now();

        const step = (now) => {
            const elapsed  = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const value    = Math.round(easeOut(progress) * target);

            el.textContent = isK
                ? (value >= 1000 ? Math.floor(value / 1000) + 'K' : value) + suffix
                : value + suffix;

            if (progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    statEls.forEach(el => observer.observe(el));
})();

(function initHeroParallax() {
    const layers = document.querySelectorAll('.hero-bg-layer');
    if (!layers) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight * 1.2) {
            const posY = `calc(50% + ${scrolled * 0.25}px)`;
            layers.forEach(layer => { layer.style.backgroundPositionY = posY; });
        }
    }, { passive: true });
})();

(function initHeroParticles() {
    const hero = document.getElementById('heroSection');
    if (!hero) return;

    const container = document.createElement('div');
    container.style.cssText = `
        position: absolute; inset: 0;
        pointer-events: none; z-index: 3; overflow: hidden;
    `;
    hero.appendChild(container);

    const count = 24;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('span');
        const size = Math.random() * 3 + 1;
      
        const colors = [
            `rgba(220,38,38,${Math.random() * 0.4 + 0.1})`,
            `rgba(29,78,216,${Math.random() * 0.4 + 0.1})`,
            `rgba(255,255,255,${Math.random() * 0.3 + 0.05})`,
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];

        p.style.cssText = `
            position: absolute;
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            animation: heroParticle ${Math.random() * 10 + 6}s ease-in-out infinite;
            animation-delay: -${Math.random() * 8}s;
        `;
        container.appendChild(p);
    }

    if (!document.getElementById('hero-particle-style')) {
        const style = document.createElement('style');
        style.id = 'hero-particle-style';
        style.textContent = `
            @keyframes heroParticle {
                0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.3; }
                33%       { transform: translateY(-28px) translateX(8px) scale(1.4); opacity: 0.8; }
                66%       { transform: translateY(-14px) translateX(-6px) scale(0.8); opacity: 0.5; }
            }
        `;
        document.head.appendChild(style);
    }
})();

(function initScrollIndicator() {
    const hero = document.getElementById('heroSection');
    if (!hero) return;

    const indicator = document.createElement('div');
    indicator.innerHTML = `<i class="fa-solid fa-chevron-down"></i>`;
    indicator.style.cssText = `
        position: absolute;
        bottom: 28px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 20;
        color: rgba(255,255,255,0.5);
        font-size: 1.3rem;
        cursor: pointer;
        animation: scrollBounce 2s ease-in-out infinite;
        transition: color 0.3s;
    `;
    indicator.addEventListener('mouseenter', () => indicator.style.color = 'rgba(255,255,255,0.9)');
    indicator.addEventListener('mouseleave', () => indicator.style.color = 'rgba(255,255,255,0.5)');
    indicator.addEventListener('click', () => {
        const next = hero.nextElementSibling;
        if (next) next.scrollIntoView({ behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        indicator.style.opacity = window.scrollY > 80 ? '0' : '1';
    }, { passive: true });

    hero.style.position = 'relative';
    hero.appendChild(indicator);

    if (!document.getElementById('scroll-indicator-style')) {
        const style = document.createElement('style');
        style.id = 'scroll-indicator-style';
        style.textContent = `
            @keyframes scrollBounce {
                0%, 100% { transform: translateX(-50%) translateY(0); }
                50%       { transform: translateX(-50%) translateY(8px); }
            }
        `;
        document.head.appendChild(style);
    }
})();


(function initMenusDropdown() {
    const trigger = document.getElementById('menuNavItem');
    if (!trigger) return;

    const menus = [
        { icon: '🍕', label: 'Pizzas',     desc: 'Classiques & feuilletées',  color: '#dc2626' },
        { icon: '🍔', label: 'Fast-Food',  desc: 'Burgers, tacos & frites',   color: '#ea580c' },
        { icon: '🥤', label: 'Boissons',   desc: 'Jus frais & bubble tea',    color: '#2563eb' },
        { icon: '🍦', label: 'Desserts',   desc: 'Glaces & milkshakes',       color: '#7c3aed' },
    ];

    
    const dropdown = document.createElement('div');
    dropdown.style.cssText = `
        position: absolute;
        top: calc(100% + 10px);
        left: 50%;
        transform: translateX(-50%) translateY(-8px);
        background: rgba(11,11,42,0.97);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 1.2rem;
        padding: 0.75rem;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
        min-width: 320px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s ease, transform 0.25s ease;
        z-index: 100;
        box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    `;

    
    const arrow = document.createElement('div');
    arrow.style.cssText = `
        position: absolute;
        top: -6px; left: 50%;
        transform: translateX(-50%) rotate(45deg);
        width: 12px; height: 12px;
        background: rgba(11,11,42,0.97);
        border-left: 1px solid rgba(255,255,255,0.1);
        border-top: 1px solid rgba(255,255,255,0.1);
    `;
    dropdown.appendChild(arrow);

    menus.forEach(menu => {
        const item = document.createElement('a');
        item.href = 'menu.html';
        item.style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.7rem 0.9rem;
            border-radius: 0.8rem;
            transition: background 0.2s ease;
            text-decoration: none;
            cursor: pointer;
        `;

        item.innerHTML = `
            <span style="font-size:1.5rem; width:2.2rem; height:2.2rem; display:flex; align-items:center; justify-content:center;
                         background:${menu.color}22; border-radius:50%;">${menu.icon}</span>
            <span>
                <span style="display:block; color:white; font-weight:600; font-size:0.9rem;">${menu.label}</span>
                <span style="display:block; color:rgba(156,163,175,1); font-size:0.72rem;">${menu.desc}</span>
            </span>
        `;

        item.addEventListener('mouseenter', () => item.style.background = `${menu.color}18`);
        item.addEventListener('mouseleave', () => item.style.background = 'transparent');

        dropdown.appendChild(item);
    });

    trigger.appendChild(dropdown);

    let closeTimer;

    const show = () => {
        clearTimeout(closeTimer);
        dropdown.style.opacity = '1';
        dropdown.style.transform = 'translateX(-50%) translateY(0)';
        dropdown.style.pointerEvents = 'auto';
    };

    const hide = () => {
        closeTimer = setTimeout(() => {
            dropdown.style.opacity = '0';
            dropdown.style.transform = 'translateX(-50%) translateY(-8px)';
            dropdown.style.pointerEvents = 'none';
        }, 120);
    };

    trigger.addEventListener('mouseenter', show);
    trigger.addEventListener('mouseleave', hide);
    dropdown.addEventListener('mouseenter', show);
    dropdown.addEventListener('mouseleave', hide);
})();

(function () {
  const slides = document.querySelectorAll('.actu-slide');
  const dots   = document.querySelectorAll('.actu-dot');
  const prev   = document.getElementById('actu-prev');
  const next   = document.getElementById('actu-next');
  let current  = 0;
  let timer;

  function goTo(index) {
    slides[current].classList.remove('opacity-100', 'relative');
    slides[current].classList.add('opacity-0', 'absolute');
    dots[current].classList.remove('bg-red-600', 'w-8');
    dots[current].classList.add('bg-white/30', 'w-3');

    current = (index + slides.length) % slides.length;
    slides[current].classList.remove('opacity-0', 'absolute');
    slides[current].classList.add('opacity-100', 'relative');
    dots[current].classList.remove('bg-white/30', 'w-3');
    dots[current].classList.add('bg-red-600', 'w-8');

    resetTimer();
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  slides[0].classList.add('opacity-100', 'relative');
  slides[0].classList.remove('opacity-0', 'absolute');

  next.addEventListener('click', () => goTo(current + 1));
  prev.addEventListener('click', () => goTo(current - 1));
  dots.forEach(dot => dot.addEventListener('click', () => goTo(+dot.dataset.index)));
  resetTimer();
  const slider = document.getElementById('actu-slider');
  slider.addEventListener('mouseenter', () => clearInterval(timer));
  slider.addEventListener('mouseleave', resetTimer);
})();