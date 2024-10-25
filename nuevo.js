// nuevo.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, Timestamp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-storage.js";

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
const storage = getStorage(app);

document.getElementById('btnGuardar').addEventListener('click', async () => {
    const nombre = document.getElementById('inputNombre').value;
    const precio = document.getElementById('inputPrecio').value;
    const file = document.getElementById('inputFile').files[0];

    if (!nombre || !precio || !file) {
        alert('Todos los campos son obligatorios.');
        return;
    }

    try {
        const storageRef = ref(storage, 'productos/' + file.name);
        await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(storageRef);

        const docRef = await addDoc(collection(db, 'productos'), {
            nombre,
            precio,
            imageUrl,
            createdAt: Timestamp.fromDate(new Date())
        });
        alert('Producto guardado con ID: ' + docRef.id);
        clearForm();
        loadProducts();
    } catch (e) {
        console.error('Error al guardar el producto: ', e);
        alert('Error al guardar el producto.');
    }
});

async function loadProducts() {
    try {
        const querySnapshot = await getDocs(collection(db, 'productos'));
        const tableBody = document.getElementById('tablaProductos').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = '';

        const currencyFormatter = new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: 'GTQ'
        });

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = data.nombre;
            row.insertCell(1).textContent = currencyFormatter.format(data.precio); 

            const imgCell = row.insertCell(2);
            const img = document.createElement('img');
            img.src = data.imageUrl || 'https://via.placeholder.com/100'; 
            img.style.width = '100px'; 
            img.style.height = 'auto';
            img.style.maxWidth = '150px'; 
            img.style.maxHeight = '100px'; 
            imgCell.appendChild(img);

            const actionsCell = row.insertCell(3);
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.classList.add('btn', 'btn-danger');
            deleteButton.addEventListener('click', () => deleteProduct(doc.id));
            actionsCell.appendChild(deleteButton);
        });
    } catch (e) {
        console.error('Error al cargar los productos: ', e);
    }
}

async function deleteProduct(id) {
    try {
        await deleteDoc(doc(db, 'productos', id));
        alert('Producto eliminado.');
        loadProducts();
    } catch (e) {
        console.error('Error al eliminar el producto: ', e);
        alert('Error al eliminar el producto.');
    }
}

function clearForm() {
    document.getElementById('inputNombre').value = '';
    document.getElementById('inputPrecio').value = '';
    document.getElementById('inputFile').value = '';
}

window.onload = loadProducts;
