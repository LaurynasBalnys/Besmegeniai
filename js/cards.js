const slider = document.getElementById('slider');
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let currentSection = 0;

const isMobile = () => window.innerWidth <= 767;
const visibleCards = 3; // по 3 карточки на десктопе

function groupCards(cards, perGroup) {
  if (slider.querySelectorAll('.section').length > 0) return;

  const fragment = document.createDocumentFragment();
  for (let i = 0; i < cards.length; i += perGroup) {
    const section = document.createElement('div');
    section.className = 'section';
    Array.from(cards)
      .slice(i, i + perGroup)
      .forEach((c) => section.appendChild(c));
    fragment.appendChild(section);
  }
  slider.innerHTML = '';
  slider.appendChild(fragment);
}

function ungroupCards() {
  const sections = slider.querySelectorAll('.section');
  if (sections.length === 0) return;

  const fragment = document.createDocumentFragment();
  sections.forEach((section) => {
    Array.from(section.children).forEach((card) =>
      fragment.appendChild(card)
    );
  });
  slider.innerHTML = '';
  slider.appendChild(fragment);
}

function createDots() {
  // удаляем старые точки
  const oldDots = document.querySelector('.dots');
  if (oldDots) oldDots.remove();

  const cards = slider.querySelectorAll('.card');
  const perGroup = isMobile() ? 1 : visibleCards;
  const totalSections = Math.ceil(cards.length / perGroup);

  // создаем контейнер точек
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'dots';

  for (let i = 0; i < totalSections; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    if (i === currentSection) dot.classList.add('active');
    dot.addEventListener('click', () => goToSection(i));
    dotsContainer.appendChild(dot);
  }

  // добавляем под слайдер
  slider.parentElement.appendChild(dotsContainer);
}

function goToSection(section) {
  const cards = slider.querySelectorAll('.card');
  const container = document.querySelector('.slider-container');
  const perGroup = isMobile() ? 1 : visibleCards;
  const maxSection = Math.ceil(cards.length / perGroup) - 1;

  currentSection = Math.max(0, Math.min(section, maxSection));

  if (isMobile()) {
    groupCards(cards, 1);
    const sections = slider.querySelectorAll('.section');
    const currentSec = sections[currentSection];
    if (!currentSec) return;

    const translateX =
      -(currentSec.offsetLeft -
        (container.offsetWidth - currentSec.offsetWidth) / 2);
    currentTranslate = prevTranslate = translateX;
  } else {
    ungroupCards();

    const cardWidth = cards[0].offsetWidth + 20;
    const groupWidth = cardWidth * visibleCards;
    const offset = (container.offsetWidth - groupWidth) / 2;

    cards.forEach((card, i) => {
      const inView =
        i >= currentSection * visibleCards &&
        i < (currentSection + 1) * visibleCards;
      card.classList.toggle('invisible', !inView);
    });

    currentTranslate = prevTranslate = -currentSection * groupWidth + offset;
  }

  slider.style.transition = 'transform 0.35s ease';
  slider.style.transform = `translateX(${currentTranslate}px)`;

  updateDots();
}

function updateDots() {
  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSection);
  });
}

function handleDragStart(e) {
  isDragging = true;
  startPos = e.pageX || e.touches?.[0]?.clientX || 0;
  slider.style.transition = 'none';
}

function handleDragMove(e) {
  if (!isDragging) return;
  const x = e.pageX || e.touches?.[0]?.clientX || 0;
  currentTranslate = prevTranslate + (x - startPos);
  slider.style.transform = `translateX(${currentTranslate}px)`;
}

function handleDragEnd() {
  if (!isDragging) return;
  isDragging = false;

  const cards = slider.querySelectorAll('.card');
  const container = document.querySelector('.slider-container');
  const perGroup = isMobile() ? 1 : visibleCards;
  const cardWidth = cards[0].offsetWidth + 20;
  const groupWidth = isMobile() ? container.offsetWidth : cardWidth * perGroup;
  const maxSection = Math.ceil(cards.length / perGroup) - 1;

  const threshold = groupWidth / 4;
  const movedBy = currentTranslate - prevTranslate;

  if (movedBy < -threshold && currentSection < maxSection) currentSection++;
  else if (movedBy > threshold && currentSection > 0) currentSection--;

  goToSection(currentSection);
}

function handleResize() {
  createDots();
  goToSection(currentSection);
}

// --- события ---
slider.addEventListener('mousedown', handleDragStart);
slider.addEventListener('mouseup', handleDragEnd);
slider.addEventListener('mouseleave', () => isDragging && handleDragEnd());
slider.addEventListener('mousemove', handleDragMove);

slider.addEventListener('touchstart', handleDragStart);
slider.addEventListener('touchend', handleDragEnd);
slider.addEventListener('touchmove', handleDragMove);

window.addEventListener('resize', handleResize);
window.addEventListener('load', () => {
  createDots();
  goToSection(0);
});
