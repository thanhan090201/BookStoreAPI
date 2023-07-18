async function login() {
  const url = "https://book0209.azurewebsites.net/api/user/getUser";

  const getTodo = async (url) => {
    return await fetch(url);
  };

  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  const todo = await getTodo(url);
  const data = await todo.json();

  console.log(data);

  data.map((item) => {
    if (
      item.user_Account == username &&
      item.user_Password == password &&
      item.is_User_Status == true &&
      item.role_Id == 1
    ) {
      localStorage.setItem("user", JSON.stringify(item));
      window.location.href = "/html/bookRequestAdmin.html";
    } else if (
      item.user_Account == username &&
      item.user_Password == password &&
      item.is_User_Status == true &&
      item.role_Id == 2
    ) {
      localStorage.setItem("user", JSON.stringify(item));
      window.location.href = "productlist.html";
    } else if (
      item.user_Account == username &&
      item.user_Password == password &&
      item.is_User_Status == true &&
      item.role_Id == 3
    ) {
      localStorage.setItem("user", JSON.stringify(item));
      window.location.href = "index.html";
    } else if (item.user_Account.length == 0 && item.user_Password == 0) {
      document.getElementById("notification").innerHTML =
        "Please fill in username or password";
    } else if (
      item.user_Account != username &&
      item.user_Password != password
    ) {
      document.getElementById("notification").innerHTML =
        "Wrong username or password";
    }
  });
}
