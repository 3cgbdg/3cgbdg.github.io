// ============================================================
// LAB 2 — JavaScript: DOM, Events, Loops & Conditionals
// Зовнішній файл JavaScript, підключений до lab1/index.html
// ============================================================

// ──────────────────────────────────────────────────────────────
// ЗАВДАННЯ 1: Керування DOM за допомогою циклів та умовної логіки
// ──────────────────────────────────────────────────────────────

function initTask1() {
  // 1. Виділення декількох елементів списку
  const tipItems = document.querySelectorAll('#tips-list li');

  // 2. Цикл for — зміна кольору фону кожного елемента
  const evenColor = 'rgba(255, 77, 109, 0.08)';
  const oddColor = 'rgba(67, 97, 238, 0.08)';

  for (let i = 0; i < tipItems.length; i++) {
    // 3. if-else — стиль на основі парності індексу
    if (i % 2 === 0) {
      tipItems[i].style.backgroundColor = evenColor;
      tipItems[i].style.borderLeft = '3px solid var(--accent)';
    } else {
      tipItems[i].style.backgroundColor = oddColor;
      tipItems[i].style.borderLeft = '3px solid #4361ee';
    }

    // if-else на основі data-category атрибута
    const category = tipItems[i].dataset.category;
    const textEl = tipItems[i].querySelector('.tip-text');

    if (category === 'exposure') {
      textEl.textContent = '☀️ ' + textEl.textContent;
    } else if (category === 'composition') {
      textEl.textContent = '📐 ' + textEl.textContent;
    } else if (category === 'portrait') {
      textEl.textContent = '🧑 ' + textEl.textContent;
    } else if (category === 'editing') {
      textEl.textContent = '🎨 ' + textEl.textContent;
    } else {
      textEl.textContent = '📷 ' + textEl.textContent;
    }
  }

  // 4. querySelectorAll + forEach — динамічна зміна стилю галереї
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(function (item, index) {
    if (index < 3) {
      item.style.boxShadow = '0 0 20px rgba(255, 77, 109, 0.15)';
    } else {
      item.style.boxShadow = '0 0 20px rgba(67, 97, 238, 0.15)';
    }
  });
}

// ──────────────────────────────────────────────────────────────
// ЗАВДАННЯ 2: Обробка подій та динамічні оновлення
// ──────────────────────────────────────────────────────────────

function initTask2() {
  // 1. Кнопка перемикання видимості
  const toggleBtn = document.getElementById('toggle-btn');
  const extraContent = document.getElementById('extra-content');

  toggleBtn.addEventListener('click', function () {
    // 2. if-else для перевірки стану видимості
    if (extraContent.classList.contains('visible')) {
      extraContent.classList.remove('visible');
      toggleBtn.textContent = '▼ Показати додаткову інформацію';
    } else {
      extraContent.classList.add('visible');
      toggleBtn.textContent = '▲ Приховати додаткову інформацію';
    }
  });

  // 3. Цикл for — додавання обробників подій до навігаційних кнопок
  const navBtns = document.querySelectorAll('.content-nav-btn');
  const contentArea = document.getElementById('content-area');

  const contentData = [
    {
      title: 'Витримка',
      text: 'Витримка контролює тривалість відкриття затвора. Коротка витримка (1/1000) заморожує рух, а довга (1/30) створює ефект розмиття. Для зйомки спорту обирають 1/500 або швидше.'
    },
    {
      title: 'Діафрагма',
      text: 'Діафрагма (f-stop) визначає глибину різкості. Мала діафрагма (f/1.8) створює красиве розмиття фону для портретів, а велика (f/11) дає чіткість по всьому кадру для пейзажів.'
    },
    {
      title: 'ISO',
      text: 'ISO — це чутливість сенсора до світла. Низьке ISO (100-400) дає чистий кадр без шуму. Високе ISO (3200+) використовують при слабкому освітленні, але воно додає зернистість.'
    },
    {
      title: 'Баланс білого',
      text: 'Баланс білого визначає колірну температуру фотографії. Автоматичний режим підходить для більшості ситуацій, але ручне налаштування дозволяє створити теплі або холодні тони.'
    }
  ];

  for (let i = 0; i < navBtns.length; i++) {
    navBtns[i].addEventListener('click', function () {
      // Знімаємо активний клас з усіх кнопок
      for (let j = 0; j < navBtns.length; j++) {
        navBtns[j].classList.remove('active');
      }
      // Встановлюємо активний клас на натиснуту кнопку
      this.classList.add('active');

      // Зміна вмісту content-area
      contentArea.innerHTML =
        '<h4>' + contentData[i].title + '</h4>' +
        '<p>' + contentData[i].text + '</p>';
    });
  }

  // 4. Ефект наведення на пункти меню
  const hoverItems = document.querySelectorAll('.hover-menu-item');

  hoverItems.forEach(function (item) {
    const originalText = item.querySelector('.hover-desc').textContent;

    item.addEventListener('mouseover', function () {
      // Умовна логіка при наведенні
      if (item.dataset.type === 'landscape') {
        item.style.borderColor = '#4cc9f0';
        item.querySelector('.hover-desc').textContent = '🏔️ Пейзажна фотографія — передайте велич природи';
      } else if (item.dataset.type === 'macro') {
        item.style.borderColor = '#7209b7';
        item.querySelector('.hover-desc').textContent = '🔍 Макрозйомка — відкрийте невидимий світ деталей';
      } else if (item.dataset.type === 'street') {
        item.style.borderColor = '#f72585';
        item.querySelector('.hover-desc').textContent = '🌆 Вулична фотографія — ловіть моменти міського життя';
      } else {
        item.style.borderColor = 'var(--accent)';
      }
      item.style.background = 'rgba(255, 255, 255, 0.06)';
    });

    item.addEventListener('mouseout', function () {
      item.style.borderColor = 'var(--glass-border)';
      item.style.background = 'var(--glass)';
      item.querySelector('.hover-desc').textContent = originalText;
    });
  });
}

// ──────────────────────────────────────────────────────────────
// ЗАВДАННЯ 3: Динамічне керування контентом
// ──────────────────────────────────────────────────────────────

function initTask3() {
  // ──── Форма з валідацією ────
  const commentForm = document.getElementById('comment-form');
  const commentsDisplay = document.getElementById('comments-display');
  const formError = document.getElementById('form-error');

  commentForm.addEventListener('submit', function (e) {
    // Запобігаємо відправці за замовчуванням
    e.preventDefault();

    const nameInput = document.getElementById('input-name');
    const emailInput = document.getElementById('input-email');
    const commentInput = document.getElementById('input-comment');

    // if-else валідація
    if (nameInput.value.trim() === '') {
      formError.textContent = '⚠️ Будь ласка, введіть ваше ім\'я.';
      formError.style.display = 'block';
      nameInput.focus();
      return;
    } else if (emailInput.value.trim() === '') {
      formError.textContent = '⚠️ Будь ласка, введіть вашу електронну пошту.';
      formError.style.display = 'block';
      emailInput.focus();
      return;
    } else if (commentInput.value.trim() === '') {
      formError.textContent = '⚠️ Будь ласка, введіть коментар.';
      formError.style.display = 'block';
      commentInput.focus();
      return;
    } else {
      formError.style.display = 'none';
    }

    // Динамічне створення коментаря в DOM
    const commentCard = document.createElement('div');
    commentCard.className = 'comment-card';

    const now = new Date();
    const timeStr = now.toLocaleDateString('uk-UA') + ' ' + now.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });

    commentCard.innerHTML =
      '<div class="comment-header">' +
      '<strong>' + nameInput.value.trim() + '</strong>' +
      '<span class="comment-time">' + timeStr + '</span>' +
      '</div>' +
      '<p class="comment-email">' + emailInput.value.trim() + '</p>' +
      '<p class="comment-text">' + commentInput.value.trim() + '</p>';

    commentsDisplay.prepend(commentCard);

    // Анімація появи
    commentCard.style.opacity = '0';
    commentCard.style.transform = 'translateY(20px)';
    setTimeout(function () {
      commentCard.style.transition = 'all 0.4s ease';
      commentCard.style.opacity = '1';
      commentCard.style.transform = 'translateY(0)';
    }, 10);

    // Очищення форми
    commentForm.reset();
  });

  // ──── Блог з розкривним вмістом ────
  const blogPosts = [
    {
      title: 'Як обрати першу камеру?',
      content: 'Вибір першої камери — це захоплюючий, але складний процес. Зверніть увагу на тип матриці, систему автофокуса та доступні об\'єктиви. Для початківців ідеальними будуть бездзеркальні камери, які поєднують компактність із професійними можливостями. Не гонитеся за мегапікселями — 20-24 Мп достатньо для більшості задач.'
    },
    {
      title: '5 помилок початківця у фотографії',
      content: 'Найпоширеніші помилки: 1) зйомка лише в авторежимі, 2) ігнорування правил композиції, 3) неправильне кадрування портретів (обрізані кінцівки), 4) страх використовувати ручні налаштування, 5) відсутність обробки RAW. Уникаючи цих помилок, ви значно покращите якість своїх робіт.'
    },
    {
      title: 'Золота година: секрети магічного світла',
      content: 'Золота година — це перша година після сходу та остання перед заходом сонця. Світло стає м\'яким, теплим і створює довгі тіні, що додають об\'єм. Використовуйте контрове освітлення для силуетів та портретів з «обідком» навколо волосся. Плануйте зйомку заздалегідь за допомогою додатків Sun Surveyor.'
    },
    {
      title: 'Мобільна фотографія: чи може смартфон замінити камеру?',
      content: 'Сучасні смартфони мають вражаючі камери з обчислювальною фотографією. Для соціальних мереж та щоденної зйомки вони ідеальні. Однак фізичні обмеження маленького сенсора все ще помітні при слабкому освітленні та великому збільшенні. Використовуйте ProRAW або ручні режими для максимальної якості.'
    }
  ];

  const blogList = document.getElementById('blog-list');

  // Цикл while для динамічного створення списку блогу (ВИМОГА 1)
  let postIndex = 0;
  while (postIndex < blogPosts.length) {
    const post = blogPosts[postIndex];
    const postEl = document.createElement('div');
    postEl.className = 'blog-post';

    const titleEl = document.createElement('div');
    titleEl.className = 'blog-post-title';
    titleEl.innerHTML = '<span class="blog-arrow">▶</span> ' + post.title;

    const bodyEl = document.createElement('div');
    bodyEl.className = 'blog-post-body';
    bodyEl.textContent = post.content;

    postEl.appendChild(titleEl);
    postEl.appendChild(bodyEl);
    blogList.appendChild(postEl);

    titleEl.addEventListener('click', function () {
      if (postEl.classList.contains('expanded')) {
        postEl.classList.remove('expanded');
        this.querySelector('.blog-arrow').textContent = '▶';
      } else {
        postEl.classList.add('expanded');
        this.querySelector('.blog-arrow').textContent = '▼';
      }
    });

    postIndex++;
  }
}

// ──────────────────────────────────────────────────────────────
// ГАЛЕРЕЯ: Фільтрація та завантаження (ВИМОГИ 2 та 3)
// ──────────────────────────────────────────────────────────────

function initGallery() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const uploadBtn = document.getElementById('upload-photo-btn');
  const modal = document.getElementById('upload-modal');
  const closeModal = document.querySelector('.close-modal');
  const uploadForm = document.getElementById('upload-form');
  const galleryGrid = document.getElementById('gallery-grid');

  // 1. Фільтрація фотографій
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const filter = this.dataset.filter;

      // Оновлюємо активну кнопку
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      // Логіка фільтрації
      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.type === filter) {
          item.style.display = 'block';
          setTimeout(() => item.style.opacity = '1', 10);
        } else {
          item.style.opacity = '0';
          setTimeout(() => item.style.display = 'none', 400);
        }
      });
    });
  });

  // 2. Модальне вікно завантаження
  uploadBtn.addEventListener('click', () => modal.style.display = 'block');
  closeModal.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

  // 3. Додавання нової фотографії
  uploadForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const url = document.getElementById('photo-url').value;
    const caption = document.getElementById('photo-caption');
    const type = document.getElementById('photo-type').value;

    const newItem = document.createElement('figure');
    newItem.className = 'gallery-item';
    newItem.dataset.type = type;

    // Використання .setAttribute() (ВИМОГА Крок 2.3)
    const newImg = document.createElement('img');
    newImg.setAttribute('src', url);
    newImg.setAttribute('alt', caption.value);

    const overlay = document.createElement('div');
    overlay.className = 'gallery-overlay';

    const figcap = document.createElement('figcaption');
    figcap.textContent = caption.value;

    overlay.appendChild(figcap);
    newItem.appendChild(newImg);
    newItem.appendChild(overlay);

    galleryGrid.prepend(newItem);

    // Закрити модалку та скинути форму
    modal.style.display = 'none';
    uploadForm.reset();

    // Повідомлення про успіх
    alert('Фото успішно додано до галереї!');
  });
}

// ──────────────────────────────────────────────────────────────
// КРОК 6: Поєднання концепцій — Зміна кольору фону
// ──────────────────────────────────────────────────────────────

function initColorChanger() {
  const colorBtn = document.getElementById('color-btn');
  const colors = [
    'linear-gradient(135deg, #0a0c15 0%, #1a1a2e 100%)',
    'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
    'linear-gradient(135deg, #1a002e 0%, #2d0a4e 100%)',
    'linear-gradient(135deg, #0d1117 0%, #161b22 100%)'
  ];
  const colorNames = ['Космос', 'Аметист', 'Океан', 'Пурпур', 'Гітхаб'];
  let colorIndex = 0;

  colorBtn.addEventListener('click', function () {
    colorIndex = (colorIndex + 1) % colors.length;
    document.body.style.background = colors[colorIndex];

    // Тернарний оператор для тексту кнопки
    colorBtn.textContent = colorIndex === 0
      ? '🎨 Змінити тему оформлення'
      : '🎨 Тема: ' + colorNames[colorIndex];
  });
}

// ──────────────────────────────────────────────────────────────
// Ініціалізація всіх завдань після завантаження DOM
// ──────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
  initTask1();
  initTask2();
  initTask3();
  initGallery();
  initColorChanger();
});
