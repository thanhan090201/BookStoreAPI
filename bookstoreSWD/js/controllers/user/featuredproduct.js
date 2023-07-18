document.addEventListener("DOMContentLoaded", function() {
    let products = document.querySelector(".pro-container");
    let currentPage = 1;
    const productsPerPage = 15;
    let bookData = [];

    async function fetchBookData(url) {
        try {
            const response = await fetch(url);
            bookData = await response.json();
            console.log(bookData);
            renderBooks(bookData);
            renderPagination();
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    function renderBooks(data) {
        // Clear existing products
        products.innerHTML = "";

        // Calculate start and end index based on current page and products per page
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;

        // Loop through the data and create product elements
        for (let i = startIndex; i < endIndex && i < data.length; i++) {
            const book = data[i];
            const productId = book.book_Id;

            const product = document.createElement("div");
            product.classList.add("pro");

            const image = document.createElement("img");
            image.src = book.image_URL;
            image.alt = book.book_Title;
            addOnclickRedirectToProduct(image, productId);

            const des = document.createElement("div");
            des.classList.add("des");
            addOnclickRedirectToProduct(des, productId);

            const category = document.createElement("span");
            category.classList.add("bookCategory");
            category.textContent = book.category_Name;

            const title = document.createElement("h4");
            title.classList.add("bookTitle");
            title.textContent = book.book_Title;
            addOnclickRedirectToProduct(title, productId);

            const star = document.createElement("div");
            star.classList.add("star");
            star.innerHTML = `
          <i class="fas fa-star"></i>
          <i class="fas fa-star"></i>
          <i class="fas fa-star"></i>
          <i class="fas fa-star"></i>
          <i class="fas fa-star"></i>
        `;

            const price = document.createElement("h4");
            price.classList.add("bookPrice");
            price.textContent = `${book.book_Price} đ`;

            const cartBtn = document.createElement("button");
            const cartIcon = document.createElement("i");
            // cartIcon.classList.add("fal", "fa-shopping-cart", "cart");
            // cartBtn.appendChild(cartIcon);
            cartBtn.addEventListener("click", function() {
                handleCart(book);
            });

            des.appendChild(category);
            des.appendChild(title);
            // des.appendChild(star);
            des.appendChild(price);

            product.appendChild(image);
            product.appendChild(des);
            product.appendChild(cartBtn);

            products.appendChild(product);
        }
    }

    function renderPagination() {
        const paginationContainer = document.querySelector(".pagination-container");
        const paginationPages = document.querySelector(".pagination-pages");
        paginationPages.innerHTML = "";

        const totalPages = Math.ceil(bookData.length / productsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const paginationItem = document.createElement("span");
            paginationItem.textContent = i;
            paginationItem.classList.add("pagination-item");
            if (i === currentPage) {
                paginationItem.classList.add("active");
            }
            paginationItem.addEventListener("click", function() {
                currentPage = i;
                renderBooks(bookData);
                renderPagination();
                updatePaginationButtonState();
            });
            paginationPages.appendChild(paginationItem);
        }

        // Add next page button
        const nextPageButton = document.querySelector(".next-page");
        nextPageButton.disabled = currentPage === totalPages;
        nextPageButton.addEventListener("click", function() {
            if (currentPage < totalPages) {
                currentPage++;
                renderBooks(bookData);
                renderPagination();
                updatePaginationButtonState();
            }
        });

        // Add previous page button
        const prevPageButton = document.querySelector(".prev-page");
        prevPageButton.disabled = currentPage === 1;
        prevPageButton.addEventListener("click", function() {
            if (currentPage > 1) {
                currentPage--;
                renderBooks(bookData);
                renderPagination();
                updatePaginationButtonState();
            }
        });
    }

    function addOnclickRedirectToProduct(element, productId) {
        element.addEventListener("click", function() {
            redirectToProduct(productId);
        });
    }

    function redirectToProduct(productId) {
        window.open(`sproduct.html?productId=${productId}`, "_blank") ||
            window.location.replace(`sproduct.html?productId=${productId}`);
    }


    function updatePaginationButtonState() {
        const prevPageButton = document.querySelector(".prev-page");
        const nextPageButton = document.querySelector(".next-page");

        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === totalPages;
    }

    fetchBookData("https://book0209.azurewebsites.net/api/book/getBook");
});