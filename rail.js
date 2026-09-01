// Section rail — LineSidebar from React Bits, ported to plain JS and shared by
// the landing page and the case studies.
//
// The landing page ships its rail as markup; a case study has its rail built
// here from the sections of the page, so adding or renaming a section needs no
// second edit. A section can override the label it shows in the rail with
// data-rail-label, for titles too long to sit in the gutter.
//
// A single rAF loop eases every item's --effect toward its target with
// frame-rate independent exponential smoothing, so colour, shift and marker
// scale move together instead of staggering CSS transitions. The section the
// reader is currently in is pinned at full effect.
(function () {
    var NEIGHBOUR_REACH = 10;     // px past an item's own row before its effect dies
    var SMOOTHING = 100;          // ms time constant of the ease

    function buildRail() {
        var body = document.querySelector('.case-study-body');
        if (!body) return null;

        var sections = Array.prototype.slice.call(body.querySelectorAll('section[id]'))
            .filter(function (section) { return section.querySelector('.section-title'); });
        if (sections.length < 2) return null;

        var rail = document.createElement('nav');
        rail.className = 'line-sidebar';
        rail.setAttribute('aria-label', 'Sections');

        var list = document.createElement('ul');
        list.className = 'line-sidebar__list';

        sections.forEach(function (section, i) {
            var num = section.querySelector('.section-num');
            var match = num && num.textContent.match(/\d+/);
            var index = match ? match[0] : String(i + 1);
            var label = section.getAttribute('data-rail-label') ||
                section.querySelector('.section-title').textContent.trim();

            var item = document.createElement('li');
            item.className = 'line-sidebar__item';
            item.innerHTML =
                '<a class="line-sidebar__link" href="#' + section.id + '">' +
                    '<span class="line-sidebar__marker" aria-hidden="true"></span>' +
                    '<span class="line-sidebar__label">' +
                        '<span class="line-sidebar__index"></span>' +
                        '<span class="line-sidebar__text"></span>' +
                    '</span>' +
                '</a>';
            // Text set as text, not markup, so a section title can never inject HTML.
            item.querySelector('.line-sidebar__index').textContent = index.length < 2 ? '0' + index : index;
            item.querySelector('.line-sidebar__text').textContent = label;
            list.appendChild(item);
        });

        rail.appendChild(list);
        document.body.appendChild(rail);
        return rail;
    }

    var rail = document.querySelector('.line-sidebar') || buildRail();
    if (!rail) return;

    var list = rail.querySelector('.line-sidebar__list');
    var items = Array.prototype.slice.call(rail.querySelectorAll('.line-sidebar__item'));
    if (!items.length) return;

    var targets = items.map(function () { return 0; });
    var current = items.map(function () { return 0; });
    var activeIndex = 0;
    var raf = null;
    var last = 0;

    // Smoothstep falloff: gentle at the edges, steep through the middle.
    function falloff(p) { return p * p * (3 - 2 * p); }

    function frame(now) {
        var dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        var k = 1 - Math.exp(-dt / (SMOOTHING / 1000));
        var moving = false;

        for (var i = 0; i < items.length; i++) {
            var target = Math.max(targets[i], activeIndex === i ? 1 : 0);
            var next = current[i] + (target - current[i]) * k;
            var settled = Math.abs(target - next) < 0.0015;
            current[i] = settled ? target : next;
            items[i].style.setProperty('--effect', current[i].toFixed(4));
            if (!settled) moving = true;
        }

        raf = moving ? requestAnimationFrame(frame) : null;
    }

    function startLoop() {
        if (raf != null) cancelAnimationFrame(raf);
        last = performance.now();
        raf = requestAnimationFrame(frame);
    }

    list.addEventListener('pointermove', function (e) {
        var rect = list.getBoundingClientRect();
        var pointerY = e.clientY - rect.top;
        for (var i = 0; i < items.length; i++) {
            var top = items[i].offsetTop;
            var bottom = top + items[i].offsetHeight;
            // Distance to the item's own row, so it reads 0 anywhere inside
            // that row and falls off within a few px of leaving it. Only the
            // item under the cursor takes the effect; its neighbours stay put.
            var distance = Math.max(top - pointerY, 0, pointerY - bottom);
            targets[i] = falloff(Math.max(0, 1 - distance / NEIGHBOUR_REACH));
        }
        startLoop();
    });

    list.addEventListener('pointerleave', function () {
        targets = targets.map(function () { return 0; });
        startLoop();
    });

    // Keep the active item in sync with the section being read, so the rail
    // doubles as a position indicator rather than just a menu.
    function setActive(index) {
        if (index === activeIndex) return;
        activeIndex = index;
        items.forEach(function (item, i) {
            if (i === index) item.setAttribute('aria-current', 'true');
            else item.removeAttribute('aria-current');
        });
        startLoop();
    }

    var sections = items
        .map(function (item) {
            var href = item.querySelector('a').getAttribute('href');
            return document.querySelector(href);
        })
        .filter(Boolean);

    if (sections.length && 'IntersectionObserver' in window) {
        var ratios = sections.map(function () { return 0; });
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var i = sections.indexOf(entry.target);
                if (i !== -1) ratios[i] = entry.isIntersecting ? entry.intersectionRatio : 0;
            });
            var best = 0;
            for (var i = 1; i < ratios.length; i++) {
                if (ratios[i] > ratios[best]) best = i;
            }
            if (ratios[best] > 0) setActive(best);
        }, { threshold: [0, 0.15, 0.35, 0.6, 0.85, 1] });

        sections.forEach(function (section) { observer.observe(section); });
    }

    items[0].setAttribute('aria-current', 'true');
    startLoop();
})();
