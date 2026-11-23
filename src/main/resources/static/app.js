
const API = "http://localhost:8080/api";

let employees = [];
let departments = [];
let attendanceRecords = [];

const $ = id => document.getElementById(id);

async function request(url, options = {}) {
    const response = await fetch(API + url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `Request failed: ${response.status}`);
    }

    if (response.status === 204) return null;

    return response.json();
}

function toast(message) {
    const element = $("toast");
    element.textContent = message;
    element.classList.add("show");

    setTimeout(() => element.classList.remove("show"), 3000);
}

function showError(error) {
    console.error(error);
    toast(error.message || "Something went wrong");
}

function closeModal(id) {
    $(id).classList.remove("show");
}

function openModal(id) {
    $(id).classList.add("show");
}

function showPage(page, link) {
    document.querySelectorAll(".page").forEach(section => {
        section.classList.remove("active");
    });

    $(page).classList.add("active");

    document.querySelectorAll(".nav-link").forEach(item => {
        item.classList.remove("active");
    });

    if (link) link.classList.add("active");

    const titles = {
        dashboard: ["Dashboard", "Welcome back! Here's what's happening today."],
        employees: ["Employees", "Manage your company's employees."],
        departments: ["Departments", "Manage company departments."],
        attendance: ["Attendance", "Track employee attendance records."]
    };

    $("pageTitle").textContent = titles[page][0];
    $("pageSubtitle").textContent = titles[page][1];

    if (page === "employees") loadEmployees();
    if (page === "departments") loadDepartments();
    if (page === "attendance") loadAttendance();
}

// LOAD DATA

async function loadEmployees() {
    try {
        employees = await request("/employees");
        renderEmployees();
        renderRecentEmployees();
        updateEmployeeOptions();
    } catch (error) {
        showError(error);
    }
}

async function loadDepartments() {
    try {
        departments = await request("/departments");
        renderDepartments();
        updateDepartmentOptions();
        updateEmployeeFilters();
    } catch (error) {
        showError(error);
    }
}

async function loadAttendance() {
    try {
        attendanceRecords = await request("/attendance");
        renderAttendance();
    } catch (error) {
        showError(error);
    }
}

async function loadDashboard() {
    try {
        const stats = await request("/dashboard/statistics");

        $("totalEmployees").textContent = stats.totalEmployees;
        $("activeEmployees").textContent = stats.activeEmployees;
        $("totalDepartments").textContent = stats.totalDepartments;
        $("totalAttendance").textContent = stats.totalAttendanceRecords;

        renderRecentEmployees();
    } catch (error) {
        showError(error);
    }
}

// EMPLOYEES

function renderEmployees() {

    const search = $("employeeSearch").value.toLowerCase();
    const departmentFilter = $("departmentFilter").value;
    const statusFilter = $("statusFilter").value;

    const filtered = employees.filter(employee => {

        const name = `${employee.firstName} ${employee.lastName}`.toLowerCase();
        const email = (employee.email || "").toLowerCase();
        const jobTitle = (employee.jobTitle || "").toLowerCase();

        const matchesSearch =
            name.includes(search) ||
            email.includes(search) ||
            jobTitle.includes(search);

        const matchesDepartment =
            !departmentFilter ||
            String(employee.department?.id) === departmentFilter;

        const matchesStatus =
            !statusFilter ||
            employee.status === statusFilter;

        return matchesSearch && matchesDepartment && matchesStatus;
    });

    $("employeesTable").innerHTML = filtered.length
        ? filtered.map(employee => `
            <tr>
                <td>#${employee.id}</td>
                <td class="employee-name">
                    ${employee.firstName} ${employee.lastName}
                </td>
                <td>${employee.email}</td>
                <td>${employee.department?.name || "Not assigned"}</td>
                <td>${employee.jobTitle}</td>
                <td>${Number(employee.salary).toFixed(2)}</td>
                <td>
                    <span class="status ${employee.status === "Inactive" ? "inactive" : ""}">
                        ${employee.status}
                    </span>
                </td>
                <td>
                    <button class="action-btn edit" onclick="editEmployee(${employee.id})">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteEmployee(${employee.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join("")
        : `<tr><td colspan="8" class="empty">No employees found</td></tr>`;
}


function renderRecentEmployees() {
    $("recentEmployees").innerHTML = employees.length
        ? [...employees].slice(-5).reverse().map(employee => `
            <tr>
                <td class="employee-name">${employee.firstName} ${employee.lastName}</td>
                <td>${employee.department?.name || "Not assigned"}</td>
                <td>${employee.jobTitle}</td>
                <td><span class="status ${employee.status === "Inactive" ? "inactive" : ""}">${employee.status}</span></td>
            </tr>
        `).join("")
        : `<tr><td colspan="4" class="empty">No employees registered yet</td></tr>`;
}

function updateDepartmentOptions(selectedId = "") {
    $("department").innerHTML = `
        <option value="">Select Department</option>
        ${departments.map(department => `
            <option value="${department.id}" ${String(selectedId) === String(department.id) ? "selected" : ""}>
                ${department.name}
            </option>
        `).join("")}
    `;
}
function updateEmployeeFilters() {

    const filter = $("departmentFilter");
    const selectedValue = filter.value;

    filter.innerHTML = `
        <option value="">All Departments</option>
        ${departments.map(department => `
            <option value="${department.id}">
                ${department.name}
            </option>
        `).join("")}
    `;

    filter.value = selectedValue;
}
function updateEmployeeOptions() {
    $("attendanceEmployee").innerHTML = `
        <option value="">Select Employee</option>
        ${employees.map(employee => `
            <option value="${employee.id}">
                ${employee.firstName} ${employee.lastName}
            </option>
        `).join("")}
    `;
}

async function openEmployeeModal() {
    try {
        await loadDepartments();

        $("employeeForm").reset();
        $("employeeId").value = "";
        $("employeeModalTitle").textContent = "Add New Employee";
        $("status").value = "Active";

        updateDepartmentOptions();
        openModal("employeeModal");
    } catch (error) {
        showError(error);
    }
}

function editEmployee(id) {
    const employee = employees.find(item => item.id === id);
    if (!employee) return;

    $("employeeId").value = employee.id;
    $("firstName").value = employee.firstName;
    $("lastName").value = employee.lastName;
    $("email").value = employee.email;
    $("phone").value = employee.phone || "";
    $("gender").value = employee.gender || "";
    $("jobTitle").value = employee.jobTitle;
    $("salary").value = employee.salary;
    $("hireDate").value = employee.hireDate || "";
    $("status").value = employee.status;

    updateDepartmentOptions(employee.department?.id || "");

    $("employeeModalTitle").textContent = "Edit Employee";
    openModal("employeeModal");
}

$("employeeForm").addEventListener("submit", async event => {
    event.preventDefault();

    const id = $("employeeId").value;
    const departmentId = $("department").value;

    if (!departmentId) {
        toast("Please select a department");
        return;
    }

    const employee = {
        firstName: $("firstName").value.trim(),
        lastName: $("lastName").value.trim(),
        email: $("email").value.trim(),
        phone: $("phone").value.trim(),
        gender: $("gender").value,
        department: { id: Number(departmentId) },
        jobTitle: $("jobTitle").value.trim(),
        salary: Number($("salary").value),
        hireDate: $("hireDate").value || null,
        status: $("status").value
    };

    try {
        await request(id ? `/employees/${id}` : "/employees", {
            method: id ? "PUT" : "POST",
            body: JSON.stringify(employee)
        });

        closeModal("employeeModal");
        await loadEmployees();
        await loadDashboard();
        toast(id ? "Employee updated successfully" : "Employee added successfully");

    } catch (error) {
        showError(error);
    }
});

async function deleteEmployee(id) {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
        await request(`/employees/${id}`, { method: "DELETE" });

        await loadEmployees();
        await loadDashboard();

        toast("Employee deleted successfully");
    } catch (error) {
        showError(error);
    }
}

function exportEmployees() {
    const search = $("employeeSearch").value.toLowerCase();
    const departmentFilter = $("departmentFilter").value;
    const statusFilter = $("statusFilter").value;

    const filtered = employees.filter(employee => {
        const name = `${employee.firstName} ${employee.lastName}`.toLowerCase();
        const email = (employee.email || "").toLowerCase();
        const jobTitle = (employee.jobTitle || "").toLowerCase();

        const matchesSearch =
            name.includes(search) ||
            email.includes(search) ||
            jobTitle.includes(search);

        const matchesDepartment =
            !departmentFilter ||
            String(employee.department?.id) === departmentFilter;

        const matchesStatus =
            !statusFilter ||
            employee.status === statusFilter;

        return matchesSearch && matchesDepartment && matchesStatus;
    });

    if (!filtered.length) {
        toast("No employees to export");
        return;
    }

    const headers = [
        "ID",
        "First Name",
        "Last Name",
        "Email",
        "Phone",
        "Gender",
        "Department",
        "Job Title",
        "Salary",
        "Hire Date",
        "Status"
    ];

    const rows = filtered.map(employee => [
        employee.id,
        employee.firstName,
        employee.lastName,
        employee.email,
        employee.phone || "",
        employee.gender || "",
        employee.department?.name || "Not assigned",
        employee.jobTitle,
        employee.salary,
        employee.hireDate || "",
        employee.status
    ]);

    const escapeCSV = value =>
        `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csvContent = [
        headers.map(escapeCSV).join(","),
        ...rows.map(row => row.map(escapeCSV).join(","))
    ].join("\r\n");

    const blob = new Blob(
        ["\uFEFF" + csvContent],
        { type: "text/csv;charset=utf-8;" }
    );

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = "NEXORA_Employees.csv";
    link.click();

    URL.revokeObjectURL(url);

    toast("Employees exported successfully");
}

// DEPARTMENTS

function renderDepartments() {
    $("departmentGrid").innerHTML = departments.length
        ? departments.map(department => `
            <div class="department-card">
                <div class="department-icon">
                    <i class="fa-solid fa-building"></i>
                </div>
                <h3>${department.name}</h3>
                <p>${department.description || "No description available"}</p>
                <div class="card-actions">
                    <button class="action-btn edit" onclick="editDepartment(${department.id})">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteDepartment(${department.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join("")
        : `<div class="empty">No departments available</div>`;
}

function openDepartmentModal() {
    $("departmentForm").reset();
    $("departmentId").value = "";
    $("departmentModalTitle").textContent = "Add Department";
    openModal("departmentModal");
}

function editDepartment(id) {
    const department = departments.find(item => item.id === id);
    if (!department) return;

    $("departmentId").value = department.id;
    $("departmentName").value = department.name;
    $("departmentDescription").value = department.description || "";

    $("departmentModalTitle").textContent = "Edit Department";
    openModal("departmentModal");
}

$("departmentForm").addEventListener("submit", async event => {
    event.preventDefault();

    const id = $("departmentId").value;

    const department = {
        name: $("departmentName").value.trim(),
        description: $("departmentDescription").value.trim()
    };

    try {
        await request(id ? `/departments/${id}` : "/departments", {
            method: id ? "PUT" : "POST",
            body: JSON.stringify(department)
        });

        closeModal("departmentModal");
        await loadDepartments();
        await loadDashboard();

        toast(id ? "Department updated" : "Department added");
    } catch (error) {
        showError(error);
    }
});

async function deleteDepartment(id) {
    if (!confirm("Are you sure you want to delete this department?")) return;

    try {
        await request(`/departments/${id}`, { method: "DELETE" });

        await loadDepartments();
        await loadDashboard();

        toast("Department deleted");
    } catch (error) {
        showError(error);
    }
}

// ATTENDANCE

function renderAttendance() {
    $("attendanceTable").innerHTML = attendanceRecords.length
        ? attendanceRecords.map(record => `
            <tr>
                <td class="employee-name">
                    ${record.employee.firstName} ${record.employee.lastName}
                </td>
                <td>${record.attendanceDate}</td>
                <td>${record.checkIn || "-"}</td>
                <td>${record.checkOut || "-"}</td>
                <td><span class="status">${record.status}</span></td>
                <td>
                    <button class="action-btn delete" onclick="deleteAttendance(${record.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join("")
        : `<tr><td colspan="6" class="empty">No attendance records found</td></tr>`;
}

async function openAttendanceModal() {
    try {
        await loadEmployees();

        if (!employees.length) {
            toast("Add an employee first");
            return;
        }

        $("attendanceForm").reset();
        $("attendanceDate").value = new Date().toLocaleDateString("en-CA");
        openModal("attendanceModal");
    } catch (error) {
        showError(error);
    }
}

$("attendanceForm").addEventListener("submit", async event => {
    event.preventDefault();

    const record = {
        employee: { id: Number($("attendanceEmployee").value) },
        attendanceDate: $("attendanceDate").value,
        checkIn: $("checkIn").value || null,
        checkOut: $("checkOut").value || null,
        status: $("attendanceStatus").value
    };

    try {
        await request("/attendance", {
            method: "POST",
            body: JSON.stringify(record)
        });

        closeModal("attendanceModal");
        await loadAttendance();
        await loadDashboard();

        toast("Attendance recorded successfully");
    } catch (error) {
        showError(error);
    }
});

async function deleteAttendance(id) {
    if (!confirm("Delete this attendance record?")) return;

    try {
        await request(`/attendance/${id}`, { method: "DELETE" });
        await loadAttendance();
        await loadDashboard();
        toast("Attendance record deleted");
    } catch (error) {
        showError(error);
    }
}


// INITIALIZATION

$("todayDate").textContent = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
});

$("employeeSearch").addEventListener("input", renderEmployees);

$("departmentFilter").addEventListener("change", renderEmployees);

$("statusFilter").addEventListener("change", renderEmployees);

async function initializeApp() {
    try {
        await Promise.all([
            loadDepartments(),
            loadEmployees(),
            loadAttendance(),
            loadDashboard(),
            loadDepartmentChart()
        ]);
    } catch (error) {
        showError(error);
    }
}

// DEPARTMENT CHART

async function loadDepartmentChart() {
    const chart = $("departmentChart");

    try {
        const departmentData = await request(
            "/dashboard/department-distribution"
        );

        chart.innerHTML = "";

        if (!departmentData.length) {
            chart.textContent = "No employees available";
            return;
        }

        const maxCount = Math.max(
            ...departmentData.map(item => Number(item.count)),
            1
        );

        departmentData.forEach(item => {
            const percentage =
                (Number(item.count) / maxCount) * 100;

            const row = document.createElement("div");
            row.className = "chart-row";

            row.innerHTML = `
                <div class="chart-info">
                    <span>${item.department}</span>
                    <strong>${item.count}</strong>
                </div>

                <div class="chart-track">
                    <div class="chart-fill"
                         style="width: ${percentage}%">
                    </div>
                </div>
            `;

            chart.appendChild(row);
        });

    } catch (error) {
        chart.textContent = "Unable to load chart";
        console.error("Department chart error:", error);
    }
}

initializeApp();
