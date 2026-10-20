'use strict';

// Source: audience analysis supplied by the project team. No aggregated or inferred percentages.
const audience = {
  youtube: { name: 'YouTube', female: 55.3, male: 44.6, age: '25–44', description: 'Взрослая аудитория, которой интересны польза и экспертность.', countries: ['Казахстан', 'Россия', 'Украина', 'Кыргызстан', 'Беларусь'] },
  vk: { name: 'ВКонтакте', female: 45.7, male: 53.7, age: 'до 18', description: 'Молодёжь и подростки. Динамичные истории и открытия в коротком формате.', countries: ['Россия'] },
  likee: { name: 'Likee', female: 64.6, male: 33.4, age: 'до 18', description: 'Молодёжь и подростки. Развлекательный контент и знакомые герои.', countries: ['Россия'] },
  tiktok: { name: 'TikTok', female: 41, male: 58, age: '18–34', description: 'Молодая аудитория, которой близки динамика и развлекательный формат.', countries: ['Россия', 'Казахстан', 'Украина', 'Беларусь'] },
};
const formatData = {
  content: {
    type: 'Бренд внутри истории', title: 'Станьте частью<br>приключения.',
    description: 'Нативные упоминания, продакт-плейсмент и брендированные спецвыпуски. Находим естественную роль бренда внутри сюжета и образовательной темы.',
    chips: ['Нативная интеграция', 'Спецвыпуск', 'Продакт-плейсмент'],
    heading: 'Берём на себя', steps: ['Разработка идеи и сценария', 'Производство анимационного ролика', 'Научная и медицинская валидация', 'Адаптация под нужные площадки', 'Публикация и итоговая статистика'],
    time: 'От одной недели', price: 'Рассчитываем под задачу', cta: 'Обсудить интеграцию', topic: 'Интеграции в контент', color: '#e7f0ea'
  },
  education: {
    type: 'Знания через опыт', title: 'Удивляться.<br>Пробовать. Понимать.',
    description: 'Совместные уроки, мастер-классы и ролики для клиник, школ и городских фестивалей. Создаём проект под аудиторию и задачи партнёра.',
    chips: ['Уроки', 'Мастер-классы', 'Фестивали'],
    heading: 'Берём на себя', steps: ['Концепция, тема и механика проекта', 'Сценарии, видео, задания и материалы', 'Проверка научной и медицинской корректности', 'Поддержка запуска на площадке', 'Фото, видео, обратная связь и итоговый отчёт'],
    time: '1,5 месяца после согласования', price: 'Рассчитываем под задачу', cta: 'Обсудить образовательный проект', topic: 'Образовательные проекты', color: '#dcecf6'
  },
  license: {
    type: 'Герои за пределами экрана', title: 'Любимая история.<br>Новый продукт.',
    description: 'Персонажи и визуальный мир НАНОБОТОВ могут стать частью вашего продукта, упаковки или совместной коллекции.',
    chips: ['Игрушки и книги', 'Упаковка', 'Коллаборации'],
    heading: 'Варианты сотрудничества', steps: ['Игрушки, книги и развивающие продукты', 'Упаковка, POSM и промоматериалы', 'Персонаж-амбассадор продукта или кампании', 'Совместная коллекция «бренд × НАНОБОТЫ»'],
    time: 'Зависит от формата и производства', price: 'Под категорию, тираж и срок лицензии', cta: 'Обсудить лицензию', topic: 'Лицензирование и мерч', color: '#f5e6c4'
  },
  press: {
    type: 'Истории для вашей редакции', title: 'Есть тема?<br>Расскажем вместе.',
    description: 'Поможем познакомить читателей с героями, создателями и научной основой проекта. Найдём интересный угол для вашей редакционной задачи.',
    chips: ['Интервью', 'Комментарии', 'Спецпроекты'],
    heading: 'Что можем подготовить', steps: ['Интервью с создателями проекта', 'Экспертные комментарии', 'Колонки и совместные спецпроекты', 'Исследования и эксклюзивные материалы'],
    time: 'Согласуем с редакцией', price: 'Условия обсуждаем индивидуально', cta: 'Связаться по запросу СМИ', topic: 'Запрос СМИ', color: '#e9e2f1'
  }
};
const $ = (selector) => document.querySelector(selector);
const percent = (number) => new Intl.NumberFormat('ru-RU', {maximumFractionDigits: 1}).format(number);
function setPlatform(key) {
  const data = audience[key];
  document.querySelectorAll('[data-platform]').forEach(button => {
    const selected = button.dataset.platform === key;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  $('#audience-panel').setAttribute('aria-labelledby', `tab-${key}`);
  $('#platform-label').textContent = data.name;
  $('#female-value').textContent = `${percent(data.female)}%`;
  $('#male-value').textContent = `${percent(data.male)}%`;
  const femaleMajor = data.female >= data.male;
  $('#gender-major').replaceChildren(document.createTextNode(percent(femaleMajor ? data.female : data.male)));
  const unit = document.createElement('span'); unit.textContent = '%'; $('#gender-major').append(unit);
  $('#gender-major-label').textContent = femaleMajor ? 'женщины' : 'мужчины';
  $('#gender-donut').style.background = `conic-gradient(var(--coral) 0 ${data.female}%, var(--blue) ${data.female}% ${data.female + data.male}%, #e8eaeb ${data.female + data.male}% 100%)`;
  $('#gender-donut').setAttribute('aria-label', `${data.name}: женщины ${percent(data.female)}%, мужчины ${percent(data.male)}%. Доли из исходной аналитики.`);
  $('#platform-age').replaceChildren(document.createTextNode(data.age));
  const years = document.createElement('small'); years.textContent = 'лет'; $('#platform-age').append(years);
  $('#platform-description').textContent = data.description;
  $('#platform-countries').replaceChildren(...data.countries.map(country => {
    const chip = document.createElement('span'); chip.textContent = country; return chip;
  }));
}
function setFormat(key) {
  const data = formatData[key];
  document.querySelectorAll('[data-format]').forEach(button => {
    const selected = button.dataset.format === key;
    button.setAttribute('aria-selected', String(selected)); button.tabIndex = selected ? 0 : -1;
  });
  $('#format-panel').setAttribute('aria-labelledby', `format-tab-${key}`);
  $('#format-panel').style.background = data.color;
  $('#format-type').textContent = data.type;
  $('#format-title').innerHTML = data.title;
  $('#format-description').textContent = data.description;
  $('#format-chips').replaceChildren(...data.chips.map(text => {const el = document.createElement('span'); el.textContent = text; return el;}));
  $('#format-list-heading').textContent = data.heading;
  $('#format-steps').replaceChildren(...data.steps.map(text => {const el = document.createElement('li'); el.textContent = text; return el;}));
  $('#format-time').textContent = data.time;
  $('#format-price').textContent = data.price;
  $('#format-cta').replaceChildren(document.createTextNode(data.cta));
  const arrow = document.createElement('span'); arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true'); $('#format-cta').append(arrow);
  $('#format-cta').dataset.openBrief = data.topic;
}
function bindTabs(selector, callback, attribute, orientation) {
  const buttons = [...document.querySelectorAll(selector)];
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => callback(button.dataset[attribute]));
    button.addEventListener('keydown', event => {
      const next = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
      const prev = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
      let target = index;
      if (event.key === next) target = (index + 1) % buttons.length;
      else if (event.key === prev) target = (index - 1 + buttons.length) % buttons.length;
      else if (event.key === 'Home') target = 0;
      else if (event.key === 'End') target = buttons.length - 1;
      else return;
      event.preventDefault(); buttons[target].focus(); callback(buttons[target].dataset[attribute]);
    });
  });
}
bindTabs('[data-platform]', setPlatform, 'platform', 'horizontal');
bindTabs('[data-format]', setFormat, 'format', 'vertical');
setPlatform('youtube'); setFormat('content');

const menuButton = $('.menu-toggle');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.setAttribute('aria-label', open ? 'Открыть меню' : 'Закрыть меню');
  $('#mobile-nav').hidden = open;
});
$('#mobile-nav').addEventListener('click', event => {
  if (event.target.closest('a')) { $('#mobile-nav').hidden = true; menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Открыть меню'); }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !$('#mobile-nav').hidden) {
    $('#mobile-nav').hidden = true; menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Открыть меню'); menuButton.focus();
  }
});

const dialog = $('#brief-dialog');
let briefOpener;
document.querySelectorAll('[data-open-brief]').forEach(button => button.addEventListener('click', () => {
  briefOpener = button;
  $('#brief-form').elements.format.value = button.dataset.openBrief;
  $('#form-status').textContent = '';
  dialog.showModal();
}));
$('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => briefOpener?.focus());
$('#brief-form').addEventListener('submit', event => {
  event.preventDefault();
  const fields = new FormData(event.currentTarget);
  const body = `Анастасия, здравствуйте!\n\nМеня зовут ${fields.get('name')}.\nКомпания: ${fields.get('company')}.\nИнтересует: ${fields.get('format')}.\n\nНаша задача:\n${fields.get('task')}\n\nСпасибо!`;
  const subject = `НАНОБОТЫ × ${fields.get('company')}: ${fields.get('format')}`;
  window.location.href = `mailto:valikova@4meds.ru?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  $('#form-status').textContent = 'Письмо подготовлено для почтового приложения. Если оно не открылось, напишите на valikova@4meds.ru. Данные этой формы никуда автоматически не отправляются.';
});
let toastTimer;
function showToast(text) {
  $('#toast').textContent = text; $('#toast').classList.add('is-visible');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('is-visible'), 3500);
}
$('[data-copy-email]').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText('valikova@4meds.ru'); showToast('Почта скопирована'); }
  catch { showToast('Почта для связи: valikova@4meds.ru'); }
});
