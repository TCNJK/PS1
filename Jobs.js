javascript:(async () => {

    function GetToken() {
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);

            if (key.startsWith("oidc.user")) {
                try {
                    const userData = JSON.parse(sessionStorage.getItem(key));
                    return userData.access_token;
                } catch (e) {}
            }
        }
        return null;
    }

    async function getAllJobs() {
        const searchValue = prompt("Nhập từ khóa để tìm Jobs:");
        if (!searchValue) {
            alert("Không có từ khóa, dừng lại.");
            return [];
        }

        const baseUrl =
            `https://cloud.uipath.com/tcnjkxsgwtpp/DefaultTenant/orchestrator_/odata/Jobs` +
            `?$top=25` +
            `&$filter=` +
            `((contains(Release/Name,%27${searchValue}%27))` +
            ` or (contains(Reference,%27${searchValue}%27))` +
            ` or (contains(Machine/Name,%27${searchValue}%27))` +
            ` or (contains(HostMachineName,%27${searchValue}%27))` +
            ` or (contains(LocalSystemAccount,%27${searchValue}%27))` +
            ` or (contains(Robot/Username,%27${searchValue}%27)))` +
            ` and (ProcessType ne 'TestAutomationProcess')` +
            `&$expand=Robot,Machine,Release` +
            `&$orderby=CreationTime desc`;

        const token = GetToken();

        if (!token) {
            alert("Không tìm thấy access_token trong sessionStorage!");
            return [];
        }

        const headers = {
            accept: "application/json",
            authorization: `Bearer ${token}`,
            "x-uipath-organizationunitid": "6884321",
            "x-uipath-orchestrator": "true"
        };

        let jobs = [];
        let nextUrl = baseUrl;

        try {
            while (nextUrl) {
                const res = await fetch(nextUrl, { headers });

                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }

                const data = await res.json();
                if (data.value) {
                    jobs = jobs.concat(data.value);
                }

                nextUrl = data["@odata.nextLink"] || null;
            }

            console.log("Total jobs:", jobs.length);

            exportArrayToCSV(jobs, "jobs.csv");

            return jobs;

        } catch (err) {
            console.error(err);
            alert("Lỗi khi gọi API.");
            return [];
        }
    }

    function exportArrayToCSV(data, filename = "data.csv") {
        if (!Array.isArray(data) || data.length === 0) {
            alert("Array rỗng.");
            return;
        }

        const headers = Object.keys(data[0]);
        const rows = [headers.join(",")];

        data.forEach(obj => {
            const row = headers.map(header => {
                let val = obj[header] ?? "";

                if (typeof val === "string" && val.includes('"')) {
                    val = val.replace(/"/g, '""');
                }

                if (
                    typeof val === "string" &&
                    (val.includes(",") || val.includes('"') || val.includes("\n"))
                ) {
                    val = `"${val}"`;
                }

                return val;
            });

            rows.push(row.join(","));
        });

        const csv = rows.join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    }

    await getAllJobs();

})();
