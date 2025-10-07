/* ----------------- form.js ----------------- */
const form = document.getElementById('contact-form');
const fields = form.querySelectorAll('input, textarea');

// ---------- Phone input restriction ----------
const phoneField = form.querySelector('input[type="tel"]');
if (phoneField) {
  phoneField.addEventListener('input', () => {
    let val = phoneField.value;
    val = val.replace(/(?!^)\+/g, ''); // only allow one leading +
    val = val.replace(/[^0-9+]/g, ''); // only digits and +
    phoneField.value = val;
  });
}

// List of invalid or common typo email domains
const invalidDomains = ['gnail.com','gamil.com','hotnail.com','yaho.com','outlok.com'];

// Whitelisted real email providers
const allowedDomains = ['gmail.com','yahoo.com','outlook.com','hotmail.com','icloud.com','aol.com'];

// Custom error messages
const emptyMessageError = 'Please leave a message';

// Leetspeak map
const leetMap = {
  '0': 'o','1': 'i','2': 'z','3': 'e','4': 'a','5': 's','6': 'g','7': 't','8': 'b','9': 'g',
  '@': 'a','\\$': 's','!': 'i'
};

// Cyrillic → Latin transliteration
const cyrillicToLatin = {
  'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh','з':'z','и':'i','й':'y',
  'к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f',
  'х':'h','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya'
};

// Utility: remove diacritics
function removeDiacritics(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Transliterate Cyrillic to Latin
function transliterateCyrillic(str) {
  return str.split('').map(ch => cyrillicToLatin[ch.toLowerCase()] || ch).join('');
}

// Normalize string for profanity detection
function normalizeForProfanity(msg) {
  if (!msg) return '';
  let out = msg.toLowerCase();
  out = removeDiacritics(out);
  out = transliterateCyrillic(out);
  Object.keys(leetMap).forEach(k => {
    const v = leetMap[k];
    out = out.replace(new RegExp(k, 'g'), v);
  });
  out = out.replace(/[^a-z0-9]/g, ''); // remove remaining non-alphanumeric
  return out;
}

// Load banned words
let bannedWordPatterns = [];
let filtersLoaded = false;
fetch('../data/banned_words.txt')
  .then(response => response.text())
  .then(data => {
    const words = data.split(/\r?\n/).map(word => word.trim()).filter(word => word.length >= 3);
    bannedWordPatterns = words.map(word => {
      const norm = normalizeForProfanity(word);
      // Allow repeated letters + optional trailing characters to catch shortened/truncated versions
      const patternString = norm.split('').map(ch => ch + '+').join('') + '.*';
      return new RegExp(patternString, 'i');
    });
    filtersLoaded = true;
  })
  .catch(err => console.error('Error loading banned words:', err));

// Check for banned words
function containsBannedWord(originalMessage) {
  if (!originalMessage || !filtersLoaded) return false;
  const words = originalMessage
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ') // remove punctuation
    .split(/\s+/);
  return words.some(word => {
    const normalized = normalizeForProfanity(word);
    return bannedWordPatterns.some(pattern => pattern.test(normalized));
  });
}

/* ---------- Input handlers & validation ---------- */
fields.forEach(field => {
  const errorMessage = field.nextElementSibling;
  const defaultBorder = '2px solid #c9a23e';

  field.addEventListener('focus', () => {
    field.classList.remove('error');
    errorMessage.classList.remove('active');
    field.style.borderBottom = defaultBorder;

    if (field.hideErrorTimeout) clearTimeout(field.hideErrorTimeout);
  });

  field.addEventListener('blur', () => {
    const value = field.value.trim();

    if (field.hideErrorTimeout) clearTimeout(field.hideErrorTimeout);

    const showError = (message, persistent = false) => {
      field.classList.add('error');
      errorMessage.textContent = message;
      errorMessage.classList.add('active');
      field.style.borderBottom = '2px solid #F67E7E';

      if (!persistent) {
        field.hideErrorTimeout = setTimeout(() => {
          field.classList.remove('error');
          errorMessage.classList.remove('active');
          field.style.borderBottom = defaultBorder;
        }, 3000);
      }
    };

    

    if (value === '') {
      showError(field.tagName.toLowerCase() === 'textarea' ? emptyMessageError : 'This field is required');
      return;
    }

    if (field.type === 'text') {
      const namePattern = /^[A-Z][a-z]+ [A-Z][a-z]+$/;
      if (!namePattern.test(value)) showError('Enter First and Last name each starting with an uppercase');
    } else if (field.type === 'tel') {
      try {
        const phoneNumber = libphonenumber.parsePhoneNumber(value);
        if (!phoneNumber || !phoneNumber.isValid()) throw new Error('Invalid number');
      } catch {
        showError('Please enter a valid phone number');
      }
    } else if (field.type === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const domain = value.split('@')[1]?.toLowerCase();

      if (!emailPattern.test(value)) {
        showError('Please enter a valid email address');
      } else if (invalidDomains.includes(domain)) {
        showError('Please enter a valid email address');
      } else if (!allowedDomains.includes(domain)) {
        showError('Please use a common email provider (Gmail, Yahoo, Outlook, Hotmail)');
      } else {
        field.classList.remove('error');
        errorMessage.classList.remove('active');
        field.style.borderBottom = defaultBorder;
      }
    } else if (field.tagName.toLowerCase() === 'textarea') {
      if (!filtersLoaded) {
        showError('Loading filters, please wait...');
      } else if (containsBannedWord(value)) {
        showError('Please avoid using inappropriate language', true); // persistent
      } else {
        field.classList.remove('error');
        errorMessage.classList.remove('active');
        field.style.borderBottom = defaultBorder;
      }
    }
  });
});

/* ---------- Submit handler ---------- */
form.addEventListener('submit', e => {
  e.preventDefault();
  if (!filtersLoaded) {
    alert('Please wait, loading filters...');
    return;
  }

  let totalFields = fields.length;
  let filledFields = 0;
  let allValid = true;
  let profanityDetected = false;

  fields.forEach(field => {
    const errorMessage = field.nextElementSibling;
    const value = field.value.trim();

    if (value !== '') filledFields++;

    if (value === '') {
      field.classList.add('error');
      errorMessage.textContent = field.tagName.toLowerCase() === 'textarea' ? emptyMessageError : 'This field is required';
      errorMessage.classList.add('active');
      field.style.borderBottom = '2px solid #F67E7E';
      allValid = false;
      return;
    }

    if (field.type === 'text') {
      const namePattern = /^[A-Z][a-z]+ [A-Z][a-z]+$/;
      if (!namePattern.test(value)) {
        field.classList.add('error');
        errorMessage.classList.add('active');
        field.style.borderBottom = '2px solid #F67E7E';
        allValid = false;
      }
    } else if (field.type === 'tel') {
      try {
        const phoneNumber = libphonenumber.parsePhoneNumber(value);
        if (!phoneNumber || !phoneNumber.isValid()) {
          field.classList.add('error');
          errorMessage.classList.add('active');
          field.style.borderBottom = '2px solid #F67E7E';
          allValid = false;
        }
      } catch {
        field.classList.add('error');
        errorMessage.classList.add('active');
        field.style.borderBottom = '2px solid #F67E7E';
        allValid = false;
      }
    } else if (field.type === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const domain = value.split('@')[1]?.toLowerCase();
      if (!emailPattern.test(value) || invalidDomains.includes(domain) || !allowedDomains.includes(domain)) {
        field.classList.add('error');
        errorMessage.classList.add('active');
        field.style.borderBottom = '2px solid #F67E7E';
        allValid = false;
      }
    } else if (field.tagName.toLowerCase() === 'textarea') {
      if (containsBannedWord(value)) {
        field.classList.add('error');
        errorMessage.textContent = 'Please avoid using inappropriate language';
        errorMessage.classList.add('active');
        field.style.borderBottom = '2px solid #F67E7E';
        profanityDetected = true;
        allValid = false;
      }
    }
  });

  if (filledFields < totalFields) return;

  if (!allValid || profanityDetected) {
    alert('Info incorrect, please recheck');
  } else {
    alert('Successfully sent');
    form.reset();
    fields.forEach(field => field.style.borderBottom = '2px solid #ccc');
    fields.forEach(field => {
      const errorMessage = field.nextElementSibling;
      field.classList.remove('error');
      errorMessage.classList.remove('active');
    });
  }
});
