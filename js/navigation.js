window.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.split-header');

    let hidePoint = 120;
    window.addEventListener('scroll', () => {
        if (window.scrollY > hidePoint) {
            header.style.opacity = 0;
            header.style.transform = 'translateY(-40px)';
        } else {
            header.style.opacity = 1;
            header.style.transform = 'translateY(0)';
        }
    });
});