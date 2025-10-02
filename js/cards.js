const slider = document.getElementById('slider');
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let currentSection = 0;

function getVisibleCards() {
    if (window.innerWidth < 768) {
        return 1; // телефон
    } else if (window.innerWidth < 1024) {
        return 2; // планшет
    } else {
        return 3; // десктоп
    }
}

function goToSection(section) {
    const cards = slider.querySelectorAll('.card');
    if (!cards.length) return;

    const cardWidth = cards[0].offsetWidth + 20;
    const visibleCards = getVisibleCards();
    const totalCards = cards.length;
    const container = document.querySelector('.slider-container');
    const containerWidth = container.offsetWidth;

    const maxSection = Math.ceil(totalCards / visibleCards) - 1;
    currentSection = Math.max(0, Math.min(section, maxSection));

    const groupWidth = cardWidth * visibleCards;
    const offset = (containerWidth - groupWidth) / 2;

    // скрываем все карточки
    cards.forEach(card => card.classList.add('invisible'));

    // показываем только нужные
    const start = currentSection * visibleCards;
    const end = start + visibleCards;
    for (let i = start; i < end && i < totalCards; i++) {
        cards[i].classList.remove('invisible');
    }

    currentTranslate = -currentSection * groupWidth + offset;
    prevTranslate = currentTranslate;
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
    startPos = e.pageX || e.touches[0].pageX;
}

function handleDragEnd() {
    isDragging = false;
    const cards = slider.querySelectorAll('.card');
    if (!cards.length) return;

    const cardWidth = cards[0].offsetWidth + 20;
    const visibleCards = getVisibleCards();
    const groupWidth = cardWidth * visibleCards;
    const maxSection = Math.ceil(cards.length / visibleCards) - 1;

    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -groupWidth / 3 && currentSection < maxSection) {
        currentSection++;
    } else if (movedBy > groupWidth / 3 && currentSection > 0) {
        currentSection--;
    }

    goToSection(currentSection);
}

function handleDragMove(e) {
    if (isDragging) {
        const x = e.pageX || e.touches[0].pageX;
        currentTranslate = prevTranslate + x - startPos;
        slider.style.transform = `translateX(${currentTranslate}px)`;
    }
}

slider.addEventListener('mousedown', handleDragStart);
slider.addEventListener('mouseup', handleDragEnd);
slider.addEventListener('mouseleave', () => {
    if (isDragging) {
        isDragging = false;
        goToSection(currentSection);
    }
});
slider.addEventListener('mousemove', handleDragMove);

// поддержка свайпа пальцем
slider.addEventListener('touchstart', handleDragStart);
slider.addEventListener('touchend', handleDragEnd);
slider.addEventListener('touchmove', handleDragMove);

window.addEventListener('load', () => goToSection(0));
window.addEventListener('resize', () => goToSection(currentSection));