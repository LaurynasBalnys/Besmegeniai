window.addEventListener('DOMContentLoaded', () => {


    //index.html animation
    

    function doAnimation() {

        

        const boxRight = document.querySelector('.box-right');
        const boxLeft = document.querySelector('.box-left');
        const image = document.querySelector('.imageSueLogo');
        const textRight = document.querySelector('.text-right');
        
        setTimeout(() => {
            image.style.opacity = '1';
            textRight.style.opacity = '1';
        },200);

        if (window.innerWidth < 1440) return;

        

        setTimeout(() => {
            boxRight.style.width = '50vw';
            boxLeft.style.width = '50vw';
        }, 200);
    }

    // function init(){
    //     if (window.innerWidth < 1440) return;

    //     const boxRight = document.querySelector('.box-right');
    //     const boxLeft = document.querySelector('.box-left');
    //     const image = document.querySelector('.imageSueLogo');
    //     const textRight = document.querySelector('.text-right');

    //     boxRight.style.width = '100%';
    //     boxLeft.style.width = '0%';
    //     textRight.style.opacity = '0';

    //     doAnimation();
    // }
    
    window.addEventListener('load', doAnimation);

    window.addEventListener('resize', doAnimation);
    
    
});
