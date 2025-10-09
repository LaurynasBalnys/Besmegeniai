/* ----------------- form.js ----------------- */

const form = document.getElementById('contact-form');
const fields = form.querySelectorAll('input, textarea');

// Correct domains
const validDomains = ['gmail.com', 'yahoo.com', 'outlook.com'];
// Common typos
const bannedDomains = ['gnail.com','gamil.com','hotnail.com','yaho.com','outlok.com'];

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

  // Leetspeak
  Object.keys(leetMap).forEach(k => {
    const re = new RegExp(k, 'g');
    out = out.replace(re, leetMap[k]);
  });

  // Collapse repeated letters (fuuuuck -> fuck)
  out = out.replace(/(.)\1+/g, '$1');

  // Remove all non-alphanumeric chars except spaces
  out = out.replace(/[^a-z0-9\s]/g, '');

  return out;
}

/* Check banned words against normalized words */
function containsBannedWord(msg) {
  if (!msg || bannedWords.length === 0) return false;

  const normalizedMsg = normalizeMessage(msg);
  const words = normalizedMsg.split(/\s+/).filter(Boolean);

  for (const word of words) {
    for (const banned of bannedWords) {
      const normalizedBanned = normalizeMessage(banned);
      if (word.includes(normalizedBanned)) {
        return true;
      }
    }
  }

  return false;
}

/* ---------- Levenshtein distance for domain typo detection ---------- */
function levenshtein(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, () => []);
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) matrix[i][j] = matrix[i - 1][j - 1];
      else matrix[i][j] = Math.min(
        matrix[i - 1][j - 1] + 1, // substitution
        matrix[i][j - 1] + 1,     // insertion
        matrix[i - 1][j] + 1      // deletion
      );
    }
  }
  return matrix[a.length][b.length];
}

function isBannedDomain(domain) {
  if (!domain) return false;
  if (validDomains.includes(domain)) return false;
  return bannedDomains.some(b => levenshtein(domain, b) <= 1);
}

/* ---------- Input handlers ---------- */
fields.forEach(field => {
  const errorMessage = field.nextElementSibling;
  let resetTimeout;

  // Only allow + and numbers in phone input
  if(field.type==='tel'){
    field.addEventListener('input', ()=>{
      field.value = field.value.replace(/[^\d+]/g,'');
    });
  }

  field.addEventListener('focus', () => {
    clearTimeout(resetTimeout);
    field.classList.remove('error');
    errorMessage.classList.remove('active');
    fields.forEach(f => f.style.borderBottom = '2px solid #c9a23e');
  });

  field.addEventListener('blur', () => {
    const value = field.value.trim();

    if(value === '') {
      field.classList.add('error');
      errorMessage.classList.add('active');
      field.style.borderBottom = '2px solid #F67E7E';
      if(field.type==='email') errorMessage.textContent = 'Please enter an email address';
      else if(field.type==='text') errorMessage.textContent = 'Please enter your name';
      else if(field.tagName.toLowerCase()==='textarea') errorMessage.textContent = 'Please leave a message';

      resetTimeout = setTimeout(()=>{
        field.classList.remove('error');
        errorMessage.classList.remove('active');
        field.style.borderBottom = '2px solid #c9a23e';
        if(field.tagName.toLowerCase()==='textarea') errorMessage.textContent = 'Please leave a message';
      }, 4000);
      return;
    }

    if(field.type==='text'){
      const namePattern=/^[A-Z][a-z]+ [A-Z][a-z]+$/;
      if(!namePattern.test(value)){
        field.classList.add('error');
        errorMessage.textContent='Enter First and Last name, each starting with uppercase';
        errorMessage.classList.add('active');
        field.style.borderBottom='2px solid #F67E7E';
      } else {
        field.classList.remove('error');
        errorMessage.classList.remove('active');
        field.style.borderBottom='2px solid #c9a23e';
      }
    } else if(field.type==='tel'){
      try {
        const phoneNumber = libphonenumber.parsePhoneNumber(value);
        if(!phoneNumber||!phoneNumber.isValid()) throw new Error();
        field.classList.remove('error');
        errorMessage.classList.remove('active');
        field.style.borderBottom='2px solid #c9a23e';
      } catch {
        field.classList.add('error');
        errorMessage.textContent='Please enter a valid phone number';
        errorMessage.classList.add('active');
        field.style.borderBottom='2px solid #F67E7E';
      }
    } else if(field.type==='email'){
      const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const domain=value.split('@')[1]?.toLowerCase();
      if(!emailPattern.test(value) || isBannedDomain(domain)){
        field.classList.add('error');
        errorMessage.textContent='Please enter a valid email address';
        errorMessage.classList.add('active');
        field.style.borderBottom='2px solid #F67E7E';
      } else {
        field.classList.remove('error');
        errorMessage.classList.remove('active');
        field.style.borderBottom='2px solid #c9a23e';
      }
    } else if(field.tagName.toLowerCase()==='textarea'){
      if(containsBannedWord(value)){
        field.classList.add('error');
        errorMessage.textContent='Please avoid using inappropriate language';
        errorMessage.classList.add('active');
        field.style.borderBottom='2px solid #F67E7E';
      } else {
        field.classList.remove('error');
        errorMessage.classList.remove('active');
        field.style.borderBottom='2px solid #c9a23e';
        errorMessage.textContent='Please leave a message';
      }

      resetTimeout = setTimeout(()=>{
        if(containsBannedWord(field.value)) return;
        field.classList.remove('error');
        errorMessage.classList.remove('active');
        field.style.borderBottom='2px solid #c9a23e';
        errorMessage.textContent='Please leave a message';
      }, 7000);
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

    if(value === '') {
      field.classList.add('error');
      errorMessage.classList.add('active');
      field.style.borderBottom = '2px solid #F67E7E';
      allValid = false;
      if(field.tagName.toLowerCase()==='textarea') errorMessage.textContent = 'Please leave a message';
      return;
    }

    if(field.type==='text'){
      const namePattern=/^[A-Z][a-z]+ [A-Z][a-z]+$/;
      if(!namePattern.test(value)){
        field.classList.add('error');
        errorMessage.classList.add('active');
        field.style.borderBottom='2px solid #F67E7E';
        allValid = false;
      }
    } else if(field.type==='tel'){
      try {
        const phoneNumber = libphonenumber.parsePhoneNumber(value);
        if(!phoneNumber||!phoneNumber.isValid()){
          field.classList.add('error');
          errorMessage.classList.add('active');
          field.style.borderBottom='2px solid #F67E7E';
          allValid = false;
        }
      } catch {
        field.classList.add('error');
        errorMessage.classList.add('active');
        field.style.borderBottom='2px solid #F67E7E';
        allValid = false;
      }
    } else if(field.type==='email'){
      const emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const domain=value.split('@')[1]?.toLowerCase();
      if(!emailPattern.test(value) || isBannedDomain(domain)){
        field.classList.add('error');
        errorMessage.classList.add('active');
        field.style.borderBottom='2px solid #F67E7E';
        allValid = false;
      }
    } else if(field.tagName.toLowerCase()==='textarea'){
      if(containsBannedWord(value)){
        field.classList.add('error');
        errorMessage.textContent='Please avoid using inappropriate language';
        errorMessage.classList.add('active');
        field.style.borderBottom='2px solid #F67E7E';
        profanityDetected = true;
        allValid = false;
      }
    }
  });

  if(filledFields < totalFields) return;

  if(!allValid || profanityDetected){
    alert('Info incorrect, please recheck');
  } else {
    alert('Successfully sent');
    form.reset();
    fields.forEach(field => field.style.borderBottom='2px solid #c9a23e');
    fields.forEach(field => {
      const errorMessage = field.nextElementSibling;
      field.classList.remove('error');
      errorMessage.classList.remove('active');
      if(field.tagName.toLowerCase()==='textarea') errorMessage.textContent='Please leave a message';
    });
  }
});
g