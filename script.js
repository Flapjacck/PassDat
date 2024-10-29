//funtion to toggle the grade form
function toggleForm(button) {
    const form = button.closest('form');
    form.classList.toggle('collapsed');
    button.textContent = form.classList.contains('collapsed') ? '∧' : '∨';
}

//function to add a assignment in the form
function addAssignment(button) {
    const form = button.closest('form');
    const assignments = form.querySelector('.assignments');
    const assignmentCount = assignments.children.length + 1;

    //new assignment html
    const newAssignmentHTML = `
        <div class="assignment">
            <label>Assignment/Exam ${assignmentCount} Grade (%):</label>
            <input type="number" class="assignmentGrade" min="0" max="100" oninput="validateInput(this)">
            <label>Weight (%):</label>
            <input type="number" class="assignmentWeight" min="0" max="100" oninput="validateInput(this)">
        </div>
    `;

    //display the new assignment
    const newAssignment = document.createElement('div');
    newAssignment.innerHTML = newAssignmentHTML;
    assignments.appendChild(newAssignment.firstElementChild);
}

//function to make sure the input is between 0 and 100
function validateInput(input) {
    if (input.value > 100) {
        input.value = 100;
    } else if (input.value < 0) {
        input.value = 0;
    }
}

//function to remove an assignment from the form
function removeAssignment(button) {
    const form = button.closest('form');
    const assignments = form.querySelector('.assignments');
    if (assignments.children.length > 1) {
        assignments.removeChild(assignments.lastElementChild);
    }
}

//function to calculate the grade
function calculateGrade(button) {
    const form = button.closest('form');
    const assignmentGrades = form.querySelectorAll('.assignmentGrade');
    const assignmentWeights = form.querySelectorAll('.assignmentWeight');

    let totalScore = 0;
    let totalWeight = 0;

    assignmentGrades.forEach((grade, index) => {
        const weight = parseFloat(assignmentWeights[index].value);
        totalScore += parseFloat(grade.value) * (weight / 100);
        totalWeight += weight;
    });

    // Calculate and display the Current grade
    const finalGrade = (totalScore / (totalWeight / 100)).toFixed(2);
    const gradeDisplay = form.querySelector('.gradeDisplay');
    gradeDisplay.innerHTML = `
        <div class="label">Current Grade:</div>
        <div class="bar" style="width: ${finalGrade}%; background-color: ${getColor(finalGrade)};">${finalGrade}%</div>
    `;

    // Show lowest possible mark if total weight is below 100%
    const lowestMark = (totalScore / ((totalWeight + (100 - totalWeight)) / 100)).toFixed(2);
    const lowestMarkDisplay = form.querySelector('.lowestMarkDisplay');
    lowestMarkDisplay.innerHTML = `
        <div class="label">Lowest possible mark:</div>
        <div class="bar" style="width: ${lowestMark}%; background-color: ${getColor(lowestMark)};">${lowestMark}%</div>
    `;

    // Calculate and display the mark needed to pass the course
    const remainingWeight = 100 - totalWeight;
    let passMark;
    
    if (remainingWeight === 0) {
        passMark = totalScore >= 50 ? 0 : Infinity;
    } else {
        passMark = ((50 - totalScore) / (remainingWeight / 100)).toFixed(2);
    }
    
    const passMarkDisplay = form.querySelector('.passMarkDisplay');
    if (passMark <= 0) {
        passMarkDisplay.innerHTML = `
            <div class="label">Minimum mark needed on next assignment/exam to pass:</div>
            <div class="bar" style="background-color: ${getFlippedColor(passMark)};">You Already PassDat</div>
        `;
    } else if (passMark > 100) {
        passMarkDisplay.innerHTML = `
            <div class="label">Minimum mark needed on next assignment/exam to pass:</div>
            <div class="bar" style="background-color: ${getFlippedColor(passMark)};">You're not going to PassDat</div>
        `;
    } else {
        passMarkDisplay.innerHTML = `
            <div class="label">Minimum mark needed on next assignment/exam to pass:</div>
            <div class="bar" style="width: ${passMark}%; background-color: ${getFlippedColor(passMark)};">${passMark}%</div>
        `;
    }

    // Display the remaining weight
    const remainingWeightDisplay = form.querySelector('.remainingWeightDisplay');
    remainingWeightDisplay.innerHTML = `
        <div class="label">Remaining Weight:</div>
        <div class="bar" style="width: ${remainingWeight}%;">${remainingWeight}%</div>
    `;
}

function getColor(percentage) {
    if (percentage < 40) {
        return 'red';
    } else if (percentage >= 40 && percentage < 60) {
        return 'orange';
    } else {
        return 'green';
    }
}

function getFlippedColor(percentage) {
    if (percentage >= 60) {
        return 'red';
    } else if (percentage >= 40 && percentage < 60) {
        return 'orange';
    } else {
        return 'green';
    }
}

//function to add a class form
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
                        <input type="number" class="assignmentGrade" min="0" max="100" oninput="validateInput(this)">
                        <label>Weight (%):</label>
                        <input type="number" class="assignmentWeight" min="0" max="100" oninput="validateInput(this)">
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

//function to remove a class form
function removeClass(button) {
    const form = button.closest('form');
    const confirmation = confirm("Are you sure you want to remove this class?");
    if (confirmation) {
        form.parentNode.removeChild(form);
    }
}

//function to calculate the GPA
function GenerateGPA() {
    const forms = document.querySelectorAll('.gradeForm');
    let totalGradePoints = 0;
    let totalWeight = 0;
    let totalPercentage = 0;
    const classGPAs = [];

    forms.forEach(form => {
        const grades = form.querySelectorAll('.assignmentGrade');
        const weights = form.querySelectorAll('.assignmentWeight');
        let courseTotal = 0;
        let courseWeight = 0;

        grades.forEach((grade, index) => {
            const weight = parseFloat(weights[index].value) || 0;
            const gradeValue = parseFloat(grade.value) || 0;
            courseTotal += gradeValue * weight;
            courseWeight += weight;
        });

        if (courseWeight > 0) {
            const courseAverage = courseTotal / courseWeight;
            const courseGPA4Point = convertTo4PointScale(courseAverage);
            const courseGPA12Point = convertTo12PointScale(courseAverage);
            const letterGrade = convertToLetterGrade(courseAverage);
            classGPAs.push({
                gpa4Point: courseGPA4Point,
                gpa12Point: courseGPA12Point,
                letterGrade: letterGrade
            });
            totalGradePoints += courseGPA4Point * courseWeight;
            totalWeight += courseWeight;
            totalPercentage += courseAverage * courseWeight;
        }
    });

    if (totalWeight > 0) {
        const totalPercentageAverage = totalPercentage / totalWeight;
        const gpa4Point = convertTo4PointScale(totalPercentageAverage)
        const gpa12Point = convertTo12PointScale(totalPercentageAverage);
        const totalLetterGrade = convertToLetterGrade(totalPercentageAverage);
        displayGPA(gpa4Point, gpa12Point, totalLetterGrade, classGPAs);
    } else {
        alert("No grades available to calculate GPA.");
    }
}

//function to convert the percentage to a 4 point scale
function convertTo4PointScale(percentage) {
    if (percentage >= 90) return 4.0;
    if (percentage >= 85) return 3.9;
    if (percentage >= 80) return 3.7;
    if (percentage >= 77) return 3.3;
    if (percentage >= 73) return 3.0;
    if (percentage >= 70) return 2.7;
    if (percentage >= 67) return 2.3;
    if (percentage >= 63) return 2.0;
    if (percentage >= 60) return 1.7;
    if (percentage >= 57) return 1.3;
    if (percentage >= 53) return 1.0;
    if (percentage >= 50) return 0.7;
    return 0.0;
}

//function to convert the percentage to a 12 point scale
function convertTo12PointScale(percentage) {
    if (percentage >= 90) return 12;
    if (percentage >= 85) return 11;
    if (percentage >= 80) return 10;
    if (percentage >= 77) return 9;
    if (percentage >= 73) return 8;
    if (percentage >= 70) return 7;
    if (percentage >= 67) return 6;
    if (percentage >= 63) return 5;
    if (percentage >= 60) return 4;
    if (percentage >= 57) return 3;
    if (percentage >= 53) return 2;
    if (percentage >= 50) return 1;
    return 0;
}

//function to convert the percentage to a letter grade
function convertToLetterGrade(percentage) {
    if (percentage >= 90) return 'A+';
    if (percentage >= 85) return 'A';
    if (percentage >= 80) return 'A-';
    if (percentage >= 77) return 'B+';
    if (percentage >= 73) return 'B';
    if (percentage >= 70) return 'B-';
    if (percentage >= 67) return 'C+';
    if (percentage >= 63) return 'C';
    if (percentage >= 60) return 'C-';
    if (percentage >= 57) return 'D+';
    if (percentage >= 53) return 'D';
    if (percentage >= 50) return 'D-';
    return 'F';
}

//function to display the GPA in a pop up
function displayGPA(gpa4Point, gpa12Point, totalLetterGrade, classGPAs) {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.width = '80%'; //width as a percentage of the viewport
    modal.style.maxWidth = '600px'; 
    modal.style.height = '80%'; //height as a percentage of the viewport
    modal.style.maxHeight = '600px'; 
    modal.style.padding = '20px';
    modal.style.backgroundColor = 'white';
    modal.style.border = '1px solid #ccc';
    modal.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    modal.style.overflowY = 'auto'; // vertical scroll if content overflows
    modal.style.zIndex = '1000';

    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '999';

    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.onclick = () => {
        document.body.removeChild(modal);
        document.body.removeChild(overlay);
    };

    let classGPADetails = '';
    classGPAs.forEach((classGPA, index) => {
        classGPADetails += `
            <h3>Class ${index + 1}</h3>
            <p>GPA (4-point scale): ${classGPA.gpa4Point.toFixed(2)}</p>
            <p>GPA (12-point scale): ${classGPA.gpa12Point}</p>
            <p>Letter Grade: ${classGPA.letterGrade}</p>
        `;
    });

    modal.innerHTML = `
        <h2>GPA Summary</h2>
        ${classGPADetails}
        <h3>Total</h3>
        <p>GPA (4-point scale): ${gpa4Point.toFixed(2)}</p>
        <p>GPA (12-point scale): ${gpa12Point}</p>
        <p>Letter Grade: ${totalLetterGrade}</p>
    `;
    modal.appendChild(closeButton);

    document.body.appendChild(modal);
    document.body.appendChild(overlay);
}
