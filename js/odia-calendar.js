/***********************
 * Odia Calendar + Correct Tithi (integrated)
 ***********************/

// Odia digits (global, single source)
const odiaDigits = ['୦', '୧', '୨', '୩', '୪', '୫', '୬', '୭', '୮', '୯'];

/* ---------------------------
   Astronomy utilities (approx.)
   Used to compute real lunar Tithi by Sun–Moon longitude difference
----------------------------*/

// Convert Gregorian date to Julian Day
function toJulianDay(year, month, day) {
    if (month <= 2) { year -= 1; month += 12; }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (year + 4716)) +
           Math.floor(30.6001 * (month + 1)) +
           day + B - 1524.5;
}

// Normalize angle to 0–360°
function normalizeAngle(angle) {
    return (angle % 360 + 360) % 360;
}

// Sun apparent longitude (deg) — simplified
function sunLongitude(jd) {
    const T = (jd - 2451545.0) / 36525;
    const L0 = normalizeAngle(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
    const M  = normalizeAngle(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
    const C  = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M * Math.PI / 180)
             + (0.019993 - 0.000101 * T) * Math.sin(2 * M * Math.PI / 180)
             + 0.000289 * Math.sin(3 * M * Math.PI / 180);
    return normalizeAngle(L0 + C);
}

// Moon ecliptic longitude (deg) — simplified
function moonLongitude(jd) {
    const T  = (jd - 2451545.0) / 36525;
    const L0 = normalizeAngle(218.3164477 + 481267.88123421 * T);
    const M  = normalizeAngle(134.9633964 + 477198.8675055 * T); // Moon anomaly
    const D  = normalizeAngle(297.8501921 + 445267.1114034 * T); // Elongation
    const F  = normalizeAngle(93.272095 + 483202.0175233 * T);   // Argument of latitude

    const lon = L0
      + 6.289 * Math.sin(M * Math.PI / 180)
      - 1.274 * Math.sin((2 * D - M) * Math.PI / 180)
      + 0.658 * Math.sin(2 * D * Math.PI / 180)
      - 0.214 * Math.sin(2 * M * Math.PI / 180)
      - 0.11  * Math.sin(F * Math.PI / 180);

    return normalizeAngle(lon);
}

const tithiNamesOdia = [
    "ପ୍ରଥମୀ","ଦ୍ଵିତୀୟା","ତୃତୀୟା","ଚତୁର୍ଥୀ","ପଞ୍ଚମୀ",
    "ଷଷ୍ଠୀ","ସପ୍ତମୀ","ଅଷ୍ଟମୀ","ନବମୀ","ଦଶମୀ",
    "ଏକାଦଶୀ","ଦ୍ୱାଦଶୀ","ତ୍ରୟୋଦଶୀ","ଚତୁର୍ଦଶୀ","ପୂର୍ଣ୍ଣିମା",
    "ପ୍ରଥମୀ","ଦ୍ଵିତୀୟା","ତୃତୀୟା","ଚତୁର୍ଥୀ","ପଞ୍ଚମୀ",
    "ଷଷ୍ଠୀ","ସପ୍ତମୀ","ଅଷ୍ଟମୀ","ନବମୀ","ଦଶମୀ",
    "ଏକାଦଶୀ","ଦ୍ୱାଦଶୀ","ତ୍ରୟୋଦଶୀ","ଚତୁର୍ଦଶୀ","ଅମାବାସ୍ୟା"
];

// Compute real Tithi for a given Gregorian date (local midnight approx.)
function calculateTithi(date) {
    // Using local date at noon to reduce boundary flips within the day
    const local = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
    const jd = toJulianDay(local.getFullYear(), local.getMonth() + 1, local.getDate());
    const sunLon  = sunLongitude(jd);
    const moonLon = moonLongitude(jd);
    const angle   = normalizeAngle(moonLon - sunLon);       // 0..360
    const tithi   = Math.floor(angle / 12) + 2;             // 1..30
    const paksha  = (tithi <= 15) ? 'ଶୁକ୍ଳପକ୍ଷ' : 'କୃଷ୍ଣପକ୍ଷ'; // Shukla (waxing), Krishna (waning)
    return { tithi, paksha, name: tithiNamesOdia[tithi - 1] };
}

/* ---------------------------
   Saka Calendar Conversion Logic (kept approx. as in your code)
----------------------------*/
function gregorianToSaka(date) {
    // Your original approach (approx). Keeping base close to your comment.
    const sakaEpochStart = new Date('March 20, 2025');  // Chaitra 1 (approx.)
    const diffTime = date - sakaEpochStart;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Approximation of Saka year and month
    const sakaYear  = 1947 + Math.floor(diffDays / 365); // kept per your code
    const sakaMonth = Math.floor((diffDays % 365) / 30); // 0..11 approx
    const dayInYear = (diffDays % 365 + 365) % 365;
    const sakaDayRaw = dayInYear % 30;                   // 0..29
    const sakaDay = (sakaDayRaw === 0) ? 30 : sakaDayRaw;

    return { sakaYear, sakaMonth, sakaDay };
}

// Convert numeric month to Saka month name
function getSakaMonthName(monthIndex) {
    const sakaMonthNames = [
        'ଚୈତ୍ର', 'ୱୈଶାଖ', 'ଜ୍ୟେଷ୍ଠ', 'ଆଷାଢ', 'ଶ୍ରାବଣ', 'ଭାଦ୍ରବ',
        'ଆଶ୍ୱିନ', 'କାର୍ତ୍ତିକ', 'ମାର୍ଗଶିର', 'ପୌଷ', 'ମାଘ', 'ଫଗୁଣ'
    ];
    return sakaMonthNames[monthIndex] ?? '';
}

/* ---------------------------
   Event data (your original, plus fixes)
----------------------------*/
const monthEvents = {
    2026: {
            0: {
                6:  { en: "Guru Govind Singh Birthday", or: "ଗୁରୁ ଗୋବିନ୍ଦ ସିଂହ ଜୟନ୍ତୀ" },
                14: { en: "Makar Sankranti", or: "ମକର ସଂକ୍ରାନ୍ତି" },
                23: { en: "Subash Chandra Bose Jayanti / Vir Surendra Sai Jayanti / Basanta Panchami", or: "ସୁବାସ ଚନ୍ଦ୍ର ବୋସ ଜୟନ୍ତୀ / ବୀର ସୁରେନ୍ଦ୍ର ସାଈ ଜୟନ୍ତୀ / ବସନ୍ତ ପଞ୍ଚମୀ" },
                26: { en: "Republic Day", or: "ଗଣତନ୍ତ୍ର ଦିବସ" }
            },

            2: {
                17: { en: "Sab-e-Qadr", or: "ଶବେ-କଦର" }
            },

            2: {   // March
                3:  { en: "Dola Purnima", or: "ଡୋଳା ପୂର୍ଣ୍ଣିମା" },
                4:  { en: "Holi", or: "ହୋଲି" },
                17: { en: "Sab-e-Qadr", or: "ଶବେ-କଦର" },
                21: { en: "Id-Ul-Fitre", or: "ଇଦ୍-ଉଲ୍-ଫିତର" },
                27: { en: "Shree Ram Nabami", or: "ଶ୍ରୀ ରାମ ନବମୀ" }
            },

            3: {
                1:  { en: "Utkal Divas", or: "ଉତ୍କଳ ଦିବସ" },
                3:  { en: "Good Friday", or: "ଗୁଡ୍ ଫ୍ରାଇଡେ" },
                4:  { en: "Easter Saturday", or: "ଇଷ୍ଟର ଶନିବାର" }
            },

            3: {
                14: { en: "Mahabishuba Sankranti / Dr. B. R. Ambedkar Jayanti", or: "ମହାବିଷୁବ ସଂକ୍ରାନ୍ତି / ଡଃ ବି.ଆର୍. ଅମ୍ବେଦକର ଜୟନ୍ତୀ" }
            },

            4: {
                1:  { en: "Budha Purnima / Birthday of Pandit Raghunath Murmu", or: "ବୁଦ୍ଧ ପୂର୍ଣ୍ଣିମା / ପଣ୍ଡିତ ରଘୁନାଥ ମୁର୍ମୁ ଜନ୍ମଦିନ" },
                16: { en: "Sabitri Amabasya", or: "ସାବିତ୍ରୀ ଅମାବାସ୍ୟା" },
                22: { en: "Birthday of Raja Ram Mohan Roy", or: "ରାଜା ରାମମହନ ରାୟ ଜନ୍ମଦିନ" },
                27: { en: "Id-ul-Zuha", or: "ଇଦ୍-ଉଲ୍-ଜୁହା" }
            },

            5: {
                15: { en: "Raja Sankranti", or: "ରଜ ସଂକ୍ରାନ୍ତି" },
                26: { en: "Muharram", or: "ମୁହର୍ରମ" }
            },

            6: {
                16: { en: "Ratha Yatra", or: "ରଥଯାତ୍ରା" },
                24: { en: "Bahuda Yatra", or: "ବହୁଦା ଯାତ୍ରା" }
            },

            7: {
                15: { en: "Independence Day", or: "ସ୍ଵାଧୀନତା ଦିବସ" },
                20: { en: "Foundation Day of Brahma Samaj", or: "ବ୍ରହ୍ମ ସମାଜ ପ୍ରତିଷ୍ଠା ଦିବସ" },
                26: { en: "Birthday of Prophet Mohammad", or: "ପୈଗମ୍ବର ମହମ୍ମଦଙ୍କ ଜନ୍ମଦିନ" },
                27: { en: "Jhulana Purnima", or: "ଝୁଲଣ ପୂର୍ଣ୍ଣିମା" }
            },

            8: {
                4:  { en: "Janmastami", or: "ଜନ୍ମାଷ୍ଟମୀ" },
                14: { en: "Ganesh Puja", or: "ଗଣେଶ ପୂଜା" },
                15: { en: "Nuakhai", or: "ନୂଆଖାଇ" },
                16: { en: "Day following Nuakhai", or: "ନୂଆଖାଇ ପରଦିନ" }
            },

            9: {
                2:  { en: "Gandhi Jayanti", or: "ଗାନ୍ଧୀ ଜୟନ୍ତୀ" },
                17: { en: "Maha Saptami", or: "ମହା ସପ୍ତମୀ" },
                19: { en: "Maha Nabami", or: "ମହା ନବମୀ" },
                20: { en: "Vijaya Dashami", or: "ବିଜୟା ଦଶମୀ" }
            },

            10: {
                18: { en: "Anla Nabami", or: "ଅଁଳା ନବମୀ" },
                24: { en: "Rasa Purnima", or: "ରାସ ପୂର୍ଣ୍ଣିମା" }
            },

            11: {
                1:  { en: "Prathamastami", or: "ପ୍ରଥମାଷ୍ଟମୀ" },
                24: { en: "Christmas Eve", or: "ବଡଦିନ ପୂର୍ବସନ୍ଧ୍ୟା" },
                25: { en: "Christmas Day", or: "ବଡଦିନ" }
            }

    },
    2025: {
        0: {
            1:  { en: "New Year 2025, ditiyara chandra darsana, sarana arambha", or: "ଇଂରାଜୀ ନୂତନ ବର୍ଷ ସନ 2025 ମସିହା ପ୍ରବେଶ ଆରମ୍ଭ, ଦ୍ୱିତୀୟର ଚନ୍ଦ୍ର ଦର୍ଶନ, ଶରଣ ଆରମ୍ଭ"},
            5:  { en: "sarana sesa", or: "ଶରଣ ଶେଷ"},
            9:  { en: "shaambadasami o sudashaa brata", or: "ଶାମ୍ବଦଶମୀ ଓ ସୁଦଶା ବ୍ରତ"},
            10: { en: "putrada ekaadasi upabasa o hala nisedha", or: "ପୁତ୍ରଦା ଏକାଦଶୀ ଉପବାସ ଓ ହଳନିଷେଧ"},
            12: { en: "swami bibekananda jayantee, sibachaturdasi upabasa o bedhaa parikramaa", or: "ସ୍ୱାମୀ ବିବେକାନନ୍ଦ ଜୟନ୍ତୀ, ଶିବଚତୁର୍ଦଶୀ ଉପବାସ ଓ ବେଢ଼ା ପରିକ୍ରମା"},
            13: { en: "pousa purnimaa, chandra puja, mahodadhi arati, nabanka bedhaa, masaanta", or: "ପୌଷ ପୂର୍ଣ୍ଣିମା, ଚନ୍ଦ୍ର ପୂଜା, ମହୋଦଧି ଆରତୀ, ନବଙ୍କ ବେଢ଼ା, ମାସାନ୍ତ"},
            14: { en: "uttarayana makara sankranti, pongala, maghabratarambha o hala nisedha", or: "ଉତ୍ତରାୟଣ ମକର ସଂକ୍ରାନ୍ତି, ପୋଙ୍ଗଲ, ମାଘବ୍ରତାରମ୍ଭ ଓ ହଳନିଷେଧ"},
            15: { en: "pusya bhiseka o rajaa bhiseka", or: "ପୁଷ୍ୟା ଭିଷେକ ଓ ରାଜା ଭିଷେକ"},
            23: { en: "netaji subaasa chandra bosanka jayantee", or: "ନେତାଜୀ ସୁବାଷ ଚନ୍ଦ୍ର ବୋଷଙ୍କ ଜୟନ୍ତୀ"},
            25: { en: "sat tila ekaadasi upabasa, olasunni mela, hala nisedha", or: "ଷଟ୍ ତିଳା ଏକାଦଶୀ ଉପବାସ, ଓଳାଶୁଣୀ ମେଳା, ହଳନିଷେଧ"},
            26: { en: "Republic Day", or: "ସାଧାରଣତନ୍ତ୍ର ଦିବସ"},
            27: { en: "ratantee kalika puja", or: "ରଟନ୍ତୀ କାଳୀକ ପୂଜା"},
            28: { en: "siba chaturdasi upabasa o bedhaa parikramaa, ratantee chaturdasi, chandra kshya, nishipalana, sarana arambha, sabe-merage (purbaratri)", or: "ଶିବ ଚତୁର୍ଦଶୀ ଉପବାସ ଓ ବେଢ଼ା ପରିକ୍ରମା, ରଟନ୍ତୀ ଚତୁର୍ଦଶୀ, ଚନ୍ଦ୍ର କ୍ଷୟ, ନିଶିପାଳନ, ଶରଣ ଆରମ୍ଭ, ସବେ-ମେରେଜ (ପୂର୍ବରାତ୍ରି)"},
            29: { en: "tribeni amaabasya, maa biraja debinkara janmobaschaba, hallanisedha", or: "ତ୍ରିବେଣୀ ଅମାବାସ୍ୟା, ମା ବିରଜା ଦେବୀଙ୍କର ଜନ୍ମୋବତ୍ସବ, ହଳନିଷେଧ"},
            30: { en: "ditiyaara chandra darsana puja o upabasa, mahatmagandhinka tirodhana dibasa", or: "ଦ୍ୱିତୀୟାର ଚନ୍ଦ୍ର ଦର୍ଶନ ପୂଜା ଓ ଉପବାସ, ମହାତ୍ମାଗାନ୍ଧୀଙ୍କ ତିରୋଧାନ ଦିବସ"}
        },
        2: { 8: { en: "Maha Shivaratri", or: "ମହା ଶିବରାତ୍ରି" }, 20: { en: "Holi Festival", or: "ହୋଲି ପର୍ବ" }},
        3: { 22: { en: "Earth Day", or: "ପୃଥିବୀ ଦିବସ" }},
        4: { 1: { en: "Labor Day", or: "ଶ୍ରମିକ ଦିବସ" }},
        5: { 5: { en: "World Environment Day", or: "ବିଶ୍ବ ପରିବେଶ ଦିବସ" }},
        6: { 4: { en: "Independence Day", or: "ସ୍ଵାଧୀନତା ଦିବସ" }},
        7: { 1: { en: "Friendship Day", or: "ମିତ୍ରତା ଦିବସ" }},
        8: { 5: { en: "Teacher's Day", or: "ଶିକ୍ଷକ ଦିବସ" }},
        9: { 31: { en: "Halloween", or: "ହେଲୋୱିନ୍" }},
        // FIX: day 14 had duplicate keys; now we store both as an array and handle in UI
        10: { 14: { en: "Children's Day", or: "ଶିଶୁ ଦିବସ" }},
        11: { 25: { en: "Christmas", or: "ବଡ଼ଦିନ" }, 31: { en: "New Year's Eve", or: "ନୂତନ ବର୍ଷ ପୂର୍ବସନ୍ଧ୍ୟା" }}
    }
};

/* ---------------------------
   Globals & dictionaries (your originals)
----------------------------*/
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let isOdia = true;  // Flag for language toggle

const monthNames = {
    odia: ['ଜାନୁଆରୀ', 'ଫେବୃଆରୀ', 'ମାର୍ଚ୍ଚ', 'ଏପ୍ରିଲ୍', 'ମେ', 'ଜୁନ୍', 'ଜୁଲାଇ', 'ଅଗଷ୍ଟ', 'ସେପ୍ଟେମ୍ବର', 'ଅକ୍ଟୋବର', 'ନଭେମ୍ବର', 'ଡିସେମ୍ବର'],
    english: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
};

const dayNames = {
    odia: ['ରବି', 'ସୋମ', 'ମଙ୍ଗଳ', 'ବୁଧ', 'ଗୁରୁ', 'ଶୁକ୍ର', 'ଶନି'],
    english: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
};

// DOM references (kept)
const selectMonth = document.getElementById('select_month');
const selectYear = document.getElementById('select_year');
const calendarDays = document.getElementById('calendar_days');
const calendarDates = document.getElementById('calendar_dates');
const eventList = document.getElementById('eventList');
const translateBtn = document.getElementById('translate_btn');

/* ---------------------------
   UI: populate months/years
----------------------------*/
function populateMonthYear() {
    selectMonth.innerHTML = '';
    selectYear.innerHTML = '';

    const currentMonthNames = isOdia ? monthNames.odia : monthNames.english;

    currentMonthNames.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = month;
        selectMonth.appendChild(option);
    });

    // Keep your 2025–2026 range
    for (let year = 2025; year <= 2026; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        selectYear.appendChild(option);
    }
}

/* ---------------------------
   UI: day headers
----------------------------*/
function populateDayNames() {
    calendarDays.innerHTML = '';
    const currentDayNames = isOdia ? dayNames.odia : dayNames.english;

    currentDayNames.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day-name');
        dayElement.textContent = day;
        calendarDays.appendChild(dayElement);
    });
}

/* ---------------------------
   UI: events list panel
----------------------------*/
function displayEvents(year, month) {
    eventList.innerHTML = '';
    const events = monthEvents[year] && monthEvents[year][month];

    if (events) {
        // Sort by numeric day
        const entries = Object.entries(events).sort((a,b)=> Number(a[0]) - Number(b[0]));
        for (const [day, eventVal] of entries) {
            const eventItem = document.createElement('div');
            const daySpan = document.createElement('span');
            daySpan.textContent = day;

            if (Array.isArray(eventVal)) {
                // Multiple events on same day
                eventVal.forEach(ev => {
                    const p = document.createElement('p');
                    p.textContent = isOdia ? ev.or : ev.en;
                    eventItem.appendChild(daySpan.cloneNode(true));
                    eventItem.appendChild(p);
                });
            } else {
                const eventSpan = document.createElement('p');
                eventSpan.textContent = isOdia ? eventVal.or : eventVal.en;
                eventItem.append(daySpan, eventSpan);
            }
            eventList.appendChild(eventItem);
        }
    } else {
        const noEvents = document.createElement('div');
        noEvents.textContent = isOdia ? 'ଏହି ମାସରେ କୌଣସି ଘଟଣା ନାହିଁ |' : 'No events this month.';
        eventList.appendChild(noEvents);
    }
}

/* ---------------------------
   Number translation helper (Odia digits)
----------------------------*/
function translateNumberToOdia(number) {
    const englishDigits = '0123456789';
    let translatedNumber = '';
    const numberString = number.toString();

    for (let char of numberString) {
        const index = englishDigits.indexOf(char);
        translatedNumber += (index !== -1) ? odiaDigits[index] : char;
    }
    return translatedNumber;
}

/* ---------------------------
   Calendar (dates grid) + Header info
----------------------------*/
function generateDates() {
    calendarDates.innerHTML = '';
    selectMonth.value = currentMonth;
    selectYear.value = currentYear;

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    // Calculate the Saka date for today (your original approx)
    const { sakaYear, sakaMonth, sakaDay } = gregorianToSaka(today);

    // Compute correct Tithi + Paksha for today
    const { tithi, paksha, name: tithiName } = calculateTithi(today);

    // on 30days of month sakamonth will -1 (keep your logic but scope-safe)
    let sakaMonthl = sakaMonth;
    if (sakaDay === 30) {
        sakaMonthl = sakaMonth - 1;
    }

    // Update the Saka Date in the header (ID must exist in your HTML)
    // Example: "1946 ଶତାବ୍ଦ, ଚୈତ୍ର ମାସ, ୧୫ ଦିନ, ଶୁକ୍ଳପକ୍ଷ"
    const sakaHeaderEl = document.getElementById("saka-calendar-date");
    if (sakaHeaderEl) {
        sakaHeaderEl.textContent = `${translateNumberToOdia(sakaYear)} ଶତାବ୍ଦ, ${getSakaMonthName(sakaMonthl)} ମାସ, ${translateNumberToOdia(sakaDay)} ଦିନ, ${paksha}`;
    }

    // Tithi label element (ID "demo" from your code)
    const tithiEl = document.getElementById("demo");
    if (tithiEl) {
        if (tithi === 15) {
            tithiEl.innerHTML = "ପୂର୍ଣ୍ଣିମା ତିଥି";
        } else if (tithi === 30) {
            tithiEl.innerHTML = "ଅମାବାସ୍ୟା ତିଥି";
        } else {
            tithiEl.innerHTML = `${tithiName} ତିଥି`;
        }
    }

    // Leading blanks for first week alignment
    for (let i = 0; i < firstDayOfWeek; i++) {
        const emptyCell = document.createElement('div');
        calendarDates.appendChild(emptyCell);
    }

    // Fill days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('date');

        const displayDay = isOdia
            ? day.toString().split('').map(digit => odiaDigits[digit]).join('')
            : day;

        dayCell.textContent = displayDay;

        const date = new Date(currentYear, currentMonth, day);
        if (date.getDay() === 0) dayCell.classList.add('sunday');
        if (day === todayDay && currentMonth === todayMonth && currentYear === todayYear)
            dayCell.classList.add('today');

        // Event highlight + tooltip (supports multiple events now)
        const evForMonth = monthEvents[currentYear] && monthEvents[currentYear][currentMonth];
        const evForDay   = evForMonth && evForMonth[day];

        if (evForDay) {
            dayCell.classList.add('event-date');
            if (Array.isArray(evForDay)) {
                dayCell.title = evForDay.map(e => (isOdia ? e.or : e.en)).join('\n');
            } else {
                dayCell.title = isOdia ? evForDay.or : evForDay.en;
            }
        }

        calendarDates.appendChild(dayCell);
    }

    displayEvents(currentYear, currentMonth);
}

/* ---------------------------
   Language toggle
----------------------------*/
function switchLanguage() {
    isOdia = !isOdia;
    translateBtn.textContent = isOdia ? 'English' : 'ଓଡ଼ିଆ';
    populateMonthYear();
    populateDayNames();
    generateDates();
}

/* ---------------------------
   Event listeners (kept)
----------------------------*/
document.getElementById('prev_month').addEventListener('click', () => {
    if (currentMonth === 0) {
        currentMonth = 11;
        currentYear--;
    } else {
        currentMonth--;
    }
    generateDates();
});

document.getElementById('next_month').addEventListener('click', () => {
    if (currentMonth === 11) {
        currentMonth = 0;
        currentYear++;
    } else {
        currentMonth++;
    }
    generateDates();
});

document.getElementById('curr_month').addEventListener('click', () => {
    currentMonth = new Date().getMonth();
    currentYear = new Date().getFullYear();
    generateDates();
});

translateBtn.addEventListener('click', switchLanguage);

selectMonth.addEventListener('change', (e) => {
    currentMonth = parseInt(e.target.value, 10); // ensure number
    generateDates();
});

selectYear.addEventListener('change', (e) => {
    currentYear = parseInt(e.target.value, 10); // ensure number
    generateDates();
});

/* ---------------------------
   Init
----------------------------*/
populateMonthYear();
populateDayNames();
generateDates();

/* ---------------------------
   jQuery bit you had (kept)
----------------------------*/
$(document).ready(function(){
  $("#fullcalendarIcon").click(function(){
    $("#calendar").css("display", "none");
    $(".event").css("display", "none");
  });
});
