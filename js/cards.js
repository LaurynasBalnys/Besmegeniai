const slider = document.getElementById('slider');
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let currentSection = 0;

function isMobile() {
    return window.innerWidth <= 767;
}

function getVisibleCards() {
    return isMobile() ? 1 : 3;
}

function goToSection(section) {
    const cards = slider.querySelectorAll('.card');
    if (!cards.length) return;

    const totalCards = cards.length;
    const visibleCards = getVisibleCards();
    const container = document.querySelector('.slider-container');
    const containerWidth = container.offsetWidth;

    let groupWidth, offset;

    if (isMobile()) {
        // 📱 мобильный режим: одна колонка = 100vw
        groupWidth = containerWidth;

        // карточка внутри = 80vw → нужно подвинуть, чтобы была по центру
        const cardWidth = cards[0].offsetWidth;
        offset = (containerWidth - cardWidth) / 2;

        // на мобилке никого не прячем
        cards.forEach(card => card.classList.remove('invisible'));
    } else {
        // 💻 десктоп/планшет
        const cardWidth = cards[0].offsetWidth + 20;
        groupWidth = cardWidth * visibleCards;
        offset = (containerWidth - groupWidth) / 2;

        // прячем лишние карточки
        cards.forEach(card => card.classList.add('invisible'));
        const start = currentSection * visibleCards;
        const end = start + visibleCards;
        for (let i = start; i < end && i < totalCards; i++) {
            cards[i].classList.remove('invisible');
        }
    }

    const maxSection = Math.ceil(totalCards / visibleCards) - 1;
    currentSection = Math.max(0, Math.min(section, maxSection));

    // ключевая строка: колонка двигается + карточки центрируются
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
    startPos = (e.touches ? e.touches[0].pageX : e.pageX);
}

function handleDragMove(e) {
    if (!isDragging) return;
    const currentPos = (e.touches ? e.touches[0].pageX : e.pageX);
    currentTranslate = prevTranslate + currentPos - startPos;
    slider.style.transform = `translateX(${currentTranslate}px)`;
}

function handleDragEnd() {
    if (!isDragging) return;
    isDragging = false;

    const cards = slider.querySelectorAll('.card');
    const visibleCards = getVisibleCards();
    const containerWidth = document.querySelector('.slider-container').offsetWidth;
    const cardWidth = isMobile() ? containerWidth : (cards[0].offsetWidth + 20);
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

slider.addEventListener('mousedown', handleDragStart);
slider.addEventListener('mousemove', handleDragMove);
slider.addEventListener('mouseup', handleDragEnd);
slider.addEventListener('mouseleave', handleDragEnd);

//mobile touch -Aleksandr
slider.addEventListener('touchstart', handleDragStart);
slider.addEventListener('touchmove', handleDragMove);
slider.addEventListener('touchend', handleDragEnd);

window.addEventListener('load', () => goToSection(0));
window.addEventListener('resize', () => goToSection(currentSection));