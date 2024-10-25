function loadCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    renderCart(cartItems);
}

function renderCart(cartItems) {
    const cartContainer = document.getElementById('cartContainer');
    const totalPriceElement = document.getElementById('totalPrice');
    cartContainer.innerHTML = ''; 

    let total = 0;

    if (cartItems.length === 0) {
        cartContainer.innerHTML = '<p>Tu carrito está vacío</p>';
        totalPriceElement.textContent = 'Q0.00';
        return;
    }

    cartItems.forEach((product, index) => {
        const productElement = document.createElement('div');
        productElement.className = 'cart-item';
        
        const price = parseFloat(product.price);
        total += isNaN(price) ? 0 : price;

        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="cart-item-img">
            <div>
                <h3>${product.name}</h3>
                <p>Precio: Q${price.toFixed(2)}</p>
                <button class="removeButton" data-product-id="${product.id}" data-index="${index}">Eliminar</button>
            </div>
        `;

        cartContainer.appendChild(productElement);
    });

    totalPriceElement.textContent = `Q${total.toFixed(2)}`;

    const removeButtons = document.querySelectorAll('.removeButton');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productIndex = this.getAttribute('data-index');
            removeFromCart(productIndex);
        });
    });
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
}

function finalizePurchase() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    if (cartItems.length === 0) {
        alert('No tienes productos en el carrito para finalizar la compra.');
        return;
    }

    let mensaje = 'Hola, estoy interesado en los siguientes productos:\n\n';
    let total = 0;

    cartItems.forEach(product => {
        const price = parseFloat(product.price);
        mensaje += `Producto: ${product.name}\nPrecio: Q${price.toFixed(2)}\nImagen: ${product.image}\n\n`;
        total += isNaN(price) ? 0 : price;
    });

    mensaje += `Total: Q${total.toFixed(2)}`;

    const numeroTelefono = "+57468459"; 
    const url = `https://wa.me/${numeroTelefono}?text=${encodeURIComponent(mensaje)}`;

    localStorage.removeItem('cart');
    alert('Compra finalizada con éxito. ¡Gracias por tu compra!');

    window.open(url, '_blank');
    loadCartItems();
}

document.getElementById('finalizePurchaseButton').addEventListener('click', finalizePurchase);

window.addEventListener('DOMContentLoaded', loadCartItems);
