// Minimal JS: mobile menu, active nav highlight, year update.

(function () {
    // Update copyright year.
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Mobile menu toggle.
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.querySelector('.side-nav');
    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            var open = nav.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        // Close menu when clicking a link on mobile.
        nav.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                if (window.innerWidth <= 900) {
                    nav.classList.remove('is-open');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // Active nav highlight via IntersectionObserver.
    var sections = document.querySelectorAll('main section[id]');
    var navLinks = document.querySelectorAll('.side-nav nav a');
    if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
        var linkMap = {};
        navLinks.forEach(function (a) {
            var id = a.getAttribute('href').replace('#', '');
            linkMap[id] = a;
        });

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var id = entry.target.getAttribute('id');
                if (entry.isIntersecting && linkMap[id]) {
                    navLinks.forEach(function (a) { a.classList.remove('is-active'); });
                    linkMap[id].classList.add('is-active');
                }
            });
        }, { rootMargin: '-40% 0px -55% 0px' });

        sections.forEach(function (s) { observer.observe(s); });
    }
})();
