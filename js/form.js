const form = document.getElementById('contact-form');
const fields = form.querySelectorAll('input, textarea');

fields.forEach(field => {
  const errorMessage = field.nextElementSibling;

  // Focus: removina error
  field.addEventListener('focus', () => {
    field.classList.remove('error');
    errorMessage.classList.remove('active');
    field.style.borderBottom = '2px solid #c9a23e';
  });

  // Blur: rodo error jeigu tuscia arba neteisinga
  field.addEventListener('blur', () => {
    const value = field.value.trim();

    if (value === '') {
      field.classList.add('error');
      errorMessage.classList.add('active');
      field.style.borderBottom = '2px solid #F67E7E';
    } else if (field.type === 'tel') {
      const phonePattern = /^\+?\d{10,15}$/;
      if (!phonePattern.test(value)) {
        field.classList.add('error');
        errorMessage.textContent = 'Please enter a valid phone number';
        errorMessage.classList.add('active');
        field.style.borderBottom = '2px solid #F67E7E';
      } else {
        field.classList.remove('error');
        errorMessage.classList.remove('active');
        errorMessage.textContent = 'Please enter your phone number';
        field.style.borderBottom = '2px solid #c9a23e';
      }
    } else if (field.type === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        field.classList.add('error');
        errorMessage.textContent = 'Please enter a valid email';
        errorMessage.classList.add('active');
        field.style.borderBottom = '2px solid #F67E7E';
      } else {
        field.classList.remove('error');
        errorMessage.classList.remove('active');
        errorMessage.textContent = 'Please enter your email';
        field.style.borderBottom = '2px solid #c9a23e';
      }
    } else {
      field.classList.remove('error');
      errorMessage.classList.remove('active');
      field.style.borderBottom = '2px solid #c9a23e';
    }
  });
});

// Submit: tikrina ar viskas tinka 
form.addEventListener('submit', e => {
  e.preventDefault();
  let allValid = true;

  fields.forEach(field => {
    const errorMessage = field.nextElementSibling;
    const value = field.value.trim();

    if (value === '') {
      field.classList.add('error');
      errorMessage.classList.add('active');
      field.style.borderBottom = '2px solid #F67E7E';
      allValid = false;
    } else if (field.type === 'tel') {
      const phonePattern = /^\+?\d{10,15}$/;
      if (!phonePattern.test(value)) {
        field.classList.add('error');
        errorMessage.textContent = 'Please enter a valid phone number';
        errorMessage.classList.add('active');
        field.style.borderBottom = '2px solid #F67E7E';
        allValid = false;
      } else {
        errorMessage.textContent = 'Please enter your phone number';
      }
    } else if (field.type === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        field.classList.add('error');
        errorMessage.textContent = 'Please enter a valid email';
        errorMessage.classList.add('active');
        field.style.borderBottom = '2px solid #F67E7E';
        allValid = false;
      } else {
        errorMessage.textContent = 'Please enter your email';
      }
    }
  });

  if (allValid) {
    alert('Sekmingai Pateikta');
    form.reset();
    fields.forEach(field => field.style.borderBottom = '2px solid #ccc');
  }
});
