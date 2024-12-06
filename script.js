const productTableBody = document.getElementById('productTableBody');
const addProductDialog = document.getElementById('addProductDialog');
const editProductDialog = document.getElementById('editProductDialog');
const addProductForm = document.getElementById('addProductForm');
const editProductForm= document.getElementById('editProductForm')
const addProductBtn = document.getElementById('addProductBtn');
const closeDialog = document.getElementById('closeDialog');
const closeAddDialog = document.getElementById("closeAddDialog");
const closeEditDialog = document.getElementById("closeEditDialog");
const searchInput = document.getElementById('search');

let products = JSON.parse(localStorage.getItem('products')) || [];
let productIdCounter = products.length > 0 ? products[products.length - 1].id + 1 : 1;

saveProductsToLocalStorage(); 
renderProducts();

// Ouvrir le formulaire d'ajout
addProductBtn.addEventListener('click', () => {
    addProductForm.reset();
    addProductDialog.showModal();
});

// Fermer le formulaire d'ajout
closeDialog.addEventListener('click', () => {
    addProductDialog.close();
    
});

// Ajouter un nouveau produit
addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newProduct = {
        id: productIdCounter++,
        name: document.getElementById('productName').value.trim(),
        price: document.getElementById('productPrice').value.trim(),
        wholesalePrice:document.getElementById('wholesalePrice').value.trim(),
        semiWholesalePrice:document.getElementById('semiWholesalePrice').value.trim(),
        retailPrice:document.getElementById('retailPrice').value.trim(),
        category:document.getElementById('category').value.trim(),
        supplier:document.getElementById('supplier').value.trim()
    };

    products.push(newProduct);
    saveProductsToLocalStorage();
    renderProducts();
    addProductDialog.close();
});

//-------------------------------------------------------------------------------------------------------------------------------

//Ouvrir le formulaire de modification
function openEditProductDialog(productId) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    document.getElementById('editProductName').value=product.name;
    document.getElementById('editProductPrice').value=product.price;
    document.getElementById('editWholesalePrice').value=product.wholesalePrice;
    document.getElementById('editSemiWholesalePrice').value=product.semiWholesalePrice;
    document.getElementById('editRetailPrice').value=product.retailPrice;
    document.getElementById('editCategory').value=product.category;
    document.getElementById('editSupplier').value=product.supplier;

    editProductForm.dataset.productId = product.id;
    editProductDialog.showModal();
}

//Fermer le formulaire ed modification
closeEditDialog.addEventListener("click", () => editProductDialog.close());


//Modifier un produit
editProductForm.addEventListener("submit",(e) => {
e.preventDefault();

    const productId = parseInt(editProductForm.dataset.productId, 10);
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    product.name = document.getElementById('editProductName').value.trim();
    product.price = document.getElementById('editProductPrice').value.trim();
    product.wholesalePrice = document.getElementById('editWholesalePrice').value.trim();
    product.semiWholesalePrice = document.getElementById('editSemiWholesalePrice').value.trim();
    product.retailPrice = document.getElementById('editRetailPrice').value.trim();
    product.category = document.getElementById('editCategory').value.trim();
    product.supplier = document.getElementById('editSupplier').value.trim();

    saveProductsToLocalStorage();
    renderProducts();
    editProductDialog.close();

});

//-----------------------------------------------------------------------------------------------------------------------------------------

// Afficher les produits
function renderProducts(filteredProducts = products) {
    productTableBody.innerHTML = "";
    filteredProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.price} DA</td>
            <td>${product.wholesalePrice} DA</td>
            <td>${product.semiWholesalePrice} DA</td>
            <td>${product.retailPrice} DA</td>
            <td>${product.category}</td>
            <td>${product.supplier}</td>
            <td>
                <button class="futuristic-btn" onclick="openEditProductDialog(${product.id})">Modifier</button>
                <button class="futuristic-btn" onclick="deleteProduct(${product.id})">Supprimer</button>
            </td>
        `;
        productTableBody.appendChild(row);
    });
}

// Enregistrer les produits dans le stockage local
function saveProductsToLocalStorage() {
    localStorage.setItem('products', JSON.stringify(products));
}

// Supprimer un produit
function deleteProduct(id) {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
        products = products.filter(product => product.id !== id);
        products.forEach((product, index) => {
            product.id = index + 1;
        });
        productIdCounter = products.length > 0 ? products[products.length - 1].id + 1 : 1;
        saveProductsToLocalStorage();
        renderProducts();
    }
}

// Rechercher un produit
searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query)
    );
    renderProducts(filteredProducts);
});

//impression du tableau des produits
document.getElementById('printTableBtn').addEventListener('click', function() {
    const table = document.querySelector('table');
    const cloneTable = table.cloneNode(true);
    const rows = cloneTable.querySelectorAll('tr');
    
    // Suppression de la colonne "Prix"
    rows.forEach(row => {
        const cells = row.querySelectorAll('th, td');
        if (cells.length > 2) { // Supprimer les colonnes de "Prix"
            cells[2].remove();
            cells[7].remove();
            cells[8].remove();
        }
    });

    // Ouvrir une nouvelle fenêtre pour prévisualisation
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write('<html><head><title>Prévisualisation d\'impression</title><style>');
    printWindow.document.write('table {width: 100%; border-collapse: collapse; margin: 20px 0;}');
    printWindow.document.write('th, td {border: 1px solid #ddd; padding: 8px; text-align: left;}');
    printWindow.document.write('th {background-color: #f0f4ff;}');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h1 style="text-align: center;">Prévisualisation d\'impression</h1>');
    printWindow.document.write(cloneTable.outerHTML);
    printWindow.document.write('<button id="printBtn" style="margin: auto;">Imprimer</button>');
    printWindow.document.write('</body></html>');

    // Ajouter un gestionnaire d'événement pour le bouton d'impression
    printWindow.document.getElementById('printBtn').addEventListener('click', function() {
        printWindow.print();
    });

    
});


// Charger les produits au démarrage
renderProducts();
