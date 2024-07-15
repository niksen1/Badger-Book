let studentData
const columnClasses = {
	xs : 'col-12',
	sm : 'col-sm-6',
	md : 'col-md-4',
	lg : 'col-lg-3',
	xl : 'col-xl-2'
}

function getStudentClass(){
	const pageSize = window.innerWidth;
	if (pageSize >= 1200){
		return columnClasses.xl
	} else if (pageSize >= 992){
		return columnClasses.lg
	} else if(pageSize >= 768){
		return columnClasses.md
	} else if (pageSize >= 576){
		return columnClasses.sm
	} else{
		return columnClasses.xs
	}
}

function resize(){
	let studentClass = getStudentClass()
	const students = document.getElementsByClassName('student');
	Array.from(students).forEach(student => {
		student.className = `student ${studentClass}`;
	});
}
	


fetch("https://cs571.org/api/f23/hw2/students", {
method: "GET",
headers: {
		"X-CS571-ID": CS571.getBadgerId()
}
})
.then(response => response.json())
.then(data => {
	console.log(data)
	studentData = data

	const numResults = document.getElementById("num-results")
    numResults.innerText = data.length

	const studentHTML = buildStudentsHtml(data)
	const students = document.getElementById("students")
	students.innerHTML = studentHTML

	students.className += " row"
	window.addEventListener('resize', resize);
	resize()
	
})
.catch(error => console.error(error))





/**
 * Given an array of students, generates HTML for all students
 * using {@link buildStudentHtml}.
 * 
 * @param {*} studs array of students
 * @returns html containing all students
 */
function buildStudentsHtml(studs) {
	return studs.map(stud => buildStudentHtml(stud)).join("\n");
}

/**
 * Given a student object, generates HTML. Use innerHtml to insert this
 * into the DOM, we will talk about security considerations soon!
 * 
 * @param {*} stud 
 * @returns 
 */
function buildStudentHtml(stud) {  
	let studentClass = getStudentClass();
	let html = `<div class="student ${studentClass}">`;
	html += `<h2>${stud.name.first} ${stud.name.last}</h2>`;
	html += `<h6>${stud.major}</h6>`;
	html += `<p>${stud.name.first} is taking ${stud.numCredits} credits and is ${stud.fromWisconsin ? 'from Wisconsin' : 'not from Wisconsin'}</p>`;
	html += `<p>${stud.name.first} has ${stud.interests.length} interests which are: </p>`;
	stud.interests.forEach(interest => {
		html += `<li>${interest}</li>`;
	});
	html += `</div>`
	return html;
}

function handleSearch(e) {
	e.preventDefault();

	const nameSearch = document.getElementById('search-name').value.toLowerCase().trim();
	const majorSearch = document.getElementById('search-major').value.toLowerCase().trim();
	const interestSearch = document.getElementById('search-interest').value.toLowerCase().trim();

	const studentResult = studentData.filter(student => {
		const fullName = `${student.name.first.toLowerCase()} ${student.name.last.toLowerCase()}`;
		const nameResult = fullName.includes(nameSearch);
		const majorResult = student.major.toLowerCase().includes(majorSearch);
        const interestResult = student.interests.some(interest =>
            interest.toLowerCase().includes(interestSearch)
        );

		return nameResult && majorResult && interestResult
	})

	const numResults = document.getElementById('num-results');
	numResults.innerText = studentResult.length;

	const filteredStudentsHtml = buildStudentsHtml(studentResult);
  
	const studentsDiv = document.getElementById('students');
	studentsDiv.innerHTML = `<div class="row">${filteredStudentsHtml}</div>`;

    let studentClass = getStudentClass()
	const students = document.getElementsByClassName('student');
	Array.from(students).forEach(student => {
		student.className = `student ${studentClass}`;
	});
}


document.getElementById("search-btn").addEventListener("click", handleSearch);
