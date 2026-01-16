/**
 * Simulates real user typing into an input element
 * Triggers keydown, keyup, input and change events
 * This is required for React / Angular controlled inputs
 */
function simulateInput(input, value) {
    if (!input) return;

    input.focus();
    input.value = "";

    for (const char of value) {
        const keyCode = char.charCodeAt(0);

        // Key down
        input.dispatchEvent(
            new KeyboardEvent("keydown", {
                key: char,
                keyCode,
                which: keyCode,
                bubbles: true
            })
        );

        // Update value
        input.value += char;

        // Key up
        input.dispatchEvent(
            new KeyboardEvent("keyup", {
                key: char,
                keyCode,
                which: keyCode,
                bubbles: true
            })
        );

        // Input event (important for frameworks)
        input.dispatchEvent(new Event("input", { bubbles: true }));
    }

    // Final change event
    input.dispatchEvent(new Event("change", { bubbles: true }));
}

/**
 * Automatically fills search form based on start time & duration
 * @param {number} duration - Duration in minutes
 */
function autoSearch(date, hours, minutes, duration = 30) {

    /* ============================
        1. Get start time from user
    ============================ */

    const now = new Date();
    const year = now.getFullYear();

    // Start datetime
    const dtStartTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes,
        0
    );

    // End datetime
    const dtEndTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes + duration,
        0
    );

    /* ============================
        2. Locate main search bar
    ============================ */

    const searchBar = document.querySelector(".scc-searchBar");
    if (!searchBar) {
        alert("Search bar not found");
        return;
    }

    const listSearch = searchBar.querySelectorAll(":scope > div");

    /* ============================
        3. Get date & time inputs
    ============================ */

    const searchDate = listSearch[0].querySelectorAll(":scope > div.scc-searchBar");

    // Extract displayed dates (remove year)
    const searchStartDate = searchDate[0]
        .querySelector(":scope > div > div > div > div > div > div > div > div")
        .textContent.replace(year, "")
        .trim();

    const searchEndDate = searchDate[2]
        .querySelector(":scope > div > div > div > div > div > div > div > div")
        .textContent.replace(year, "")
        .trim();

    // Locate time input fields
    const searchStartTimeInput = searchDate[0]
        .querySelector(":scope > div:nth-child(2) > div > div > div > input");

    const searchEndTimeInput = searchDate[2]
        .querySelector(":scope > div:nth-child(2) > div > div > div > input");

    /* ============================
        4. Fill start & end time
    ============================ */

    simulateInput(
        searchStartTimeInput,
        dtStartTime.toLocaleString("en-GB", {
            hour: "2-digit",
            minute: "2-digit"
        })
    );

    simulateInput(
        searchEndTimeInput,
        dtEndTime.toLocaleString("en-GB", {
            hour: "2-digit",
            minute: "2-digit"
        })
    );

    /* ============================
        5. Get search type & name input
    ============================ */

    const searchType = listSearch[1]
        .querySelectorAll(":scope > div")[2]
        .querySelector(
            ":scope > div > div > div > div > div:nth-child(2) > div > span > div > div > div"
        )
        .textContent
        .trim();

    const searchNameInput = listSearch[1]
        .querySelectorAll(":scope > div")[3]
        .querySelector(":scope > div > div > div > div > input");

    /* ============================
    6. Build search title
       ============================ */

    let titleSearchName = `${searchStartDate} - ${searchEndDate} ${searchType}`;
    titleSearchName += ` ${String(dtStartTime.getHours()).padStart(2, "0")}${String(dtStartTime.getMinutes()).padStart(2, "0")}`;
    titleSearchName += `-${String(dtEndTime.getHours()).padStart(2, "0")}${String(dtEndTime.getMinutes()).padStart(2, "0")}`;

    /* ============================
        7. Fill search name
    ============================ */

    simulateInput(searchNameInput, titleSearchName);
}

function autoSearchWrapper(duration = 30) {

    /* =========================
        1. Pick date
    ========================= */

    const dateStr = prompt(
        "Enter Date (YYYY-MM-DD):",
        new Date().toISOString().slice(0, 10)
    );

    if (!dateStr) {
        alert("No date selected");
        return;
    }

    const [year, month, day] = dateStr.split("-").map(Number);

    // Start of selected day
    let currentTime = new Date(year, month - 1, day, 0, 0, 0);

    /* =========================
        2. Pick start time
    ========================= */

    let temp = prompt("Enter Start Hour (0-23):", "0");
    const startHour = Number(temp);

    temp = prompt("Enter Start Minute (0-59):", "0");
    const startMinute = Number(temp);

    // Set initial time
    currentTime.setHours(startHour, startMinute, 0, 0);

    /* =========================
        3. End of day (next day 00:00)
    ========================= */

    const endOfDay = new Date(year, month - 1, day + 1, 0, 0, 0);

    /* =========================
        4. Loop autoSearch
    ========================= */

    while (currentTime < endOfDay) {

        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();

        console.log(
            "AutoSearch at:",
            currentTime.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit"
            })
        );

        // Call your existing function
        autoSearch(currentTime, hours, minutes, duration);
        //chờ user nhấn search trên ui rồi mới đi qua lần kế tiếp
        // 1 alert nhu cầu user nhấn search trên ui sau đó nhấn ok trong alert để tiếp tục
        // Move forward by duration
        currentTime = new Date(currentTime.getTime() + duration * 60 * 1000);
    }

    alert("Auto search finished for the whole day");
}
