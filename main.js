/* =====================================
   الأيام
===================================== */

const DAYS = [

    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس"

];



/* =====================================
   المجالات الافتراضية
===================================== */

const DEFAULT_FIELDS = [

    "المواطنة والحياة",
    "الصحة والسلامة",
    "العلوم والتقنية",
    "الرياضة",
    "الفنون",
    "النشاط الكشفي",
    "الأنشطة الثقافية",
    "البرامج التربوية"

];



/* =====================================
   تواريخ الأسابيع مثل الصورة
===================================== */

const DEFAULT_DATES = [

    "1448/3/10 - 1448/3/14",

    "1448/3/17 - 1448/3/21",

    "1448/3/24 - 1448/3/28",

    "1448/4/2 - 1448/4/6",

    "1448/4/9 - 1448/4/13",

    "1448/4/16 - 1448/4/20",

    "1448/4/23 - 1448/4/27",

    "1448/4/30 - 1448/5/4",

    "1448/5/7 - 1448/5/11",

    "1448/5/14 - 1448/5/18",

    "1448/5/21 - 1448/5/25",

    "1448/5/28 - 1448/6/2",

    "1448/6/5 - 1448/6/9",

    "1448/6/12 - 1448/6/16",

    "1448/6/19 - 1448/6/23",

    "1448/6/26 - 1448/6/30",

    "1448/7/11 - 1448/7/15",

    "1448/7/18 - 1448/7/22"

];



/* =====================================
   البيانات
===================================== */

let fields =

    JSON.parse(
        localStorage.getItem(
            "activityFields"
        )
    ) || DEFAULT_FIELDS;



let weekDates =

    JSON.parse(
        localStorage.getItem(
            "weekDates"
        )
    ) || DEFAULT_DATES;



let data =

    JSON.parse(
        localStorage.getItem(
            "activityPlan"
        )
    ) || {};



let selectedWeek = null;

let selectedDay = null;



/* =====================================
   إنشاء الأسابيع
===================================== */

function createWeeks() {


    const container =
        document.getElementById(
            "weeksContainer"
        );


    container.innerHTML = "";


    for (
        let week = 1;
        week <= 18;
        week++
    ) {


        if (!data[week]) {

            data[week] = {};

        }


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "week-card";


        card.innerHTML = `

            <div class="week-title">

                الأسبوع ${week}

                <div class="week-date">

                    ${weekDates[week - 1]}

                </div>

            </div>


            <div class="days-header">

                <div>اليوم</div>

                <div>البرنامج</div>

                <div>الحصص</div>

            </div>

        `;



        DAYS.forEach(day => {


            if (!data[week][day]) {

                data[week][day] = [];

            }


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "day-row";


            row.innerHTML = `

                <div class="day-name">

                    ${day}

                </div>


                <div
                    class="day-content"
                    onclick="openProgram(${week}, '${day}')">

                    ${renderPrograms(
                        week,
                        day
                    )}

                </div>


                <div class="day-sessions">

                    ${getDaySessions(
                        week,
                        day
                    )}

                </div>

            `;


            card.appendChild(row);

        });


        container.appendChild(card);

    }


    updateSummary();

}



/* =====================================
   عرض البرامج
===================================== */

function renderPrograms(
    week,
    day
) {


    const programs =
        data[week][day];


    if (
        !programs ||
        programs.length === 0
    ) {


        return `

            <div class="no-program">

                لا يوجد برنامج

                <div class="add-text">

                    + اضغطي للإضافة

                </div>

            </div>

        `;

    }


    return programs.map(

        (program, index) => `

            <div
                class="program-item"
                onclick="
                    event.stopPropagation();
                    editProgram(
                        ${week},
                        '${day}',
                        ${index}
                    )
                "
            >

                <div class="program-name">

                    ${escapeHtml(
                        program.name
                    )}

                </div>


                <div class="program-field">

                    ${escapeHtml(
                        program.field
                    )}

                </div>


                <div class="program-sessions">

                    حصص: ${program.sessions}

                </div>

            </div>

        `

    ).join("");

}



/* =====================================
   مجموع حصص اليوم
===================================== */

function getDaySessions(
    week,
    day
) {


    return (

        data[week][day] || []

    ).reduce(

        (total, item) =>

            total +
            Number(
                item.sessions || 0
            ),

        0

    );

}



/* =====================================
   فتح إضافة برنامج
===================================== */

function openProgram(
    week,
    day
) {


    selectedWeek = week;

    selectedDay = day;


    document.getElementById(
        "selectedWeek"
    ).textContent =
        "الأسبوع " + week;


    document.getElementById(
        "selectedDate"
    ).textContent =
        weekDates[week - 1];


    document.getElementById(
        "selectedDay"
    ).textContent =
        day;


    document.getElementById(
        "programName"
    ).value = "";


    document.getElementById(
        "programSessions"
    ).value = 1;


    document.getElementById(
        "programTeacher"
    ).value = "";


    document.getElementById(
        "programNotes"
    ).value = "";


    fillFields();


    document.getElementById(
        "programModal"
    ).classList.add("show");

}



/* =====================================
   تعديل البرنامج
===================================== */

function editProgram(
    week,
    day,
    index
) {


    selectedWeek = week;

    selectedDay = day;


    const program =
        data[week][day][index];


    document.getElementById(
        "selectedWeek"
    ).textContent =
        "الأسبوع " + week;


    document.getElementById(
        "selectedDate"
    ).textContent =
        weekDates[week - 1];


    document.getElementById(
        "selectedDay"
    ).textContent =
        day;


    document.getElementById(
        "programName"
    ).value =
        program.name;


    fillFields();


    document.getElementById(
        "programField"
    ).value =
        program.field;


    document.getElementById(
        "programSessions"
    ).value =
        program.sessions;


    document.getElementById(
        "programTeacher"
    ).value =
        program.teacher || "";


    document.getElementById(
        "programNotes"
    ).value =
        program.notes || "";


    document.getElementById(
        "programModal"
    ).classList.add("show");

}



/* =====================================
   حفظ البرنامج
===================================== */

function saveProgram() {


    const name =
        document.getElementById(
            "programName"
        ).value.trim();


    if (!name) {

        alert(
            "اكتبي اسم البرنامج أولاً"
        );

        return;

    }


    const field =
        document.getElementById(
            "programField"
        ).value;


    const sessions =
        document.getElementById(
            "programSessions"
        ).value;


    const teacher =
        document.getElementById(
            "programTeacher"
        ).value;


    const notes =
        document.getElementById(
            "programNotes"
        ).value;


    if (!data[selectedWeek]) {

        data[selectedWeek] = {};

    }


    if (
        !data[selectedWeek][selectedDay]
    ) {

        data[selectedWeek][selectedDay] = [];

    }


    data[selectedWeek][selectedDay]
        .push({

            name: name,

            field: field,

            sessions: sessions,

            teacher: teacher,

            notes: notes

        });


    saveAll(false);

    closeModal();

    createWeeks();

}



/* =====================================
   المجالات
===================================== */

function fillFields() {


    const select =
        document.getElementById(
            "programField"
        );


    select.innerHTML = "";


    fields.forEach(field => {


        const option =
            document.createElement(
                "option"
            );


        option.value = field;

        option.textContent = field;


        select.appendChild(option);

    });

}



/* =====================================
   إعدادات المجالات والتواريخ
===================================== */

function openSettings() {


    document.getElementById(
        "fieldsInput"
    ).value =
        fields.join("\n");


    createDateSettings();


    document.getElementById(
        "settingsModal"
    ).classList.add("show");

}



function createDateSettings() {


    const container =
        document.getElementById(
            "datesInput"
        );


    container.innerHTML = "";


    for (
        let i = 0;
        i < 18;
        i++
    ) {


        const box =
            document.createElement(
                "div"
            );


        box.className =
            "date-setting";


        box.innerHTML = `

            <strong>
                الأسبوع ${i + 1}
            </strong>

            <input
                id="weekDate${i}"
                type="text"
                value="${weekDates[i]}"
            >

        `;


        container.appendChild(box);

    }

}



/* =====================================
   حفظ الإعدادات
===================================== */

function saveSettings() {


    fields =

        document.getElementById(
            "fieldsInput"
        ).value

        .split("\n")

        .map(
            item => item.trim()
        )

        .filter(Boolean);



    for (
        let i = 0;
        i < 18;
        i++
    ) {


        const input =
            document.getElementById(
                "weekDate" + i
            );


        if (input) {

            weekDates[i] =
                input.value.trim();

        }

    }


    localStorage.setItem(

        "activityFields",

        JSON.stringify(fields)

    );


    localStorage.setItem(

        "weekDates",

        JSON.stringify(weekDates)

    );


    fillFields();

    createWeeks();

    closeSettings();


    alert(
        "تم حفظ الإعدادات ✓"
    );

}



/* =====================================
   حفظ كل شيء
===================================== */

function saveAll(
    showMessage = true
) {


    localStorage.setItem(

        "activityPlan",

        JSON.stringify(data)

    );


    localStorage.setItem(

        "activityFields",

        JSON.stringify(fields)

    );


    localStorage.setItem(

        "weekDates",

        JSON.stringify(weekDates)

    );


    updateSummary();


    if (showMessage) {

        alert(
            "تم حفظ البيانات ✓"
        );

    }

}



/* =====================================
   الإحصائيات
===================================== */

function updateSummary() {


    let programs = 0;

    let sessions = 0;


    for (
        let week = 1;
        week <= 18;
        week++
    ) {


        if (!data[week])
            continue;


        DAYS.forEach(day => {


            const list =
                data[week][day] || [];


            programs +=
                list.length;


            list.forEach(item => {

                sessions +=
                    Number(
                        item.sessions || 0
                    );

            });

        });

    }


    document.getElementById(
        "totalPrograms"
    ).textContent =
        programs;


    document.getElementById(
        "totalSessions"
    ).textContent =
        sessions;

}



/* =====================================
   إغلاق النوافذ
===================================== */

function closeModal() {

    document.getElementById(
        "programModal"
    ).classList.remove("show");

}


function closeSettings() {

    document.getElementById(
        "settingsModal"
    ).classList.remove("show");

}



/* =====================================
   مسح جميع البرامج
===================================== */

function clearAll() {


    if (
        !confirm(
            "هل تريدين مسح جميع البرامج؟"
        )
    ) {

        return;

    }


    data = {};


    localStorage.removeItem(
        "activityPlan"
    );


    createWeeks();

}



/* =====================================
   حماية النص
===================================== */

function escapeHtml(text) {

    return String(text)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}



/* =====================================
   تشغيل الموقع
===================================== */

document.addEventListener(

    "DOMContentLoaded",

    function () {

        createWeeks();

        fillFields();

    }

);