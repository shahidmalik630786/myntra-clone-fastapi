window.onload = async function () {
    const accessToken = localStorage.getItem("accessToken");
    console.log(accessToken, "**********insert_Product**********")
    if (accessToken === null || accessToken === undefined) {
        window.location.href = "/login";
        return;
    }
    try {
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
            console.log(product_count, "***********************")
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
                            <div class="col-6">
                                <button type="button" class="btn btn-primary w-100" data-bs-toggle="modal" data-bs-target="#exampleModal${product.id}" onclick="modelButton(event,${product.id})">Update</button>
                                <div class="modal fade" id="exampleModal${product.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body ">
                                                <form onsubmit="updateClick(event, ${product.id})">
                                                <div class="form-floating">
                                                    <input type="text" class="form-control" id="productName${product.id}" placeholder="Name" name="product_name" required>
                                                    <label for="floatingfile">Product Name</label>
                                                </div>
                                                <div class="form-floating mt-2">
                                                    <input type="text" class="form-control" id="productPrice${product.id}" placeholder="Price" name="product_price" required>
                                                    <label for="floatingfile">Product Price</label>
                                                </div>
                                                <div class="form-floating mt-2">
                                                    <input type="text" class="form-control" id="productSize${product.id}" placeholder="Size" name="product_size" required>
                                                    <label for="floatingfile">Product Size</label>
                                                </div>
                                                <div class="form-floating mt-2">
                                                    <input type="file" class="form-control" id="productImage${product.id}" placeholder="Image" name="product_image" required>
                                                    <label for="floatingfile">Product File</label>
                                                    <img src="" id ="modal_product_image${product.id}" class="" alt="" style="height: 50px;">
                                                </div>

                                                <button class="btn btn-primary w-100 py-2 mt-2" type="submit" onclick="updateClick(event,${product.id})">Submit</button>
                                                <p class="mt-5 mb-3 text-body-secondary">&copy; 2017–2024</p>
                                                </form>
                                            </div>
                                            <div class="modal-footer">
                                            <button id="modalCloseButton" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <button type="button" class="btn btn-primary">Save changes</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6">
                           <button id="deleteButton" onclick="deleteClick(event,${product.id})" class="btn btn-primary w-100 py-2" type="submit">Delete</button>
                            </div>
                        </div>
                    </div>
                `;
                    // productContainer.append(cardBody);
                    productContainer.insertAdjacentElement('beforeend', cardBody);
                });
                prodCount++
                console.log(prodCount, "**********************88")
            } else {
                console.log("There is no more data in Data Base For Further Call");
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
    }
    catch (error) {
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

async function modelButton(event, id) {
    image_src = document.getElementById(`card_product_image${id}`)

    document.getElementById(`productName${id}`).value = document.getElementById(`card_product_name${id}`).innerText;
    document.getElementById(`productPrice${id}`).value = document.getElementById(`card_product_price${id}`).innerText;
    document.getElementById(`productSize${id}`).value = document.getElementById(`card_product_size${id}`).innerText;
    document.getElementById(`modal_product_image${id}`).setAttribute("src", image_src.getAttribute('src'));

}

async function updateClick(event, id) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('id', id);
    formData.append("product_name", document.getElementById(`productName${id}`).value);
    formData.append("size", document.getElementById(`productSize${id}`).value);
    formData.append("price", document.getElementById(`productPrice${id}`).value);
    formData.append("image", document.getElementById(`productImage${id}`).files[0]);

    const button = document.getElementById('modalCloseButton');
    button.addEventListener('click', () => {
    });
    button.click();


    try {
        const accessToken = localStorage.getItem("accessToken")
        const response = await fetch("/api/update_product/", {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            body: formData
        });
        if (response.ok) {
            const result = await response.json();
            console.log("Product updated successfully:", result);
            await fetchData()




        } else {
            const errorData = await response.json();
            console.error('Failed to fetch products:', response.status, errorData.detail);
            const error = errorData.detail;
            if (error === "Token expired") {
                console.log("access token has expired")
                await generate_access_token()
            }
        }
    } catch (error) {
        console.error("Error updating product:", error);
    }
};



async function deleteClick(event, id) {
    const data = {
        id: id
    }
    console.log("delete is working")
    const accessToken = localStorage.getItem("accessToken")
    const response = await fetch(`/api/delete_product/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(id)
    })
    if (response.ok) {
        const id = await response.json()
        console.log(id, "*******************************")
        await fetchData();

    } else {
        const errorData = await response.json();
        console.error('Failed to fetch products:', response.status, errorData.detail);
        const error = errorData.detail;
        if (error === "Token expired") {
            console.log("access token has expired")
            await generate_access_token()
        }
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