window.addEventListener('DOMContentLoaded', () => {


    //index.html animation

    const boxRight = document.querySelector('.box-right');
    const boxLeft = document.querySelector('.box-left');
    const image = document.querySelector('.imageSueLogo');
    const textRight = document.querySelector('.text-right');

    boxLeft.style.width = '0%';
    boxRight.style.width = '100%';
    image.style.opacity = '0';
    textRight.style.opacity = '0';
    
    //about.html animation

    // law_image = document.querySelector('.law_image');
    // law_image.style.opacity = '0';

    setTimeout(() => {
        boxRight.style.width = '50%';
        boxLeft.style.width = '50%';
        image.style.opacity = '1';
        textRight.style.opacity = '1';
        // law_image.style.opacity = '1';
    }, 200);
});
