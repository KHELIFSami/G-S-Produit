const productTableBody = document.getElementById('productTableBody');
const addProductDialog = document.getElementById('addProductDialog');
const addProductForm = document.getElementById('addProductForm');
const addProductBtn = document.getElementById('addProductBtn');
const closeDialog = document.getElementById('closeDialog');
const searchInput = document.getElementById('search');

let products = JSON.parse(localStorage.getItem('products')) || [];
let productIdCounter = products.length > 0 ? products[products.length - 1].id + 1 : 1;

// Ouvrir le formulaire d'ajout
addProductBtn.addEventListener('click', () => {
    addProductDialog.showModal();
});

// Fermer le formulaire d'ajout
closeDialog.addEventListener('click', () => {
    addProductDialog.close();
    addProductForm.reset();
});

// Ajouter un nouveau produit
addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value.trim());
    const wholesalePrice = parseFloat(document.getElementById('wholesalePrice').value.trim());
    const semiWholesalePrice = parseFloat(document.getElementById('semiWholesalePrice').value.trim());
    const retailPrice = parseFloat(document.getElementById('retailPrice').value.trim());
    const category = document.getElementById('category').value.trim();
    const supplier = document.getElementById('supplier').value.trim();

    if (!name || !price || !wholesalePrice || !semiWholesalePrice || !retailPrice || !category || !supplier) {
        alert('Tous les champs obligatoires doivent être remplis.');
        return;
    }

    const newProduct = {
        id: productIdCounter++,
        name,
        price,
        wholesalePrice,
        semiWholesalePrice,
        retailPrice,
        category,
        supplier
    };

    products.push(newProduct);
    saveProductsToLocalStorage();
    renderProducts();
    addProductDialog.close();
    addProductForm.reset();
});

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
                <button class="futuristic-btn" onclick="editProduct(${product.id})">Modifier</button>
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

// Modifier un produit
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('wholesalePrice').value = product.wholesalePrice;
        document.getElementById('semiWholesalePrice').value = product.semiWholesalePrice;
        document.getElementById('retailPrice').value = product.retailPrice;
        document.getElementById('category').value = product.category;
        document.getElementById('supplier').value = product.supplier;
        addProductDialog.showModal();

        addProductForm.onsubmit = (e) => {
            e.preventDefault();
            product.name = document.getElementById('productName').value.trim();
            product.price = parseFloat(document.getElementById('productPrice').value.trim());
            product.wholesalePrice = parseFloat(document.getElementById('wholesalePrice').value.trim());
            product.semiWholesalePrice = parseFloat(document.getElementById('semiWholesalePrice').value.trim());
            product.retailPrice = parseFloat(document.getElementById('retailPrice').value.trim());
            product.category = document.getElementById('category').value.trim();
            product.supplier = document.getElementById('supplier').value.trim();

            saveProductsToLocalStorage();
            renderProducts();
            addProductDialog.close();
            addProductForm.reset();
        };
    }
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

    // Ajouter un gestionnaire d'événement pour le bouton de téléchargement PDF
    printWindow.document.getElementById('downloadBtn').addEventListener('click', function() {
        const { jsPDF } = window.jspdf; // Assurez-vous d'utiliser jsPDF correctement
        const doc = new jsPDF();
        
        // Utilisez la méthode autoTable pour ajouter le tableau dans le PDF
        doc.autoTable({ html: cloneTable });
        
        // Téléchargez le PDF avec un nom
        doc.save('tableau_produits.pdf');
    });
});


// Charger les produits au démarrage
renderProducts();
