function init() {
  const data = localStorage.getItem("user");
  const user = JSON.parse(data);
  console.log("user: ", user);
}
init();

const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get("bookId");
function bookDetail() {
  fetch(
    `https://book0209.azurewebsites.net/api/book/getBookDetail?bookId=${bookId}`
  )
    .then((response) => response.json())
    .then((productData) => {
      document.getElementById("book-title").textContent =
        productData.book_Title;
      document.getElementById(
        "book-price"
      ).textContent = `đ. ${productData.book_Price}`;
      document.getElementById("book-author").textContent =
        productData.book_Author;
      document.getElementById("publication-date").textContent =
        productData.book_Year_Public;
      document.getElementById("quantity").textContent =
        productData.book_Quantity;
      document.getElementById("book-description").textContent =
        productData.book_Description;

      const bookImage = document.getElementById("book-image");
      bookImage.src = productData.image_URL;
      bookImage.alt = productData.book_Title;
    })
    .catch((error) => {
      console.error("Error fetching product details:", error);
    });
}

function addInventory() {
  document.getElementById("inventory-note").value = "";
  document.getElementById("inventory-quantity").value = "";
  inventoryModal.show();
}

function addToInventory() {
  const note = document.getElementById("inventory-note").value;
  const quantity = document.getElementById("inventory-quantity").value;

  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get("bookId");

  const data = localStorage.getItem("user");
  const user = JSON.parse(data);

  if (!note || !quantity || !bookId || !user) {
    alert("Vui lòng điền đầy đủ thông tin.");
    return;
  }

  // Chuyển quantity và book_Quantity thành số nguyên
  const parsedQuantity = parseInt(quantity);
  const parsedBookQuantity = parseInt(
    document.getElementById("quantity").textContent
  );

  if (parsedQuantity <= 0) {
    alert("Số lượng phải lớn hơn 0.");
    return;
  }

  if (parsedQuantity > parsedBookQuantity) {
    alert("Số lượng trong kho không đủ.");
    return;
  }

  const inventoryData = {
    user_Id: user.user_Id,
    book_Id: bookId,
    inventory_Quantity: parsedQuantity,
    inventory_Note: note,
  };

  fetch("https://book0209.azurewebsites.net/api/inventory/addInventory", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inventoryData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then((data) => {
      console.log("API response:", data);

      if (data === "Add Inventory Success") {
        inventoryModal.hide();
        bookDetail();
        document.getElementById("inventory-note").value = "";
        document.getElementById("inventory-quantity").value = "";
      } else {
      }
    })
    .catch((error) => {
      console.error("Error adding inventory:", error);
    });
}

bookDetail();
