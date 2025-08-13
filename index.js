const tableBody = document.querySelector("#employeeTable tbody");
const tableHead = document.querySelectorAll("th");
const searchInput = document.getElementById("searchInput");
const loader = document.getElementById("loader");
const table = document.getElementById("employeeTable");
const exportBtn = document.getElementById("export");
const match = document.getElementById("match");
const pageBtn = document.querySelectorAll(".page-btn");
const btnDiv = document.querySelector(".page-numbers");
const menu = document.querySelector(".menu")
const sidebar = document.querySelector(".sidebar")

tableHead.forEach((head) => {
  head.addEventListener("click", function () {
    tableHead.forEach((th) => th.classList.remove("active"));
    head.classList.add("active");
  });
});

pageBtn.forEach((page) => {
  page.addEventListener("click", function () {
    pageBtn.forEach((p) => p.classList.remove("active"));
    page.classList.add("active");
  });
});

menu.addEventListener("click", function () {
  sidebar.style.display = "block"
})

document.addEventListener("DOMContentLoaded", () => {
  loader.hidden = false;
  table.hidden = true;
  btnDiv.style.display = "none";
  exportBtn.style.display = "none";
  loadTable();
});

async function loadTable() {
  const data = await getEmployees();
  btnDiv.style.display = "inline-block";

  let tablePage = data.slice(0, 10);

  pageBtn.forEach((page, index) => {
    page.addEventListener("click", function () {
      if (index === 0) {
        tablePage = data.slice(0, 10);
      } else if (index === 1) {
        tablePage = data.slice(10, 20);
      } else if (index === 2) {
        tablePage = data.slice(20, 30);
      } else if (index === 3) {
        tablePage = data.slice(30, 40);
      } else if (index === 4) {
        tablePage = data.slice(40, 50);
      }
      createTable(tablePage);
    });
  });

  function createTable(tableData) {
    tableBody.innerHTML = "";
    loader.hidden = true;
    table.hidden = false;
    exportBtn.style.display = "inline-block";

    tableData.forEach((emp) => {
      tableBody.innerHTML += `<tr>
      <td>${emp.name}</td>
      <td>${emp.department}</td>
      <td>${emp.email}</td>
      <td>${emp.location}</td>
    </tr>`;
    });

    document.getElementById("export").addEventListener("click", function () {
      const csv = [];

      csv.push('"Name","Department","Email","Location"');

      data.forEach((emp) => {
        csv.push(
          `"${emp.name}","${emp.department}","${emp.email}","${emp.location}"`
        );
      });

      const csvString = csv.join("\n");
      const blob = new Blob([csvString], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Employee Table.csv";
      link.click();
    });

    document.querySelectorAll("tbody tr").forEach((row, index) => {
      row.addEventListener("click", function () {
        const modal = document.getElementById("employeeModal");
        const modalDetails = document.getElementById("modalDetails");

        const employee = data[index];

        modalDetails.innerHTML = `
          <div class="employee-card">
            <img src="${employee.picture}" alt="${employee.name}" class="employee-photo" />
            <div class="employee-info">
              <h3>${employee.name}</h3>
              <p><strong>Department:</strong> ${employee.department}</p>
              <p><strong>Email:</strong> ${employee.email}</p>
              <p><strong>Phone:</strong> ${employee.phone}</p>
              <p><strong>Location:</strong> ${employee.location}</p>
              <p><strong>Age:</strong> ${employee.age}</p>
              <p><strong>Gender:</strong> ${employee.gender}</p>
            </div>
          </div>`;
        modal.style.display = "block";
      });
    });
  }
  createTable(tablePage);

  searchInput.addEventListener("input", function () {
    const query = searchInput.value.toLowerCase();

    tableHead.forEach((th) => th.classList.remove("active"));

    const filteredData = data.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.department.toLowerCase().includes(query)
    );

    if (filteredData.length === 0) {
      exportBtn.style.display = "none";
      match.hidden = false;
      table.hidden = true;
      container.style.overflowX = 'hidden'
      btnDiv.style.display = "none";
    } else if (filteredData.length !== 0 && query !== "") {
      match.hidden = true;
      btnDiv.style.display = "none";
      createTable(filteredData);
    } else {
      btnDiv.style.display = "inline-block";
      createTable(tablePage);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loader.hidden = false;
  loadChart();
});

async function loadChart() {
  const data = await getEmployees();
  const departmentCount = getDepartmentCounts(data);
  const ctx = document.getElementById("barChart").getContext("2d");

  loader.hidden = true;

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(departmentCount),
      datasets: [
        {
          label: "Employees",
          data: Object.values(departmentCount),
          backgroundColor: "rgba(54, 162, 235, 0.7)",
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      responsive: true,
    },
  });
}

let sort_asc = true;

function sortTable(column) {
  sort_asc = !sort_asc;
  const rows = document.querySelectorAll("tbody tr");

  [...rows]
    .sort((a, b) => {
      const aCell = a.querySelectorAll("td")[column].textContent;
      const bCell = b.querySelectorAll("td")[column].textContent;

      return sort_asc ? (aCell < bCell ? 1 : -1) : aCell < bCell ? -1 : 1;
    })
    .forEach((row) => document.querySelector("tbody").appendChild(row));
}

function closeModal() {
  const modal = document.getElementById("employeeModal");
  modal.style.display = "none";
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});

window.addEventListener("click", (e) => {
  if (e.target.id === "employeeModal") {
    closeModal();
  }
});

function closeSidebar() {
  sidebar.style.display = "none"
}

window.addEventListener("click", (e) => {
  if (e.target.id === "sidebar") {
    closeSidebar();
  }
});