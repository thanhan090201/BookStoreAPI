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

function fetchBooks() {
  fetch("https://book0209.azurewebsites.net/api/book/getBook")
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.getElementById("book-table-body");
      tableBody.innerHTML = ""; // Xóa dữ liệu trước đó trên bảng

      let count = 0; // Biến đếm số thứ tự

      data.forEach((book) => {
        count++; // Tăng biến đếm số thứ tự

        const row = document.createElement("tr");
        const sttCell = document.createElement("td");
        const imgCell = document.createElement("td");
        const titleCell = document.createElement("td");
        const priceCell = document.createElement("td");
        const quantityCell = document.createElement("td");
        const editCell = document.createElement("td");
        const editIcon = document.createElement("i");

        sttCell.textContent = count;
        titleCell.textContent = book.book_Title;
        titleCell.style.cursor = "pointer"; // Áp dụng CSS style cursor pointer

        titleCell.addEventListener("click", () => {
          window.location.href = `admindetail.html?bookId=${book.book_Id}`;
        });
        if (book.image_URL) {
          const image = document.createElement("img");
          image.src = book.image_URL;
          image.alt = "Book Image";
          image.style.width = "100px";
          image.style.height = "120px";
          imgCell.appendChild(image);
        } else {
          imgCell.textContent = "No Image";
        }

        // Tạo biểu tượng chỉnh sửa
        editIcon.classList.add("far", "fa-edit");
        editIcon.addEventListener("click", () => {
          window.location.href = `/html/adminedit.html?bookId=${book.book_Id}`;
        });
        editCell.appendChild(editIcon);

        priceCell.textContent = book.book_Price;
        // quantityCell.textContent = book.book_Quantity;

        row.appendChild(sttCell);
        row.appendChild(imgCell);
        row.appendChild(titleCell);
        row.appendChild(priceCell);
        row.appendChild(quantityCell);
        row.appendChild(editCell);

        sttCell.classList.add("bold-column");
        titleCell.classList.add("bold-column");
        priceCell.classList.add("bold-column");
        // Thay đoạn mã sau:

        // Bằng đoạn mã sau:
        const quantityContent = document.createElement("div");
        quantityContent.textContent = book.book_Quantity;
        quantityContent.classList.add("quantity-column");
        quantityCell.appendChild(quantityContent);

        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error fetching books:", error);
    });
}

// Hàm fetch dữ liệu từ API SEARCH_BOOK và hiển thị kết quả trên bảng
function searchBooks() {
  const searchInput = document.getElementById("search-input");
  const searchQuery = searchInput.value;

  fetch(
    `https://book0209.azurewebsites.net/api/book/searchBook?nameBook=${searchQuery}`
  )
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.getElementById("book-table-body");
      tableBody.innerHTML = ""; // Xóa dữ liệu trước đó trên bảng

      data.forEach((book) => {
        const row = document.createElement("tr");
        const idCell = document.createElement("td");
        const imgCell = document.createElement("td");
        const titleCell = document.createElement("td");
        const priceCell = document.createElement("td");
        const quantityCell = document.createElement("td");

        fetch(
          `https://book0209.azurewebsites.net/api/image/getImage?bookId=${book.book_Id}`
        )
          .then((response) => response.json())
          .then((imageData) => {
            if (imageData && imageData.length > 0) {
              const image = document.createElement("img");
              image.src = imageData[0].image_URL;
              image.alt = imageData[0].image_Name;
              image.style.width = "120px";
              image.style.height = "120px";
              imgCell.appendChild(image);
            } else {
              imgCell.textContent = "No Image";
            }
          })
          .catch((error) => console.error(error));

        idCell.textContent = book.book_Id;
        titleCell.textContent = book.book_Title;
        priceCell.textContent = book.book_Price;
        quantityCell.textContent = book.book_Quantity;

        row.appendChild(idCell);
        row.appendChild(imgCell);
        row.appendChild(titleCell);
        row.appendChild(priceCell);
        row.appendChild(quantityCell);

        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error searching books:", error);
    });
}

// Fetch dữ liệu từ API GET_BOOK khi vừa vào trang
fetchBooks();
