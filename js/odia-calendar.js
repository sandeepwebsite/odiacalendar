const odiaDigits = ['୦', '୧', '୨', '୩', '୪', '୫', '୬', '୭', '୮', '୯'];
// Saka Calendar Conversion Logic
function gregorianToSaka(date) {
    const sakaEpochStart = new Date('March 20, 2024');  // Chaitra 1 (22 march) of the Saka year (approx.)
    const diffTime = date - sakaEpochStart;  // Difference between the given date and the Saka Epoch
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));  // Convert diffTime to days

    // Approximation of Saka year and month
    const sakaYear = 1946 + Math.floor(diffDays / 365); // Calculate Saka Year based on the days difference
    const sakaMonth = Math.floor((diffDays % 365) / 30)  // Approximate month (30 days per month)
    const sakaDay = (diffDays % 365) % 30 === 0 ? 30 : (diffDays % 365) % 30;  // Calculate the day within the month
    // tithi = day % 15 === 0 ? 15 : day % 15;

    return { sakaYear, sakaMonth, sakaDay };
}

// Convert numeric month to Saka month name
function getSakaMonthName(monthIndex) {
    const sakaMonthNames = [
        'ଚୈତ୍ର', 'ୱୈଶାଖ', 'ଜ୍ୟେଷ୍ଠ', 'ଆଷାଢ', 'ଶ୍ରାବଣ', 'ଭାଦ୍ରବ',
        'ଆଶ୍ୱିନ', 'କାର୍ତ୍ତିକ', 'ମାର୍ଗଶିର', 'ପୌଷ', 'ମାଘ', 'ଫଗୁଣ'
    ];
    return sakaMonthNames[monthIndex];
}

// Event data structure for various years and months
const monthEvents = {
    2024: {
        0: { 15: { en: "Makar Sankranti/Pongal", or: "ମକର ସଂକ୍ରାନ୍ତି/ପୋଙ୍ଗାଲ୍" }, 26: { en: "Republic Day", or: "ଗଣତନ୍ତ୍ର ଦିବସ" }},
        2: { 8: { en: "Maha Shivaratri", or: "ମହା ଶିବରାତ୍ରି" }, 20: { en: "Holi Festival", or: "ହୋଲି ପର୍ବ" }},
        3: { 22: { en: "Earth Day", or: "ପୃଥିବୀ ଦିବସ" }},
        4: { 1: { en: "Labor Day", or: "ଶ୍ରମିକ ଦିବସ" }},
        5: { 5: { en: "World Environment Day", or: "ବିଶ୍ବ ପରିବେଶ ଦିବସ" }},
        6: { 4: { en: "Independence Day", or: "ସ୍ଵାଧୀନତା ଦିବସ" }},
        7: { 1: { en: "Friendship Day", or: "ମିତ୍ରତା ଦିବସ" }},
        8: { 5: { en: "Teacher's Day", or: "ଶିକ୍ଷକ ଦିବସ" }},
        9: { 31: { en: "Diwali", or: "ଦୀପାବଳି" }},
        10: { 
            // 1: { en: "Diwali", or: "ଦୀପାବଳି" }, 
            // 14: { en: "Children's Day", or: "ଶିଶୁ ଦିବସ" },

                1: { en: "Kartika Amabasya 2024", or: "କାର୍ତ୍ତିକ  ଅମାବାସ୍ୟା" },
                2: { en: "Gobardhan Puja", or: "ଗୋବର୍ଦ୍ଧନ ପୂଜା"},
                3: { en: "Bhatru Ditiya", or: "ଭାତୃ ଦ୍ଵିତୀୟା ଓ ଚନ୍ଦ୍ରଦର୍ଶନ" },
                5: { en: "Naga Chaturthi Brata 2024", or: "ନାଗ ଚତୁର୍ଥୀ ବ୍ରତ" },
                8: { en: "Solasasana Ambruta Mahoni Bhoga", or: "ଷୋଳଶାସନ ଅମୃତ ମଣୋହି ଭୋଗ" },
                9: { en: "Gosthastami 2024", or: "ଗୋଷ୍ଠାଷ୍ଟମୀ" },
                10: { en: "Anla Nabami and Jagatdhatri Puja", or: "ଅଁଳା ନବମୀ, ଶ୍ରୀ ରାଧାଙ୍କ ପାଦ ଦର୍ଶନ ଓ ଜଗଦ୍ଧାତ୍ରୀ ପୂଜା" },
                12: { en: "Debo Uthana Akadasi, Bhisma Panchaka Brata", or: "ଦେବେ।ତ୍ଅ।ପନ (ବଡ଼) ଏକାଦଶୀ, ଭୀଷ୍ମ ପଞ୍ଚକ ବ୍ରତ, ଶରଣ ଶେଷ ଓ ହଳ ନିଷେଧ" },
                13: { en: "Garuda Dwadasi 2024, Tulasi Bibah", or: "ଗରୁଡ଼ ଦ୍ଵାଦଶୀ ଓ ତୁଳସୀ ବିବାହ" },
                14: { en: "Badaosa 2024, Bada Osa 2024, Sisu Sibasa, Neheru Jayanti", or: "ବଡ଼ଓଷା, ଶିବୋଧପନ, ବୈକୁଣ୍ଠ ଚତୁର୍ଦ୍ଦଶୀ, ଶିଶୁ ଦିବସ(ନେହେରୁଙ୍କ ଜୟନ୍ତୀ)" },
                15: { en: "Rasa Purnima 2024, Bali Jatra 2024, Kartikeswar Puja, Kartika Brata Samapana, Kedara Brata", or: "ରାସ ପୂର୍ଣ୍ଣିମା, ବାଲିଯାତ୍ରା, କାର୍ତ୍ତିକେଶ୍ୱର ପୂଜା, କାର୍ତ୍ତିକ ବ୍ରତ ସମାପନ, ଚନ୍ଦ୍ରପୂଜା ଓ କେଦାର ବ୍ରତ" },
                16: { en: "Bichha Sankranti, Chadakhai 2024", or: "ବିଛା ସଂକ୍ରାନ୍ତି, ଛାଡ଼ଖାଇ ଓ ହ.ନି" },
                20: { en: "Sita Bibah", or: "ସୀତା ବିବାହ ଓ ଶ୍ରୀକ୍ଷେତ୍ର ପରିକ୍ରମା" },
                21: { en: "Margasira Gurubar Osa 2024", or: "ମାର୍ଗଶୀର ଗୁରୁବାର ଓଷା" },
                23: { en: "Prathamastami 2024", or: "ପ୍ରଥମାଷ୍ଟମୀ" },
                24: { en: "Kanjianla Nabami 2024", or: "କାଞ୍ଜିଅଁଳା ନବମୀ" },
                26: { en: "Upasana Ekadasi", or: "ଉତ୍ପନ୍ନା ଏକାଦଶୀ, ଉପବାସ ଓ ହ. ନି"},
                28: { en: "Manabasa Osha", or: "ମାଣବସା ଗୁରୁବାର ଓଷା"},
                29: { en: "Shivachaturdasi Upasana", or: "ଶିବଚତୁର୍ଦ୍ଦଶୀ ଉପବାସ"},
                30: { en: "Debadipapali arambha", or: "ଦେବଦୀପାବଳୀ ଆରମ୍ଭ, ଚନ୍ଦ୍ରକ୍ଷୟ ଓ ଦଳ ନିଷେଧ"}




            // 20: { en: "Special Event 1", or: "ବିଶେଷ ଘଟଣା 1" },
            // 22: { en: "Special Event 2", or: "ବିଶେଷ ଘଟଣା 2" }
        },
        11: { 25: { en: "Christmas", or: "ବଡ଼ଦିନ" }, 31: { en: "New Year's Eve", or: "ନୂତନ ବର୍ଷ ପୂର୍ବସନ୍ଧ୍ୟା" }}
    },
    2025: {
        0: { 15: { en: "Makar Sankranti/Pongal", or: "ମକର ସଂକ୍ରାନ୍ତି/ପୋଙ୍ଗାଲ୍" }, 26: { en: "Republic Day", or: "ଗଣତନ୍ତ୍ର ଦିବସ" }},
        2: { 8: { en: "Maha Shivaratri", or: "ମହା ଶିବରାତ୍ରି" }, 20: { en: "Holi Festival", or: "ହୋଲି ପର୍ବ" }},
        3: { 22: { en: "Earth Day", or: "ପୃଥିବୀ ଦିବସ" }},
        4: { 1: { en: "Labor Day", or: "ଶ୍ରମିକ ଦିବସ" }},
        5: { 5: { en: "World Environment Day", or: "ବିଶ୍ବ ପରିବେଶ ଦିବସ" }},
        6: { 4: { en: "Independence Day", or: "ସ୍ଵାଧୀନତା ଦିବସ" }},
        7: { 1: { en: "Friendship Day", or: "ମିତ୍ରତା ଦିବସ" }},
        8: { 5: { en: "Teacher's Day", or: "ଶିକ୍ଷକ ଦିବସ" }},
        9: { 31: { en: "Halloween", or: "ହେଲୋୱିନ୍" }},
        10: { 14: { en: "Diwali", or: "ଦୀପାବଳି" }, 14: { en: "Children's Day", or: "ଶିଶୁ ଦିବସ" }},
        11: { 25: { en: "Christmas", or: "ବଡ଼ଦିନ" }, 31: { en: "New Year's Eve", or: "ନୂତନ ବର୍ଷ ପୂର୍ବସନ୍ଧ୍ୟା" }}
    }
};



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

const selectMonth = document.getElementById('select_month');
const selectYear = document.getElementById('select_year');
const calendarDays = document.getElementById('calendar_days');
const calendarDates = document.getElementById('calendar_dates');
const eventList = document.getElementById('eventList');
const translateBtn = document.getElementById('translate_btn');

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

    for (let year = 2024; year <= 2025; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        selectYear.appendChild(option);
    }
}

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

function displayEvents(year, month) {
    eventList.innerHTML = '';
    const events = monthEvents[year] && monthEvents[year][month];

    if (events) {
        for (const [day, eventObj] of Object.entries(events)) {
            const eventItem = document.createElement('div');
            const daySpan = document.createElement('span');
            daySpan.textContent = day;
            const eventSpan = document.createElement('p');
            eventSpan.textContent = isOdia ? eventObj.or : eventObj.en;
            eventItem.append(daySpan, eventSpan);
            eventList.appendChild(eventItem);
        }
    } else {
        const noEvents = document.createElement('div');
        noEvents.textContent = isOdia ? 'ଏହି ମାସରେ କୌଣସି ଘଟଣା ନାହିଁ |' : 'No events this month.';
        eventList.appendChild(noEvents);
    }
}

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

    // Calculate the Saka date for today
    const { sakaYear, sakaMonth, sakaDay } = gregorianToSaka(today);
    const paksha = getPaksha(sakaDay);
    const tithi = getTithi(sakaDay + 1); // Calculate Tithi (lunar day)
 
 // on 30days of month sakamonth will -1
    if (sakaDay === 30) {
        sakaMonthl = sakaMonth - 1;
    } else {
        sakaMonthl = sakaMonth;
    }

// Function to calculate the Paksha (Shukla or Krishna)
function getPaksha(day) {
    if (day <= 15) {
        return 'କୃଷ୍ଣ ପକ୍ଷ,'; // Waxing phase
    } else {
        return 'ଶୁକ୍ଳ ପକ୍ଷ,'; // Waning phase
    }
}

function getTithi(day) {
    const tithi = day % 15 === 0 ? 15 : day % 15; // If it's 15th day, Tithi is 15


// const numbersInWords = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

const numbersInWords = [
    "ପ୍ରଥମି",    // First
    "ଦ୍ଵିତୀୟା",   // Second
    "ତୃତୀୟା",    // Third
    "ଚତୁର୍ଥୀ",   // Fourth
    "ପଞ୍ଚମୀ",    // Fifth
    "ଷଷ୍ଠୀ",     // Sixth
    "ସପ୍ତମୀ",    // Seventh
    "ଅଷ୍ଟମୀ",    // Eighth
    "ନବମୀ",      // Ninth
    "ଦଶମୀ",      // Tenth
    "ଏକାଦଶୀ",   // Eleventh
    "ଦ୍ୱାଦଶୀ",   // Twelfth
    "ତ୍ରୟୋଦଶୀ", // Thirteenth
    "ଚତୁର୍ଦୋଶୀ", // Fourteenth
    "ପାଞ୍ଚଦଶୀ"
];

function numberToWord(number) {
    // Check if the number is within the valid range (1 to 9)
    if (number >= 1 && number <= 15) {
        if (tithi === 1) {
            return numbersInWords[number - 1];
        }
        return numbersInWords[number - 2];  // Adjust index for 0-based array
    } else {
        return 'Number out of range';
    }
}
// alert(sakaDay);

// let x = tithi;
const inputNumber = tithi;
const purnima = day - 1;
    if (purnima === 30) {
            document.getElementById("demo").innerHTML = "ପୂର୍ଣ୍ଣିମା ତିଥି";
    }
    else if (purnima === 15){
            document.getElementById("demo").innerHTML = "ଅମାବାସ୍ୟା ତିଥି";
    }
    else{
            document.getElementById("demo").innerHTML = numberToWord(inputNumber) + " ତିଥି";
    }
        return tithi;
    }
//translate sakaDay & sakaYear into odia 
const OdiaSakaYear = sakaYear;
const OdiaSakaDay = sakaDay;
const englishDigits = '0123456789';
const odiaDigits = '୦୧୨୩୪୫୬୭୮୯';

    function translateNumberToOdia(number) {
        let translatedNumber = '';
        const numberString = number.toString();

        for (let char of numberString) {
            const index = englishDigits.indexOf(char);
            translatedNumber += (index !== -1) ? odiaDigits[index] : char;
        }

        return translatedNumber;
    }

// Update the Saka Date in the header
document.getElementById("saka-calendar-date").textContent = `${translateNumberToOdia(OdiaSakaYear)}ଶତାବ୍ଦ,${getSakaMonthName(sakaMonthl)} ମାସ,${translateNumberToOdia(OdiaSakaDay)} ଦିନ, ${paksha}`;

    for (let i = 0; i < firstDayOfWeek; i++) {
        const emptyCell = document.createElement('div');
        calendarDates.appendChild(emptyCell);
    }

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
        if (monthEvents[currentYear] && monthEvents[currentYear][currentMonth] && monthEvents[currentYear][currentMonth][day]) {
            dayCell.classList.add('event-date');
            dayCell.title = isOdia ? monthEvents[currentYear][currentMonth][day].or : monthEvents[currentYear][currentMonth][day].en;
        }
        calendarDates.appendChild(dayCell);
    }

    displayEvents(currentYear, currentMonth);
}

function switchLanguage() {
    isOdia = !isOdia;
    translateBtn.textContent = isOdia ? 'English' : 'ଓଡ଼ିଆ';
    populateMonthYear();
    populateDayNames();
    generateDates();
}

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
    currentMonth = e.target.value;
    generateDates();
});

selectYear.addEventListener('change', (e) => {
    currentYear = e.target.value;
    generateDates();
});

// Initialize the calendar
populateMonthYear();
populateDayNames();
generateDates();

$(document).ready(function(){
  $("#fullcalendarIcon").click(function(){
    $("#calendar").css("display", "none");
    $(".event").css("display", "none");
  });
});
