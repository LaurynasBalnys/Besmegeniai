window.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = 0;
    document.body.style.transform = 'translateY(40px)';
    document.body.style.transition = 'opacity 0.7s, transform 0.7s';

    setTimeout(() => {
        document.body.style.opacity = 1;
        document.body.style.transform = 'translateY(0)';
    }, 10);
});