function init() {
  const data = localStorage.getItem("user");
  const user = JSON.parse(data);
  console.log("user: ", user);

  if (user.role_Id == 1) {
    document.getElementById("censored").style.bottom = null;
    document.getElementById("disable").classList.remove("disable");
  }

  if (user.role_Id == 2) {
    document.getElementById("staff").href = "bookRequestStaff.html";
  }
}

init();

async function selectCate() {
  const url = "https://book0209.azurewebsites.net/api/category/getCategory";

  const getTodo = async (url) => {
    return await fetch(url);
  };

  const todo = await getTodo(url);
  const data = await todo.json();

  var html = "";
  data.map((item) => {
    html +=
      "<option value=" +
      item.category_Id +
      ">" +
      item.category_Name +
      "</option>";
  });
  document.getElementById("newType").innerHTML = html;
}

selectCate();

async function renderTable() {
  const url = "https://book0209.azurewebsites.net/api/request/getRequest";

  const getTodo = async (url) => {
    return await fetch(url);
  };

  const todo = await getTodo(url);
  const data = await todo.json();

  var contentHTML = "";
  for (var i = 0; i < data.length; i++) {
    var currentRequestBook = data[i];

    var contentTr = `<tr> 
      <td>${i + 1}</td>
      <td><img class="bookImg img-fluid" src="${
        currentRequestBook.request_Image_Url
      }" /></td>
      <td>${currentRequestBook.request_Book_Name}</td>
      <td>${currentRequestBook.request_Quantity}</td>
      <td>${currentRequestBook.request_Price}</td>
      <td>${currentRequestBook.request_Note}</td>
      <td>${currentRequestBook.request_Date}</td>
      <td>${currentRequestBook.request_Date_Done}</td>
      <td>${
        currentRequestBook.is_Request_Status === 1
          ? "<p style='color: #f0b01d;'>Processing</p>"
          : currentRequestBook.is_Request_Status === 2
          ? "<p style='color: rgb(17, 232, 17);'>Done</p>"
          : "<p style='color: red'>Undone</p>"
      }</td>
      <td>${
        currentRequestBook.is_RequestBook_Status === true
          ? "<p style='color: rgb(7, 214, 7);'>New</p>"
          : "<p style='color: red;'>Old</p>"
      }
      </td>
      </tr>
      `;
    contentHTML = contentHTML + contentTr;
  }
  document.getElementById("book-table-body").innerHTML = contentHTML;
}

renderTable();

function emptyValidate(value, idError) {
  if (value.length == 0) {
    document.getElementById(idError).innerText = "This field is required";
    return false;
  } else {
    document.getElementById(idError).innerText = "";
    return true;
  }
}

function numberValidate(value, idError) {
  if (value < 1) {
    document.getElementById(idError).innerText =
      "This number must be larger than 0";
    return false;
  } else {
    document.getElementById(idError).innerText = "";
    return true;
  }
}

function isImage(url) {
  return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
}

function imgValidate(value, idError) {
  if (isImage(value) == false) {
    document.getElementById(idError).innerText = "Please fill in an image link";
    return false;
  } else {
    document.getElementById(idError).innerText = "";
    return true;
  }
}

function getNewBookRequestForm() {
  var newUrl = document.getElementById("newUrl").value;
  var newName = document.getElementById("newName").value;
  var newQuantity = +document.getElementById("newQuantity").value;
  var newPrice = +document.getElementById("newPrice").value;
  var newType = +document.getElementById("newType").value;
  var newNote = document.getElementById("newNote").value;

  var newAmount = newQuantity * newPrice;

  var newBook = new NewBook(
    newUrl,
    newName,
    newQuantity,
    newPrice,
    newType,
    newNote,
    newAmount
  );
  return newBook;
}

function validate1() {
  var newBook = getNewBookRequestForm();

  isValid = true;

  isValid =
    isValid & emptyValidate(newBook.newUrl, "noti1") &&
    imgValidate(newBook.newUrl, "noti1");
  isValid = isValid & emptyValidate(newBook.newName, "noti2");
  isValid =
    isValid &
    emptyValidate(newBook.newQuantity, "noti3") &
    numberValidate(newBook.newQuantity, "noti3");
  isValid =
    isValid &
    emptyValidate(newBook.newPrice, "noti4") &
    numberValidate(newBook.newPrice, "noti4");
  isValid = isValid & emptyValidate(newBook.newNote, "noti5");

  return { isValid: isValid, newBook: newBook };
}

async function newBookRequest() {
  const url =
    "https://book0209.azurewebsites.net/api/request/createRequestBookNew";

  var rs = validate1();

  var newDate = new Date();
  console.log(newDate);

  if (rs.isValid == true) {
    fetch(url, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        request_Id: "8c930bf9-2339-4a5a-b470-16297d06d2d8",
        book_Id: "4d1675d2-45ce-4cfb-b9a3-23d0ba817c04",
        category_Id: rs.newBook.newType,
        request_Image_Url: rs.newBook.newUrl,
        request_Book_Name: rs.newBook.newName,
        request_Quantity: rs.newBook.newQuantity,
        request_Amount: rs.newBook.newAmount,
        request_Price: rs.newBook.newPrice,
        request_Date: newDate,
        request_Date_Done: newDate,
        request_Note: rs.newBook.newNote,
        is_RequestBook_Status: true,
        is_Request_Status: 1,
      }),
    })
      .then((response) => {
        var closeButton = document.querySelector(
          '.btn.btn-danger[data-dismiss="modal"]'
        );
        closeButton.click();
        renderTable();
      })
      .catch(function (err) {
        console.log("err: ", err);
      });
  }
  Swal.fire({
    icon: "success",
    title: "Add successfully",
    text: "Items have been move to importation.",
  })
}

function getOldBookRequestForm() {
  var oldName = document.getElementById("oldName").value;
  var oldQuantity = +document.getElementById("oldQuantity").value;
  var oldNote = document.getElementById("oldNote").value;

  var oldBook = new OldBook(oldName, oldQuantity, oldNote);

  return oldBook;
}

function validate2() {
  var oldBook = getOldBookRequestForm();

  isValid = true;

  isValid =
    isValid & emptyValidate(oldBook.oldQuantity, "noti6") &&
    numberValidate(oldBook.oldQuantity, "noti6");
  isValid = isValid & emptyValidate(oldBook.oldNote, "noti7");

  return { isValid: isValid, oldBook: oldBook };
}

async function getBook() {
  const url = "https://book0209.azurewebsites.net/api/book/getBook";

  const getTodo = async (url) => {
    return await fetch(url);
  };

  const todo = await getTodo(url);
  const data = await todo.json();

  var html = "";
  data.map((item) => {
    html +=
      "<option value=" + item.book_Id + ">" + item.book_Title + "</option>";
  });
  document.getElementById("oldName").innerHTML = html;
}

getBook();

async function oldBookRequest() {
  const url2 =
    "https://book0209.azurewebsites.net/api/request/createRequestBookOld";

  var rs1 = validate2();
  console.log("rs1: ", rs1);
  console.log(rs1.oldBook.id);

  const url1 = `https://book0209.azurewebsites.net/api/book/getBookDetail?bookId=${rs1.oldBook.id}`;

  const getTodo = async (url1) => {
    return await fetch(url1);
  };

  const todo = await getTodo(url1);
  const data = await todo.json();
  console.log('data: ', data);

  var amount = rs1.oldBook.oldQuantity * data.book_Price;

  var oldDate = new Date();

  if (rs1.isValid == true) {
    fetch(url2, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        request_Id: "8c930bf9-2339-4a5a-b470-16297d06d2d8",
        book_Id: rs1.oldBook.id,
        request_Quantity: rs1.oldBook.oldQuantity,
        request_Note: rs1.oldBook.oldNote,

        category_Id: 0,
        request_Image_Url: "",
        request_Book_Name: "",
        request_Price: 0,

        request_Amount: amount,

        request_Date: oldDate,
        request_Date_Done: oldDate,
        is_RequestBook_Status: false,
        is_Request_Status: 1,
      }),
    })
      .then((response) => {
        console.log("response: ", response);

        var closeButton = document.querySelector(
          '.btn.btn-danger[data-dismiss="modal"]'
        );
        closeButton.click();
        renderTable();
      })
      .catch(function (err) {
        console.log("err: ", err);
      });
  }
  Swal.fire({
    icon: "success",
    title: "Add successfully",
    text: "Items have been move to importation.",
  })
}
