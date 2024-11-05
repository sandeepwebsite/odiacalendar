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
        9: { 31: { en: "Halloween", or: "ହେଲୋୱିନ୍" }},
        10: { 14: { en: "Diwali", or: "ଦୀପାବଳି" }, 14: { en: "Children's Day", or: "ଶିଶୁ ଦିବସ" }},
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

const selectMonth = document.getElementById('select_month');
const selectYear = document.getElementById('select_year');
const calendarDays = document.getElementById('calendar_days');
const calendarDates = document.getElementById('calendar_dates');
const eventList = document.getElementById('eventList');
const translateBtn = document.getElementById('translate_btn');

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let isOdia = true; // Flag for language state

const monthNames = {
    odia: ['ଜାନୁଆରୀ', 'ଫେବୃଆରୀ', 'ମାର୍ଚ୍ଚ', 'ଏପ୍ରିଲ୍', 'ମେ', 'ଜୁନ୍', 'ଜୁଲାଇ', 'ଅଗଷ୍ଟ', 'ସେପ୍ଟେମ୍ବର', 'ଅକ୍ଟୋବର', 'ନଭେମ୍ବର', 'ଡିସେମ୍ବର'],
    english: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
};

const dayNames = {
    odia: ['ରବି', 'ସୋମ', 'ମଙ୍ଗଳ', 'ବୁଧ', 'ଗୁରୁ', 'ଶୁକ୍ର', 'ଶନି'],
    english: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
};

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

    for (let year = 2024; year <= 2026; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        selectYear.appendChild(option);
    }
}

// Populate day names
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

// Display events for the selected month in the chosen language
function displayEvents(year, month) {
    eventList.innerHTML = '';
    const events = monthEvents[year] && monthEvents[year][month];
    
    if (events) {
        for (const [day, eventObj] of Object.entries(events)) {
            const eventItem = document.createElement('li');
            const daySpan = document.createElement('span');
            daySpan.textContent = day;
            const eventSpan = document.createElement('span');
            eventSpan.textContent = isOdia ? eventObj.or : eventObj.en;
            eventItem.append(daySpan, eventSpan);
            eventList.appendChild(eventItem);
        }
    } else {
        const noEvents = document.createElement('li');
        noEvents.textContent = isOdia ? 'ଏହି ମାସରେ କୌଣସି ଘଟଣା ନାହିଁ |' : 'No events this month.';
        eventList.appendChild(noEvents);
    }
}

// Generate calendar dates
const odiaDigits = ['୦', '୧', '୨', '୩', '୪', '୫', '୬', '୭', '୮', '୯'];

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
    console.log(todayDay);
    document.getElementById("fullcalendardate").innerHTML = todayDay;
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

// Switch month function
function switchMonth(direction) {
    if (direction === -1) {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11; // December
            currentYear--;
        }
    } else if (direction === 1) {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0; // January
            currentYear++;
        }
    }
    generateDates();
}

// Switch language
function switchLanguage() {
    isOdia = !isOdia;
translateBtn.textContent = isOdia ? 'English' : 'ଓଡ଼ିଆ';
    populateMonthYear();
    populateDayNames();
    generateDates();
}

// Event listeners
document.getElementById('prev_month').addEventListener('click', () => switchMonth(-1));
document.getElementById('next_month').addEventListener('click', () => switchMonth(1));
document.getElementById('curr_month').addEventListener('click', () => {
    currentMonth = new Date().getMonth();
    currentYear = new Date().getFullYear();
    generateDates();
});
selectMonth.addEventListener('change', () => {
    currentMonth = parseInt(selectMonth.value);
    generateDates();
});
selectYear.addEventListener('change', () => {
    currentYear = parseInt(selectYear.value);
    generateDates();
});
translateBtn.addEventListener('click', switchLanguage);

// Initial setup
populateMonthYear();
populateDayNames();
generateDates();



$(document).ready(function(){
  $("#fullcalendarIcon").click(function(){
    $("#calendar").css("display", "none");
    $(".event").css("display", "none");
  });
});

