document.addEventListener('DOMContentLoaded', () => {
  const readMoreBtn = document.querySelector('.read_more');
  const aboutText = document.querySelector('.about_text');

  if (!readMoreBtn || !aboutText) return; // защита

  const shortText = aboutText.innerHTML.trim();
  const fullTextContent = `Eveniet similique laborum quia atque beatae expedita quae quaerat ex veniam corporis ea, aliquam explicabo. Itaque deserunt omnis, aspernatur quae nihil nemo.`;

  aboutText.innerHTML = `
    <span class="short-text">${shortText}</span>
    <span class="full-text">${fullTextContent}</span>
  `;

  let isExpanded = false;

  const toggleRead = (e) => {
    e.preventDefault(); // предотвращаем стандартное поведение
    aboutText.classList.toggle('expanded');
    isExpanded = !isExpanded;
    readMoreBtn.textContent = isExpanded ? 'Read Less' : 'Read More';
  };

  // Используем только touchstart для мобильных или click для десктопа
  if ('ontouchstart' in window) {
    readMoreBtn.addEventListener('touchstart', toggleRead, { passive: false });
  } else {
    readMoreBtn.addEventListener('click', toggleRead);
  }
});