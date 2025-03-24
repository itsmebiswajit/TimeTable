// script.js
document.addEventListener('DOMContentLoaded', function () {
    const timetableElement = document.getElementById('timetable');
    const editButton = document.getElementById('editButton');
    const viewButton = document.getElementById('viewButton');
    const editForm = document.getElementById('editForm');
    const timetableForm = document.getElementById('timetableForm');
    const daySelect = document.getElementById('day');
    const entriesContainer = document.getElementById('entries');
    const addEntryButton = document.getElementById('addEntry');
    const completeTimetableGrid = document.getElementById('completeTimetableGrid');
    const timetableGrid = document.getElementById('timetableGrid').getElementsByTagName('tbody')[0];

    // Predefined time slot
    const timeSlots = ['08:00 - 8:40', '08:40 - 09:20', '09:20 - 10:00', '10:00 - 10:40', '10:40 - 11:00', '11:00 - 11:40', '11:40 - 12:20', '12:20 - 01:00', '01:00 - 01:40'];


    let timetable = JSON.parse(localStorage.getItem('timetable')) || {
        1: [{ time: '9:00 - 10:00', subject: 'Math' }, { time: '11:00 - 12:00', subject: 'Science' }], // Monday
        2: [{ time: '10:00 - 11:00', subject: 'History' }, { time: '1:00 - 2:00', subject: 'English' }], // Tuesday
        3: [{ time: '9:30 - 10:30', subject: 'Physics' }, { time: '2:00 - 3:00', subject: 'Chemistry' }], // Wednesday
        4: [{ time: '8:00 - 9:00', subject: 'Biology' }, { time: '12:00 - 1:00', subject: 'Geography' }], // Thursday
        5: [{ time: '10:30 - 11:30', subject: 'Computer Science' }, { time: '3:00 - 4:00', subject: 'Art' }], // Friday
        6: [], // Saturday
        0: []  // Sunday
    };

    // Display today's timetable
    function displayTimetable() {
        const today = new Date().getDay();
        const todayTimetable = timetable[today];

        timetableElement.innerHTML = ''; // Clear previous entries

        if (todayTimetable && todayTimetable.length > 0) {
            todayTimetable.forEach(item => {
                const timeDiv = document.createElement('div');
                timeDiv.textContent = item.time;
                timetableElement.appendChild(timeDiv);

                const subjectDiv = document.createElement('div');
                subjectDiv.textContent = item.subject;
                timetableElement.appendChild(subjectDiv);
            });
        } else {
            const noClassesDiv = document.createElement('div');
            noClassesDiv.textContent = 'No classes today!';
            noClassesDiv.style.gridColumn = '1 / -1'; // Span across all columns
            noClassesDiv.style.textAlign = 'center';
            timetableElement.appendChild(noClassesDiv);
        }
    }

    // Show edit form
    editButton.addEventListener('click', () => {
        editForm.style.display = 'block';
        loadEditForm();
    });

    // Show complete timetable grid
    viewButton.addEventListener('click', () => {
        completeTimetableGrid.style.display = 'block';
        loadCompleteTimetableGrid();
    });

    // Load complete timetable grid
    function loadCompleteTimetableGrid() {
        timetableGrid.innerHTML = ''; // Clear previous entries
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const timeSlots = ['08:00 - 8:40', '08:40 - 09:20', '09:20 - 10:00', '10:00 - 10:40', '10:40 - 11:00', '11:00 - 11:40', '11:40 - 12:20', '12:20 - 01:00', '01:00 - 01:40'];

        days.forEach((day, dayIndex) => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${day}</td>`;

            timeSlots.forEach(slot => {
                const cell = document.createElement('td');
                const entry = timetable[dayIndex].find(e => e.time === slot);
                cell.textContent = entry ? entry.subject : '-';
                row.appendChild(cell);
            });

            timetableGrid.appendChild(row);
        });
    }

    // Load entries for the selected day
    function loadEditForm() {
        const selectedDay = daySelect.value;
        const entries = timetable[selectedDay] || [];
        entriesContainer.innerHTML = '';
        entries.forEach((entry, index) => {
            addEntry(entry.time, entry.subject, index);
        });
    }

    // Add a new entry
    addEntryButton.addEventListener('click', () => {
        addEntry('', '');
    });

    function addEntry(time = '', subject = '', index = null) {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'entry';
        entryDiv.innerHTML = `
            <select>
                ${timeSlots.map(slot => `<option value="${slot}" ${time === slot ? 'selected' : ''}>${slot}</option>`).join('')}
            </select>
            <input type="text" placeholder="Subject" value="${subject}">
            <button type="button" onclick="removeEntry(this)">Remove</button>
        `;
        entriesContainer.appendChild(entryDiv);
    }

    // Remove an entry
    window.removeEntry = function (button) {
        button.parentElement.remove();
    };

    // Save timetable
    timetableForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedDay = daySelect.value;
        const entries = [];
        document.querySelectorAll('.entry').forEach(entry => {
            const time = entry.querySelector('select').value; // Get selected time slot
            const subject = entry.querySelector('input[placeholder="Subject"]').value;
            if (time && subject) {
                entries.push({ time, subject });
            }
        });
        timetable[selectedDay] = entries;
        localStorage.setItem('timetable', JSON.stringify(timetable));
        alert('Timetable saved!');
        displayTimetable();
        editForm.style.display = 'none';
    });

    // Reload form when day changes
    daySelect.addEventListener('change', loadEditForm);

    // Initial display
    displayTimetable();
});