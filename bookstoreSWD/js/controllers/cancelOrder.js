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

function formatDateTime(dateTimeString) {
  const dateTime = new Date(dateTimeString);
  const year = dateTime.getFullYear();
  const month = String(dateTime.getMonth() + 1).padStart(2, "0");
  const day = String(dateTime.getDate()).padStart(2, "0");
  const hours = String(dateTime.getHours()).padStart(2, "0");
  const minutes = String(dateTime.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

function fetchOrders() {
  fetch("https://book0209.azurewebsites.net/api/order/getOrder")
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.querySelector("#orderTable tbody");
      tableBody.innerHTML = "";

      data.forEach((item) => {
        if (item.is_Order_Status === 3) {
          const row = document.createElement("tr");

          const orderIdCell = document.createElement("td");
          const dateCell = document.createElement("td");
          const customerNameCell = document.createElement("td");
          const amountCell = document.createElement("td");
          const deleteCell = document.createElement("td");

          orderIdCell.textContent = item.order_Code;
          orderIdCell.classList.add("order-Id-Cell");

          dateCell.textContent = formatDateTime(item.order_Date);
          customerNameCell.textContent = item.order_Customer_Name;
          amountCell.textContent = item.order_Amount;

          if (item.is_Order_Status === 2) {
            const deleteIcon = document.createElement("i");
            deleteIcon.className = "fa fa-trash";
            deleteIcon.onclick = () => deleteOrder(item.order_Id);
            deleteCell.appendChild(deleteIcon);
          }

          orderIdCell.addEventListener("click", () => {
            const orderId = item.order_Id;
            openDetail(orderId);
          });

          row.appendChild(orderIdCell);
          row.appendChild(dateCell);
          row.appendChild(customerNameCell);
          row.appendChild(amountCell);
          row.appendChild(deleteCell);

          tableBody.appendChild(row);
        }
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function openDetail(orderId) {
  console.log("Clicked orderId:", orderId);

  fetch(
    "https://book0209.azurewebsites.net/api/orderDetail/getByOrderId?Order_id=" +
      orderId
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      const tableBody = document.querySelector("#order-items tbody");

      tableBody.innerHTML = "";

      data.forEach((item) => {
        // Create a new table row
        const row = document.createElement("tr");

        const imageCell = document.createElement("td");
        const titleCell = document.createElement("td");
        const quantityCell = document.createElement("td");
        const amountCell = document.createElement("td");

        imageCell.innerHTML = `<img src="${item.image_URL}" alt="Book Image" width="50">`;
        titleCell.textContent = item.book_Title;
        quantityCell.textContent = item.order_Detail_Quantity;
        amountCell.textContent = item.order_Detail_Amount;

        row.appendChild(imageCell);
        row.appendChild(titleCell);
        row.appendChild(quantityCell);
        row.appendChild(amountCell);

        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  fetch(
    "https://book0209.azurewebsites.net/api/order/getOrderByOrderId?OrderId=" +
      orderId
  )
    .then((response) => response.json())
    .then((orderDetails) => {
      // Hiển thị thông tin chi tiết đơn hàng
      const orderCodeElement = document.querySelector("#order-code");
      const orderDateElement = document.querySelector("#order-date");
      const orderStatusElement = document.querySelector("#order-status");
      const orderRecipientElement = document.querySelector("#order-recipient");
      const orderPhoneElement = document.querySelector("#order-phone");
      const orderAddressElement = document.querySelector("#order-address");
      const orderQuantityElement = document.querySelector(
        "#order-total-quantity"
      );
      const orderAmountElement = document.querySelector("#order-total-amount");

      orderCodeElement.textContent = orderDetails.order_Id;
      orderDateElement.textContent = formatDateTime(orderDetails.order_Date);

      if (orderDetails.is_Order_Status === 1) {
        orderStatusElement.textContent = "Processing";
        orderStatusElement.classList.add("order-status-processing");
      } else if (orderDetails.is_Order_Status === 2) {
        orderStatusElement.textContent = "Done";
        orderStatusElement.classList.add("order-status-done");
      } else if (orderDetails.is_Order_Status === 3) {
        orderStatusElement.textContent = "Fail";
        orderStatusElement.classList.add("order-status-fail");
      } else {
        orderStatusElement.textContent = "Unknown";
      }

      orderRecipientElement.textContent = orderDetails.order_Customer_Name;
      orderPhoneElement.textContent = orderDetails.order_Customer_Phone;
      orderAddressElement.textContent = orderDetails.order_Customer_Address;
      orderQuantityElement.textContent = orderDetails.order_Quantity;
      orderAmountElement.textContent = orderDetails.order_Amount;
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  // Show the modal
  const detailModal = new bootstrap.Modal(
    document.getElementById("detailModal")
  );
  detailModal.show();
}

function deleteOrder(order_Id) {
  const deleteModal = new bootstrap.Modal(
    document.getElementById("deleteModal")
  );
  deleteModal.show();

  const confirmButton = document.getElementById("confirmDeleteButton");
  confirmButton.onclick = () => confirmDelete(order_Id);
}

function confirmDelete(order_Id) {
  fetch(
    `https://book0209.azurewebsites.net/api/order/deleteOrder?orderId=${order_Id}`,
    {
      method: "PATCH",
    }
  )
    .then((response) => {
      // Kiểm tra xem phản hồi có hợp lệ không
      if (response.ok) {
        fetchOrder();
        // Thay thế console.log bằng mã hiển thị thông báo SweetAlert
        Swal.fire({
          icon: "success",
          title: "Deleted Successfully",
          text: "The order has been deleted successfully.",
        }).then(() => {
          // Redirect về trang admin sau khi xóa thành công
          window.location.href = "orderlist.html";
        });
      } else {
        console.error(
          "Error deleting order:",
          response.status,
          response.statusText
        );
      }
    })
    .catch((error) => {
      console.error("Error deleting order:", error);
    });
}

fetchOrders();
