import { getProducts, postProduct, deleteProduct } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    const productList = document.getElementById('product-list');
    const noProductsMessage = document.getElementById('no-products-message');
    const productForm = document.getElementById('product-form');
    const clearFormButton = document.getElementById('clear-form');

    // Render products on page load
    renderProducts(await getProducts());

    // Handle form submission
    productForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const productName = document.getElementById('product-name').value;
        const productPrice = document.getElementById('product-price').value;
        const productImage = document.getElementById('product-image').value;

        const newProduct = {
            name: productName,
            price: parseFloat(productPrice),
            image: productImage
        };

        const createdProduct = await postProduct(newProduct);
        renderProduct(createdProduct);

        productForm.reset();
        noProductsMessage.style.display = 'none';
    });

    // Handle form clearing
    clearFormButton.addEventListener('click', () => {
        productForm.reset();
    });

    // Render product list
    function renderProducts(products) {
        productList.innerHTML = '';
        if (products.length === 0) {
            noProductsMessage.style.display = 'block';
        } else {
            noProductsMessage.style.display = 'none';
            products.forEach(renderProduct);
        }
    }

    // Render individual product
    function renderProduct(product) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="card-container--info">
                <p>${product.name}</p>
                <div class="card-container--value">
                    <p>$ ${product.price.toFixed(2)}</p>
                    <img src="./assets/trashIcon.png" alt="Eliminar" data-id="${product.id}">
                </div>
            </div>
        `;

        const deleteButton = card.querySelector('[data-id]');
        deleteButton.addEventListener('click', async () => {
            await deleteProduct(deleteButton.getAttribute('data-id'));
            card.remove();
            if (productList.children.length === 0) {
                noProductsMessage.style.display = 'block';
            }
        });

        productList.appendChild(card);
    }
});