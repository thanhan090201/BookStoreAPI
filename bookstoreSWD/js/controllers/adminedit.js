// Lấy bookId từ query parameter trong URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const bookId = urlParams.get("bookId");

// Lấy các phần tử DOM
const imageUrlInput = document.getElementById("image-url");
const bookTitleInput = document.getElementById("book-title");
const bookAuthorInput = document.getElementById("book-author");
const bookDescriptionInput = document.getElementById("book-description");
const bookPriceInput = document.getElementById("book-price");
const bookQuantityInput = document.getElementById("book-quantity");
const bookYearPublicInput = document.getElementById("book-year-public");

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

// Gửi request lấy thông tin sách từ API
function fetchBookDetails() {
  fetch(
    `https://book0209.azurewebsites.net/api/book/getBookDetail?bookId=${bookId}`
  )
    .then((response) => response.json())
    .then((book) => {
      // Lưu trữ các giá trị từ book vào các biến tạm
      const tempBookId = book.book_Id;
      const tempCategoryId = book.category_Id;
      const tempCategoryName = book.category_Name;
      const tempBookISBN = book.book_ISBN;
      const tempBookStatus = book.is_Book_Status;

      // Đổ dữ liệu lên các trường nhập liệu
      document.getElementById("image-url").src = book.image_URL;
      bookTitleInput.value = book.book_Title;
      bookAuthorInput.value = book.book_Author;
      bookDescriptionInput.value = book.book_Description;
      bookPriceInput.value = book.book_Price;
      bookQuantityInput.value = book.book_Quantity;
      bookYearPublicInput.value = book.book_Year_Public;

      // Đặt sự kiện click cho nút "Cập nhật"
      const saveButton = document.getElementById("save-button");
      saveButton.addEventListener("click", function () {
        // Tiến hành cập nhật sách khi người dùng nhấn nút "Save"
        updateBook(
          tempBookId,
          tempCategoryId,
          tempCategoryName,
          tempBookISBN,
          tempBookStatus
        );
      });
    })
    .catch((error) => {
      console.error("Error fetching book:", error);
    });
}

// Gửi request cập nhật sách lên API
function updateBook(
  tempBookId,
  tempCategoryId,
  tempCategoryName,
  tempBookISBN,
  tempBookStatus
) {
  // Lấy giá trị từ các trường nhập liệu
  const updatedBook = {
    book_Id: tempBookId,
    category_Id: tempCategoryId,
    category_Name: tempCategoryName,
    image_URL: [imageUrlInput.value],
    book_Title: bookTitleInput.value,
    book_Author: bookAuthorInput.value,
    book_Description: bookDescriptionInput.value,
    book_Price: bookPriceInput.value,
    book_Quantity: bookQuantityInput.value,
    book_Year_Public: bookYearPublicInput.value,
    book_ISBN: tempBookISBN,
    is_Book_Status: tempBookStatus,
  };

  fetch(`https://book0209.azurewebsites.net/api/book/updateBook`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedBook),
  })
    .then((response) => {
      // Kiểm tra xem phản hồi có hợp lệ không
      if (response.ok) {
        console.log("Book updated successfully.");
        window.location.href = "productlist.html";
        // Hiển thị thông báo cập nhật thành công, hoặc thực hiện các hành động khác sau khi cập nhật
      } else {
        console.error(
          "Error updating book:",
          response.status,
          response.statusText
        );
      }
    })
    .catch((error) => {
      console.error("Error updating book:", error);
    });
}

// Gửi request xóa sách lên API
function deleteBook() {
  // Hiển thị modal xác nhận xóa
  const deleteModal = new bootstrap.Modal(
    document.getElementById("deleteModal")
  );
  deleteModal.show();
}

// Xác nhận xóa sách
function confirmDelete() {
  fetch(
    `https://book0209.azurewebsites.net/api/book/deleteBook?bookId=${bookId}`,
    {
      method: "PATCH",
    }
  )
    .then((response) => {
      // Kiểm tra xem phản hồi có hợp lệ không
      if (response.ok) {
        console.log("Book deleted successfully.");
        // Redirect về trang admin sau khi xóa thành công
        window.location.href = "productlist.html";
      } else {
        console.error(
          "Error deleting book:",
          response.status,
          response.statusText
        );
      }
    })
    .catch((error) => {
      console.error("Error deleting book:", error);
    });
}

// Fetch book details when the page loads

fetchBookDetails();
