export function selectedModifyOrRemoveOption(selected) {
    if (selected === 1 || selected === 2) {
        return true;
    }
    return false;
}

export function selectedModifyOption(selected) {
    if (selected === 1) {
        return true;
    }
    return false;
}

export function selectedRemoveOption(selected) {
    if (selected === 2) {
        return true;
    }
    return false;
}

export function selectedAddOption(selected) {
    if (selected === 3) {
        return true;
    }
    return false;
}


export function sortProducts(products) {
    return products.sort(function (a, b) {
        if (a.nombre < b.nombre) { return -1; }
        if (a.nombre > b.nombre) { return 1; }
        return 0;
    })
}

export function updateProductById(newProduct, newMenu) {
    newMenu.forEach(product => {
        if (product.id === newProduct.id) {
            product.nombre = newProduct.nombre;
            product.precio = newProduct.precio;
        }
    });
    return newMenu;
}

export function removeProductById(id, newMenu) {
    let filteredMenu =
        newMenu.filter(product => product.id !== id);
    return filteredMenu;
}

export function addNewProduct(nombre, precio, newMenu) {
    let id = Math.random();
    let producto = {
        id: id,
        nombre: nombre,
        precio: precio
    };
    newMenu.push(producto);
    return newMenu;
}

export function validatePrice(price) {
    let priceRGEX =  /^[0-9]{1,4}([.]{1}[0-9]{1,2})?$/;
    let priceResult = priceRGEX.test(price);
    return priceResult;
}