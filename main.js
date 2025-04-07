const form = document.getElementById('booking-form');
const appointmentsList = document.getElementById('appointments-list');

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;

  const li = document.createElement('li');
  li.textContent = `${name} - ${date} at ${time}`;

  appointmentsList.appendChild(li);

  form.reset();
});