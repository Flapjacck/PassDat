function toggleForm(header) {
    const formContent = header.nextElementSibling;
    if (formContent.style.display === 'none' || formContent.style.display === '') {
        formContent.style.display = 'block';
    } else {
        formContent.style.display = 'none';
    }
}

function updateHeader(header) {
    header.textContent = header.textContent.trim() ? header.textContent : 'Grade Form';
}

function addAssignment(button) {
    const form = button.closest('form');
    const assignments = form.querySelector('.assignments');
    const newAssignment = assignments.firstElementChild.cloneNode(true);
    assignments.appendChild(newAssignment);
}

function removeAssignment(button) {
    const form = button.closest('form');
    const assignments = form.querySelector('.assignments');
    if (assignments.children.length > 1) {
        assignments.removeChild(assignments.lastElementChild);
    }
}

function calculateGrade(button) {
    const form = button.closest('form');
    let totalWeight = 0;
    let totalScore = 0;

    // Calculate assignments within the specific form
    const assignments = form.querySelectorAll('.assignment');
    assignments.forEach(assignment => {
        const score = parseFloat(assignment.querySelector('.assignmentGrade').value) || 0;
        const weight = parseFloat(assignment.querySelector('.assignmentWeight').value) || 0;
        totalScore += score * (weight / 100);
        totalWeight += weight;
    });

    // Calculate final grade
    const finalGrade = (totalScore / (totalWeight / 100)).toFixed(2);
    const gradeDisplay = form.querySelector('.gradeDisplay');
    gradeDisplay.innerHTML = `
        <div class="label">Current mark:</div>
        <div class="bar" style="width: ${finalGrade}%;">${finalGrade}%</div>
    `;

    // Show lowest possible mark if total weight is below 100%
    const lowestMark = (totalScore / ((totalWeight + (100 - totalWeight)) / 100)).toFixed(2);
    const lowestMarkDisplay = form.querySelector('.lowestMarkDisplay');
    if (totalWeight < 100) {
        lowestMarkDisplay.innerHTML = `
            <div class="label">Lowest possible mark:</div>
            <div class="bar" style="width: ${lowestMark}%;">${lowestMark}%</div>
        `;
    } else {
        lowestMarkDisplay.innerHTML = '';
    }
}

function addClass() {
    const mainContent = document.getElementById('mainContent');
    const gradeForm = document.querySelector('.gradeForm');
    const newForm = gradeForm.cloneNode(true);
    
    // Remove id attributes from the cloned form and its elements
    newForm.removeAttribute('id');
    const elements = newForm.querySelectorAll('[id]');
    elements.forEach(element => element.removeAttribute('id'));
    
    mainContent.insertBefore(newForm, document.getElementById('addClassButton'));
}

function removeClass() {
    const mainContent = document.getElementById('mainContent');
    const forms = mainContent.getElementsByTagName('form');
    if (forms.length > 1) {
        mainContent.removeChild(forms[forms.length - 1]);
    }
}