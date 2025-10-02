/* ----------------- form.js ----------------- */

const form = document.getElementById('contact-form');
const fields = form.querySelectorAll('input, textarea');
const invalidDomains = ['gnail.com','gamil.com','hotnail.com','yaho.com','outlok.com'];

// Load banned words from external text file
let bannedWords = [];
fetch('../data/banned_words.txt')
  .then(response => response.text())
  .then(data => {
    bannedWords = data.split(/\r?\n/).map(word => word.trim()).filter(Boolean);
  })
  .catch(err => console.error('Error loading banned words:', err));

/* --------------- leetspeak map --------------- */
const leetMap = {
  '0': 'o','1': 'i','2': 'z','3': 'e','4': 'a','5': 's','6': 'g','7': 't','8': 'b','9': 'g','@': 'a','\\$': 's','!': 'i'
};

/* --------------- Cyrillic → Latin transliteration map --------------- */
const cyrillicToLatin = {
  'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh','з':'z','и':'i','й':'y',
  'к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f',
  'х':'h','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya'
};

/* Utility: remove diacritics */
function removeDiacritics(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/* Transliterate Cyrillic to Latin */
function transliterateCyrillic(str) {
  return str.split('').map(ch => cyrillicToLatin[ch.toLowerCase()] || ch).join('');
}

/* Normalize message to catch obfuscations */
function normalizeMessage(msg) {
  if (!msg) return '';
  let out = msg.toLowerCase();
  out = removeDiacritics(out);
  out = transliterateCyrillic(out);
  out = out.replace(/[\s\.\-_\u00A0]/g, '');
  Object.keys(leetMap).forEach(k => {
    const v = leetMap[k];
    const re = new RegExp(k, 'g');
    out = out.replace(re, v);
  });
  out = out.replace(/[^a-z0-9]/g, '');
  return out;
}

/* Check banned words against both original and normalized forms */
function containsBannedWord(originalMessage) {
  if (!originalMessage) return false;

  const lower = removeDiacritics(originalMessage.toLowerCase());
  for (const word of bannedWords) {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp('\\b' + escaped + '\\b', 'i');
    if (pattern.test(lower)) return true;
  }

  const normalized = normalizeMessage(originalMessage);
  for (const word of bannedWords) {
    const w = removeDiacritics(word.toLowerCase()).replace(/[^a-z0-9]/g, '');
    if (!w) continue;
    if (normalized.includes(w)) return true;
  }

  return false;
}

/* ---------- Input handlers & validation ---------- */
fields.forEach(field => {
  const errorMessage = field.nextElementSibling;

  field.addEventListener('focus', () => {
    field.classList.remove('error');
    errorMessage.classList.remove('active');
    field.style.borderBottom = '2px solid #c9a23e';
  });

  field.addEventListener('blur', () => {
    const value = field.value.trim();

    if (value === '') {
      field.classList.add('error');
      errorMessage.classList.add('active');
      field.style.borderBottom = '2px solid #F67E7E';
      return;
    }

    if (field.type === 'text') {
      const namePattern = /^[A-Z][a-z]+ [A-Z][a-z]+$/;
      if (!namePattern.test(value)) {
        field.classList.add('error');
        errorMessage.textContent = 'Enter First and Last name, each starting with uppercase';
        errorMessage.classList.add('active');
        field.style.borderBottom = '2px solid #F67E7E';
      } else {
        field.classList.remove('error');
        errorMessage.classList.remove('active');
        field.style.borderBottom = '2px solid #c9a23e';
      }
    }

    else if (field.type === 'tel') {
      try {
        const phoneNumber = libphonenumber.parsePhoneNumber(value);
        if (!phoneNumber || !phoneNumber.isValid()) throw new Error('Invalid number');
        field.classList.remove('error');
        errorMessage.classList.remove('active');
        field.style.borderBottom = '2px solid #c9a23e';
      } catch {
        field.classList.add('error');
        errorMessage.textContent = 'Please enter a valid phone number';
        errorMessage.classList.add('active');
        field.style.borderBottom = '2px solid #F67E7E';
      }
    }

    else if (field.type === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const domain = value.split('@')[1]?.toLowerCase();
      if (!emailPattern.test(value) || invalidDomains.includes(domain)) {
        field.classList.add('error');
        errorMessage.textContent = 'Please enter a valid email address';
        errorMessage.classList.add('active');
        field.style.borderBottom = '2px solid #F67E7E';
      } else {
        field.classList.remove('error');
        errorMessage.classList.remove('active');
        field.style.borderBottom = '2px solid #c9a23e';
      }
    }

    else if (field.tagName.toLowerCase() === 'textarea') {
      if (containsBannedWord(value)) {
        field.classList.add('error');
        errorMessage.textContent = 'Please avoid using inappropriate language';
        errorMessage.classList.add('active');
        field.style.borderBottom = '2px solid #F67E7E';
      } else {
        field.classList.remove('error');
        errorMessage.classList.remove('active');
        field.style.borderBottom = '2px solid #c9a23e';
      }
    }
  });
});

/* ---------- Submit handler ---------- */
form.addEventListener('submit', e => {
  e.preventDefault();
  let totalFields = fields.length;
  let filledFields = 0;
  let allValid = true;
  let profanityDetected = false;

  fields.forEach(field => {
    const errorMessage = field.nextElementSibling;
    const value = field.value.trim();

    if (value !== '') filledFields++;

    // Skip empty fields for validation
    if (value === '') {
      field.classList.add('error');
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
    }

    else if (field.type === 'tel') {
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
    }

    else if (field.type === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const domain = value.split('@')[1]?.toLowerCase();
      if (!emailPattern.test(value) || invalidDomains.includes(domain)) {
        field.classList.add('error');
        errorMessage.classList.add('active');
        field.style.borderBottom = '2px solid #F67E7E';
        allValid = false;
      }
    }

    else if (field.tagName.toLowerCase() === 'textarea') {
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

  // Only show popup if all fields are filled
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
