    window.addEventListener('DOMContentLoaded', () => {
        const header = document.querySelector('.split-header');
        const links = document.querySelector('.nav-links');
        const dark = document.querySelector(' .dark');

        let hidePoint = 40;
        let activeBurger = false;

        window.addEventListener('scroll', () => swimpNavigation());
        window.addEventListener('resize', () => swimpNavigation());

        const hamburgerButton = document.createElement('button');
        hamburgerButton.classList.add('hamburger-menu');
        hamburgerButton.innerHTML = '☰';

        header.querySelector('.header-right').prepend(hamburgerButton);

        links.classList.add('mobile-menu');

        
        hamburgerButton.addEventListener('click', () => {
        links.classList.toggle('open');
        hamburgerButton.classList.toggle('open');
        

    
        if (links.classList.contains('open')) {
            dark.style.opacity = 1;  
            dark.style.zIndex = 998; 
            hamburgerButton.innerHTML = '✖';
        }
        else{
            dark.style.zIndex = -1; 
            dark.style.opacity = 0;
            hamburgerButton.innerHTML = '☰';
        }

        });


        links.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 768) {
                    links.classList.remove('open');
                    hamburgerButton.classList.remove('open');
                    dark.style.opacity = 0;
                }
            });
        });

        function swimpNavigation() {
            if (window.innerWidth < 768) {
                // меню справа
                links.classList.add('mobile-menu');
            } else {
                links.classList.remove('mobile-menu', 'open');
                links.style = "";
            }

            if (window.innerWidth > 1439) {
                if (window.scrollY > hidePoint) {
                    header.style.opacity = 0;
                    header.style.transform = 'translateY(-90px)';
                } else {
                    header.style.opacity = 1;
                    header.style.transform = 'translateY(0)';
                }
            } else {
                header.style.opacity = 1;
                header.style.transform = 'translateY(0)';
            }
        }

        swimpNavigation();
    });


    function goHome(){
        window.location.href = "../index.html";
    }