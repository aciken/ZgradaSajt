(function () {
	'use strict';

	var data = window.BUILDING;
	if (!data) return;

	var SVG_NS = 'http://www.w3.org/2000/svg';

	var apartments = data.apartments;
	var state = { floor: 'all', freeOnly: false };

	/* Helpers ------------------------------------------------------------- */

	function freeIn(list) {
		return list.filter(function (a) { return a.status === 'free'; }).length;
	}
	function onFloor(key) {
		return apartments.filter(function (a) { return a.floor === key; });
	}
	function floorOf(key) {
		for (var i = 0; i < data.floors.length; i++) {
			if (data.floors[i].key === key) return data.floors[i];
		}
		return null;
	}
	function floorLabel(key) {
		var f = floorOf(key);
		return f ? f.label : key;
	}
	function formatArea(n) {
		return n.toLocaleString('sr-RS', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
	}
	// Serbian plural: 1 (stan), 2–4 (stana), 5+ and 11–14 (stanova)
	function plural(n, one, few, many) {
		var mod10 = n % 10, mod100 = n % 100;
		if (mod10 === 1 && mod100 !== 11) return n + ' ' + one;
		if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return n + ' ' + few;
		return n + ' ' + many;
	}
	// Wording can be overridden per building (e.g. "jedinica" when the list mixes stanovi and apartmani)
	var words = data.words || {
		unit: ['stan', 'stana', 'stanova'],
		free: ['slobodan stan', 'slobodna stana', 'slobodnih stanova'],
		all: 'Svi stanovi',
		floor: 'Stanovi'
	};
	function freeText(n) {
		return plural(n, words.free[0], words.free[1], words.free[2]);
	}
	var STATUS = {
		free: { label: 'Slobodan', cls: 'is-free' },
		reserved: { label: 'Rezervisan', cls: 'is-reserved' },
		sold: { label: 'Rasprodat', cls: 'is-sold' }
	};

	/* Stats --------------------------------------------------------------- */

	document.querySelectorAll('[data-stat]').forEach(function (el) {
		var value = el.dataset.stat === 'free' ? freeIn(apartments) : apartments.length;
		el.textContent = value;
		el.dataset.count = value;
	});

	/* Floor picker (building image with clickable floors) ------------------ */

	var media = document.querySelector('.picker-media');
	var tooltip = document.querySelector('.picker-tooltip');
	var polygons = {};

	if (media && data.image) {
		var svg = document.createElementNS(SVG_NS, 'svg');
		svg.setAttribute('viewBox', '0 0 ' + data.image.width + ' ' + data.image.height);
		svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
		svg.classList.add('picker-svg');

		data.floors.forEach(function (floor) {
			if (!floor.polygon) return;
			var free = freeIn(onFloor(floor.key));
			var poly = document.createElementNS(SVG_NS, 'polygon');
			poly.setAttribute('points', floor.polygon);
			poly.setAttribute('tabindex', '0');
			poly.setAttribute('role', 'button');
			poly.setAttribute('aria-label', floor.label + ' – ' + freeText(free));
			poly.dataset.floor = floor.key;
			poly.dataset.free = free;
			if (!free) poly.classList.add('is-full');

			poly.addEventListener('click', function () { selectFloor(floor.key, true); });
			poly.addEventListener('keydown', function (e) {
				if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectFloor(floor.key, true); }
			});
			poly.addEventListener('pointerenter', function () { showTooltip(floor, free); });
			poly.addEventListener('focus', function () { showTooltip(floor, free); });
			poly.addEventListener('pointerleave', hideTooltip);
			poly.addEventListener('blur', hideTooltip);
			poly.addEventListener('pointermove', moveTooltip);

			svg.appendChild(poly);
			polygons[floor.key] = poly;
		});
		media.appendChild(svg);
	}

	function showTooltip(floor, free) {
		if (!tooltip) return;
		tooltip.innerHTML = '<strong>' + floor.label + '</strong><span>' + freeText(free) + '</span>';
		tooltip.hidden = false;
	}
	function moveTooltip(e) {
		if (!tooltip) return;
		var r = media.getBoundingClientRect();
		tooltip.style.left = (e.clientX - r.left) + 'px';
		tooltip.style.top = (e.clientY - r.top) + 'px';
	}
	function hideTooltip() {
		if (tooltip) tooltip.hidden = true;
	}

	/* Floor list next to the image ----------------------------------------- */

	var floorList = document.querySelector('.floor-list');
	if (floorList) {
		data.floors.slice().reverse().forEach(function (floor) {
			var free = freeIn(onFloor(floor.key));
			var li = document.createElement('li');
			li.innerHTML =
				'<button type="button" class="floor-btn" data-floor="' + floor.key + '">' +
					'<span class="floor-btn-label">' + floor.label + '</span>' +
					'<span class="floor-btn-free' + (free ? '' : ' is-none') + '">' + (free ? freeText(free) : 'Rasprodato') + '</span>' +
				'</button>';
			li.firstChild.addEventListener('click', function () { selectFloor(floor.key, true); });
			li.firstChild.addEventListener('pointerenter', function () { highlight(floor.key, true); });
			li.firstChild.addEventListener('pointerleave', function () { highlight(floor.key, false); });
			floorList.appendChild(li);
		});
	}

	function highlight(key, on) {
		if (polygons[key]) polygons[key].classList.toggle('is-hover', on);
	}

	/* Apartment list ------------------------------------------------------- */

	var chips = document.querySelector('.floor-chips');
	var grid = document.querySelector('.apt-grid');
	var title = document.querySelector('.apt-title');
	var summary = document.querySelector('.apt-summary');
	var freeToggle = document.querySelector('.free-toggle input');
	var section = document.getElementById('stanovi');

	if (chips) {
		var options = [{ key: 'all', label: 'Svi spratovi' }].concat(data.floors);
		options.forEach(function (opt) {
			var b = document.createElement('button');
			b.type = 'button';
			b.className = 'chip';
			b.dataset.floor = opt.key;
			b.textContent = opt.label;
			b.addEventListener('click', function () { selectFloor(opt.key, false); });
			chips.appendChild(b);
		});
	}

	if (freeToggle) {
		freeToggle.addEventListener('change', function () {
			state.freeOnly = freeToggle.checked;
			render();
		});
	}

	function selectFloor(key, scroll) {
		state.floor = key;
		render();
		if (scroll && section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	function card(a) {
		var s = STATUS[a.status] || STATUS.sold;
		var inquiry = '/kontakt/?projekat=' + encodeURIComponent(data.slug) + '&stan=' + encodeURIComponent(a.num) + (a.type ? '&tip=' + encodeURIComponent(a.type.toLowerCase()) : '');
		var actions = '';
		if (a.plan) actions += '<a class="apt-link" href="' + a.plan + '" data-lightbox data-caption="Stan ' + a.num + ' – ' + floorLabel(a.floor) + '">Nacrt stana</a>';
		if (a.pdf) actions += '<a class="apt-link" href="' + a.pdf + '" target="_blank" rel="noopener">PDF</a>';
		if (a.status !== 'sold') actions += '<a class="btn btn-dark btn-sm" href="' + inquiry + '">Pošaljite upit</a>';

		return '<article class="apt-card ' + s.cls + '">' +
			(a.plan ? '<a class="apt-plan" href="' + a.plan + '" data-lightbox data-caption="Stan ' + a.num + '"><img src="' + a.plan + '" alt="Nacrt stana ' + a.num + '" loading="lazy"></a>' : '') +
			'<div class="apt-top">' +
				'<span class="apt-num"><small>' + (a.type || 'Stan') + '</small>' + a.num + '</span>' +
				'<span class="badge ' + s.cls + '">' + s.label + '</span>' +
			'</div>' +
			'<p class="apt-area">' + formatArea(a.area) + '<span> m²</span></p>' +
			'<p class="apt-floor">' + floorLabel(a.floor) + (a.rooms ? ' · ' + a.rooms : '') + '</p>' +
			(a.spaces ? spacesList(a.spaces) : '') +
			(actions ? '<div class="apt-actions">' + actions + '</div>' : '') +
		'</article>';
	}

	function spacesList(spaces) {
		return '<details class="apt-spaces"><summary>Struktura</summary><dl>' +
			spaces.map(function (s) {
				return '<div><dt>' + s[0] + '</dt><dd>' + formatArea(s[1]) + ' m²</dd></div>';
			}).join('') +
		'</dl></details>';
	}

	function render() {
		var list = state.floor === 'all' ? apartments : onFloor(state.floor);
		var shown = state.freeOnly ? list.filter(function (a) { return a.status !== 'sold'; }) : list;

		if (title) title.textContent = state.floor === 'all' ? words.all : words.floor + ' – ' + floorLabel(state.floor);
		if (summary) summary.textContent = plural(list.length, words.unit[0], words.unit[1], words.unit[2]) + ' · ' + freeText(freeIn(list));

		grid.innerHTML = shown.length
			? shown.map(card).join('')
			: '<p class="apt-empty">Na ovom spratu trenutno nema slobodnih jedinica. Pogledajte druge spratove ili nas kontaktirajte.</p>';

		document.querySelectorAll('.chip, .floor-btn').forEach(function (b) {
			var active = b.dataset.floor === state.floor;
			b.classList.toggle('is-active', active);
			b.setAttribute('aria-pressed', String(active));
		});
		Object.keys(polygons).forEach(function (k) {
			polygons[k].classList.toggle('is-active', k === state.floor);
		});
	}

	if (grid) render();

	/* Lightbox (floor plans, construction photos) -------------------------- */

	var box = document.createElement('dialog');
	box.className = 'lightbox';
	box.innerHTML =
		'<button type="button" class="lightbox-close" aria-label="Zatvori">&times;</button>' +
		'<figure><img alt=""><figcaption></figcaption></figure>';
	document.body.appendChild(box);
	var boxImg = box.querySelector('img');
	var boxCap = box.querySelector('figcaption');

	document.addEventListener('click', function (e) {
		var link = e.target.closest('[data-lightbox]');
		if (!link || typeof box.showModal !== 'function') return;
		e.preventDefault();
		boxImg.src = link.getAttribute('href');
		boxImg.alt = link.dataset.caption || '';
		boxCap.textContent = link.dataset.caption || '';
		box.showModal();
	});
	box.addEventListener('click', function (e) {
		if (e.target === box || e.target.closest('.lightbox-close')) box.close();
	});
})();
