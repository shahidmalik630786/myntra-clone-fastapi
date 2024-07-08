const main = document.getElementById("main-container");


const items = JSON.parse(localStorage.getItem("cartData"));
console.log(items);

if (items) {
    main.innerHTML =
        `<div class="container text-center">
            <div class="row" style="margin-top: 100px;">
                <div class="col-9 d-flex flex-row flex-wrap mb-2" style="" id="cart-items" >
                </div>
                <div class="col-3 h-100">
                    <div class="card" style="width: 25rem; height: 604px;">
                        <div class="card-body">
                            <h5 class="card-title">Cart Bill</h5>
                            <p class="card-text mt-5"><strong>SUPPORT TRANSFORMATIVE SOCIAL WORK IN INDIA</strong></p>
                            <div class="row my-1">
                                <div class="col text-start">
                                    <strong style="color:rgb(255, 37, 102);">Know More</strong>
                                </div>
                            </div>
                            <div class="row border-bottom border-secondary-subtle">
                                <div class="col">Product Name</div>
                                <div class="col">Price Details</div>
                                <div class="col">Size</div>
                            </div>
                        </div>

                        <div class="card-body">
                            <div class="row border-top border-secondary-subtle">
                                <div class="col text-start">
                                    <strong>TOTAL AMOUNT</strong>
                                </div>
                                <div class="col text-end"><strong>RS Value</strong></div>
                            </div>
                            <div class="row">
                                <center><button type="button" class="btn my-3 mt-5 w-20" style="background-color: rgb(255, 37, 102); width: 300px;"><strong style="color: rgb(255, 37, 102);"><a href="/login" style="text-decoration: none; color: rgb(255, 255, 255);">PLACE ORDER</a></strong></button></center>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
}

const cartItems = document.getElementById("cart-items");
console.log(cartItems)


if (items) {
    // Iterate over each item and create card HTML
    items.forEach(function(item) {
        const cardBody = document.createElement("div")
        cardBody.classList.add('col');
        cardBody.innerHTML = `
            <div class="card mx-1 mb-2" style="width: 18rem;">
                <h1>${item.id}</h1>
                <img src="${item.image_path}" class="card-img-top" alt="${item.image_path}">
                <div class="card-body">
                    <h1 id="product_id" data-item-id="${item.id}" style="display: none;">${item.id}</h1>
                    <h3 id="card_product_name${item.id}" class="my-0 fw-normal">${item.name}</h3>
                    <h5 id="card_product_price${item.id}" class="card-title pricing-card-title">${item.price}<small class="text-body-secondary fw-light"></small></h5>
                    <h5 id="card_product_size${item.id}" class="card-title pricing-card-title">${item.size}<small class="text-body-secondary fw-light"></small></h5>
                    <div class="row">
                        <button type="button" class="btn btn-primary w-100" onclick="addToCart(${item.id}, '${item.name}', ${item.price}, '${item.size}', '${item.image_path}')">Buy</button>
                    </div>
                </div>
            </div>  
        `;

        cartItems.insertAdjacentElement('beforeend', cardBody);
    });
}

