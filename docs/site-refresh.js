(() => {
  'use strict';
  const trailerDialog = document.querySelector('#trailer-dialog');
  const trailerVideo = document.querySelector('#series-trailer');
  const trailerStatus = document.querySelector('#trailer-status');
  let trailerTrigger = null;
  if (trailerDialog && trailerVideo) {
    const closeTrailer = () => trailerDialog.close();
    document.querySelectorAll('[data-open-trailer]').forEach(trigger => trigger.addEventListener('click', event => {
      if (!trailerDialog.showModal) return;
      event.preventDefault();
      trailerTrigger = trigger;
      trailerStatus.hidden = true;
      trailerDialog.showModal();
      document.documentElement.classList.add('trailer-open');
      trailerVideo.play().catch(() => {
        if (!trailerDialog.open) return;
        trailerStatus.textContent = 'Нажмите кнопку воспроизведения в видео, чтобы начать просмотр.';
        trailerStatus.hidden = false;
      });
    }));
    trailerDialog.querySelector('.trailer-close').addEventListener('click', closeTrailer);
    trailerDialog.addEventListener('click', event => {
      const box = trailerDialog.getBoundingClientRect();
      if (event.target === trailerDialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) closeTrailer();
    });
    trailerDialog.addEventListener('close', () => {
      trailerVideo.pause();
      document.documentElement.classList.remove('trailer-open');
      trailerTrigger?.focus({preventScroll:true});
    });
    trailerVideo.addEventListener('playing', () => { trailerStatus.hidden = true; });
    trailerVideo.addEventListener('error', () => {
      trailerStatus.textContent = 'Не удалось воспроизвести видео. Скачайте трейлер по ссылке ниже.';
      trailerStatus.hidden = false;
    });
  }
  const form = document.querySelector('#brief-form');
  const copy = document.querySelector('#copy-brief');
  if (form && copy) copy.addEventListener('click', async () => {
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const text = `Анастасия, здравствуйте!\n\nМеня зовут ${data.get('name')}.\nКомпания: ${data.get('company')}.\nИнтересует: ${data.get('format')}.\n\nНаша задача:\n${data.get('task')}\n\nСпасибо!`;
    const status = document.querySelector('#form-status');
    try { await navigator.clipboard.writeText(text); status.textContent = 'Текст скопирован. Вставьте его в письмо на valikova@4meds.ru.'; }
    catch {
      let field = document.querySelector('#brief-copy-text');
      if (!field) {field = document.createElement('textarea');field.id='brief-copy-text';field.readOnly=true;field.setAttribute('aria-label','Готовый текст письма');status.after(field);}
      field.value=text;field.focus();field.select();status.textContent='Выделили текст — скопируйте его и вставьте в письмо на valikova@4meds.ru.';
    }
  });
  // Textual labels explain status; movement never gates content.
  const activeLinks = [...document.querySelectorAll('.desktop-nav a[href^="#"]')];
  if ('IntersectionObserver' in window && activeLinks.length) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      activeLinks.forEach(link => {
        if (link.hash === '#'+entry.target.id) link.setAttribute('aria-current','location');
        else link.removeAttribute('aria-current');
      });
    }), {rootMargin:'-15% 0px -65% 0px'});
    activeLinks.forEach(link => {const section=document.querySelector(link.hash);if(section)observer.observe(section);});
  }
})();
