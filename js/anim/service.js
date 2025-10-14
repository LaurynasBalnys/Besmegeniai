window.addEventListener('DOMContentLoaded', () => {


    //index.html animation
    

    function doAnimation() {
        
        const cards = document.querySelectorAll('.card');
        const banner = document.querySelector('.banner');

        setTimeout(() => {
            cards.forEach((card, index) => {
                setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                }, index * 200);
            });
            banner.style.opacity = '1';
            banner.style.transform = 'translateY(0)';
        }, 300);

        if (window.innerWidth < 1440) return;

        
    }
    
    window.addEventListener('load', doAnimation);

    window.addEventListener('resize', doAnimation);
    
    
});