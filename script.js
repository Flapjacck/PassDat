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
    const assignmentCount = assignments.children.length + 1;

    const newAssignmentHTML = `
        <div class="assignment">
            <label>Assignment/Exam ${assignmentCount} Grade (%):</label>
            <input type="number" class="assignmentGrade" min="0" max="100">
            <label>Weight (%):</label>
            <input type="number" class="assignmentWeight" min="0" max="100">
        </div>
    `;

    const newAssignment = document.createElement('div');
    newAssignment.innerHTML = newAssignmentHTML;
    assignments.appendChild(newAssignment.firstElementChild);
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
    const remainingWeightDisplay = form.querySelector('.remainingWeightDisplay');
    const passMarkDisplay = form.querySelector('.passMarkDisplay');

    if (totalWeight < 100) {
        lowestMarkDisplay.innerHTML = `
            <div class="label">Lowest possible mark:</div>
            <div class="bar" style="width: ${lowestMark}%;">${lowestMark}%</div>
        `;

        // Calculate and display remaining weight
        const remainingWeight = (100 - totalWeight).toFixed(2);
        remainingWeightDisplay.innerHTML = `
            <div class="label">Remaining weight:</div>
            <div class="bar" style="width: ${remainingWeight}%;">${remainingWeight}%</div>
        `;

        // Calculate and display the mark needed to pass the course
        const passMark = ((50 - totalScore) / (remainingWeight / 100)).toFixed(2);
        if (passMark <= 0) {
            passMarkDisplay.innerHTML = `
            <div class="label">Minimum mark needed to pass:</div>
            <div class="bar">You PassDat Already</div>
            `;
        } else {
            passMarkDisplay.innerHTML = `
            <div class="label">Minimum mark needed to pass:</div>
            <div class="bar" style="width: ${passMark}%;">${passMark}%</div>
            `;
    }
    } else {
        lowestMarkDisplay.innerHTML = '';
        remainingWeightDisplay.innerHTML = '';
        passMarkDisplay.innerHTML = '';
    }
}

function addClass() {
    const mainContent = document.getElementById('mainContent');
    
    // HTML template for the new class form
    const template = document.createElement('template');
    template.innerHTML = `
        <form class="gradeForm">
            <h2 class="formHeader" contenteditable="true" oninput="updateHeader(this)" onclick="toggleForm(this)">Class #..</h2>
            <div class="formContent">
                <div class="assignments">
                    <div class="assignment">
                        <label>Assignment/Exam 1 Grade (%):</label>
                        <input type="number" class="assignmentGrade" min="0" max="100">
                        <label>Weight (%):</label>
                        <input type="number" class="assignmentWeight" min="0" max="100">
                    </div>
                </div>
                <button type="button" onclick="addAssignment(this)">Add Assignment</button>
                <button type="button" onclick="removeAssignment(this)">Remove Assignment</button><br>
                <button type="button" onclick="calculateGrade(this)">Calculate Grade</button>
                <div class="gradeDisplay"></div>
                <div class="lowestMarkDisplay"></div>
                <div class="remainingWeightDisplay"></div>
                <div class="passMarkDisplay"></div>
            </div>
        </form>
    `.trim();
    
    // Clone the template content
    const newForm = template.content.firstChild.cloneNode(true);
    
    mainContent.insertBefore(newForm, document.getElementById('addClassButton'));
}

function removeClass() {
    const mainContent = document.getElementById('mainContent');
    const forms = mainContent.getElementsByTagName('form');
    if (forms.length > 1) {
        mainContent.removeChild(forms[forms.length - 1]);
    }
}