document.addEventListener("DOMContentLoaded", function() {
    const selectMonth = document.getElementById('select_month');
    const selectYear = document.getElementById('select_year');
    const monthCalendar = document.getElementById('month-calendar');
    const eventsList = document.getElementById('events-list');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const currentMonthBtn = document.getElementById('currentMonth');
    const tabSelector = document.getElementById('tab_selector');

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    let currentTab = localStorage.getItem('currentTab') || 'bank';

    const today = new Date();

    /* ------------------------------------------
       HOLIDAY DATA (2025 + Empty 2026)
    ---------------------------------------------*/
    const holidayData = {
        bank: {
            2025: {
                0: { 15: "Makar Sankranti" },
                1: { 14: "Basanta Panchami" },
                2: { 8: "Maha Shivaratri", 26: "Holi", 29: "Good Friday" },
                3: { 1: "Annual Closing of Bank Accounts", 11: "Id-Ul-Fitre", 17: "Ram Navami" },
                5: { 15: "Raja Sankranti", 17: "Id-Ul-Zuha" },
                7: { 15: "Independence Day", 19: "Jhulana Purnima", 26: "Janmashtami" },
                8: { 7: "Ganesh Puja" },
                9: { 2: "Gandhi Jayanti", 11: "Maha Ashtami", 31: "Diwali" },
                10: { 15: "Rahas Purnima" },
                11: { 25: "X-Mas Day" }
            },
            2026: {
                1: {
                    10: "2nd Saturday Bank Holiday",
                    14: "Makara Sankranti",
                    23: "Vasant Panchami",
                    24: "4th Saturday Bank Holiday",
                    26: "Republic Day (National Holiday)"
                },

                2: {
                    14: "2nd Saturday Bank Holiday",
                    15: "Maha Shivaratri",
                    28: "4th Saturday Bank Holiday"
                },

                3: {
                    4: "Holi",
                    14: "2nd Saturday Bank Holiday",
                    21: "Eid-ul-Fitr",
                    27: "Sri Ramnavami"
                },

                4: {
                    1: "Annual Closing of Bank Account",
                    3: "Good Friday",
                    11: "2nd Saturday Bank Holiday",
                    25: "4th Saturday Bank Holiday"
                },

                5: {
                    9: "2nd Saturday Bank Holiday",
                    23: "4th Saturday Bank Holiday"
                },

                6: {
                    13: "2nd Saturday Bank Holiday",
                    15: "Raja Sankranti",
                    26: "Muharram",
                    27: "4th Saturday Bank Holiday"
                },

                7: {
                    11: "2nd Saturday Bank Holiday",
                    25: "4th Saturday Bank Holiday"
                },

                8: {
                    8: "2nd Saturday Bank Holiday",
                    15: "Independence Day (National Holiday)",
                    22: "4th Saturday Bank Holiday"
                },

                9: {
                    4: "Janmashtami",
                    12: "2nd Saturday Bank Holiday",
                    14: "Ganesh Puja",
                    16: "Nuakhai",
                    26: "4th Saturday Bank Holiday"
                },

                10: {
                    2: "Mahatma Gandhi Jayanti (National Holiday)",
                    10: "2nd Saturday Bank Holiday",
                    19: "Maha Ashtami (Durga Puja)",
                    21: "Vijaya Dashami (Dussehra)",
                    24: "4th Saturday Bank Holiday"
                },

                11: {
                    8: "Deepavali / Diwali",
                    14: "2nd Saturday Bank Holiday",
                    28: "4th Saturday Bank Holiday"
                },

                12: {
                    12: "2nd Saturday Bank Holiday",
                    25: "Christmas",
                    26: "4th Saturday Bank Holiday"
                }
            }
              // ← Fill later
        },

        school: {
            2025: {
                0: {
                    1: "New Year", 9: "Sambadasami", 14: "Makar Sankranti",
                    23: "Subash Chandra Bose Jayanti / Vir Surendra Sai Jayanti",
                    26: "Republic Day"
                },

                1: { 14: "Basanta Panchami", 26: "Maha Shivaratri" },

                2: {
                    5: "Panchayati Raj Divas", 14: "Dola Purnima",
                    15: "Holi", 31: "Id-Ul-Fitre"
                },

                3: {
                    1: "Utkal Divas",
                    14: "Maha Vishuva Sankranti/Dr. B.R Ambedkar Jayanti",
                    18: "Good Friday"
                },

                4: { 6: "Summer Vacation Start" },

                5: { 19: "Summer Vacation End", 27: "Ratha Yatra" },

                6: { 5: "Bahuda Yatra" },

                7: {
                    9: "Jhulana Purnima(Rakshya Bandhan)",
                    15: "Independence Day/Janmasami",
                    27: "Ganesh Puja",
                    28: "Nua Khai"
                },

                8: {
                    5: "Guru Divas/Birthday of Prophet Muhammad",
                    29: "Puja Vacation start"
                },

                9: {
                    7: "Puja Vacation End",
                    21: "Diwali / Kalipuja"
                },

                10: {
                    4: "Badaosha",
                    5: "Rahas Purnima",
                    12: "Prathamastami",
                    14: "Sishu Divas"
                },

                11: {
                    4: "Sesa Manabasa Gurubara",
                    24: "X-Mas HoliDay Start",
                    31: "X-Mas HoliDay End"
                }
            },
            2026: {} // ← Fill later
        },

        state: {
            2025: {
                0: {
                    14: "Makar Sankranti",
                    23: "Subash Chandra Bose Jayanti / Vir Surendra Sai Jayanti",
                    26: "Republic Day"
                },

                1: { 14: "Basanta Panchami", 26: "Maha Shivaratri" },

                2: {
                    5: "Panchayati Raj Divas",
                    14: "Dola Purnima",
                    15: "Holi",
                    31: "Id-Ul-Fitre"
                },

                3: {
                    1: "Utkal Divas",
                    14: "Maha Vishuva Sankranti/ Dr. B.R. Ambedkar Jayanti",
                    18: "Good Friday"
                },

                4: {
                    12: "Budha Purnima / Birthday of Pandit Raghunath Murmu",
                    27: "Sabitri Amabasya"
                },

                5: {
                    7: "Id-ul-Zuha",
                    27: "Ratha Yatra"
                },

                7: {
                    15: "Independence Day / Janmastami",
                    27: "Ganesh Puja",
                    28: "Nuakhai"
                },

                8: {
                    5: "Birthday of Prophet Muhammad",
                    29: "Mahasaptami",
                    30: "Mahastami"
                },

                9: {
                    1: "Mahanavami",
                    2: "Gandhi Jayanti / Vijaya Dasami",
                    7: "Kumar Purnima",
                    21: "Diwali / Kalipuja"
                },

                10: { 5: "Rahas Purnima" },

                11: { 25: "X-Mas Day" }
            },
            2026: {
                1: {
                    6: "Guru Govind Singh Birthday",
                    14: "Makar Sankranti",
                    23: "Subash Chandra Bose Jayanti / Vir Surendra Sai Jayanti / Basanta Panchami",
                    26: "Republic Day"
                },

                3: {
                    3: "Dola Purnima",
                    4: "Holi",
                    17: "Sab-e-Qadr",
                    21: "Id-Ul-Fitre",
                    27: "Shree Ram Nabami"
                },

                4: {
                    1: "Utkal Divas",
                    3: "Good Friday",
                    4: "Easter Saturday",
                    14: "Mahabishuba Sankranti / Dr. B. R. Ambedkar Jayanti"
                },

                5: {
                    1: "Budha Purnima / Birthday of Pandit Raghunath Murmu",
                    16: "Sabitri Amabasya",
                    22: "Birthday of Raja Ram Mohan Roy",
                    27: "Id-ul-Zuha"
                },

                6: {
                    15: "Raja Sankranti",
                    26: "Muharram"
                },

                7: {
                    16: "Ratha Yatra",
                    24: "Bahuda Yatra"
                },

                8: {
                    15: "Independence Day",
                    20: "Foundation Day of Brahma Samaj",
                    26: "Birthday of Prophet Mohammad",
                    27: "Jhulana Purnima"
                },

                9: {
                    4: "Janmastami",
                    14: "Ganesh Puja",
                    15: "Nuakhai",
                    16: "Day following Nuakhai"
                },

                10: {
                    2: "Gandhi Jayanti",
                    17: "Maha Saptami",
                    19: "Maha Nabami",
                    20: "Vijaya Dasami"
                },

                11: {
                    18: "Anla Nabami",
                    24: "Rasa Purnima"
                },

                12: {
                    1: "Prathamastami",
                    24: "Christmas Eve",
                    25: "Christmas Day (X-Mas Day)"
                }
            }

        }
    };

    /* ------------------------------------------
       POPULATE SELECTORS
    ---------------------------------------------*/
    function populateSelectors() {
        monthNames.forEach((month, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = month;
            selectMonth.appendChild(option);
        });

        for (let year = 2025; year <= 2026; year++) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            selectYear.appendChild(option);
        }

        selectMonth.value = currentMonth;
        selectYear.value = currentYear;
        tabSelector.value = currentTab;
    }

    /* ------------------------------------------
        BUILD CALENDAR
    ---------------------------------------------*/
    function createMonthCalendar(month, year) {
        monthCalendar.innerHTML = '';

        // Day names row
        const daysRow = document.createElement('div');
        daysRow.classList.add('calendar-days');
        ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(day => {
            const d = document.createElement('div');
            d.classList.add('day-name');
            d.textContent = day;
            daysRow.appendChild(d);
        });
        monthCalendar.appendChild(daysRow);

        // Dates grid
        const datesRow = document.createElement('div');
        datesRow.classList.add('calendar-dates');

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();

        for (let i = 0; i < firstDay; i++) {
            datesRow.appendChild(document.createElement('div'));
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateEl = document.createElement('div');
            dateEl.classList.add('date');
            dateEl.textContent = day;

            const dateObj = new Date(year, month, day);

            // Sunday
            if (dateObj.getDay() === 0) {
                dateEl.classList.add('sunday');
            }

            // Today highlight
            if (
                year === today.getFullYear() &&
                month === today.getMonth() &&
                day === today.getDate()
            ) {
                dateEl.classList.add('today');
            }

            /* ------------------------------------------
                VACATION HIGHLIGHT LOGIC (FIXED)
            ---------------------------------------------*/

            // Durgapuja: Sep 29 → Oct 7
            if (
                currentTab === 'school' &&
                (
                    (month === 8 && day >= 29) ||
                    (month === 9 && day <= 7)
                )
            ) {
                dateEl.classList.add('highlight-red');
            }

            // X-Mas Winter Vacation: Dec 24 → Dec 31
            if (
                currentTab === 'school' &&
                month === 11 &&
                day >= 24 && day <= 31
            ) {
                dateEl.classList.add('highlight-red');
            }

            // Summer Vacation: May 6 → June 19
            if (
                currentTab === 'school' &&
                (
                    (month === 4 && day >= 6) ||     // May
                    (month === 5 && day <= 19)       // June
                )
            ) {
                dateEl.classList.add('highlight-red');
            }

            // Holidays
            if (holidayData[currentTab][year] &&
                holidayData[currentTab][year][month] &&
                holidayData[currentTab][year][month][day]) {
                dateEl.classList.add('active');
                dateEl.title = holidayData[currentTab][year][month][day];
            }

            datesRow.appendChild(dateEl);
        }

        monthCalendar.appendChild(datesRow);
        updateEventsList(month, year);
    }

    /* ------------------------------------------
       UPDATE EVENTS LIST
    ---------------------------------------------*/
    function updateEventsList(month, year) {
        eventsList.innerHTML = `<h3>${monthNames[month]} ${year} Events</h3>`;
        const events = holidayData[currentTab][year] && holidayData[currentTab][year][month];

        if (events && Object.keys(events).length > 0) {
            Object.keys(events).forEach(day => {
                const ev = document.createElement('div');
                ev.classList.add('event-item');
                ev.textContent = `${monthNames[month]} ${day}: ${events[day]}`;
                eventsList.appendChild(ev);
            });
        } else {
            eventsList.innerHTML += `<p>No events for this month.</p>`;
        }
    }

    /* ------------------------------------------
       UPDATE CALENDAR
    ---------------------------------------------*/
    function updateCalendar() {
        createMonthCalendar(currentMonth, currentYear);
    }

    /* ------------------------------------------
       TAB SWITCHING
    ---------------------------------------------*/
    function changeTab(newTab) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.getElementById(`tab_${newTab}`).classList.add('active');
        currentTab = newTab;
        localStorage.setItem('currentTab', newTab);
        updateCalendar();
    }

    function setActiveTab() {
        const tab = document.getElementById(`tab_${currentTab}`);
        if (tab) tab.classList.add('active');
    }

    /* ------------------------------------------
       EVENT LISTENERS
    ---------------------------------------------*/
    selectMonth.addEventListener('change', () => {
        currentMonth = parseInt(selectMonth.value);
        updateCalendar();
    });

    selectYear.addEventListener('change', () => {
        currentYear = parseInt(selectYear.value);
        updateCalendar();
    });

    prevMonthBtn.addEventListener('click', () => {
        currentMonth = (currentMonth - 1 + 12) % 12;
        if (currentMonth === 11) currentYear--;
        selectMonth.value = currentMonth;
        selectYear.value = currentYear;
        updateCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth = (currentMonth + 1) % 12;
        if (currentMonth === 0) currentYear++;
        selectMonth.value = currentMonth;
        selectYear.value = currentYear;
        updateCalendar();
    });

 if (currentMonthBtn) {
    currentMonthBtn.addEventListener('click', () => {
        currentMonth = today.getMonth();
        currentYear = today.getFullYear();
        selectMonth.value = currentMonth;
        selectYear.value = currentYear;
        updateCalendar();
    });
}

    document.getElementById('tab_bank').addEventListener('click', () => changeTab('bank'));
    document.getElementById('tab_school').addEventListener('click', () => changeTab('school'));
    document.getElementById('tab_state').addEventListener('click', () => changeTab('state'));

    tabSelector.addEventListener('change', function() {
        changeTab(tabSelector.value);
    });

    /* ------------------------------------------
       INIT
    ---------------------------------------------*/
    setActiveTab();
    populateSelectors();
    updateCalendar();
});
