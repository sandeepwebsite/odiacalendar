document.addEventListener("DOMContentLoaded", function() {
    const selectMonth = document.getElementById('select_month');
    const selectYear = document.getElementById('select_year');
    const monthCalendar = document.getElementById('month-calendar');
    const eventsList = document.getElementById('events-list');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const currentMonthBtn = document.getElementById('currentMonth');
    const tabSelector = document.getElementById('tab_selector');


    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    let currentTab = localStorage.getItem('currentTab') || 'bank';

    // Set active tab on page load
    function setActiveTab() {
        const tab = document.getElementById(`tab_${currentTab}`);
        if (tab) {
            tab.classList.add('active');
        }
    }


    const today = new Date();
    const holidayData = {
        bank: {
            2024: {
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
            }
        },
        school: {
            2024: {
                0: { 15: "Makar Sankranti", 23: "Subash Chandra Bose Jayanti / Vir Surendra Sai Jayanti", 26: "Republic Day" },
  
                1: {
                    14: "Basanta Panchami"
                },
  
                2: {
                    5: "Panchayati Raj Divas",
                    8: "Maha Shivaratri",
                    25: "Dola Purnima",
                    26: "Holi",
                    29: "Good Friday",
                },
  
                3: {
                    1: "Utkal Divas",
                    11: "Id-ul-Fitre",
                    17: "Ram Navami"
                  },
  
                4: {
                    23: "Budha Purnima / Birthday of Pandit Raghunath Murmu"
                  },
  
                5: {
                    6: "Sabitri Amabasya",
                    14: "Pahili Raja",
                    15: "Raja Sankranti",
                    17: "ID-ul-Zuha"
                  },
  
                6: {
                    17: "Muharram",
                    15: "Bahuda Yatra (Optional Holiday)"
                  },
  
                7: {
                    15: "Independence Day",
                    19: "Jhulana Purnima",
                    26: "Janmastami"
                  },
  
                8: {
                    7: "Ganesh Puja",
                    16: "Birthday of Prophet Muhammad"
                  },
  
                9: {
                    2: "Gandhi Jayanti / Mohalaya",
                    8: "Dussahera Holiday Start",
                    10: "Mahasaptami",
                    11: "Mahastami",
                    16: "Kumar Purnima",
                    17: "Dussahera Holiday End",
                    31: "Diwali / Kalipuja"
                  },
  
                10: {
                    15: "Rahas Purnima",
                    23: "Prathamastami (4th Saturday)"
                  },
                  
                11: {
                    25: "X-Mas Day",
                    24: "Christmas Eve (Winter Vacation Starts 24th Dec to 2nd Jan)"
                  }
            },
            2025: {
                0: {14: "Makar Sankranti", 23: "Subash Chandra Bose Jayanti / Vir Surendrasai Jayanti"},
                1: {26: "Maha Shivaratri"},
                2: {5: "Panchayati Raj Divas", 14: "Dola Purnima", 15: "Holi", 31: "Id-ul-Fitre"},
                3: {1: "Utkal Divas", 14: "Maha Vishuva Sankranti/ Dr. B.R. Ambedkar Jayanti", 18: "Good Friday"},
                4: {12: "Buddha Purnima/ Birthday of Pt. Raghunath Murmu", 27: "Sabitri Amabasya"},
                5: {7: "Id-ul-Zuha", 27: "Ratha Yatra"},
                7: {15: "Independence Day/ Janmastami", 27: "Ganesh Puja", 28: "Nuakhai"},
                8: {5: "Birthday of Prophet Muhammad", 29: "Mahasaptami", 30: "Mahastami"},
                9: {1: "Mahanavami", 2: "Vijaya Dasami/ Gandhi Jayanti", 7: "Kumar Purnima", 21: "Diwali"},
                10: {5: "Rahas Purnima"},
                11: {25: "X-Mas Day"}
            }      
        },
        state: {
            2024: {
                0: { 15: "Makar Sankranti", 23: "Subash Chandra Bose Jayanti / Vir Surendra Sai Jayanti", 26: "Republic Day" },
  
                1: {
                    14: "Basanta Panchami"
                },
  
                2: {
                    5: "Panchayati Raj Divas",
                    8: "Maha Shivaratri",
                    25: "Dola Purnima",
                    26: "Holi",
                    29: "Good Friday",
                },
  
                3: {
                    1: "Utkal Divas",
                    11: "Id-ul-Fitre",
                    17: "Ram Navami"
                  },
  
                4: {
                    23: "Budha Purnima / Birthday of Pandit Raghunath Murmu"
                  },
  
                5: {
                    6: "Sabitri Amabasya",
                    14: "Pahili Raja",
                    15: "Raja Sankranti",
                    17: "ID-ul-Zuha"
                  },
  
                6: {
                    17: "Muharram",
                    15: "Bahuda Yatra (Optional Holiday)"
                  },
  
                7: {
                    15: "Independence Day",
                    19: "Jhulana Purnima",
                    26: "Janmastami"
                  },
  
                8: {
                    7: "Ganesh Puja",
                    16: "Birthday of Prophet Muhammad"
                  },
  
                9: {
                    2: "Gandhi Jayanti / Mohalaya",
                    10: "Mahasaptami",
                    11: "Mahastami",
                    16: "Kumar Purnima",
                    31: "Diwali / Kalipuja"
                  },
  
                10: {
                    15: "Rahas Purnima",
                    23: "Prathamastami (4th Saturday)"
                  },
                  
                11: {
                    25: "X-Mas Day",
                    24: "Christmas Eve (Optional Holiday)"
                  }
            },
            2025: {
                0: {14: "Makar Sankranti", 23: "Subash Chandra Bose Jayanti / Vir Surendrasai Jayanti", 26: "Republic Day"},
                1: {2: "Basanta Panchami", 26: "Maha Shivaratri"},
                2: {5: "Panchayati Raj Divas", 14: "Dola Purnima", 15: "Holi", 31: "Id-ul-Fitre"},
                3: {1: "Utkal Divas", 3: "Sri Ram Navami", 14: "Maha Vishuva Sankranti/ Dr. B.R. Ambedkar Jayanti", 18: "Good Friday"},
                4: {12: "Buddha Purnima/ Birthday of Pt. Raghunath Murmu", 27: "Sabitri Amabasya"},
                5: {7: "Id-ul-Zuha", 14: "Pahili Raja (2nd Saturday)", 15: "Raja Sankranti", 27: "Ratha Yatra"},
                6: {5: "Bahuda Yatra(Optional Holiday)", 6: "Muharram"},
                7: {9: "Jhulana Purnima (2nd Saturday)", 15: "Independence Day/ Janmastami", 27: "Ganesh Puja", 28: "Nuakhai"},
                8: {5: "Birthday of Prophet Muhammad", 21: "Mahalaya", 29: "Mahasaptami", 30: "Mahastami"},
                9: {1: "Mahanavami", 2: "Vijaya Dasami/ Gandhi Jayanti", 7: "Kumar Purnima", 21: "Diwali"},
                10: {5: "Rahas Purnima", 12: "Prathamastami(Optional Holiday)"},
                11: {25: "X-Mas Day"}
            }  
        }
    };

    function populateSelectors() {
        monthNames.forEach((month, index) => {
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

        selectMonth.value = currentMonth;
        selectYear.value = currentYear;
        tabSelector.value = currentTab;
    }

    function createMonthCalendar(month, year) {
        monthCalendar.innerHTML = '';

        const monthName = document.createElement('div');
        monthName.classList.add('month-name');
        // monthName.textContent = `${monthNames[month]} ${year}`;
        monthCalendar.appendChild(monthName);

        const daysRow = document.createElement('div');
        daysRow.classList.add('calendar-days');
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day-name');
            dayElement.textContent = day;
            daysRow.appendChild(dayElement);
        });
        monthCalendar.appendChild(daysRow);

        const datesRow = document.createElement('div');
        datesRow.classList.add('calendar-dates');
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfWeek = new Date(year, month, 1).getDay();

        for (let i = 0; i < firstDayOfWeek; i++) {
            const emptyCell = document.createElement('div');
            datesRow.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateElement = document.createElement('div');
            dateElement.classList.add('date');
            dateElement.textContent = day;
          
          // Check if the date is a Sunday
        const date = new Date(year, month, day);
        if (date.getDay() === 0) {
            dateElement.classList.add('sunday'); // Apply the Sunday class
        }

            if (month === today.getMonth() && year === today.getFullYear() && day === today.getDate()) {
                dateElement.classList.add('today');
            }

                // Apply lightblue background for Durgapuja, dates from 8th to 17th November on the 'school' tab
            if (currentTab === 'school' && month === 9 && day >= 8 && day <= 17) {
                dateElement.classList.add('highlight-red'); // Add this custom class
            }
            // Apply lightblue background for X-Mass/Winter Vacation, dates from 8th to 17th November on the 'school' tab
            if (currentTab === 'school' && month === 11 && day >= 24 && day <= 31) {
                dateElement.classList.add('highlight-red'); // Add this custom class
            }
            // Apply lightblue background for Summer Vacation, dates from 8th to 17th November on the 'school' tab
            if (currentTab === 'school' && month === 4 && day >= 25 && day <= 31) {
                dateElement.classList.add('highlight-red'); // Add this custom class
            }
            // Apply lightblue background for Summer Vacation, dates from 8th to 17th November on the 'school' tab
            if (currentTab === 'school' && month === 5 && day >= 1 && day <= 17) {
                dateElement.classList.add('highlight-red'); // Add this custom class
            }

            if (holidayData[currentTab][year] && holidayData[currentTab][year][month]?.[day]) {
                dateElement.classList.add('active');
                dateElement.title = holidayData[currentTab][year][month][day];
            }
            datesRow.appendChild(dateElement);
        }
        monthCalendar.appendChild(datesRow);
        updateEventsList(month, year);
    }

    function updateEventsList(month, year) {
        eventsList.innerHTML = `<h3>${monthNames[month]} ${year} Events</h3>`;
        const events = holidayData[currentTab][year] && holidayData[currentTab][year][month];
        if (events) {
            Object.keys(events).forEach(day => {
                const eventItem = document.createElement('div');
                eventItem.classList.add('event-item');
                eventItem.textContent = `${monthNames[month]} ${day}: ${events[day]}`;
                eventsList.appendChild(eventItem);
            });
        } else {
            eventsList.innerHTML += '<p>No events for this month.</p>';
        }
    }

    function updateCalendar() {
        createMonthCalendar(currentMonth, currentYear);
    }

    function changeTab(newTab) {
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        document.getElementById(`tab_${newTab}`).classList.add('active');
        currentTab = newTab;
        console.log(currentTab);
        localStorage.setItem('currentTab', newTab);
        updateCalendar();
    }

    selectMonth.addEventListener('change', function() {
        currentMonth = parseInt(selectMonth.value, 10);
        updateCalendar();
    });

    selectYear.addEventListener('change', function() {
        currentYear = parseInt(selectYear.value, 10);
        updateCalendar();
    });

    prevMonthBtn.addEventListener('click', function() {
        currentMonth = (currentMonth - 1 + 12) % 12;
        if (currentMonth === 11) currentYear--;
        selectMonth.value = currentMonth;
        selectYear.value = currentYear;
        updateCalendar();
    });

    nextMonthBtn.addEventListener('click', function() {
        currentMonth = (currentMonth + 1) % 12;
        if (currentMonth === 0) currentYear++;
        selectMonth.value = currentMonth;
        selectYear.value = currentYear;
        updateCalendar();
    });

// New functionality for Current Month button
    // currentMonthBtn.addEventListener('click', function() {
    //         let activeMonth = currentMonth;
    // let activeYear = currentYear;
    //     updateCalendar();
    // });





    document.getElementById('tab_bank').addEventListener('click', () => changeTab('bank'));
    document.getElementById('tab_school').addEventListener('click', () => changeTab('school'));
    document.getElementById('tab_state').addEventListener('click', () => changeTab('state'));
    
    
    tabSelector.addEventListener('change', function() {
        const selectedTab = tabSelector.value;
        localStorage.setItem('currentTab', selectedTab);  // Save to local storage
        changeTab(selectedTab);  // Update the tab and calendar
    });
setActiveTab();
    populateSelectors();
    updateCalendar();
});
