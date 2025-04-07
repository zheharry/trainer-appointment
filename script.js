/* filepath: /Users/harry/Documents/programming/trainer-appointment/script.js */
document.addEventListener('DOMContentLoaded', () => {
    const monthYearElement = document.getElementById('month-year');
    const datesElement = document.getElementById('calendar-dates');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    const selectedDateInput = document.getElementById('selected-date');
    const trainerOptions = document.getElementById('trainer-options');
    const studentOptions = document.getElementById('student-options');
    const timeOptions = document.getElementById('time-options');
    const submitButton = document.getElementById('submit-booking');
    const bookingListElement = document.getElementById('booking-list');

    let currentDate = new Date(2025, 3, 7); // April 7, 2025
    let selectedDate = null;
    let selectedTrainer = null;
    let selectedStudent = null;
    let selectedTime = null;
    let bookings = []; // Array to hold booking objects

    function renderCalendar() {
        datesElement.innerHTML = ''; // Clear previous dates
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth(); // 0-indexed

        monthYearElement.textContent = `${year}年 ${month + 1}月`;

        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday, ...
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Add empty divs for days before the 1st of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('empty');
            datesElement.appendChild(emptyDiv);
        }

        // Add divs for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateDiv = document.createElement('div');
            dateDiv.textContent = day;
            dateDiv.dataset.date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            const today = new Date();
            if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                dateDiv.classList.add('today'); // Highlight today's actual date
            }

            if (selectedDate === dateDiv.dataset.date) {
                dateDiv.classList.add('selected');
            }

            dateDiv.addEventListener('click', () => {
                // Remove previous selection
                const previouslySelected = datesElement.querySelector('.selected');
                if (previouslySelected) {
                    previouslySelected.classList.remove('selected');
                }
                // Add new selection
                dateDiv.classList.add('selected');
                selectedDate = dateDiv.dataset.date;
                selectedDateInput.value = selectedDate; // Store value if needed elsewhere
                console.log("Selected Date:", selectedDate);
            });
            datesElement.appendChild(dateDiv);
        }
    }

    function renderBookings() {
        bookingListElement.innerHTML = ''; // Clear existing list
        bookings.forEach((booking, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${booking.date} - ${booking.time}, 教練: ${booking.trainer}, 學員: ${booking.student}`;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'X';
            deleteButton.classList.add('delete-booking');
            deleteButton.dataset.index = index; // Store index to identify which booking to delete

            deleteButton.addEventListener('click', (event) => {
                const indexToDelete = parseInt(event.target.dataset.index, 10);
                bookings.splice(indexToDelete, 1); // Remove booking from array
                renderBookings(); // Re-render the list
                // Optionally: save updated bookings to localStorage
            });

            listItem.appendChild(deleteButton);
            bookingListElement.appendChild(listItem);
        });
         // Optionally: save bookings to localStorage here if needed after initial render
    }

    // Event Listeners for Option Buttons (Trainer, Student, Time)
    function handleOptionSelection(event) {
        if (!event.target.classList.contains('option-button')) return; // Ignore clicks not on buttons

        const button = event.target;
        const type = button.dataset.type;
        const value = button.dataset.value;
        const container = button.parentElement;

        // Remove 'selected' class from siblings
        container.querySelectorAll('.option-button').forEach(btn => btn.classList.remove('selected'));

        // Add 'selected' class to the clicked button
        button.classList.add('selected');

        // Update the corresponding selected variable
        if (type === 'trainer') selectedTrainer = value;
        if (type === 'student') selectedStudent = value;
        if (type === 'time') selectedTime = value;

        console.log(`Selected ${type}:`, value);
    }

    trainerOptions.addEventListener('click', handleOptionSelection);
    studentOptions.addEventListener('click', handleOptionSelection);
    timeOptions.addEventListener('click', handleOptionSelection);

    // Event Listeners for Calendar Navigation
    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    // Event Listener for Submit Button
    submitButton.addEventListener('click', () => {
        if (!selectedDate || !selectedTrainer || !selectedStudent || !selectedTime) {
            alert('請選擇日期、教練、學員和時間！');
            return;
        }

        const newBooking = {
            date: selectedDate,
            trainer: selectedTrainer,
            student: selectedStudent,
            time: selectedTime,
            id: Date.now() // Simple unique ID
        };

        bookings.push(newBooking);
        console.log("New Booking:", newBooking);
        console.log("All Bookings:", bookings);

        renderBookings(); // Update the displayed list

        // Clear selections after booking (optional)
        // selectedDate = null;
        // selectedTrainer = null;
        // selectedStudent = null;
        // selectedTime = null;
        // datesElement.querySelector('.selected')?.classList.remove('selected');
        // trainerOptions.querySelector('.selected')?.classList.remove('selected');
        // studentOptions.querySelector('.selected')?.classList.remove('selected');
        // timeOptions.querySelector('.selected')?.classList.remove('selected');
        // renderCalendar(); // Re-render calendar to remove date selection highlight

        // Optionally: save bookings to localStorage
        // localStorage.setItem('bookings', JSON.stringify(bookings));
    });

    // Initial Setup
    // Optionally: load bookings from localStorage
    // const storedBookings = localStorage.getItem('bookings');
    // if (storedBookings) {
    //     bookings = JSON.parse(storedBookings);
    // }

    renderCalendar();
    renderBookings(); // Render any initially loaded bookings
});