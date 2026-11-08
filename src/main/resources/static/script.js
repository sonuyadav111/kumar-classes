// ==========================================
// 1. API URLS
// ==========================================

const API_URL = "/api/enquiries";
const STUDENT_API_URL = "/api/students";
const COURSE_API_URL = "/api/courses";

let allEnquiries = [];
let allStudents = [];
let allCourses = [];

let editingCourseId = null;


// ==========================================
// 2. AUTHENTICATION - SESSION BASED
// ==========================================

function getAuthHeaders() {
    return {
        "Content-Type": "application/json"
    };
}


// ==========================================
// 3. COMMON API ERROR HANDLING
// ==========================================

async function handleResponse(response) {

    if (response.status === 401) {
        window.location.href = "/admin-login.html?expired";
        throw new Error("Session expired. Please login again.");
    }

    if (response.status === 403) {
        throw new Error("Access denied. You do not have permission.");
    }

    if (!response.ok) {
        let message = "Something went wrong.";

        try {
            const data = await response.json();
            message = data.error || data.message || message;
        } catch (error) {
            // Keep default error message
        }

        throw new Error(message);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}


// ==========================================
// 4. HTML ESCAPE
// ==========================================

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[char];
    });
}


// ==========================================
// 5. ENQUIRY MANAGEMENT
// ==========================================

// LOAD ENQUIRIES

async function loadEnquiries() {
    const tableBody = document.getElementById("enquiryTableBody");

    if (!tableBody) return;

    try {
        const headers = getAuthHeaders();

        const response = await fetch(API_URL, {
            method: "GET",
            headers: headers,
            credentials: "same-origin"
        });

        allEnquiries = await handleResponse(response);

        displayEnquiries(allEnquiries);
        updateDashboardCounts();

    } catch (error) {
        console.error("Enquiry Error:", error);
        tableBody.innerHTML =
            `<tr><td colspan="8">${escapeHTML(error.message)}</td></tr>`;
    }
}


// DISPLAY ENQUIRIES

function displayEnquiries(enquiries) {
    const tableBody = document.getElementById("enquiryTableBody");

    if (!tableBody) return;

    if (!enquiries || enquiries.length === 0) {
        tableBody.innerHTML =
            `<tr><td colspan="8">No enquiries found.</td></tr>`;
        return;
    }

    tableBody.innerHTML = enquiries.map(enquiry => `
        <tr>
            <td>${enquiry.id}</td>
            <td>${escapeHTML(enquiry.studentName)}</td>
            <td>${escapeHTML(enquiry.parentName)}</td>
            <td>${escapeHTML(enquiry.mobileNumber)}</td>
            <td>${escapeHTML(enquiry.studentClass)}</td>
            <td>${escapeHTML(enquiry.subject)}</td>
            <td>
                <select onchange="updateEnquiryStatus(${enquiry.id}, this.value)">
                    <option value="New" ${enquiry.status === "New" ? "selected" : ""}>New</option>
                    <option value="Contacted" ${enquiry.status === "Contacted" ? "selected" : ""}>Contacted</option>
                    <option value="Admitted" ${enquiry.status === "Admitted" ? "selected" : ""}>Admitted</option>
                    <option value="Rejected" ${enquiry.status === "Rejected" ? "selected" : ""}>Rejected</option>
                </select>
            </td>
            <td>
                <button type="button" class="delete-btn"
                    onclick="deleteEnquiry(${enquiry.id})">
                    Delete
                </button>
            </td>
        </tr>
    `).join("");
}


// UPDATE ENQUIRY STATUS

async function updateEnquiryStatus(id, status) {
    try {
        const headers = getAuthHeaders();

        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: headers,
            credentials: "same-origin",
            body: JSON.stringify({ status: status })
        });

        await handleResponse(response);

        alert("Enquiry status updated successfully!");
        await loadEnquiries();

    } catch (error) {
        alert(error.message);
    }
}


// DELETE ENQUIRY

async function deleteEnquiry(id) {
    if (!confirm("Are you sure you want to delete this enquiry?")) {
        return;
    }

    try {
        const headers = getAuthHeaders();

        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: headers,
            credentials: "same-origin"
        });

        await handleResponse(response);

        alert("Enquiry deleted successfully!");
        await loadEnquiries();

    } catch (error) {
        alert(error.message);
    }
}


// SEARCH ENQUIRIES

function searchEnquiries() {
    const searchValue =
        document.getElementById("searchInput")?.value.toLowerCase() || "";

    const filtered = allEnquiries.filter(enquiry =>
        String(enquiry.studentName || "").toLowerCase().includes(searchValue) ||
        String(enquiry.parentName || "").toLowerCase().includes(searchValue) ||
        String(enquiry.mobileNumber || "").includes(searchValue)
    );

    displayEnquiries(filtered);
}


// FILTER ENQUIRIES BY CLASS

function filterEnquiries() {
    const selectedClass =
        document.getElementById("classFilter")?.value || "";

    const filtered = selectedClass
        ? allEnquiries.filter(enquiry =>
            String(enquiry.studentClass) === selectedClass
        )
        : allEnquiries;

    displayEnquiries(filtered);
}


// ==========================================
// 6. STUDENT MANAGEMENT
// ==========================================

// LOAD STUDENTS

async function loadStudents() {
    const tableBody = document.getElementById("studentTableBody");

    if (!tableBody) return;

    try {
        const headers = getAuthHeaders();

        const response = await fetch(STUDENT_API_URL, {
            method: "GET",
            headers: headers,
            credentials: "same-origin"
        });

        allStudents = await handleResponse(response);

        displayStudents(allStudents);
        updateTotalStudents();

    } catch (error) {
        console.error("Student Error:", error);
        tableBody.innerHTML =
            `<tr><td colspan="8">${escapeHTML(error.message)}</td></tr>`;
    }
}


// DISPLAY STUDENTS

function displayStudents(students) {
    const tableBody = document.getElementById("studentTableBody");

    if (!tableBody) return;

    if (!students || students.length === 0) {
        tableBody.innerHTML =
            `<tr><td colspan="8">No students found.</td></tr>`;
        return;
    }

    tableBody.innerHTML = students.map(student => `
        <tr>
            <td>${student.id}</td>
            <td>${escapeHTML(student.studentName)}</td>
            <td>${escapeHTML(student.parentName)}</td>
            <td>${escapeHTML(student.mobileNumber)}</td>
            <td>${escapeHTML(student.studentClass)}</td>
            <td>${escapeHTML(student.subject)}</td>
            <td>${escapeHTML(student.admissionDate || "-")}</td>
            <td>
                <button type="button" class="delete-btn"
                    onclick="deleteStudent(${student.id})">
                    Delete
                </button>
            </td>
        </tr>
    `).join("");
}


// ADD STUDENT

async function addStudent(event) {
    event.preventDefault();

    const student = {
        studentName: document.getElementById("studentName").value.trim(),
        parentName: document.getElementById("parentName").value.trim(),
        mobileNumber: document.getElementById("mobileNumber").value.trim(),
        studentClass: Number(document.getElementById("studentClass").value),
        subject: document.getElementById("studentSubject").value
    };

    try {
        const headers = getAuthHeaders();

        const response = await fetch(STUDENT_API_URL, {
            method: "POST",
            headers: headers,
            credentials: "same-origin",
            body: JSON.stringify(student)
        });

        await handleResponse(response);

        alert("Student added successfully!");

        document.getElementById("studentForm").reset();

        updateSubjectOptions();
        await loadStudents();

    } catch (error) {
        alert(error.message);
    }
}


// DELETE STUDENT

async function deleteStudent(id) {
    if (!confirm("Are you sure you want to delete this student?")) {
        return;
    }

    try {
        const headers = getAuthHeaders();

        const response = await fetch(`${STUDENT_API_URL}/${id}`, {
            method: "DELETE",
            headers: headers,
            credentials: "same-origin"
        });

        await handleResponse(response);

        alert("Student deleted successfully!");
        await loadStudents();

    } catch (error) {
        alert(error.message);
    }
}


// UPDATE STUDENT COUNT

function updateTotalStudents() {
    const totalStudents = document.getElementById("totalStudents");

    if (totalStudents) {
        totalStudents.textContent = allStudents.length;
    }
}


// STUDENT SUBJECT OPTIONS

function updateSubjectOptions() {
    const classSelect = document.getElementById("studentClass");
    const subjectSelect = document.getElementById("studentSubject");

    if (!classSelect || !subjectSelect) return;

    const selectedClass = Number(classSelect.value);

    subjectSelect.innerHTML = "";

    if (!selectedClass) {
        subjectSelect.innerHTML =
            `<option value="">Select Class First</option>`;
        return;
    }

    if (selectedClass >= 1 && selectedClass <= 8) {
        subjectSelect.innerHTML =
            `<option value="All Subjects">All Subjects</option>`;
    } else if (selectedClass >= 9 && selectedClass <= 12) {
        subjectSelect.innerHTML =
            `<option value="Chemistry">Chemistry</option>`;
    }
}


// ==========================================
// 7. COURSE MANAGEMENT
// ==========================================

// LOAD COURSES

async function loadCourses() {
    const tableBody = document.getElementById("courseTableBody");

    if (!tableBody) return;

    try {
        const headers = getAuthHeaders();

        const response = await fetch(COURSE_API_URL, {
            method: "GET",
            headers: headers,
            credentials: "same-origin"
        });

        allCourses = await handleResponse(response);

        displayCourses(allCourses);
        updateActiveCoursesCount();

    } catch (error) {
        console.error("Course Error:", error);
        tableBody.innerHTML =
            `<tr><td colspan="8">${escapeHTML(error.message)}</td></tr>`;
    }
}


// DISPLAY COURSES

function displayCourses(courses) {
    const tableBody = document.getElementById("courseTableBody");

    if (!tableBody) return;

    if (!courses || courses.length === 0) {
        tableBody.innerHTML =
            `<tr><td colspan="8">No courses found.</td></tr>`;
        return;
    }

    tableBody.innerHTML = courses.map(course => `
        <tr>
            <td>${course.id}</td>
            <td>${escapeHTML(course.courseName)}</td>
            <td>${course.startClass}</td>
            <td>${course.endClass}</td>
            <td>${escapeHTML(course.subject)}</td>
            <td>${escapeHTML(course.description || "-")}</td>
            <td>
                <span class="${course.active ? "status-active" : "status-inactive"}">
                    ${course.active ? "Active" : "Inactive"}
                </span>
            </td>
            <td>
                <button type="button" class="edit-btn"
                    onclick="editCourse(${course.id})">
                    Edit
                </button>

                <button type="button" class="delete-btn"
                    onclick="deleteCourse(${course.id})">
                    Delete
                </button>
            </td>
        </tr>
    `).join("");
}


// ADD OR UPDATE COURSE

async function addCourse(event) {
    event.preventDefault();

    const course = {
        courseName: document.getElementById("courseName").value.trim(),
        startClass: Number(document.getElementById("startClass").value),
        endClass: Number(document.getElementById("endClass").value),
        subject: document.getElementById("courseSubject").value,
        description: document.getElementById("courseDescription").value.trim(),
        active: document.getElementById("courseActive").value === "true"
    };

    try {
        const headers = getAuthHeaders();

        let url = COURSE_API_URL;
        let method = "POST";

        if (editingCourseId !== null) {
            url = `${COURSE_API_URL}/${editingCourseId}`;
            method = "PUT";
        }

        const response = await fetch(url, {
            method: method,
            headers: headers,
            credentials: "same-origin",
            body: JSON.stringify(course)
        });

        await handleResponse(response);

        alert(
            method === "PUT"
                ? "Course updated successfully!"
                : "Course added successfully!"
        );

        cancelCourseEdit();
        await loadCourses();

    } catch (error) {
        alert(error.message);
    }
}


// EDIT COURSE

function editCourse(id) {
    const course = allCourses.find(item => item.id === id);

    if (!course) {
        alert("Course not found!");
        return;
    }

    editingCourseId = id;

    document.getElementById("courseName").value = course.courseName;
    document.getElementById("startClass").value = course.startClass;
    document.getElementById("endClass").value = course.endClass;

    updateCourseSubjectOptions();

    document.getElementById("courseSubject").value = course.subject;
    document.getElementById("courseDescription").value =
        course.description || "";

    document.getElementById("courseActive").value =
        String(course.active);

    document.getElementById("courseFormTitle").textContent =
        "Update Course";

    document.getElementById("courseSubmitBtn").textContent =
        "Update Course";

    document.getElementById("cancelCourseEdit").style.display =
        "inline-block";

    document.getElementById("courseForm").scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


// CANCEL COURSE EDIT

function cancelCourseEdit() {
    editingCourseId = null;

    const form = document.getElementById("courseForm");

    if (form) {
        form.reset();
    }

    document.getElementById("courseFormTitle").textContent =
        "Add New Course";

    document.getElementById("courseSubmitBtn").textContent =
        "Add Course";

    document.getElementById("cancelCourseEdit").style.display =
        "none";

    updateCourseSubjectOptions();
}


// DELETE COURSE

async function deleteCourse(id) {
    if (!confirm("Are you sure you want to delete this course?")) {
        return;
    }

    try {
        const headers = getAuthHeaders();

        const response = await fetch(`${COURSE_API_URL}/${id}`, {
            method: "DELETE",
            headers: headers,
            credentials: "same-origin"
        });

        await handleResponse(response);

        if (editingCourseId === id) {
            cancelCourseEdit();
        }

        alert("Course deleted successfully!");
        await loadCourses();

    } catch (error) {
        alert(error.message);
    }
}


// UPDATE ACTIVE COURSE COUNT

function updateActiveCoursesCount() {
    const activeCoursesCount =
        document.getElementById("activeCoursesCount");

    if (!activeCoursesCount) return;

    const activeCount = allCourses.filter(course =>
        course.active === true
    ).length;

    activeCoursesCount.textContent = activeCount;
}


// COURSE SUBJECT OPTIONS

function updateCourseSubjectOptions() {
    const startSelect = document.getElementById("startClass");
    const endSelect = document.getElementById("endClass");
    const subjectSelect = document.getElementById("courseSubject");

    if (!startSelect || !endSelect || !subjectSelect) return;

    const startClass = Number(startSelect.value);
    const endClass = Number(endSelect.value);

    subjectSelect.innerHTML = "";

    if (!startClass || !endClass) {
        subjectSelect.innerHTML =
            `<option value="">Select Classes First</option>`;
        return;
    }

    if (startClass >= 1 && endClass <= 8 && startClass <= endClass) {
        subjectSelect.innerHTML =
            `<option value="All Subjects">All Subjects</option>`;
    } else if (
        startClass >= 9 &&
        endClass <= 12 &&
        startClass <= endClass
    ) {
        subjectSelect.innerHTML =
            `<option value="Chemistry">Chemistry</option>`;
    } else {
        subjectSelect.innerHTML =
            `<option value="">Invalid Class Range</option>`;
    }
}


// ==========================================
// 8. DASHBOARD COUNTS
// ==========================================

function updateDashboardCounts() {
    const totalEnquiries =
        document.getElementById("totalEnquiries");

    const newEnquiries =
        document.getElementById("newEnquiries");

    if (totalEnquiries) {
        totalEnquiries.textContent = allEnquiries.length;
    }

    if (newEnquiries) {
        const newCount = allEnquiries.filter(enquiry =>
            enquiry.status === "New"
        ).length;

        newEnquiries.textContent = newCount;
    }
}
// ==========================================
// 9. PAGE INITIALIZATION
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("searchInput");
    const classFilter = document.getElementById("classFilter");

    if (searchInput) {
        searchInput.addEventListener("input", searchEnquiries);
    }

    if (classFilter) {
        classFilter.addEventListener("change", filterEnquiries);
    }

    const studentForm = document.getElementById("studentForm");

    if (studentForm) {
        studentForm.addEventListener("submit", addStudent);
    }

    const studentClass = document.getElementById("studentClass");

    if (studentClass) {
        studentClass.addEventListener("change", updateSubjectOptions);
    }

    const courseForm = document.getElementById("courseForm");

    if (courseForm) {
        courseForm.addEventListener("submit", addCourse);
    }

    const startClass = document.getElementById("startClass");
    const endClass = document.getElementById("endClass");

    if (startClass) {
        startClass.addEventListener("change", updateCourseSubjectOptions);
    }

    if (endClass) {
        endClass.addEventListener("change", updateCourseSubjectOptions);
    }

    const cancelButton = document.getElementById("cancelCourseEdit");

    if (cancelButton) {
        cancelButton.addEventListener("click", cancelCourseEdit);
    }

    updateSubjectOptions();
    updateCourseSubjectOptions();

    loadEnquiries();
    loadStudents();
    loadCourses();
});


// ==========================================
// 10. ANNOUNCEMENTS MANAGEMENT
// ==========================================

const ANNOUNCEMENT_API_URL = "/api/announcements";

let allAnnouncements = [];
let editingAnnouncementId = null;


// LOAD ANNOUNCEMENTS

async function loadAnnouncements() {
    const tableBody = document.getElementById("announcementTableBody");

    if (!tableBody) return;

    try {
        const headers = getAuthHeaders();

        const response = await fetch(ANNOUNCEMENT_API_URL, {
            method: "GET",
            headers,
            credentials: "same-origin"
        });

        allAnnouncements = await handleResponse(response);

        displayAnnouncements(allAnnouncements);

    } catch (error) {
        console.error("Announcement Error:", error);

        tableBody.innerHTML =
            `<tr><td colspan="7">${escapeHTML(error.message)}</td></tr>`;
    }
}


// DISPLAY ANNOUNCEMENTS

function displayAnnouncements(announcements) {
    const tableBody = document.getElementById("announcementTableBody");

    if (!tableBody) return;

    if (!announcements || announcements.length === 0) {
        tableBody.innerHTML =
            `<tr><td colspan="7">No announcements found.</td></tr>`;
        return;
    }

    tableBody.innerHTML = announcements.map(item => `
        <tr>
            <td>${item.id}</td>
            <td>${escapeHTML(item.title)}</td>
            <td>${escapeHTML(item.type)}</td>
            <td>${escapeHTML(item.message)}</td>
            <td>
                <span class="${item.active ? "status-active" : "status-inactive"}">
                    ${item.active ? "Active" : "Inactive"}
                </span>
            </td>
            <td>${escapeHTML(item.createdAt || "-")}</td>
            <td>
                <button type="button" class="edit-btn"
                    onclick="editAnnouncement(${item.id})">
                    Edit
                </button>

                <button type="button" class="delete-btn"
                    onclick="deleteAnnouncement(${item.id})">
                    Delete
                </button>
            </td>
        </tr>
    `).join("");
}


// ADD OR UPDATE ANNOUNCEMENT

async function saveAnnouncement(event) {
    event.preventDefault();

    const announcement = {
        title: document.getElementById("announcementTitle").value.trim(),
        type: document.getElementById("announcementType").value,
        message: document.getElementById("announcementMessage").value.trim(),
        active: document.getElementById("announcementActive").value === "true"
    };

    try {
        const headers = getAuthHeaders();

        let url = ANNOUNCEMENT_API_URL;
        let method = "POST";

        if (editingAnnouncementId !== null) {
            url = `${ANNOUNCEMENT_API_URL}/${editingAnnouncementId}`;
            method = "PUT";
        }

        const response = await fetch(url, {
            method,
            headers,
            credentials: "same-origin",
            body: JSON.stringify(announcement)
        });

        await handleResponse(response);

        alert(
            method === "PUT"
                ? "Announcement updated successfully!"
                : "Announcement published successfully!"
        );

        cancelAnnouncementEdit();

        await loadAnnouncements();

    } catch (error) {
        alert(error.message);
    }
}


// EDIT ANNOUNCEMENT

function editAnnouncement(id) {
    const announcement = allAnnouncements.find(item => item.id === id);

    if (!announcement) {
        alert("Announcement not found!");
        return;
    }

    editingAnnouncementId = id;

    document.getElementById("announcementTitle").value =
        announcement.title;

    document.getElementById("announcementType").value =
        announcement.type;

    document.getElementById("announcementMessage").value =
        announcement.message;

    document.getElementById("announcementActive").value =
        String(announcement.active);

    document.getElementById("announcementFormTitle").textContent =
        "Update Announcement";

    document.getElementById("announcementSubmitBtn").textContent =
        "Update Announcement";

    document.getElementById("cancelAnnouncementEdit").style.display =
        "inline-block";

    document.getElementById("announcementForm").scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


// CANCEL ANNOUNCEMENT EDIT

function cancelAnnouncementEdit() {
    editingAnnouncementId = null;

    const form = document.getElementById("announcementForm");

    if (form) {
        form.reset();
    }

    document.getElementById("announcementFormTitle").textContent =
        "Create New Announcement";

    document.getElementById("announcementSubmitBtn").textContent =
        "Publish Announcement";

    document.getElementById("cancelAnnouncementEdit").style.display =
        "none";
}


// DELETE ANNOUNCEMENT

async function deleteAnnouncement(id) {
    if (!confirm("Are you sure you want to delete this announcement?")) {
        return;
    }

    try {
        const headers = getAuthHeaders();

        const response = await fetch(`${ANNOUNCEMENT_API_URL}/${id}`, {
            method: "DELETE",
            headers,
            credentials: "same-origin"
        });

        await handleResponse(response);

        if (editingAnnouncementId === id) {
            cancelAnnouncementEdit();
        }

        alert("Announcement deleted successfully!");

        await loadAnnouncements();

    } catch (error) {
        alert(error.message);
    }
}


// ANNOUNCEMENT EVENT LISTENERS

document.addEventListener("DOMContentLoaded", function () {

    const announcementForm =
        document.getElementById("announcementForm");

    if (announcementForm) {
        announcementForm.addEventListener("submit", saveAnnouncement);
    }

    const cancelButton =
        document.getElementById("cancelAnnouncementEdit");

    if (cancelButton) {
        cancelButton.addEventListener("click", cancelAnnouncementEdit);
    }

    loadAnnouncements();
});


// ======================================
// 11. FACULTY MANAGEMENT
// ======================================

const FACULTY_API_URL = "/api/faculty";

let allFaculty = [];
let editingFacultyId = null;


// LOAD FACULTY

async function loadFaculty() {
    const tbody = document.getElementById("facultyTableBody");

    if (!tbody) return;

    try {
        const headers = getAuthHeaders();

        const response = await fetch(FACULTY_API_URL, {
            method: "GET",
            headers,
            credentials: "same-origin"
        });

        allFaculty = await handleResponse(response);

        displayFaculty(allFaculty);

    } catch (error) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9">${escapeHTML(error.message)}</td>
            </tr>
        `;
    }
}


// DISPLAY FACULTY

function displayFaculty(facultyList) {
    const tbody = document.getElementById("facultyTableBody");

    if (!tbody) return;

    if (!facultyList || facultyList.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9">No faculty records found.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = facultyList.map(faculty => `
        <tr>
            <td>${faculty.id}</td>
            <td>${escapeHTML(faculty.teacherName)}</td>
            <td>${escapeHTML(faculty.mobileNumber)}</td>
            <td>${escapeHTML(faculty.qualification)}</td>
            <td>${escapeHTML(faculty.subject)}</td>
            <td>${faculty.experience} Years</td>
            <td>${faculty.joiningDate || "-"}</td>
            <td>
                <span class="${faculty.active ? "status-active" : "status-inactive"}">
                    ${faculty.active ? "Active" : "Inactive"}
                </span>
            </td>
            <td>
                <button class="edit-btn" onclick="editFaculty(${faculty.id})">
                    Edit
                </button>

                <button class="delete-btn" onclick="deleteFaculty(${faculty.id})">
                    Delete
                </button>
            </td>
        </tr>
    `).join("");
}


// ADD / UPDATE FACULTY

async function saveFaculty(event) {
    event.preventDefault();

    const faculty = {
        teacherName: document.getElementById("facultyTeacherName").value.trim(),
        mobileNumber: document.getElementById("facultyMobileNumber").value.trim(),
        qualification: document.getElementById("facultyQualification").value.trim(),
        subject: document.getElementById("facultySubject").value,
        experience: Number(document.getElementById("facultyExperience").value),
        active: document.getElementById("facultyActive").value === "true"
    };

    try {
        const headers = getAuthHeaders();

        const isEditing = editingFacultyId !== null;

        const response = await fetch(
            isEditing
                ? `${FACULTY_API_URL}/${editingFacultyId}`
                : FACULTY_API_URL,
            {
                method: isEditing ? "PUT" : "POST",
                headers,
                credentials: "same-origin",
                body: JSON.stringify(faculty)
            }
        );

        await handleResponse(response);

        alert(isEditing
            ? "Faculty updated successfully!"
            : "Faculty added successfully!");

        cancelFacultyEdit();

        await loadFaculty();

    } catch (error) {
        alert(error.message);
    }
}


// EDIT FACULTY

function editFaculty(id) {
    const faculty = allFaculty.find(item => item.id === id);

    if (!faculty) return;

    editingFacultyId = id;

    document.getElementById("facultyTeacherName").value =
        faculty.teacherName;

    document.getElementById("facultyMobileNumber").value =
        faculty.mobileNumber;

    document.getElementById("facultyQualification").value =
        faculty.qualification;

    document.getElementById("facultySubject").value =
        faculty.subject;

    document.getElementById("facultyExperience").value =
        faculty.experience;

    document.getElementById("facultyActive").value =
        String(faculty.active);

    document.getElementById("facultyFormTitle").textContent =
        "Edit Faculty";

    document.getElementById("facultySubmitBtn").textContent =
        "Update Faculty";

    document.getElementById("cancelFacultyEdit").style.display =
        "inline-block";

    document.getElementById("facultyForm").scrollIntoView({
        behavior: "smooth"
    });
}


// CANCEL FACULTY EDIT

function cancelFacultyEdit() {
    editingFacultyId = null;

    document.getElementById("facultyForm").reset();

    document.getElementById("facultyFormTitle").textContent =
        "Add New Faculty";

    document.getElementById("facultySubmitBtn").textContent =
        "Add Faculty";

    document.getElementById("cancelFacultyEdit").style.display =
        "none";
}


// DELETE FACULTY

async function deleteFaculty(id) {
    if (!confirm("Are you sure you want to delete this faculty?")) {
        return;
    }

    try {
        const headers = getAuthHeaders();

        const response = await fetch(`${FACULTY_API_URL}/${id}`, {
            method: "DELETE",
            headers,
            credentials: "same-origin"
        });

        await handleResponse(response);

        if (editingFacultyId === id) {
            cancelFacultyEdit();
        }

        alert("Faculty deleted successfully!");

        await loadFaculty();

    } catch (error) {
        alert(error.message);
    }
}


// FACULTY EVENT LISTENERS

document.addEventListener("DOMContentLoaded", function () {

    const facultyForm = document.getElementById("facultyForm");
    const cancelButton = document.getElementById("cancelFacultyEdit");

    if (facultyForm) {
        facultyForm.addEventListener("submit", saveFaculty);
    }

    if (cancelButton) {
        cancelButton.addEventListener("click", cancelFacultyEdit);
    }

    loadFaculty();
});


// ======================================
// 12. GALLERY MANAGEMENT
// ======================================

const GALLERY_API_URL = "/api/gallery";

let allGallery = [];


// LOAD GALLERY

async function loadGallery() {
    const tbody = document.getElementById("galleryTableBody");

    if (!tbody) return;

    try {
        const headers = getAuthHeaders();

        const response = await fetch(GALLERY_API_URL, {
            method: "GET",
            headers,
            credentials: "same-origin"
        });

        allGallery = await handleResponse(response);

        displayGallery(allGallery);

    } catch (error) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7">${escapeHTML(error.message)}</td>
            </tr>
        `;
    }
}


// DISPLAY GALLERY

function displayGallery(galleryList) {
    const tbody = document.getElementById("galleryTableBody");

    if (!tbody) return;

    if (!galleryList || galleryList.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7">No gallery photos found.</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = galleryList.map(photo => `
        <tr>
            <td>${photo.id}</td>
            <td>
                <img
                    src="${escapeHTML(photo.imagePath)}"
                    alt="${escapeHTML(photo.title)}"
                    style="width:80px;height:60px;object-fit:cover;border-radius:8px;"
                >
            </td>
            <td>${escapeHTML(photo.title)}</td>
            <td>${escapeHTML(photo.category)}</td>
            <td>${photo.uploadedAt ? escapeHTML(photo.uploadedAt.replace("T", " ")) : "-"}</td>
            <td>
                <span class="${photo.active ? "status-active" : "status-inactive"}">
                    ${photo.active ? "Active" : "Inactive"}
                </span>
            </td>
            <td>
                <button class="delete-btn"
                    onclick="deleteGallery(${photo.id})">
                    Delete
                </button>
            </td>
        </tr>
    `).join("");
}


// UPLOAD GALLERY PHOTO

async function uploadGallery(event) {
    event.preventDefault();

    const title = document.getElementById("galleryTitle").value.trim();
    const category = document.getElementById("galleryCategory").value;
    const image = document.getElementById("galleryImage").files[0];

    if (!image) {
        alert("Please select an image.");
        return;
    }

    if (image.size > 5 * 1024 * 1024) {
        alert("Image size must be under 5 MB.");
        return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(image.type)) {
        alert("Only JPG, PNG and WEBP images are allowed.");
        return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", image);

    try {
        const headers = getAuthHeaders();

        // FormData ke liye Content-Type manually set nahi karna hai.
        delete headers["Content-Type"];

        const response = await fetch(GALLERY_API_URL, {
            method: "POST",
            headers,
            credentials: "same-origin",
            body: formData
        });

        await handleResponse(response);

        alert("Photo uploaded successfully!");

        document.getElementById("galleryForm").reset();

        await loadGallery();

    } catch (error) {
        alert(error.message);
    }
}


// DELETE GALLERY PHOTO

async function deleteGallery(id) {
    if (!confirm("Are you sure you want to delete this photo?")) {
        return;
    }

    try {
        const headers = getAuthHeaders();

        const response = await fetch(`${GALLERY_API_URL}/${id}`, {
            method: "DELETE",
            headers,
            credentials: "same-origin"
        });

        await handleResponse(response);

        alert("Photo deleted successfully!");

        await loadGallery();

    } catch (error) {
        alert(error.message);
    }
}


// GALLERY EVENT LISTENERS

document.addEventListener("DOMContentLoaded", function () {

    const galleryForm = document.getElementById("galleryForm");

    if (galleryForm) {
        galleryForm.addEventListener("submit", uploadGallery);
    }

    loadGallery();
});

// ==========================================
// 13. TESTIMONIALS MANAGEMENT
// ==========================================

const TESTIMONIAL_API_URL = "/api/testimonials";

let allTestimonials = [];
let editingTestimonialId = null;


// LOAD TESTIMONIALS

async function loadTestimonials() {
    const tbody = document.getElementById("testimonialTableBody");
    if (!tbody) return;

    try {
        const response = await fetch(TESTIMONIAL_API_URL, {
            method: "GET",
            headers: getAuthHeaders(),
            credentials: "same-origin"
        });

        allTestimonials = await handleResponse(response);
        displayTestimonials(allTestimonials);

    } catch (error) {
        console.error("Testimonials Error:", error);
        tbody.innerHTML =
            `<tr><td colspan="7">${escapeHTML(error.message)}</td></tr>`;
    }
}


// DISPLAY TESTIMONIALS

function displayTestimonials(list) {
    const tbody = document.getElementById("testimonialTableBody");
    if (!tbody) return;

    if (!list || list.length === 0) {
        tbody.innerHTML =
            `<tr><td colspan="7">No testimonials found.</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(item => `
        <tr>
            <td>${item.id}</td>
            <td>${escapeHTML(item.studentName)}</td>
            <td>Class ${escapeHTML(item.studentClass)}</td>
            <td>${escapeHTML(item.feedback)}</td>
            <td>
                <span class="${item.approved ? "status-active" : "status-inactive"}">
                    ${item.approved ? "Approved" : "Pending"}
                </span>
            </td>
            <td>${escapeHTML(item.createdAt || "-")}</td>
            <td>
                <button type="button" class="edit-btn"
                    onclick="editTestimonial(${item.id})">
                    Edit
                </button>

                <button type="button" class="add-student-btn"
                    onclick="toggleTestimonialApproval(${item.id}, ${!item.approved})">
                    ${item.approved ? "Reject" : "Approve"}
                </button>

                <button type="button" class="delete-btn"
                    onclick="deleteTestimonial(${item.id})">
                    Delete
                </button>
            </td>
        </tr>
    `).join("");
}


// ADD / UPDATE TESTIMONIAL

async function saveTestimonial(event) {
    event.preventDefault();

    const testimonial = {
        studentName: document.getElementById("testimonialStudentName").value.trim(),
        studentClass: Number(document.getElementById("testimonialClass").value),
        feedback: document.getElementById("testimonialFeedback").value.trim()
    };

    try {
        const isEditing = editingTestimonialId !== null;

        const response = await fetch(
            isEditing
                ? `${TESTIMONIAL_API_URL}/${editingTestimonialId}`
                : TESTIMONIAL_API_URL,
            {
                method: isEditing ? "PUT" : "POST",
                headers: getAuthHeaders(),
                credentials: "same-origin",
                body: JSON.stringify(testimonial)
            }
        );

        await handleResponse(response);

        alert(isEditing
            ? "Testimonial updated successfully!"
            : "Testimonial added successfully! It is pending approval.");

        cancelTestimonialEdit();
        await loadTestimonials();

    } catch (error) {
        alert(error.message);
    }
}


// EDIT TESTIMONIAL

function editTestimonial(id) {
    const item = allTestimonials.find(
        testimonial => Number(testimonial.id) === Number(id)
    );

    if (!item) {
        alert("Testimonial not found!");
        return;
    }

    editingTestimonialId = id;

    document.getElementById("testimonialStudentName").value =
        item.studentName;

    document.getElementById("testimonialClass").value =
        item.studentClass;

    document.getElementById("testimonialFeedback").value =
        item.feedback;

    document.getElementById("testimonialFormTitle").textContent =
        "Update Testimonial";

    document.getElementById("testimonialSubmitBtn").textContent =
        "Update Testimonial";

    document.getElementById("cancelTestimonialEdit").style.display =
        "inline-block";

    document.getElementById("testimonialForm").scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


// CANCEL TESTIMONIAL EDIT

function cancelTestimonialEdit() {
    editingTestimonialId = null;

    document.getElementById("testimonialForm").reset();

    document.getElementById("testimonialFormTitle").textContent =
        "Add New Testimonial";

    document.getElementById("testimonialSubmitBtn").textContent =
        "Add Testimonial";

    document.getElementById("cancelTestimonialEdit").style.display =
        "none";
}


// APPROVE / REJECT TESTIMONIAL

async function toggleTestimonialApproval(id, approved) {
    const action = approved ? "approve" : "reject";

    if (!confirm(`Are you sure you want to ${action} this testimonial?`)) {
        return;
    }

    try {
        const response = await fetch(
            `${TESTIMONIAL_API_URL}/${id}/approval`,
            {
                method: "PUT",
                headers: getAuthHeaders(),
                credentials: "same-origin",
                body: JSON.stringify({ approved })
            }
        );

        await handleResponse(response);

        alert(`Testimonial ${approved ? "approved" : "rejected"} successfully!`);
        await loadTestimonials();

    } catch (error) {
        alert(error.message);
    }
}


// DELETE TESTIMONIAL

async function deleteTestimonial(id) {
    if (!confirm("Are you sure you want to delete this testimonial?")) {
        return;
    }

    try {
        const response = await fetch(`${TESTIMONIAL_API_URL}/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
            credentials: "same-origin"
        });

        await handleResponse(response);

        if (Number(editingTestimonialId) === Number(id)) {
            cancelTestimonialEdit();
        }

        alert("Testimonial deleted successfully!");
        await loadTestimonials();

    } catch (error) {
        alert(error.message);
    }
}


// TESTIMONIAL EVENT LISTENERS

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("testimonialForm");
    const cancelButton = document.getElementById("cancelTestimonialEdit");

    if (form) {
        form.addEventListener("submit", saveTestimonial);
    }

    if (cancelButton) {
        cancelButton.addEventListener("click", cancelTestimonialEdit);
    }

    loadTestimonials();
});


// ==========================================
// 14. STUDENT RESULTS MANAGEMENT
// ==========================================

const RESULT_API_URL = "/api/results";

let allResults = [];
let editingResultId = null;


// LOAD RESULTS

async function loadResults() {
    const tbody = document.getElementById("resultTableBody");
    if (!tbody) return;

    try {
        const response = await fetch(RESULT_API_URL, {
            method: "GET",
            headers: getAuthHeaders(),
            credentials: "same-origin"
        });

        allResults = await handleResponse(response);
        displayResults(allResults);

    } catch (error) {
        console.error("Results Error:", error);
        tbody.innerHTML =
            `<tr><td colspan="11">${escapeHTML(error.message)}</td></tr>`;
    }
}


// DISPLAY RESULTS

function displayResults(list) {
    const tbody = document.getElementById("resultTableBody");
    if (!tbody) return;

    if (!list || list.length === 0) {
        tbody.innerHTML =
            `<tr><td colspan="11">No student results found.</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(item => `
        <tr>
            <td>${item.id}</td>
            <td>${escapeHTML(item.studentName)}</td>
            <td>Class ${escapeHTML(item.studentClass)}</td>
            <td>${escapeHTML(item.examName)}</td>
            <td>${escapeHTML(item.totalMarks)}</td>
            <td>${escapeHTML(item.obtainedMarks)}</td>
            <td>
                ${item.percentage != null
                    ? Number(item.percentage).toFixed(2) + "%"
                    : "-"}
            </td>
            <td>${escapeHTML(item.grade || "-")}</td>
            <td>${escapeHTML(item.academicYear || "-")}</td>
            <td>
                <span class="${item.approved ? "status-active" : "status-inactive"}">
                    ${item.approved ? "Approved" : "Pending"}
                </span>
            </td>
            <td>
                <button type="button" class="edit-btn"
                    onclick="editResult(${item.id})">
                    Edit
                </button>

                <button type="button" class="add-student-btn"
                    onclick="toggleResultApproval(${item.id}, ${!item.approved})">
                    ${item.approved ? "Reject" : "Approve"}
                </button>

                <button type="button" class="delete-btn"
                    onclick="deleteResult(${item.id})">
                    Delete
                </button>
            </td>
        </tr>
    `).join("");
}


// ADD / UPDATE RESULT

async function saveResult(event) {
    event.preventDefault();

    const totalMarks = Number(
        document.getElementById("resultTotalMarks").value
    );

    const obtainedMarks = Number(
        document.getElementById("resultObtainedMarks").value
    );

    if (totalMarks <= 0) {
        alert("Total marks must be greater than zero.");
        return;
    }

    if (obtainedMarks < 0 || obtainedMarks > totalMarks) {
        alert("Obtained marks must be between 0 and total marks.");
        return;
    }

    const result = {
        studentName: document.getElementById("resultStudentName").value.trim(),
        studentClass: Number(document.getElementById("resultClass").value),
        examName: document.getElementById("resultExamName").value.trim(),
        totalMarks,
        obtainedMarks,
        academicYear: document.getElementById("resultAcademicYear").value.trim()
    };

    try {
        const isEditing = editingResultId !== null;

        const response = await fetch(
            isEditing
                ? `${RESULT_API_URL}/${editingResultId}`
                : RESULT_API_URL,
            {
                method: isEditing ? "PUT" : "POST",
                headers: getAuthHeaders(),
                credentials: "same-origin",
                body: JSON.stringify(result)
            }
        );

        await handleResponse(response);

        alert(isEditing
            ? "Result updated successfully!"
            : "Result added successfully! It is pending approval.");

        cancelResultEdit();
        await loadResults();

    } catch (error) {
        alert(error.message);
    }
}


// EDIT RESULT

function editResult(id) {
    const item = allResults.find(
        result => Number(result.id) === Number(id)
    );

    if (!item) {
        alert("Result not found!");
        return;
    }

    editingResultId = id;

    document.getElementById("resultStudentName").value =
        item.studentName;

    document.getElementById("resultClass").value =
        item.studentClass;

    document.getElementById("resultExamName").value =
        item.examName;

    document.getElementById("resultTotalMarks").value =
        item.totalMarks;

    document.getElementById("resultObtainedMarks").value =
        item.obtainedMarks;

    document.getElementById("resultAcademicYear").value =
        item.academicYear || "";

    document.getElementById("resultFormTitle").textContent =
        "Update Student Result";

    document.getElementById("resultSubmitBtn").textContent =
        "Update Result";

    document.getElementById("cancelResultEdit").style.display =
        "inline-block";

    document.getElementById("resultForm").scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


// CANCEL RESULT EDIT

function cancelResultEdit() {
    editingResultId = null;

    document.getElementById("resultForm").reset();

    document.getElementById("resultFormTitle").textContent =
        "Add New Result";

    document.getElementById("resultSubmitBtn").textContent =
        "Add Result";

    document.getElementById("cancelResultEdit").style.display =
        "none";
}


// APPROVE / REJECT RESULT

async function toggleResultApproval(id, approved) {
    const action = approved ? "approve" : "reject";

    if (!confirm(`Are you sure you want to ${action} this result?`)) {
        return;
    }

    try {
        const response = await fetch(
            `${RESULT_API_URL}/${id}/approval`,
            {
                method: "PUT",
                headers: getAuthHeaders(),
                credentials: "same-origin",
                body: JSON.stringify({ approved })
            }
        );

        await handleResponse(response);

        alert(`Result ${approved ? "approved" : "rejected"} successfully!`);
        await loadResults();

    } catch (error) {
        alert(error.message);
    }
}


// DELETE RESULT

async function deleteResult(id) {
    if (!confirm("Are you sure you want to delete this result?")) {
        return;
    }

    try {
        const response = await fetch(`${RESULT_API_URL}/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
            credentials: "same-origin"
        });

        await handleResponse(response);

        if (Number(editingResultId) === Number(id)) {
            cancelResultEdit();
        }

        alert("Result deleted successfully!");
        await loadResults();

    } catch (error) {
        alert(error.message);
    }
}


// RESULT EVENT LISTENERS

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("resultForm");
    const cancelButton = document.getElementById("cancelResultEdit");

    if (form) {
        form.addEventListener("submit", saveResult);
    }

    if (cancelButton) {
        cancelButton.addEventListener("click", cancelResultEdit);
    }

    loadResults();
});
