document.addEventListener('DOMContentLoaded', () => {
    const patientsTable = document.getElementById('patients-table');
    loadPatients();

    function loadPatients() {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        patientsTable.innerHTML = '';

        if (appointments.length === 0) {
            patientsTable.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No patient records found.</td></tr>';
            return;
        }

        appointments.forEach((patient) => {
            const row = document.createElement('tr');
            row.classList.add('patient-row');
            row.style.cursor = 'pointer';
            row.setAttribute('data-id', patient.id);

            row.innerHTML = `
                <td>${patient.id}</td>
                <td>${patient.patientName}</td>
                <td>${patient.age}</td>
                <td>${patient.category}</td>
             
             
                <td>Not Provided</td>
                <td>${patient.reason || 'N/A'}</td>
                <td>
                    <button class="btn btn-sm btn-danger delete-btn">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
            patientsTable.appendChild(row);
        });

        // Set up click listeners on patient rows
        document.querySelectorAll('.patient-row').forEach(row => {
            row.addEventListener('click', (e) => {
                // Prevent triggering when delete button is clicked
                if (e.target.closest('.delete-btn')) return;

                const patientId = row.getAttribute('data-id');
                window.location.href = `paitientdetail.html?id=${patientId}`;
            });
        });

        // Set up delete button listeners
        document.querySelectorAll('.delete-btn').forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent row click
                const id = parseInt(btn.closest('tr').getAttribute('data-id'));
                deletePatient(id);
            });
        });
    }

    function deletePatient(id) {
        if (!confirm('Are you sure you want to delete this patient record?')) return;
        let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        appointments = appointments.filter(app => app.id !== id);
        localStorage.setItem('appointments', JSON.stringify(appointments));
        loadPatients(); // Reload table after deletion
    }
});
