// Formulaire « Audit offert de votre présence en ligne ».
// Envoie la demande à Formspree (même circuit que l'Anamnèse), sans innerHTML.
(function () {
  var forms = document.querySelectorAll('form[data-lead-audit]');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var msg = form.querySelector('.pf-form-msg');
      if (form.querySelector('[name="_gotcha"]').value) return;
      if (!form.checkValidity()) { form.reportValidity(); return; }
      btn.disabled = true;
      msg.textContent = 'Envoi en cours…';
      var data = new FormData(form);
      data.append('page', window.location.pathname);
      fetch(form.action, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('envoi');
          form.reset();
          msg.textContent = 'Merci, votre demande est bien arrivée. Loïc vous répond personnellement par e-mail ou sur WhatsApp.';
          msg.classList.add('ok');
          if (window.gtag) window.gtag('event', 'generate_lead', { form: 'audit_presence_en_ligne', page: window.location.pathname });
        })
        .catch(function () {
          msg.textContent = "L'envoi n'a pas fonctionné. Écrivez-nous sur WhatsApp au +33 6 20 78 33 77 ou à domtomconnect@gmail.com.";
          btn.disabled = false;
        });
    });
  });
})();
