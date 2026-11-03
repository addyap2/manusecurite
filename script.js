(function () {
  document.documentElement.classList.add('is-ready');

  // Mobile menu
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  }
  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  // CTA buttons pre-select the profile in the form
  var form = document.getElementById('contact-form');
  document.querySelectorAll('[data-subject]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var profil = btn.dataset.subject.indexOf('Particulier') === 0 ? 'Particulier' : 'Entreprise';
      var radio = form.querySelector('input[value="' + profil + '"]');
      if (radio) radio.checked = true;
    });
  });

  // Contact form opens the visitor's mail app with a pre-filled message
  var errorEl = form.querySelector('.form-error');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nom = form.nom.value.trim();
    var coord = form.coord.value.trim();
    form.nom.setAttribute('aria-invalid', String(!nom));
    form.coord.setAttribute('aria-invalid', String(!coord));
    if (!nom || !coord) {
      errorEl.hidden = false;
      (nom ? form.coord : form.nom).focus();
      return;
    }
    errorEl.hidden = true;
    var profil = form.querySelector('input[name="profil"]:checked').value;
    var subject = 'Demande de contact (' + profil + ') : ' + nom;
    var body = 'Nom : ' + nom + '\nProfil : ' + profil + '\nContact : ' + coord + '\n\n' + form.message.value.trim();
    window.location.href = 'mailto:providencecotedazur@gmail.com?subject=' +
      encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
