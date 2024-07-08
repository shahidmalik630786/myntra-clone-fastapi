



window.onload = async function () {
    try {
        const role = localStorage.getItem("role");
        const accesstoken = localStorage.getItem("accessToken");
        const adminLink = document.getElementById("adminUrlRedirect");
        const loginLink = document.getElementById("loginUrlRedirect");
        const registerLink = document.getElementById("registerUrlRedirect");
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken === null || accessToken === undefined) {
            window.location.href = "/login";
            return;
        }
        // if(accesstoken){
        //  loginLink.remove();
        //  registerLink.remove();
        // }

        if (role !== "admin") {
            adminLink.remove();
        }

        await fetchData();
    } catch (error) {
        console.error('Error in window.onload:', error);
    }
}

const productContainer = document.getElementById("product-container");
const loadingSpinner = document.getElementById("loading-spinner");
let limit = 6;
let page = 1;
let PostCount = 1;
let isLoading = false;
let prodCount = 0;
let isDataAvailable = true;
let bagItem = []

async function fetchData() {

    if (isLoading) return;
    isLoading = true;
    loadingSpinner.style.display = "block";

    try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch(`api/get_all_product/limit/${limit}/page/${page}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        if (response.ok) {
            const products = await response.json();
            console.log(products);
            const product_count = Math.floor(products.product_count / 6)
            if (prodCount <= product_count - 1) {
                products.product.forEach(product => {
                    const image_path = "http://127.0.0.1:8000/static/" + product.image_path;
                    const cardBody = document.createElement("div");
                    cardBody.classList.add("col");  // Add bootstrap column class for better layout
                    cardBody.innerHTML = `
                    <div class="card mt-4" style="width: 18rem;">
                        <h1>${product.id}</h1>
                        <img src="${image_path}" class="card-img-top" alt="${image_path}">
                        <div class="card-body">
                         <h1 id="product_id" data-product-id=${product.id} style="display:none;" >${product.id}</h1>
                         <h3 id ="card_product_name${product.id}" class="my-0 fw-normal">${product.name}</h3>
                        <h5 id ="card_product_price${product.id}" class="card-title pricing-card-title">${product.price}<small class="text-body-secondary fw-light"></small></h5>
                        <h5 id ="card_product_size${product.id}" class="card-title pricing-card-title">${product.size}<small class="text-body-secondary fw-light"></small></h5>
                        <div class="row">
                            <button type="button" class="btn btn-primary w-100" onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.size}', '${image_path}')">Buy</button>
                        </div>
                    </div>
                `;
                    // productContainer.append(cardBody);
                    productContainer.insertAdjacentElement('beforeend', cardBody);

                });
                prodCount++

            } else {
                isDataAvailable = false
            }
        } else {
            const errorData = await response.json();
            console.error('Failed to fetch products:', response.status, errorData.detail);
            const error = errorData.detail;
            if (error === "Token expired") {
                console.log("access token has expired")
                generate_access_token()
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
    finally {
        isLoading = false;
        loadingSpinner.style.display = "none";

    }
}

const showData = () => {
    setTimeout(() => {
        page++;
        fetchData();
    }, 300)
}


window.addEventListener('scroll', () => {
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight) {
        if (isDataAvailable == true) {
            console.log(isDataAvailable, "*********isDataAvailable**********")
            showData();
        }
    }
})

async function addToCart(id, name, price, size, image_path) {
    item = {
        "id": id,
        "name": name,
        "price": price,
        "size": size,
        "image_path": image_path
    }
    const countInBags = document.querySelector(".bag-item-count strong");
    console.log(countInBags,"*************88")
    if (bagItem.some(bagItem => bagItem.id == item.id)) {
        alert("Item is present inside Cart")
    } else {

        bagItem.push(item)
        localStorage.setItem("cartData", JSON.stringify(bagItem));
        items = JSON.parse(localStorage.getItem("cartData"));
        console.log(items)
        const countOfItem = items.length;
        countInBags.textContent = countOfItem;

    }

}

async function generate_access_token() {

    const refreshToken = localStorage.getItem('refreshToken');
    const requestBody = {
        refresh_token: refreshToken,
    };
    const response = await fetch("/refresh-token", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });
    if (response.ok) {
        const token = await response.json();
        console.log(token.access_token, "**************new access token has generated****************")
        localStorage.setItem("accessToken", token.access_token)
        fetchData()
    }
}