window.addEventListener('DOMContentLoaded', () => {
    
    //about.html animation

    law_image = document.querySelector('.law_image');
    law_image.style.opacity = '0';
    law_image.style.right = '20rem';

    container = document.querySelector('.container-comands');
    container.style.opacity = '0';
    container.style.marginTop = '500px';

    setTimeout(() => {
        law_image.style.opacity = '1';

        container.style.opacity = '1';
        container.style.marginTop = '200px';
    }, 200);
});
