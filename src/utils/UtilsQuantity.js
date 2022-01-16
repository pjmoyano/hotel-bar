export function addQuantity(quantity) {
    return quantity + 1;
}

export function removeQuantity(quantity) {
    if (quantity === 1) {
        return 1;
    }
    return quantity - 1;
}