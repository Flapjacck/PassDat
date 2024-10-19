// set count to 1
let assignmentCount = 1;

// add assignment function
function addAssignment() {
    assignmentCount++;
    const assignmentsDiv = document.getElementById('assignments');
    const newAssignment = document.createElement('div');
    newAssignment.classList.add('assignment');
    //new assignment inner html
    newAssignment.innerHTML = `
        <label for="assignment${assignmentCount}">Assignment ${assignmentCount}:</label>
        <input type="number" id="assignment${assignmentCount}" name="assignment${assignmentCount}" min="0" max="100">
        <label for="weight${assignmentCount}">Weight (%):</label>
        <input type="number" id="weight${assignmentCount}" name="weight${assignmentCount}" min="0" max="100">
    `;
    assignmentsDiv.appendChild(newAssignment);
}

// calculates the final grade
function calculateGrade() {
    let totalGrade = 0;
    let totalWeight = 0;

    // loop through each assignment and calculate the grade
    for (let i = 1; i <= assignmentCount; i++) {
        const assignment = parseFloat(document.getElementById(`assignment${i}`).value) || 0;
        const weight = parseFloat(document.getElementById(`weight${i}`).value) || 0;
        totalGrade += assignment * (weight / 100);
        totalWeight += weight;
    }

    // get the midterm and final grades
    const midterm = parseFloat(document.getElementById('midterm').value) || 0;
    const final = parseFloat(document.getElementById('final').value) || 0;

    // calculate the final grade
    totalGrade += midterm * ((100 - totalWeight) / 200);
    totalGrade += final * ((100 - totalWeight) / 200);

    // display the final grade
    document.getElementById('result').innerText = `Your final grade is: ${totalGrade.toFixed(2)}`;
}