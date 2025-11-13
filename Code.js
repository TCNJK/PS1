async function getAllJobs() {
  const baseUrl =
    "https://cloud.uipath.com/tcnjkxsgwtpp/DefaultTenant/orchestrator_/odata/Jobs?$top=50&$filter=((((ProcessType eq 'Process') or (ProcessType eq 'Api') or (ProcessType eq 'ProcessOrchestration') or (ProcessType eq 'Agent') or (ProcessType eq 'WebApp') or (ProcessType eq 'MCPServer') or (ProcessType eq 'BusinessRules'))))&$expand=Robot,Machine,Release&$orderby=CreationTime desc";

  const headers = {
    accept: "application/json",
    authorization: "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkpXVC1Ub2tlbi1jYXJyeS1yZXBsYWNlLWJ5LWFwaS10b2tlbiIsInR5cCI6IkpXVCJ9", // thay token hợp lệ của bạn
    "x-uipath-organizationunitid": "6884321", // nếu cần
    "x-uipath-orchestrator": "true",
  };

  let jobs = [];
  let nextUrl = baseUrl;

  try {
    while (nextUrl) {
      const response = await fetch(nextUrl, { headers });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.value) {
        jobs = jobs.concat(data.value);
      }

      // Nếu có trang tiếp theo, tiếp tục fetch
      nextUrl = data["@odata.nextLink"] || null;
    }

    console.log("Total jobs:", jobs.length);
    return jobs;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
}

function exportArrayToCSV(data, filename = 'data.csv') {
  if (!Array.isArray(data) || data.length === 0) {
    console.error('Array rỗng hoặc không hợp lệ');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvRows = [];

  csvRows.push(headers.join(','));

  data.forEach(item => {
    const values = headers.map(header => {
      let val = item[header] ?? '';
      if (typeof val === 'string' && val.includes('"')) {
        val = val.replace(/"/g, '""');
      }
      if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
        val = `"${val}"`;
      }
      return val;
    });
    csvRows.push(values.join(','));
  });

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


getAllJobs().then((jobs) => {
  console.log("Jobs array:", jobs);
});

