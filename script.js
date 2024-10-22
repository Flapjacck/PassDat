function toggleForm(button) {
    const form = button.closest('form');
    form.classList.toggle('collapsed');
    button.textContent = form.classList.contains('collapsed') ? '∧' : '∨';
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
    lowestMarkDisplay.innerHTML = `
        <div class="label">Lowest possible mark:</div>
        <div class="bar" style="width: ${lowestMark}%;">${lowestMark}%</div>
    `;

    // Calculate and display the mark needed to pass the course
    const remainingWeight = 100 - totalWeight;
    const passMark = ((50 - totalScore) / (remainingWeight / 100)).toFixed(2);
    const passMarkDisplay = form.querySelector('.passMarkDisplay');
    if (passMark <= 0) {
        passMarkDisplay.innerHTML = `
            <div class="label">Minimum mark needed to pass:</div>
            <div class="bar">You PassDat Already</div>
        `;
    } else if (passMark > 100) {
        passMarkDisplay.innerHTML = `
            <div class="label">Minimum mark needed to pass:</div>
            <div class="bar">You're not going to PassDat</div>
        `;
    } else {
        passMarkDisplay.innerHTML = `
            <div class="label">Minimum mark needed to pass:</div>
            <div class="bar" style="width: ${passMark}%;">${passMark}%</div>
        `;
    }
}

function addClass() {
    const mainContent = document.getElementById('mainContent');
    
    // HTML template for the new class form
    const template = document.createElement('template');
    template.innerHTML = `
        <form class="gradeForm collapsible">
            <div class="formHeaderContainer">
                <input type="text" class="formHeader" value="Grade Calculator Form">
                <button type="button" id="toggleFormButton" onclick="toggleForm(this)">v</button>
            </div>
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
                <button type="button" class="removeClassButton" onclick="removeClass(this)">Remove Class</button>
            </div>
        </form>
    `.trim();
    
    // Clone the template content
    const newForm = template.content.firstChild.cloneNode(true);
    
    mainContent.insertBefore(newForm, document.getElementById('addClassButton'));
}

function removeClass(button) {
    const form = button.closest('form');
    const confirmation = confirm("Are you sure you want to remove this class?");
    if (confirmation) {
        form.parentNode.removeChild(form);
    }
}