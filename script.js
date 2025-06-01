// Sample Data
const doctorsData = [
    { id: 1, name: "Dr. Sarah Johnson", specialization: "Cardiology", contact: "sarah.j@hms.com", availability: "Mon-Fri, 9AM-5PM" },
    { id: 2, name: "Dr. Michael Chen", specialization: "Neurology", contact: "michael.c@hms.com", availability: "Tue-Sat, 10AM-6PM" },
    { id: 3, name: "Dr. shreekant", specialization: "General Physician", contact: "Shreekant.s@ingh.com", availability: "Mon-Wed, Fri, 8AM-4PM" },
    { id: 4, name: "Dr. Vinay Kumar", specialization: "Orthopedics", contact: "vinay.k@umars.com", availability: "Thu-Sun, 11AM-7PM" }
];

const patientsData = [
    { id: 1, name: "John Smith", age: 45, gender: "Male", contact: "john.smith@example.com", history: "Hypertension, Type 2 Diabetes" },
    { id: 2, name: "Maria Garcia", age: 32, gender: "Female", contact: "maria.g@example.com", history: "Asthma, Allergies" },
    { id: 3, name: "David Kim", age: 28, gender: "Male", contact: "david.k@example.com", history: "None" },
    { id: 4, name: "Lisa Wong", age: 56, gender: "Female", contact: "lisa.w@example.com", history: "Arthritis, High Cholesterol" }
];

const diseasesData = [
    { id: 1, name: "Diabetes", symptoms: "Increased thirst, frequent urination, extreme hunger, unexplained weight loss, fatigue, irritability, blurred vision, slow-healing sores", treatment: "Healthy eating, regular exercise, insulin therapy, oral medications, blood sugar monitoring", prevention: "Maintain a healthy weight, eat healthy foods, get regular physical activity" },
    { id: 2, name: "Hypertension", symptoms: "Severe headaches, fatigue, vision problems, chest pain, difficulty breathing, irregular heartbeat", treatment: "Lifestyle changes (diet, exercise), diuretics, ACE inhibitors, calcium channel blockers", prevention: "Reduce salt intake, eat a healthy diet, maintain healthy weight, limit alcohol" },
    { id: 3, name: "Asthma", symptoms: "Shortness of breath, chest tightness, wheezing, coughing attacks", treatment: "Inhaled corticosteroids, leukotriene modifiers, long-acting beta agonists, quick-relief inhalers", prevention: "Identify and avoid triggers, get vaccinated for flu and pneumonia, monitor breathing" }
];

const healthTips = [
    { id: 1, title: "Stay Hydrated", content: "Drink at least 8 glasses of water daily to maintain proper body function and flush out toxins." },
    { id: 2, title: "Regular Exercise", content: "Aim for at least 30 minutes of moderate exercise most days of the week to improve cardiovascular health." },
    { id: 3, title: "Balanced Diet", content: "Eat a variety of fruits, vegetables, whole grains, and lean proteins to ensure proper nutrition." },
    { id: 4, title: "Adequate Sleep", content: "Get 7-9 hours of quality sleep each night to allow your body to repair and rejuvenate." }
];

// Utility Functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function truncateText(text, maxLength) {
    return text.length <= maxLength ? text : text.substring(0, maxLength) + '...';
}

// Initialization
document.addEventListener('DOMContentLoaded', function () {
    const path = window.location.pathname.split('/').pop();

    if (path === 'index.html' || path === '') initDashboard();
    else if (path === 'diseases.html') initDiseasesPage();
    else if (path === 'doctors.html') initDoctorsPage();
    else if (path === 'patients.html') initPatientsPage();
    else if (path === 'appointments.html') initAppointmentsPage();
});

// Dashboard Functions
function initDashboard() {
    updateDashboardCounts();
    loadRecentAppointments();
    loadHealthTips();
}

function updateDashboardCounts() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    document.getElementById('patient-count').textContent = patientsData.length;
    document.getElementById('doctor-count').textContent = doctorsData.length;
    document.getElementById('appointment-count').textContent = appointments.length;
    document.getElementById('disease-count').textContent = diseasesData.length;
}

function loadRecentAppointments() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const container = document.getElementById('recent-appointments');
    container.innerHTML = '';

    if (appointments.length === 0) {
        container.innerHTML = '<div class="list-group-item text-center text-muted">No recent appointments</div>';
        return;
    }

    const sortedAppointments = appointments.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
    sortedAppointments.forEach(appointment => {
        const doctor = doctorsData.find(d => d.id == appointment.doctorId);
        const item = document.createElement('a');
        item.className = 'list-group-item list-group-item-action';
        item.innerHTML = `
            <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-1">${appointment.patientName}</h6>
                <small>${formatDate(appointment.date)}</small>
            </div>
            <p class="mb-1">With ${doctor ? doctor.name : 'Doctor'}</p>
            <small>${appointment.time} - ${appointment.reason || 'No reason specified'}</small>
        `;
        container.appendChild(item);
    });
}

function loadHealthTips() {
    const container = document.getElementById('health-tips-container');
    container.innerHTML = '';
    healthTips.forEach((tip, index) => {
        const item = document.createElement('div');
        item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        item.innerHTML = `<h5>${tip.title}</h5><p>${tip.content}</p>`;
        container.appendChild(item);
    });
}

// Diseases Page
function initDiseasesPage() {
    renderDiseaseCards(diseasesData);
    setupDiseaseSearch();
}

function renderDiseaseCards(diseases) {
    const container = document.getElementById('disease-container');
    container.innerHTML = '';
    diseases.forEach(disease => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        col.innerHTML = `
            <div class="card disease-card h-100" data-id="${disease.id}">
                <div class="card-header bg-info text-white">
                    <h5 class="mb-0">${disease.name}</h5>
                </div>
                <div class="card-body">
                    <p><strong>Symptoms:</strong> ${truncateText(disease.symptoms, 100)}</p>
                    <button class="btn btn-sm btn-outline-info view-details">View Details</button>
                </div>
            </div>
        `;
        container.appendChild(col);
    });

    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', function () {
            const card = this.closest('.disease-card');
            const diseaseId = card.dataset.id;
            showDiseaseDetails(diseaseId);
        });
    });
}

function setupDiseaseSearch() {
    document.getElementById('diseaseSearch').addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();
        const filtered = searchTerm.trim() === '' ? diseasesData : diseasesData.filter(d =>
            d.name.toLowerCase().includes(searchTerm) ||
            d.symptoms.toLowerCase().includes(searchTerm) ||
            (d.treatment && d.treatment.toLowerCase().includes(searchTerm))
        );
        renderDiseaseCards(filtered);
    });
}

function showDiseaseDetails(id) {
    const disease = diseasesData.find(d => d.id == id);
    if (!disease) return;
    document.getElementById('diseaseModalTitle').textContent = disease.name;
    const modalBody = document.getElementById('diseaseModalBody');
    modalBody.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <h6>Symptoms</h6>
                <p>${disease.symptoms}</p>
                <h6 class="mt-4">Prevention</h6>
                <p>${disease.prevention}</p>
            </div>
            <div class="col-md-6">
                <h6>Treatment</h6>
                <p>${disease.treatment}</p>
            </div>
        </div>
    `;
    new bootstrap.Modal(document.getElementById('diseaseModal')).show();
}

// Doctors Page
function initDoctorsPage() {
    const tableBody = document.getElementById('doctors-table');
    tableBody.innerHTML = '';
    doctorsData.forEach(d => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${d.id}</td><td>${d.name}</td><td>${d.specialization}</td><td>${d.contact}</td><td>${d.availability}</td>`;
        tableBody.appendChild(row);
    });
}

// Patients Page
function initPatientsPage() {
    const tableBody = document.getElementById('patients-table');
    tableBody.innerHTML = '';
    patientsData.forEach(p => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.age}</td>
            <td>${p.gender}</td>
            <td>${p.contact}</td>
            <td>${p.history}</td>
            <td>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${p.id}">
                    <i class="fas fa-trash-alt"></i> Delete
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Attach event listeners for delete buttons
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const patientId = parseInt(this.getAttribute('data-id'));
            if (confirm('Are you sure you want to delete this patient?')) {
                // Remove from patientsData array
                const index = patientsData.findIndex(p => p.id === patientId);
                if (index !== -1) {
                    patientsData.splice(index, 1);
                    initPatientsPage(); // Reload table
                }
            }
        });
    });
}


// Appointments Page
// function initAppointmentsPage() {
//     populateDoctorSelect();
//     loadUserAppointments();
//     setupAppointmentForm();
// }

// function populateDoctorSelect() {
//     const select = document.getElementById('doctorSelect');
//     select.innerHTML = '<option value="">Choose a doctor</option>';
//     doctorsData.forEach(doc => {
//         const opt = document.createElement('option');
//         opt.value = doc.id;
//         opt.textContent = `${doc.name} (${doc.specialization})`;
//         select.appendChild(opt);
//     });
// }

// function loadUserAppointments() {
//     const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
//     const container = document.getElementById('appointmentsList');
//     container.innerHTML = '';

//     if (appointments.length === 0) {
//         container.innerHTML = '<div class="list-group-item text-center text-muted">No appointments booked yet</div>';
//         return;
//     }

//     appointments.sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(appointment => {
//         const doctor = doctorsData.find(d => d.id == appointment.doctorId);
//         const item = document.createElement('div');
//         item.className = 'list-group-item d-flex justify-content-between align-items-start flex-column flex-md-row';
//         item.innerHTML = `
//             <div>
//                 <h6 class="mb-1">${appointment.patientName}</h6>
//                 <small>${formatDate(appointment.date)} at ${appointment.time}</small><br>
//                 <small>With ${doctor ? doctor.name : 'Doctor'} - ${appointment.reason || 'No reason specified'}</small>
//             </div>
//             <button class="btn btn-sm btn-danger mt-2 mt-md-0" onclick="removeAppointment(${appointment.id})">Cancel</button>
//         `;
//         container.appendChild(item);
//     });
// }

// function setupAppointmentForm() {
//     document.getElementById('appointmentForm').addEventListener('submit', function (e) {
//         e.preventDefault();

//         bookAppointment();
//     });

//     const today = new Date().toISOString().split('T')[0];
//     document.getElementById('appointmentDate').min = today;
//     document.getElementById('appointmentDate').value = today;
// }

// function bookAppointment() {
//     const patientName = document.getElementById('patientName').value.trim();
//     const doctorId = document.getElementById('doctorSelect').value;
//     const date = document.getElementById('appointmentDate').value;
//     const time = document.getElementById('appointmentTime').value;
//     const reason = document.getElementById('appointmentReason').value.trim();

//     if (!patientName || !doctorId || !date || !time) {
//         alert('Please fill in all required fields');
//         return;
//     }

//     const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
//     const doctor = doctorsData.find(d => d.id == doctorId);

//     const conflict = appointments.some(app => app.doctorId == doctorId && app.date === date && app.time === time);
//     if (conflict) {
//         alert(`Dr. ${doctor.name} is already booked at ${time} on ${formatDate(date)}. Please choose another time.`);
//         return;
//     }

//     const newAppointment = {
//         id: appointments.length ? Math.max(...appointments.map(a => a.id)) + 1 : 1,
//         patientName,
//         doctorId: parseInt(doctorId),
//         date,
//         time,
//         reason,
//         createdAt: new Date().toISOString()
//     };

//     appointments.push(newAppointment);
//     localStorage.setItem('appointments', JSON.stringify(appointments));
//     showAppointmentConfirmation(newAppointment);
//     document.getElementById('appointmentForm').reset();
//     document.getElementById('appointmentDate').value = date;
//     loadUserAppointments();
//     if (typeof updateDashboardCounts === 'function') updateDashboardCounts();
// }

// function showAppointmentConfirmation(appointment) {
//     const doctor = doctorsData.find(d => d.id == appointment.doctorId);
//     document.getElementById('confirmationDetails').innerHTML = `
//         <p><strong>Patient:</strong> ${appointment.patientName}</p>
//         <p><strong>Doctor:</strong> ${doctor ? doctor.name : 'Unknown'}</p>
//         <p><strong>Date:</strong> ${formatDate(appointment.date)}</p>
//         <p><strong>Time:</strong> ${appointment.time}</p>
//         <p><strong>Reason:</strong> ${appointment.reason || 'Not specified'}</p>
//         <div class="alert alert-info mt-3"><i class="fas fa-info-circle"></i> Please arrive 15 minutes before your appointment time.</div>
//     `;
//     new bootstrap.Modal(document.getElementById('confirmationModal')).show();
// }

// // 🔥 New: Remove Appointment
// function removeAppointment(id) {
//     if (!confirm('Are you sure you want to remove this appointment?')) return;
//     let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
//     appointments = appointments.filter(app => app.id !== id);
//     localStorage.setItem('appointments', JSON.stringify(appointments));
//     loadUserAppointments();
//     if (typeof updateDashboardCounts === 'function') updateDashboardCounts();
// }
//authhhh
let isSignUp = false;

function toggleAuth() {
  isSignUp = !isSignUp;

  document.getElementById('form-title').innerText = isSignUp ? "Sign Up" : "Sign In";

  document.querySelector('.auth-toggle').innerHTML = isSignUp
    ? "Already have an account? <span onclick='toggleAuth()' style='cursor:pointer; color:blue; text-decoration:underline;'>Sign In</span>"
    : "Don't have an account? <span onclick='redirectToRegister()' style='cursor:pointer; color:blue; text-decoration:underline;'>Sign Up</span>";

  if (isSignUp) {
    window.location.href = "register.html";  // Redirect when switching to Sign Up
  }
}

function redirectToRegister() {
  window.location.href = "register.html";
}

function handleAuth() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (isSignUp) {
    const fullname = document.getElementById('fullname')?.value || "Unknown User";
    const gender = document.getElementById('gender')?.value || "Not Specified";
    const role = document.getElementById('role')?.value || "Not Assigned";

    if (!fullname || !gender || !role) {
      alert("Please fill all required fields.");
      return;
    }

    const userData = { fullname, gender, email, password, role };

    localStorage.setItem("user_" + email, JSON.stringify(userData));

    alert("Account created successfully! Redirecting to login.");
    window.location.href = "auth.html"; // Redirect to login after registration
  } else {
    const storedUser = JSON.parse(localStorage.getItem("user_" + email));
    if (storedUser && storedUser.password === password) {
      localStorage.setItem("loggedIn", "true");
      window.location.href = "index.html"; // Redirect to dashboard after login
    } else {
      alert("Invalid credentials. Please try again.");
    }
  }
}


document.addEventListener("DOMContentLoaded", function () {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.clear();         // Data clear karo
            sessionStorage.clear();
            window.location.href = "auth.html";  // Login page pe le jao
        });
    }
});

