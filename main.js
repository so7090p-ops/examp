/* =====================================================
   إعدادات أساسية
===================================================== */

const TOTAL_WEEKS = 18;

const DAYS = [
    "الأحد",
    "الاثنين",
    "الثلاثاء"
];

let fields = [
    "المجال الثقافي",
    "المجال الاجتماعي",
    "المجال الرياضي",
    "المجال الفني",
    "المجال العلمي"
];

let weekDates = Array.from(
    { length: TOTAL_WEEKS },
    (_, i) => `الأسبوع ${i + 1}`
);

let programs = {};

let settings = {
    region: "القصيم",
    administration: "إدارة التعليم بالقصيم",
    school: "اسم المدرسة",
    year: "1448هـ"
};

let selectedWeek = null;
let selectedDay = null;


/* =====================================================
   تحميل البيانات
===================================================== */

function loadData() {

    const savedSettings =
        localStorage.getItem("activitySettings");

    const savedFields =
        localStorage.getItem("activityFields");

    const savedDates =
        localStorage.getItem("activityDates");

    const savedPrograms =
        localStorage.getItem("activityPrograms");


    if (savedSettings) {
        try {
            settings = {
                ...settings,
                ...JSON.parse(savedSettings)
            };
        } catch (e) {}
    }


    if (savedFields) {
        try {
            fields = JSON.parse(savedFields);
        } catch (e) {}
    }


    if (savedDates) {
        try {
            weekDates = JSON.parse(savedDates);
        } catch (e) {}
    }


    if (savedPrograms) {
        try {
            programs = JSON.parse(savedPrograms);
        } catch (e) {}
    }
}


/* =====================================================
   عرض البيانات في الرأس
===================================================== */

function updateHeader() {

    document.getElementById("headerRegion").textContent =
        settings.region || "—";

    document.getElementById("headerAdministration").textContent =
        settings.administration || "—";

    document.getElementById("headerSchool").textContent =
        settings.school || "—";

    document.getElementById("headerYear").textContent =
        settings.year || "1448هـ";
}


/* =====================================================
   إنشاء الأسابيع
===================================================== */

function renderWeeks() {

    const container =
        document.getElementById("weeksContainer");

    container.innerHTML = "";


    for (let week = 1; week <= TOTAL_WEEKS; week++) {

        const card =
            document.createElement("section");

        card.className = "week-card";


        const title =
            document.createElement("div");

        title.className = "week-title";

        title.innerHTML = `
            الأسبوع ${week}
            <div class="week-date">
                ${escapeHtml(weekDates[week - 1] || "")}
            </div>
        `;


        card.appendChild(title);


        const header =
            document.createElement("div");

        header.className = "days-header";

        header.innerHTML = `
            <div>اليوم</div>
            <div>البرنامج</div>
            <div>الحصص</div>
        `;

        card.appendChild(header);


        DAYS.forEach(day => {

            const row =
                document.createElement("div");

            row.className = "day-row";


            const name =
                document.createElement("div");

            name.className = "day-name";

            name.textContent = day;


            const content =
                document.createElement("div");

            content.className = "day-content";


            const sessions =
                document.createElement("div");

            sessions.className = "day-sessions";


            const key =
                makeKey(week, day);


            const dayPrograms =
                programs[key] || [];


            if (dayPrograms.length === 0) {

                content.innerHTML = `
                    <div class="no-program">
                        لا يوجد برنامج
                        <div class="add-text">
                            اضغطي لإضافة برنامج
                        </div>
                    </div>
                `;

            } else {

                dayPrograms.forEach(program => {

                    const item =
                        document.createElement("div");

                    item.className = "program-item";


                    item.innerHTML = `
                        <div class="program-name">
                            ${escapeHtml(program.name)}
                        </div>

                        <div class="program-field">
                            ${escapeHtml(program.field)}
                        </div>

                        ${
                            program.teacher
                            ? `
                            <div class="program-field">
                                ${escapeHtml(program.teacher)}
                            </div>
                            `
                            : ""
                        }

                        ${
                            program.notes
                            ? `
                            <div class="program-field">
                                ${escapeHtml(program.notes)}
                            </div>
                            `
                            : ""
                        }

                        <div class="program-sessions">
                            ${program.sessions} حصة
                        </div>
                    `;


                    item.onclick = function(event) {

                        event.stopPropagation();

                        openProgram(week, day, program.id);

                    };


                    content.appendChild(item);

                });

            }


            const total =
                dayPrograms.reduce(
                    (sum, p) =>
                        sum + Number(p.sessions || 0),
                    0
                );


            sessions.textContent =
                total ? total : "—";


            content.onclick = function() {

                openProgram(week, day);

            };


            row.appendChild(name);

            row.appendChild(content);

            row.appendChild(sessions);

            card.appendChild(row);

        });


        container.appendChild(card);
    }


    updateSummary();
}


/* =====================================================
   مفتاح البرنامج
===================================================== */

function makeKey(week, day) {

    return `${week}-${day}`;

}


/* =====================================================
   فتح نافذة البرنامج
===================================================== */

function openProgram(week, day, programId = null) {

    selectedWeek = week;

    selectedDay = day;


    document.getElementById("selectedWeek").textContent =
        `الأسبوع ${week}`;

    document.getElementById("selectedDate").textContent =
        weekDates[week - 1] || "";

    document.getElementById("selectedDay").textContent =
        day;


    fillFields();


    document.getElementById("programName").value = "";

    document.getElementById("programSessions").value = 1;

    document.getElementById("programTeacher").value = "";

    document.getElementById("programNotes").value = "";


    if (programId) {

        const key =
            makeKey(week, day);

        const list =
            programs[key] || [];

        const program =
            list.find(p => p.id === programId);


        if (program) {

            document.getElementById("programName").value =
                program.name || "";

            document.getElementById("programField").value =
                program.field || "";

            document.getElementById("programSessions").value =
                program.sessions || 1;

            document.getElementById("programTeacher").value =
                program.teacher || "";

            document.getElementById("programNotes").value =
                program.notes || "";

        }
    }


    document
        .getElementById("programModal")
        .classList.add("show");
}


/* =====================================================
   إغلاق البرنامج
===================================================== */

function closeModal() {

    document
        .getElementById("programModal")
        .classList.remove("show");

}


/* =====================================================
   المجالات
===================================================== */

function fillFields() {

    const select =
        document.getElementById("programField");

    select.innerHTML = "";


    fields.forEach(field => {

        const option =
            document.createElement("option");

        option.value = field;

        option.textContent = field;

        select.appendChild(option);

    });


    if (fields.length === 0) {

        const option =
            document.createElement("option");

        option.value = "";

        option.textContent = "أضيفي المجالات من الإعدادات";

        select.appendChild(option);
    }
}


/* =====================================================
   حفظ البرنامج
===================================================== */

function saveProgram() {

    if (selectedWeek === null ||
        selectedDay === null) {
        return;
    }


    const name =
        document.getElementById("programName")
        .value
        .trim();


    if (!name) {

        alert("اكتبي اسم البرنامج أولاً");

        return;
    }


    const field =
        document.getElementById("programField")
        .value;


    const sessions =
        Number(
            document.getElementById("programSessions")
            .value
        ) || 1;


    const teacher =
        document.getElementById("programTeacher")
        .value
        .trim();


    const notes =
        document.getElementById("programNotes")
        .value
        .trim();


    const key =
        makeKey(selectedWeek, selectedDay);


    if (!programs[key]) {
        programs[key] = [];
    }


    programs[key].push({

        id:
            Date.now() +
            Math.random(),

        name,

        field,

        sessions,

        teacher,

        notes

    });


    saveStorage();

    closeModal();

    renderWeeks();
}


/* =====================================================
   إعدادات الخطة
===================================================== */

function openSettings() {

    document.getElementById("regionInput").value =
        settings.region;

    document.getElementById("administrationInput").value =
        settings.administration;

    document.getElementById("schoolInput").value =
        settings.school;

    document.getElementById("yearInput").value =
        settings.year;


    document.getElementById("fieldsInput").value =
        fields.join("\n");


    createDateInputs();


    document
        .getElementById("settingsModal")
        .classList.add("show");
}


/* =====================================================
   إغلاق الإعدادات
===================================================== */

function closeSettings() {

    document
        .getElementById("settingsModal")
        .classList.remove("show");

}


/* =====================================================
   إنشاء حقول التواريخ
===================================================== */

function createDateInputs() {

    const container =
        document.getElementById("datesInput");

    container.innerHTML = "";


    for (let i = 0; i < TOTAL_WEEKS; i++) {

        const box =
            document.createElement("div");

        box.className = "date-setting";


        box.innerHTML = `

            <strong>
                الأسبوع ${i + 1}
            </strong>

            <input
                type="text"
                data-week="${i}"
                value="${escapeAttribute(
                    weekDates[i] || ""
                )}"
                placeholder="من تاريخ - إلى تاريخ">

        `;


        container.appendChild(box);
    }
}


/* =====================================================
   حفظ الإعدادات
===================================================== */

function saveSettings() {

    settings.region =
        document.getElementById("regionInput")
        .value
        .trim();


    settings.administration =
        document.getElementById("administrationInput")
        .value
        .trim();


    settings.school =
        document.getElementById("schoolInput")
        .value
        .trim();


    settings.year =
        document.getElementById("yearInput")
        .value
        .trim();


    fields =
        document.getElementById("fieldsInput")
        .value
        .split("\n")
        .map(x => x.trim())
        .filter(Boolean);


    const dateInputs =
        document.querySelectorAll(
            "#datesInput input[data-week]"
        );


    dateInputs.forEach(input => {

        const index =
            Number(input.dataset.week);

        weekDates[index] =
            input.value.trim();

    });


    saveStorage();

    updateHeader();

    renderWeeks();

    closeSettings();

}


/* =====================================================
   حفظ كل شيء
===================================================== */

function saveAll() {

    saveStorage();

    alert("تم حفظ الخطة بنجاح 🌷");

}


/* =====================================================
   التخزين
===================================================== */

function saveStorage() {

    localStorage.setItem(
        "activitySettings",
        JSON.stringify(settings)
    );


    localStorage.setItem(
        "activityFields",
        JSON.stringify(fields)
    );


    localStorage.setItem(
        "activityDates",
        JSON.stringify(weekDates)
    );


    localStorage.setItem(
        "activityPrograms",
        JSON.stringify(programs)
    );
}


/* =====================================================
   مسح البرامج
===================================================== */

function clearAll() {

    const confirmDelete =
        confirm(
            "هل تريدين حذف جميع البرامج؟"
        );


    if (!confirmDelete) {
        return;
    }


    programs = {};

    saveStorage();

    renderWeeks();
}


/* =====================================================
   الإحصائيات
===================================================== */

function updateSummary() {

    let totalPrograms = 0;

    let totalSessions = 0;


    Object.values(programs).forEach(list => {

        list.forEach(program => {

            totalPrograms++;

            totalSessions +=
                Number(program.sessions || 0);

        });

    });


    document.getElementById(
        "totalPrograms"
    ).textContent =
        totalPrograms;


    document.getElementById(
        "totalSessions"
    ).textContent =
        totalSessions;


    document.getElementById(
        "totalWeeks"
    ).textContent =
        TOTAL_WEEKS;
}


/* =====================================================
   حماية النصوص
===================================================== */

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function escapeAttribute(value) {

    return escapeHtml(value);

}


/* =====================================================
   التشغيل
===================================================== */

loadData();

updateHeader();

fillFields();

renderWeeks();