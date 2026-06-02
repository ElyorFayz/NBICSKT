// ===========================
// NBICSKT — Interactive Script with i18n
// ===========================

let currentLang = 'ru';

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initScrollHeader();
    initMobileMenu();
    initTabs();
    initTreeToggle();
    initBackToTop();
    initScrollAnimations();
    initNavHighlight();
    initLanguageSystem();
});

// -- Language System --
function initLanguageSystem() {
    // All language buttons (header, mobile, dropdown)
    const allLangBtns = document.querySelectorAll('[data-lang]');

    allLangBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = btn.dataset.lang;
            switchLanguage(lang);
        });
    });

    // Dropdown toggle
    const dropdownToggle = document.getElementById('langDropdownToggle');
    const dropdown = document.getElementById('langDropdown');

    if (dropdownToggle && dropdown) {
        dropdownToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('open');
        });

        // Close dropdown on outside click
        document.addEventListener('click', () => {
            dropdown.classList.remove('open');
        });

        dropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Load saved language
    const savedLang = localStorage.getItem('nbicskt_lang');
    if (savedLang && typeof translations !== 'undefined' && translations[savedLang]) {
        switchLanguage(savedLang);
    }
}

function switchLanguage(lang) {
    if (typeof translations === 'undefined' || !translations[lang]) {
        console.warn(`Translation for "${lang}" not found.`);
        return;
    }

    currentLang = lang;
    const t = translations[lang];

    // Update all data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (t[key]) {
            el.textContent = t[key];
        }
    });

    // Update HTML dir and lang
    const dir = t.dir || 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;

    // Update active state on all language buttons
    document.querySelectorAll('[data-lang]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Close dropdown after selection
    const dropdown = document.getElementById('langDropdown');
    if (dropdown) dropdown.classList.remove('open');

    // Close mobile menu after lang switch
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) mobileMenu.classList.remove('active');

    // Save preference
    localStorage.setItem('nbicskt_lang', lang);

    // Update page title
    document.title = `NBICSKT`;

    // Visual feedback
    document.body.style.opacity = '0.95';
    setTimeout(() => { document.body.style.opacity = '1'; }, 150);
}

// -- Clock Widget --
function initClock() {
    const timeEl = document.getElementById('clockTime');
    const dateEl = document.getElementById('clockDate');

    function update() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        timeEl.textContent = `${hours}:${mins}:${secs}`;

        // Date based on current language
        const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };
        try {
            dateEl.textContent = now.toLocaleDateString(currentLang, dateOptions);
        } catch {
            const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
            dateEl.textContent = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
        }
    }

    update();
    setInterval(update, 1000);
}

// -- Scroll Header --
function initScrollHeader() {
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });
}

// -- Mobile Menu --
function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const menu = document.getElementById('mobileMenu');

    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
        menu.classList.toggle('active');
        btn.classList.toggle('active');
    });

    menu.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            btn.classList.remove('active');
        });
    });
}

// -- Tabs --
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;

            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const el = document.getElementById(`tab-${target}`);
            if (el) {
                el.classList.add('active');
                el.querySelectorAll('.card, .mini-card').forEach((card, i) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(16px)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, i * 60);
                });
            }
        });
    });
}

// -- Tree Toggle --
function initTreeToggle() {
    document.querySelectorAll('.branch-node').forEach(node => {
        node.addEventListener('click', () => {
            const children = node.parentElement.querySelector('.tree-children');
            const icon = node.querySelector('.expand-icon');
            if (children) {
                children.classList.toggle('expanded');
                if (icon) {
                    icon.textContent = children.classList.contains('expanded') ? '−' : '+';
                }
            }
        });
    });
}

// -- Mindmap Toggle --
function toggleMM(el) {
    const leaves = el.parentElement.querySelector('.mm-leaves');
    if (leaves) {
        leaves.classList.toggle('expanded');
        el.classList.toggle('active');
    }
}
window.toggleMM = toggleMM;

// -- Back to Top --
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// -- Scroll Animations --
function initScrollAnimations() {
    const elements = document.querySelectorAll('.card, .process-step, .consulting-block, .journal-block, .pipeline-item, .mini-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const delay = Array.from(entry.target.parentElement.children).indexOf(entry.target) * 80;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

// -- Active Nav Highlight --
function initNavHighlight() {
    const sections = document.querySelectorAll('.content-section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.dataset.section === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-80px 0px -50% 0px'
    });

    sections.forEach(section => observer.observe(section));
}

// -- Smooth scroll --
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    });
});
