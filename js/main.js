(function () {
	'use strict';

	var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var header = document.getElementById('header');

	/* Hero slideshow with project tabs */
	var SLIDE_MS = 6000;
	var slides = document.querySelectorAll('.hero-slide');
	var tabs = document.querySelectorAll('.hero-tab[data-slide]');
	var current = 0;
	var timer;

	document.documentElement.style.setProperty('--slide-duration', SLIDE_MS + 'ms');

	function showSlide(i) {
		slides[current].classList.remove('is-active');
		tabs[current].classList.remove('is-active');
		tabs[current].setAttribute('aria-selected', 'false');
		current = i;
		slides[current].classList.add('is-active');
		// Restart the progress bar animation
		void tabs[current].offsetWidth;
		tabs[current].classList.add('is-active');
		tabs[current].setAttribute('aria-selected', 'true');
	}
	function startTimer() {
		clearInterval(timer);
		if (reduceMotion || slides.length < 2) return;
		timer = setInterval(function () { showSlide((current + 1) % slides.length); }, SLIDE_MS);
	}
	tabs.forEach(function (tab) {
		tab.addEventListener('click', function () {
			showSlide(Number(tab.dataset.slide));
			startTimer();
		});
	});
	startTimer();

	/* Header: glass background after the hero top, hide on scroll down */
	var lastY = window.scrollY;
	function onScroll() {
		var y = window.scrollY;
		header.classList.toggle('is-scrolled', y > 40);
		var menuOpen = document.body.classList.contains('menu-open');
		header.classList.toggle('is-hidden', !menuOpen && y > 600 && y > lastY);
		lastY = y;
	}
	window.addEventListener('scroll', onScroll, { passive: true });
	onScroll();

	/* Desktop dropdowns: keyboard / touch support */
	document.querySelectorAll('.menu-parent').forEach(function (btn) {
		btn.addEventListener('click', function () {
			var open = btn.getAttribute('aria-expanded') === 'true';
			document.querySelectorAll('.menu-parent').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
			btn.setAttribute('aria-expanded', String(!open));
		});
	});
	document.addEventListener('click', function (e) {
		if (!e.target.closest('.has-children')) {
			document.querySelectorAll('.menu-parent').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
		}
	});

	/* Mobile menu */
	var mobileNav = document.getElementById('mobile-nav');
	var toggle = document.querySelector('.menu-toggle');
	function setMenu(open) {
		mobileNav.hidden = !open;
		document.body.classList.toggle('menu-open', open);
		document.body.classList.toggle('no-scroll', open);
		toggle.setAttribute('aria-expanded', String(open));
		toggle.setAttribute('aria-label', open ? 'Zatvori meni' : 'Otvori meni');
		if (open) header.classList.remove('is-hidden');
	}
	toggle.addEventListener('click', function () { setMenu(mobileNav.hidden); });
	mobileNav.addEventListener('click', function (e) {
		if (e.target.closest('a')) setMenu(false);
	});
	mobileNav.querySelectorAll('.m-parent').forEach(function (btn) {
		btn.addEventListener('click', function () {
			btn.setAttribute('aria-expanded', String(btn.getAttribute('aria-expanded') !== 'true'));
		});
	});
	window.addEventListener('resize', function () {
		if (window.innerWidth > 820 && !mobileNav.hidden) setMenu(false);
	});

	/* Scroll reveal */
	var reveals = document.querySelectorAll('.reveal');
	if ('IntersectionObserver' in window && !reduceMotion) {
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) return;
				entry.target.classList.add('is-visible');
				io.unobserve(entry.target);
			});
		}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
		reveals.forEach(function (el) { io.observe(el); });
	} else {
		reveals.forEach(function (el) { el.classList.add('is-visible'); });
	}

	/* Count-up numbers in the stats strip */
	var counters = document.querySelectorAll('[data-count]');
	if ('IntersectionObserver' in window && !reduceMotion) {
		var co = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) return;
				var el = entry.target;
				var target = Number(el.dataset.count);
				var start = performance.now();
				(function tick(now) {
					var p = Math.min((now - start) / 1400, 1);
					el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString('sr-RS');
					if (p < 1) requestAnimationFrame(tick);
				})(start);
				co.unobserve(el);
			});
		}, { threshold: 0.6 });
		counters.forEach(function (el) { co.observe(el); });
	}

	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') setMenu(false);
	});

	document.getElementById('year').textContent = new Date().getFullYear();
})();
