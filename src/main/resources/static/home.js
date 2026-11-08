// =====================================
// SECURITY HELPER
// =====================================

function escapeHTML(value) {
    const element = document.createElement("div");
    element.textContent = value ?? "";
    return element.innerHTML;
}


// =====================================
// PUBLIC COURSES
// =====================================

const COURSE_API_URL = "/api/courses/public";

async function loadPublicCourses() {

    const container = document.getElementById("courseContainer");

    if (!container) return;

    try {
        const response = await fetch(COURSE_API_URL);

        if (!response.ok) {
            throw new Error(`Course error: ${response.status}`);
        }

        const courses = await response.json();

        const activeCourses = courses.filter(
            course => course.active === true
        );

        if (activeCourses.length === 0) {
            container.innerHTML = "<p>Courses coming soon!</p>";
            return;
        }

        container.innerHTML = activeCourses.map(course => {

            const startClass = Number(course.startClass);
            const endClass = Number(course.endClass);

            const classRange = startClass === endClass
                ? `Class ${startClass}`
                : `Classes ${startClass}–${endClass}`;

            const isChemistry =
                course.subject?.toLowerCase() === "chemistry";

            const icon = isChemistry ? "🧪" : "📚";

            const level = isChemistry
                ? "SUBJECT-FOCUSED LEARNING"
                : "FOUNDATION LEARNING";

            return `
                <article class="course-card course-card-primary">

                    <div class="course-icon" aria-hidden="true">
                        ${icon}
                    </div>

                    <span class="course-level">
                        ${level}
                    </span>

                    <h3>${escapeHTML(classRange)}</h3>

                    <p class="course-subject">
                        ${escapeHTML(course.courseName)}
                    </p>

                    <p class="course-description">
                        ${escapeHTML(course.description || "Explore our learning program.")}
                    </p>

                    <p class="course-subject">
                        ${escapeHTML(course.subject)}
                    </p>

                    <a href="#contact" class="course-btn">
                        Enquire Now <span aria-hidden="true">→</span>
                    </a>

                </article>
            `;

        }).join("");

    } catch (error) {

        console.error("Course Error:", error);

        container.textContent =
            "Courses are temporarily unavailable. Please try again later.";
    }
}


// =====================================
// PUBLIC FACULTY
// =====================================

const FACULTY_API_URL = "/api/faculty/public";

async function loadPublicFaculty() {

    const container = document.getElementById("facultyContainer");

    if (!container) return;

    try {

        const response = await fetch(FACULTY_API_URL);

        if (!response.ok) {
            throw new Error(`Faculty error: ${response.status}`);
        }

        const facultyList = await response.json();

        if (!Array.isArray(facultyList) || facultyList.length === 0) {

            container.innerHTML = `
                <p class="faculty-empty">
                    Faculty details will be available soon.
                </p>
            `;

            return;
        }

        container.innerHTML = facultyList.map(faculty => {

            return `
                <article class="faculty-card">

                    <div class="faculty-icon" aria-hidden="true">
                        👨‍🏫
                    </div>

                    <span class="faculty-card-tag">
                        OUR FACULTY
                    </span>

                    <h3>
                        ${escapeHTML(faculty.teacherName)}
                    </h3>

                    <p class="faculty-qualification">
                        ${escapeHTML(faculty.qualification)}
                    </p>

                    <div class="faculty-details">

                        <p>
                            <strong>Subject:</strong>
                            ${escapeHTML(faculty.subject)}
                        </p>

                        <p>
                            <strong>Experience:</strong>
                            ${
                                faculty.experience != null
                                    ? `${escapeHTML(faculty.experience)} Years`
                                    : "Not specified"
                            }
                        </p>

                    </div>

                </article>
            `;

        }).join("");

    } catch (error) {

        console.error("Faculty Error:", error);

        container.textContent =
            "Faculty details are temporarily unavailable.";

    }
}


// =====================================
// PUBLIC GALLERY
// =====================================

const GALLERY_API_URL = "/api/public/gallery";

async function loadPublicGallery() {

    const container = document.getElementById("galleryContainer");

    if (!container) return;

    try {

        const response = await fetch(GALLERY_API_URL);

        if (!response.ok) {
            throw new Error(`Gallery error: ${response.status}`);
        }

        const photos = await response.json();

        const activePhotos = photos.filter(
            photo => photo.active === true
        );

        if (activePhotos.length === 0) {
            container.innerHTML = "<p>Gallery photos coming soon!</p>";
            return;
        }

        container.innerHTML = activePhotos.map(photo => `
            <div class="gallery-card">

                <img
                    src="${escapeHTML(photo.imagePath)}"
                    alt="${escapeHTML(photo.title)}"
                    loading="lazy"
                >

                <h3>${escapeHTML(photo.title)}</h3>

                <p>${escapeHTML(photo.category)}</p>

            </div>
        `).join("");

    } catch (error) {

        console.error("Gallery Error:", error);

        container.textContent = "Gallery abhi load nahi ho paayi.";

    }
}
// =====================================
// PUBLIC ANNOUNCEMENTS
// =====================================

const ANNOUNCEMENT_API_URL = "/api/public/announcements";

async function loadPublicAnnouncements() {

    const container = document.getElementById("announcementContainer");

    if (!container) return;

    try {

        const response = await fetch(ANNOUNCEMENT_API_URL);

        if (!response.ok) {
            throw new Error(`Announcement error: ${response.status}`);
        }

        const announcements = await response.json();

        const activeAnnouncements = announcements.filter(
            item => item.active === true
        );

        if (activeAnnouncements.length === 0) {
            container.innerHTML =
                "<p>There are no new announcements.</p>";
            return;
        }

        container.innerHTML = activeAnnouncements.map(item => `
            <div class="announcement-card">

                <span class="announcement-type">
                    ${escapeHTML(item.type || "Notice")}
                </span>

                <h3>${escapeHTML(item.title)}</h3>

                <p>${escapeHTML(item.message)}</p>

                <small>
                    ${item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("en-IN")
                        : ""}
                </small>

            </div>
        `).join("");

    } catch (error) {

        console.error("Announcement Error:", error);

        container.textContent =
            "Announcements abhi load nahi ho paaye.";

    }
}


// =====================================
// PUBLIC ENQUIRY FORM
// =====================================

const ENQUIRY_API_URL = "/api/enquiries";

async function submitPublicEnquiry(event) {

    event.preventDefault();

    const form = event.currentTarget;

    const submitBtn =
        document.getElementById("enquirySubmitBtn");

    const responseMessage =
        document.getElementById("enquiryResponse");

    const enquiryData = {

        studentName:
            document.getElementById("studentName").value.trim(),

        parentName:
            document.getElementById("parentName").value.trim(),

        mobileNumber:
            document.getElementById("mobileNumber").value.trim(),

        studentClass:
            Number(document.getElementById("studentClass").value),

        subject:
            document.getElementById("subject").value.trim(),

        message:
            document.getElementById("message").value.trim()
    };

    responseMessage.textContent = "";

    // REQUIRED FIELDS VALIDATION

    if (
        !enquiryData.studentName ||
        !enquiryData.parentName ||
        !enquiryData.mobileNumber ||
        !enquiryData.studentClass ||
        !enquiryData.subject
    ) {

        responseMessage.textContent =
            "Please fill all required fields.";

        responseMessage.style.color = "red";

        return;
    }

    // MOBILE VALIDATION

    if (!/^[6-9][0-9]{9}$/.test(enquiryData.mobileNumber)) {

        responseMessage.textContent =
            "Enter a valid 10-digit mobile number.";

        responseMessage.style.color = "red";

        return;
    }

    // SUBJECT VALIDATION

    const selectedClass = enquiryData.studentClass;
    const selectedSubject = enquiryData.subject;

    if (
        selectedClass >= 1 &&
        selectedClass <= 8 &&
        selectedSubject !== "All Subjects"
    ) {

        responseMessage.textContent =
            "Class 1–8 ke liye All Subjects select karein.";

        responseMessage.style.color = "red";

        return;
    }

    if (
        selectedClass >= 9 &&
        selectedClass <= 12 &&
        selectedSubject !== "Chemistry"
    ) {

        responseMessage.textContent =
            "Class 9–12 ke liye Chemistry select karein.";

        responseMessage.style.color = "red";

        return;
    }

    try {

        submitBtn.disabled = true;

        submitBtn.textContent = "Submitting...";

        const response = await fetch(ENQUIRY_API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(enquiryData)

        });

        if (!response.ok) {

            const errorText = await response.text();

            console.error(
                "Backend Error:",
                response.status,
                errorText
            );

            throw new Error(
                errorText || `Request failed: ${response.status}`
            );
        }

        responseMessage.textContent =
            "Your enquiry has been submitted successfully!";

        responseMessage.style.color = "green";

        form.reset();

        // RESET SUBJECT DROPDOWN

        const subjectSelect =
            document.getElementById("subject");

        subjectSelect.innerHTML =
            '<option value="">First Select Your Class</option>';

        subjectSelect.disabled = true;

    } catch (error) {

        console.error("Enquiry Error:", error);

        responseMessage.textContent =
            error.message || "Unable to submit enquiry.";

        responseMessage.style.color = "red";

    } finally {

        submitBtn.disabled = false;

        submitBtn.textContent = "Submit Enquiry";

    }
}
// =====================================
// INITIALIZE WEBSITE
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    // LOAD PUBLIC COURSES
    loadPublicCourses();

    // LOAD PUBLIC FACULTY
    loadPublicFaculty();

    // LOAD PUBLIC GALLERY
    loadPublicGallery();

    // LOAD PUBLIC ANNOUNCEMENTS
    loadPublicAnnouncements();

    // LOAD TESTIMONIALS
    loadPublicTestimonials();

    // LOAD STUDENT RESULTS
    loadPublicResults();

    // ENQUIRY FORM
    const enquiryForm =
        document.getElementById("publicEnquiryForm");

    if (enquiryForm) {

        enquiryForm.addEventListener(
            "submit",
            submitPublicEnquiry
        );

    }

});


// =====================================
// MOBILE NAVIGATION MENU
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    const menuToggle =
        document.getElementById("menuToggle");

    const mainNav =
        document.getElementById("mainNav");

    if (!menuToggle || !mainNav) return;

    menuToggle.addEventListener("click", function () {

        const isOpen =
            mainNav.classList.toggle("active");

        menuToggle.classList.toggle("active", isOpen);

        menuToggle.setAttribute(
            "aria-expanded",
            isOpen
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );

    });

    mainNav.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {

            mainNav.classList.remove("active");

            menuToggle.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

        });

    });

});


// =====================================
// PUBLIC TESTIMONIALS
// =====================================

const PUBLIC_TESTIMONIAL_API = "/api/testimonials/public";

async function loadPublicTestimonials() {

    const container =
        document.getElementById("testimonialContainer");

    if (!container) return;

    try {

        const response = await fetch(PUBLIC_TESTIMONIAL_API);

        if (!response.ok) {
            throw new Error(`Testimonials error: ${response.status}`);
        }

        const testimonials = await response.json();

        if (!Array.isArray(testimonials) || testimonials.length === 0) {
            container.innerHTML =
                "<p>Student testimonials coming soon!</p>";
            return;
        }

        const approvedTestimonials = testimonials.filter(
            item => item.approved === true
        );

        if (approvedTestimonials.length === 0) {
            container.innerHTML =
                "<p>Student testimonials coming soon!</p>";
            return;
        }

        container.innerHTML = approvedTestimonials
            .map(item => `
                <article class="testimonial-card">

                    <div class="testimonial-icon">❝</div>

                    <p>${escapeHTML(item.feedback)}</p>

                    <h3>${escapeHTML(item.studentName)}</h3>

                    <span>Class ${escapeHTML(item.studentClass)}</span>

                </article>
            `).join("");

    } catch (error) {

        console.error("Testimonials Error:", error);

        container.textContent =
            "Testimonials are temporarily unavailable.";

    }
}


// =====================================
// PUBLIC STUDENT RESULTS
// =====================================

const PUBLIC_RESULT_API = "/api/results/public";

async function loadPublicResults() {

    const container =
        document.getElementById("resultContainer");

    if (!container) return;

    try {

        const response = await fetch(PUBLIC_RESULT_API);

        if (!response.ok) {
            throw new Error(`Results error: ${response.status}`);
        }

        const results = await response.json();

        if (!Array.isArray(results) || results.length === 0) {
            container.innerHTML =
                "<p>Student results coming soon!</p>";
            return;
        }

        const approvedResults = results.filter(
            item => item.approved === true
        );

        if (approvedResults.length === 0) {
            container.innerHTML =
                "<p>Student results coming soon!</p>";
            return;
        }

        container.innerHTML = approvedResults
            .map(item => `
                <article class="result-card">

                    <div class="result-icon">🏆</div>

                    <h3>${escapeHTML(item.studentName)}</h3>

                    <p>Class ${escapeHTML(item.studentClass)}</p>

                    <p>${escapeHTML(item.examName)}</p>

                    <div class="result-marks">
                        <strong>
                            ${escapeHTML(item.obtainedMarks)}
                            /
                            ${escapeHTML(item.totalMarks)}
                        </strong>
                    </div>

                    <p>
                        Percentage:
                        <strong>
                            ${item.percentage != null
                                ? Number(item.percentage).toFixed(2) + "%"
                                : "-"}
                        </strong>
                    </p>

                    <p>
                        Grade:
                        <strong>${escapeHTML(item.grade || "-")}</strong>
                    </p>

                    <small>
                        ${escapeHTML(item.academicYear || "")}
                    </small>

                </article>
            `).join("");

    } catch (error) {

        console.error("Results Error:", error);

        container.textContent =
            "Student results are temporarily unavailable.";

    }
}