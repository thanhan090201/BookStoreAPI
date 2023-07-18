function init() {
  const data = localStorage.getItem("user");
  const user = JSON.parse(data);
  console.log('user: ', user);

  if(user.role_Id == 1) {
    document.getElementById("censored").style.bottom = null;
    document.getElementById("disable").classList.remove('disable');
  }

  if (user.role_Id == 2) {
    document.getElementById("staff").href = "bookRequestStaff.html";
  }
}

init();

fetch("https://book0209.azurewebsites.net/api/user/getUser")
  .then((response) => response.json())
  .then((data) => {
    const tableBody = document.getElementById("user-table-body");

    tableBody.innerHTML = "";
    data.forEach((user, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="bold-column">${index + 1}</td> 
        <td class="bold-column">${user.user_Account}</td>
        <td class="bold-column">${user.user_Email}</td>
        <td class="bold-column">${user.user_Phone}</td>
        <td class="bold-column">${getUserRole(user.role_Id)}</td>
        <td>
          <select class="status-select" data-userid="${user.user_Id}">
            <option value="true" ${
              user.is_User_Status ? "selected" : ""
            }>Active</option>
            <option value="false" ${
              !user.is_User_Status ? "selected" : ""
            }>Inactive</option>
          </select>
        </td>
      `;
      tableBody.appendChild(row);
    });

    const statusSelects = document.querySelectorAll(".status-select");
    statusSelects.forEach((select) => {
      select.addEventListener("change", function () {
        const userId = this.getAttribute("data-userid");
        const newStatus = this.value === "true" ? true : false;
        updateUserStatus(userId, newStatus);
      });
    });
  })
  .catch((error) => {
    console.log(error);
  });

function getUserRole(roleId) {
  if (roleId === 1) {
    return "Admin";
  } else if (roleId === 2) {
    return "Staff";
  } else if (roleId === 3) {
    return "User";
  } else {
    return "Unknown";
  }
}
function searchUser() {
  const searchInput = document.getElementById("search-input");
  const searchQuery = searchInput.value;

  fetch(
    `https://book0209.azurewebsites.net/api/user/getUserByName?userName=${searchQuery}`
  )
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.getElementById("user-table-body");

      tableBody.innerHTML = "";
      data.forEach((user, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="bold-column">${index + 1}</td> 
          <td class="bold-column">${user.user_Account}</td>
          <td class="bold-column">${user.user_Email}</td>
          <td class="bold-column">${user.user_Phone}</td>
          <td class="bold-column">${getUserRole(user.role_Id)}</td>
          <td>
            <select class="status-select" data-userid="${user.user_Id}">
              <option value="true" ${
                user.is_User_Status ? "selected" : ""
              }>Active</option>
              <option value="false" ${
                !user.is_User_Status ? "selected" : ""
              }>Inactive</option>
            </select>
          </td>
        `;
        tableBody.appendChild(row);
      });

      const statusSelects = document.querySelectorAll(".status-select");
      statusSelects.forEach((select) => {
        select.addEventListener("change", function () {
          const userId = this.getAttribute("data-userid");
          const newStatus = this.value === "true" ? true : false;
          updateUserStatus(userId, newStatus);
        });
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function updateUserStatus(userId, newStatus) {
  const requestData = {
    is_User_Status: newStatus,
  };
  if (!newStatus) {
    fetch(
      `https://book0209.azurewebsites.net/api/user/deleteUser?userId=${userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    fetch(
      `https://book0209.azurewebsites.net/api/user/restoreUser?userId=${userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
