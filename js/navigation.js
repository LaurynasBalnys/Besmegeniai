    window.addEventListener('DOMContentLoaded', () => {
        const header = document.querySelector('.split-header');
        const links = document.querySelector('.nav-links');
        const dark = document.querySelector(' .dark');

        let hidePoint = 40;
        let activeBurger = false;

        window.addEventListener('scroll', () => swimpNavigation());
        window.addEventListener('resize', () => swimpNavigation());

        // Бургер
        const hamburgerButton = document.createElement('button');
        hamburgerButton.classList.add('hamburger-menu');
        hamburgerButton.innerHTML = '☰';

        header.querySelector('.header-right').prepend(hamburgerButton);

        // Изначально скрытое меню
        links.classList.add('mobile-menu');

        
       hamburgerButton.addEventListener('click', () => {
    links.classList.toggle('open');
    hamburgerButton.classList.toggle('open');

    // Check if menu is now open
    if (links.classList.contains('open')) {
        dark.style.opacity = 1;  // Show dark background
    } else {
        dark.style.opacity = 0;  // Hide dark background
    }
});



        

        // Закрытие меню по клику на ссылку
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

        swimpNavigation(); // первичный вызов
    });
