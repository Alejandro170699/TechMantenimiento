import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyD6WHgUG0QK3yN_nzFmtwP0hVn9QauRrX8",
    authDomain: "tecnologico-97ef1.firebaseapp.com",
    projectId: "tecnologico-97ef1",
    storageBucket: "tecnologico-97ef1.appspot.com",
    messagingSenderId: "330297165407",
    appId: "1:330297165407:web:ff3945cb9bfa8a73ce3dea",
    measurementId: "G-7KGG6HW4S1"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let products = [];

// Cargar productos desde Firebase
async function loadProductsFromFirebase() {
    try {
        const querySnapshot = await getDocs(collection(db, 'productos'));
        products = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            products.push({
                id: doc.id,
                name: data.nombre,
                price: data.precio,
                image: data.imageUrl || 'https://via.placeholder.com/150'
            });
        });
        renderProducts(products);
    } catch (e) {
        console.error('Error al cargar los productos de Firebase: ', e);
    }
}

// Renderizar los productos
function renderProducts(productsList) {
    const catalog = document.getElementById('catalog');
    catalog.innerHTML = ''; // Limpiar catálogo
    productsList.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card'; // Clase para mantener el estilo

        // Asegurarse de que el precio sea un número antes de usar toFixed
        const price = parseFloat(product.price); 
        const formattedPrice = isNaN(price) ? "Precio no disponible" : price.toFixed(2);

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Precio: Q${formattedPrice}</p>
            <button class="add-to-cart" data-product-id="${product.id}">Agregar al carrito</button>
        `;

        catalog.appendChild(productCard);
    });

    // Agregar evento de click al botón "Agregar al carrito"
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            const product = products.find(p => p.id === productId);
            addToCart(product);
        });
    });
}

// Agregar producto al carrito
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} ha sido agregado al carrito`);
}

// Filtrar productos
function filterProducts() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchInput)
    );
    renderProducts(filteredProducts);
}

document.getElementById('searchInput').addEventListener('input', filterProducts);


loadProductsFromFirebase();
