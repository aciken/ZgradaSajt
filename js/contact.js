(function () {
	'use strict';

	var form = document.getElementById('contact-form');
	if (!form) return;

	var status = form.querySelector('.form-status');
	var project = form.elements.projekat;
	var message = form.elements.poruka;

	/* Prefill from building pages: /kontakt/?projekat=tose-jovanovica-30&stan=20 */
	var params = new URLSearchParams(window.location.search);
	var projectKey = params.get('projekat');
	var apt = params.get('stan');
	var unitType = params.get('tip') === 'apartman' ? 'apartman' : 'stan';
	if (projectKey && project.querySelector('option[value="' + CSS.escape(projectKey) + '"]')) {
		project.value = projectKey;
	}
	if (apt && /^[\w-]{1,10}$/.test(apt)) {
		var name = project.value ? project.options[project.selectedIndex].text : '';
		message.value = 'Zainteresovan/a sam za ' + unitType + ' ' + apt + (name ? ' (' + name + ')' : '') +
			'. Molim vas za više informacija o ceni i uslovima kupovine.';
	}

	/* Validation */
	function validate(field) {
		var wrap = field.closest('.field');
		var error = wrap && wrap.querySelector('.field-error');
		if (!error) return true;
		if (!field.value.trim()) field.value = ''; // whitespace-only counts as empty
		var ok = field.checkValidity();
		wrap.classList.toggle('is-invalid', !ok);
		error.textContent = ok ? '' : error.dataset.msg;
		field.setAttribute('aria-invalid', String(!ok));
		return ok;
	}

	form.querySelectorAll('input, textarea').forEach(function (field) {
		field.addEventListener('blur', function () { if (field.value) validate(field); });
		field.addEventListener('input', function () {
			if (field.closest('.field').classList.contains('is-invalid')) validate(field);
		});
	});

	function setStatus(text, type) {
		status.textContent = text;
		status.className = 'form-status' + (type ? ' is-' + type : '');
	}

	form.addEventListener('submit', function (e) {
		e.preventDefault();

		var fields = form.querySelectorAll('input, textarea');
		var firstInvalid = null;
		fields.forEach(function (f) {
			if (!validate(f) && !firstInvalid) firstInvalid = f;
		});
		if (firstInvalid) {
			firstInvalid.focus();
			setStatus('Proverite označena polja.', 'error');
			return;
		}

		var data = new FormData(form);
		var projectName = project.value ? project.options[project.selectedIndex].text : '';
		var endpoint = form.dataset.endpoint;
		var subject = 'Upit sa sajta' + (projectName ? ' – ' + projectName : '');

		// Option A: a form service is configured – send directly
		if (endpoint) {
			var button = form.querySelector('button[type="submit"]');
			button.disabled = true;
			setStatus('Slanje…');
			data.set('_subject', subject);
			data.set('projekat', projectName || '—');
			fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
				.then(function (res) {
					if (!res.ok) throw new Error(res.status);
					form.reset();
					setStatus('Hvala! Vaša poruka je poslata – javićemo vam se uskoro.', 'success');
				})
				.catch(function () {
					setStatus('Poruka nije poslata. Pokušajte ponovo ili nas pozovite na +381 63 808 44 67.', 'error');
				})
				.then(function () { button.disabled = false; });
			return;
		}

		// Option B: no backend – open the visitor's email app with everything filled in
		var body =
			data.get('poruka') + '\n\n' +
			'—\n' +
			'Ime i prezime: ' + data.get('ime') + '\n' +
			'Telefon: ' + data.get('telefon') + '\n' +
			'Email: ' + data.get('email') +
			(projectName ? '\nProjekat: ' + projectName : '');

		window.location.href = 'mailto:' + form.dataset.email +
			'?subject=' + encodeURIComponent(subject) +
			'&body=' + encodeURIComponent(body);
		setStatus('Otvaramo vaš email program sa popunjenom porukom – samo kliknite „Pošalji”.', 'success');
	});
})();
