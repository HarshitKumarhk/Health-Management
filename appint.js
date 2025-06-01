document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('appointmentForm');
    const appointmentsList = document.getElementById('appointmentsList');
    const confirmationDetails = document.getElementById('confirmationDetails');
    const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));

    initAppointmentsPage();

    function initAppointmentsPage() {
        populateDoctorSelect();
        setupAppointmentForm();
        loadUserAppointments();
    }

    function populateDoctorSelect() {
        const select = document.getElementById('doctorSelect');
        select.innerHTML = '<option value="">Choose a doctor</option>';
        doctorsData.forEach(doc => {
            const opt = document.createElement('option');
            opt.value = doc.id;
            opt.textContent = `${doc.name} (${doc.specialization})`;
            select.appendChild(opt);
        });
    }

    function setupAppointmentForm() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('appointmentDate').min = today;
        document.getElementById('appointmentDate').value = today;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            bookAppointment();
        });
    }

    function bookAppointment() {
        const appointment = {
            id: Date.now(),
            patientName: document.getElementById('patientName').value.trim(),
            age: document.getElementById('patientAge').value,
            contact: document.getElementById('patientContact').value,
            height: document.getElementById('patientHeight').value,
            weight: document.getElementById('patientWeight').value,
            bmi: document.getElementById('patientBMI').value,
            bloodGroup: document.getElementById('bloodGroup').value,
            category: document.getElementById('patientCategory').value,
            gender: document.getElementById('patientGender').value,
            doctorId: parseInt(document.getElementById('doctorSelect').value),
            date: document.getElementById('appointmentDate').value,
            time: document.getElementById('appointmentTime').value,
            reason: document.getElementById('appointmentReason').value.trim(),
            createdAt: new Date().toISOString()
        };

        if (!appointment.patientName || !appointment.doctorId || !appointment.date || !appointment.time) {
            alert('Please fill in all required fields');
            return;
        }

        const doctor = doctorsData.find(d => d.id === appointment.doctorId);
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];

        const conflict = appointments.some(app => app.doctorId === appointment.doctorId && app.date === appointment.date && app.time === appointment.time);
        if (conflict) {
            alert(`Dr. ${doctor.name} is already booked at ${appointment.time} on ${formatDate(appointment.date)}. Please choose another time.`);
            return;
        }

        appointments.push(appointment);
        localStorage.setItem('appointments', JSON.stringify(appointments));

        form.reset();
        document.getElementById('appointmentDate').value = appointment.date;
        document.getElementById('patientBMI').value = '';

        loadUserAppointments();
        showConfirmation(appointment);
        if (typeof updateDashboardCounts === 'function') updateDashboardCounts();
    }

    function loadUserAppointments() {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        appointmentsList.innerHTML = '';

        if (appointments.length === 0) {
            appointmentsList.innerHTML = '<div class="list-group-item text-center text-muted">No appointments booked yet</div>';
            return;
        }

        appointments
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .forEach(addAppointmentToUI);
    }

    function addAppointmentToUI(appointment) {
        const doctor = doctorsData.find(d => d.id === appointment.doctorId);
        const item = document.createElement('div');
        item.className = 'list-group-item d-flex justify-content-between align-items-start flex-column flex-md-row';
        item.innerHTML = `
            <div>
                <h6 class="mb-1">${appointment.patientName} (${appointment.age} yrs) - ${appointment.category}</h6>
                <small>${formatDate(appointment.date)} at ${appointment.time}</small><br>
                <small>With ${doctor ? doctor.name : 'Doctor'} - ${appointment.reason || 'No reason specified'}</small><br>
                <small><strong>BMI:</strong> ${appointment.bmi}, <strong>Blood Group:</strong> ${appointment.bloodGroup}</small>
            </div>
            <div class="d-flex gap-2 mt-2 mt-md-0">
                <button class="btn btn-sm btn-primary open-btn" data-id="${appointment.id}">Open</button>
                <button class="btn btn-sm btn-danger" onclick="removeAppointment(${appointment.id})">Cancel</button>
            </div>
        `;
        appointmentsList.prepend(item);
    }

    function showConfirmation(appointment) {
        const doctor = doctorsData.find(d => d.id === appointment.doctorId);
        confirmationDetails.innerHTML = `
            <p><strong>Patient:</strong> ${appointment.patientName}</p>
            <p><strong>Age:</strong> ${appointment.age}</p>
            <p><strong>Height:</strong> ${appointment.height} cm</p>
            <p><strong>Weight:</strong> ${appointment.weight} kg</p>
            <p><strong>Contact:</strong> ${appointment.contact}</p>
            <p><strong>BMI:</strong> ${appointment.bmi}</p>
            <p><strong>Blood Group:</strong> ${appointment.bloodGroup}</p>
            <p><strong>Category:</strong> ${appointment.category}</p>
            <p><strong>Doctor:</strong> ${doctor ? doctor.name : 'Unknown'}</p>
            <p><strong>Gender:</strong> ${appointment.gender}</p>
            <p><strong>Date:</strong> ${formatDate(appointment.date)}</p>
            <p><strong>Time:</strong> ${appointment.time}</p>
            <p><strong>Reason:</strong> ${appointment.reason}</p>
            <div class="alert alert-info mt-3"><i class="fas fa-info-circle"></i> Please arrive 15 minutes before your appointment time.</div>
        `;
        confirmationModal.show();
    }

    // Handle open button clicks
    appointmentsList.addEventListener('click', function (event) {
        if (event.target.classList.contains('open-btn')) {
            const appointmentId = event.target.getAttribute('data-id');
            window.open(`paitientdetail.html?id=${appointmentId}`, '_blank');
        }
    });
});

// Remove appointment
function removeAppointment(id) {
    if (!confirm('Are you sure you want to remove this appointment?')) return;
    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    appointments = appointments.filter(app => app.id !== id);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    document.dispatchEvent(new Event('DOMContentLoaded'));
    if (typeof updateDashboardCounts === 'function') updateDashboardCounts();
}

// Format date utility
function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
}
