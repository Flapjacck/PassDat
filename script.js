function addAssignment() {
    const assignmentsDiv = document.getElementById('assignments');
    const assignmentCount = assignmentsDiv.children.length + 1;

    const newAssignment = document.createElement('div');
    newAssignment.classList.add('assignment');
    newAssignment.innerHTML = `
        <label for="assignment${assignmentCount}">Assignment/Exam ${assignmentCount} Grade (%):</label>
        <input type="number" id="assignment${assignmentCount}" name="assignment${assignmentCount}" min="0" max="100">
        <label for="weight${assignmentCount}">Weight (%):</label>
        <input type="number" id="weight${assignmentCount}" name="weight${assignmentCount}" min="0" max="100">
    `;
    assignmentsDiv.appendChild(newAssignment);
}

function removeAssignment() {
    const assignmentsDiv = document.getElementById('assignments');
    const lastAssignment = assignmentsDiv.lastElementChild;
    if (lastAssignment) {
        assignmentsDiv.removeChild(lastAssignment);
    }
}

// script.js
function calculateGrade() {
    let totalWeight = 0;
    let totalScore = 0;

    // Calculate assignments
    const assignments = document.querySelectorAll('.assignment');
    assignments.forEach(assignment => {
        const score = parseFloat(assignment.querySelector('input[type="number"]').value) || 0;
        const weight = parseFloat(assignment.querySelector('input[name^="weight"]').value) || 0;
        totalScore += score * (weight / 100);
        totalWeight += weight;
    });

    // Calculate final grade
    const finalGrade = totalScore / (totalWeight / 100);
    const gradeDisplay = document.getElementById('gradeDisplay');
    gradeDisplay.innerHTML = `<div class="bar" style="width: ${finalGrade}%;">${finalGrade}%</div>`;
}
