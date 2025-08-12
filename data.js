const departmentList = [
  "Engineering",
  "Sales",
  "HR",
  "Marketing",
  "Support",
  "Finance",
  "Operations",
  "IT",
  "Customer Service",
];

function getRandomDepartment() {
  return departmentList[Math.floor(Math.random() * departmentList.length)];
}

async function getEmployees() {
  try {
    const response = await fetch("https://randomuser.me/api/?results=50");

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const employeesList = data.results.map((emp) => ({
      name: `${emp.name.title} ${emp.name.first} ${emp.name.last}`,
      email: emp.email,
      location: `${emp.location.city}, ${emp.location.country}`,
      picture: emp.picture.medium,
      department: getRandomDepartment(),
      phone: emp.phone,
      age: emp.dob.age,
      gender: emp.gender,
    }));
    return employeesList;

  } catch (error) {
    console.error("Fetch error:", error);
  }
};

function getDepartmentCounts(data) {
  return data.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});
}