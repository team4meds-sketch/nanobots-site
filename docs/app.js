(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const menuButton = $('.menu-toggle');
  const menu = $('#mobile-nav');
  const closeMenu = () => {
    menu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Открыть меню');
  };
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) { closeMenu(); menuButton.focus(); }
  });

  const characterExtras = {
    vector: { color: '#0b7078', hook: 'У любой загадки есть решение', about: 'Векторе', short: 'Капитан корабля и мозг команды. Знает ответы на тысячи вопросов, верит в логику и учится доверять друзьям.' },
    endo: { color: '#187fc3', hook: 'Сначала приключение. Потом план!', about: 'Эндо', short: 'Смелый второй пилот, который первым бросается на помощь. Его энергия вдохновляет друзей, а совместные миссии учат слушать команду.' },
    mikra: { color: '#cc386c', hook: 'Самое важное — в деталях', about: 'Микре', short: 'Внимательная исследовательница замечает то, что упускают остальные. С каждой миссией она становится смелее и всё больше доверяет своей интуиции.' },
    luksi: { color: '#8850bb', hook: 'Об этом должны узнать все!', about: 'Люкси', short: 'Неутомимая рассказчица: всегда на связи, всё фиксирует и обо всём расспрашивает. Для Люкси каждое приключение — новая история.' },
    omni: { color: '#9b7425', hook: 'Я рядом. Всё починим', about: 'Омни', short: 'Надёжный и заботливый помощник — сердце команды. Чинит, подзаряжает и подстраховывает друзей. Рядом с ним всем спокойно.' }
  };
  const characters = window.NANOBOTS_CHARACTERS;
  const crewTabs = [...document.querySelectorAll('.crew-tabs [role="tab"]')];
  let activeCharacter = characters[0];
  function chooseCharacter(id) {
    const c = characters.find(item => item.id === id);
    if (!c) return;
    activeCharacter = c;
    const extra = characterExtras[id];
    crewTabs.forEach(tab => {
      const selected = tab.dataset.character === id;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    document.querySelectorAll('.crew-portrait').forEach(portrait => { portrait.hidden = portrait.dataset.portrait !== id; });
    $('.crew-scene').style.setProperty('--portrait-color', extra.color);
    $('#crew-panel').setAttribute('aria-labelledby', `crew-tab-${id}`);
    $('#crew-panel').style.setProperty('--hero-color', extra.color);
    $('#crew-role').textContent = c.role;
    $('#crew-number').textContent = `${String(characters.indexOf(c) + 1).padStart(2, '0')} / 05`;
    $('#crew-name').textContent = c.name;
    $('#crew-hook').textContent = extra.hook;
    $('#crew-story').textContent = extra.short;
    $('#crew-mission').textContent = c.mission;
    const preposition = /^[ОЭ]/.test(extra.about) ? 'об' : 'о';
    $('#more-hero').replaceChildren(document.createTextNode(`Больше ${preposition} ${extra.about} `));
    const arrow = document.createElement('span');
    arrow.setAttribute('aria-hidden', 'true'); arrow.textContent = '↗'; $('#more-hero').append(arrow);
  }
  function bindTabs(tabs, choose, key) {
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => choose(tab.dataset[key]));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault(); choose(tabs[next].dataset[key]); tabs[next].focus();
      });
    });
  }
  bindTabs(crewTabs, chooseCharacter, 'character');
  chooseCharacter('vector');
  const dialog = $('#hero-dialog');
  $('#more-hero').addEventListener('click', () => {
    const c = activeCharacter;
    dialog.style.setProperty('--hero-color', characterExtras[c.id].color);
    $('#dialog-role').textContent = c.role;
    $('#dialog-name').textContent = c.name;
    $('#dialog-story').textContent = c.story;
    $('#dialog-mission').textContent = c.mission;
    $('#dialog-powers').replaceChildren(...c.powers.map(([name, text]) => {
      const li = document.createElement('li'); const strong = document.createElement('strong');
      strong.textContent = `${name}: `; li.append(strong, document.createTextNode(text)); return li;
    }));
    dialog.showModal();
  });
  $('.dialog-close').addEventListener('click', () => dialog.close());
  $('.dialog-return').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });

  const organData = {
    heart: {title:'Твой внутренний\nсупернасос',symbol:'♡',color:'#cc4d73',bg:'#f8e1e8',kicker:'Миссия: доставка кислорода',text:'Сердце работает как насос: отправляет кровь по сосудам. Вместе с кровью клетки получают кислород и питательные вещества.',question:'Куда отправляется кровь с каждым ударом сердца?'},
    brain: {title:'На связи\nсо всем телом',symbol:'✳',color:'#8957ba',bg:'#eee3f7',kicker:'Миссия: передать сигнал',text:'Нервные клетки передают сигналы. Благодаря их работе мы чувствуем, двигаемся, учимся и запоминаем новое.',question:'Как тело узнаёт, что пора сделать шаг?'},
    teeth: {title:'Первый шаг\nбольшого пути',symbol:'◇',color:'#168baf',bg:'#dcf0f7',kicker:'Миссия: изучить зубы',text:'Зубы помогают откусывать и измельчать пищу. Наноботы отправляются в путешествие, чтобы узнать, что происходит у нас во рту.',question:'Зачем нужно тщательно пережёвывать пищу?'},
    lungs: {title:'Вдох — и кислород\nуже в пути',color:'#278b97',bg:'#dcf2f1',kicker:'Миссия: изучить дыхание',text:'В лёгких кислород из воздуха переходит в кровь. Одновременно углекислый газ переходит из крови в лёгкие, чтобы покинуть тело с выдохом.',question:'Как кислород из воздуха попадает к клеткам?'},
    stomach: {title:'Здесь еда\nменяется',color:'#c47e55',bg:'#f9e6d6',kicker:'Миссия: изучить пищеварение',text:'Мышцы желудка перемешивают пищу с желудочным соком. Он помогает расщеплять её, а затем содержимое постепенно переходит в тонкую кишку.',question:'Что происходит с едой после того, как мы её проглотили?'},
    liver: {title:'Большая работа\nвнутри тебя',color:'#b07955',bg:'#f4e6d9',kicker:'Миссия: помочь пищеварению',text:'Печень перерабатывает и запасает питательные вещества. Ещё она вырабатывает желчь, которая помогает переваривать жиры в тонкой кишке.',question:'Как печень помогает организму использовать питательные вещества?'},
    pancreas: {title:'Помогает\nпереваривать',color:'#a88c40',bg:'#f4edcf',kicker:'Миссия: узнать о ферментах',text:'Поджелудочная железа помогает пищеварению: её сок содержит ферменты, которые расщепляют белки, жиры и углеводы в тонкой кишке. На схеме она видна под желудком, а в теле находится позади него.',question:'Почему желудок справляется с пищеварением не один?'},
    intestines: {title:'Забирает пользу\nиз еды',color:'#bb7d70',bg:'#f7e5dc',kicker:'Миссия: найти питательные вещества',text:'В тонкой кишке продолжается переваривание пищи, а питательные вещества всасываются и отправляются к клеткам. В толстой кишке всасывается вода, а из непереваренных остатков формируется кал.',question:'Как полезные вещества из еды попадают к клеткам?'},
    kidneys: {title:'Сохраняют нужное\nВыводят лишнее',color:'#ab6797',bg:'#f3e1ee',kicker:'Миссия: сохранить равновесие',text:'Почки очищают кровь от отходов и избытка воды — из них образуется моча. Они помогают поддерживать нужное количество воды и солей в организме.',question:'Как организм избавляется от лишней воды?'},
    bones: {title:'Опора для\nкаждого движения',color:'#95804a',bg:'#f6edcf',kicker:'Миссия: изучить скелет',text:'Кости образуют скелет: поддерживают тело, защищают внутренние органы и вместе с мышцами помогают двигаться. Костная ткань живая — она растёт и обновляется.',question:'Какие кости защищают сердце и лёгкие?'},
    skin: {title:'Твоя граница\nс внешним миром',symbol:'≋',color:'#aa7c30',bg:'#fff0cc',kicker:'Миссия: исследовать кожу',text:'Кожа отделяет внутренний мир тела от внешнего. Она помогает чувствовать прикосновения и участвует в регулировании температуры.',question:'Как мы чувствуем прикосновение к руке?'}
  };
  const organIcons = {
    heart: ['M24 41 7 25C-4 13 12 2 24 15 36 2 52 13 41 25Z'],
    brain: ['M22 9C14 2 6 9 9 16 1 20 4 31 11 32 10 41 21 43 23 36V12','M26 9C34 2 42 9 39 16 47 20 44 31 37 32 38 41 27 43 25 36V12','M11 17q10-3 10 7m-10 8q0-7 9-7m17-8q-10-3-10 7m10 8q0-7-9-7'],
    teeth: ['M10 8c5-3 9 0 14 0s9-3 14 0c7 7 2 16-1 26-3 14-8 10-9-2-1-7-7-7-8 0-1 12-6 16-9 2C8 24 3 15 10 8Z'],
    skin: ['M5 13q9-10 19 0t19 0M5 24q9-10 19 0t19 0M5 35q9-10 19 0t19 0'],
    lungs: ['M24 5v15m0-4-8 9m8-9 8 9','M18 13C9 12 4 29 7 36c2 5 10 3 13 0V18q0-4-2-5ZM30 13c9-1 14 16 11 23-2 5-10 3-13 0V18q0-4 2-5Z'],
    stomach: ['M22 5v10c0 6 5 8 8 3 7-11 17-1 12 12-5 13-19 15-26 6-3-4-7-3-9 1l-4-5c4-8 12-9 17-4 5 4 9-1 5-5-7-4-10-8-10-13V5'],
    liver: ['M6 17c9-9 24-5 36 0-3 6-11 9-19 11L10 37C4 35 3 23 6 17Z','m26 14-4 14'],
    kidneys: ['M15 9C2 7 1 29 10 33c8 4 12-3 7-8-3-3-2-6 1-8 4-4 1-7-3-8ZM33 9c13-2 14 20 5 24-8 4-12-3-7-8 3-3 2-6-1-8-4-4-1-7 3-8Z','M19 24q4 2 3 16m7-16q-4 2-3 16'],
    pancreas: ['M5 27q-2-8 7-9l10 2 15-6q10-2 8 5L29 30l-18 5q-7 1-6-8Z','m13 24 5 3m8-5 3 3m5-7 3 3'],
    intestines: ['M8 32V14q0-6 6-6h20q6 0 6 6v19q0 6-6 6h-8v5','M17 16h13q5 0 5 4t-5 4H18q-5 0-5 4t5 4h12'],
    bones: ['m15 12 21 21c8-3 12 7 5 10-3 1-5-1-6-4-5 2-8-1-6-6L10 14C2 17-2 7 5 4c3-1 5 1 6 4 5-2 8 1 4 4Z']
  };
  const organTabs = [...document.querySelectorAll('.organ-tabs [role="tab"]')];
  let activeOrgan = 'heart';
  function chooseOrgan(id) {
    const organ = organData[id]; if (!organ) return;
    activeOrgan = id;
    organTabs.forEach(tab => { const selected = tab.dataset.organ === id; tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1; });
    document.querySelectorAll('.map-point').forEach(point => point.setAttribute('aria-pressed', String(point.dataset.organ === id)));
    $('#organ-panel').setAttribute('aria-labelledby', `organ-tab-${id}`);
    const title = $('#organ-title'); title.replaceChildren();
    organ.title.split('\n').forEach((line,index) => {if(index) title.append(document.createElement('br')); title.append(document.createTextNode(line));});
    document.querySelectorAll('[data-anatomy]').forEach(part => part.classList.toggle('is-active', part.dataset.anatomy === id));
    document.querySelectorAll('[data-map-target]').forEach(part => part.classList.toggle('is-active', part.dataset.mapTarget === id));
    const symbol = $('#organ-symbol');
    symbol.replaceChildren();
    if (organIcons[id]) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 48 48'); svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor'); svg.setAttribute('stroke-width', '2.2');
      svg.setAttribute('stroke-linecap', 'round'); svg.setAttribute('stroke-linejoin', 'round');
      organIcons[id].forEach(d => { const path = document.createElementNS(svg.namespaceURI, 'path'); path.setAttribute('d', d); svg.append(path); });
      symbol.append(svg);
    } else { symbol.textContent = organ.symbol; }
    symbol.style.color = organ.color; symbol.style.background = organ.bg;
    $('#organ-kicker').textContent = organ.kicker; $('#organ-text').textContent = organ.text; $('#organ-question').textContent = organ.question;
  }
  bindTabs(organTabs, chooseOrgan, 'organ');
  const mobileMap = window.matchMedia('(max-width: 900px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function revealOrgan(id) {
    chooseOrgan(id);
    if (!mobileMap.matches) return;
    const panel = $('#organ-panel');
    panel.focus({preventScroll:true});
    panel.scrollIntoView({block:'start',behavior:reducedMotion.matches ? 'instant' : 'smooth'});
  }
  document.querySelectorAll('.map-point').forEach(point => point.addEventListener('click', () => revealOrgan(point.dataset.organ)));
  document.querySelectorAll('[data-map-target]').forEach(point => point.addEventListener('click', () => revealOrgan(point.dataset.mapTarget)));
  $('.map-return').addEventListener('click', () => {
    document.querySelector(`.map-point[data-organ="${activeOrgan}"]`).focus({preventScroll:true});
    $('#body-map').scrollIntoView({block:'start',behavior:reducedMotion.matches ? 'instant' : 'smooth'});
  });
  chooseOrgan('heart');
})();
