export function addProductToShoppingCart(product, quantity, shoppingCart) {
    const productIndex = shoppingCart.products.findIndex((item) => item._id.toString() === product._id.toString());
    if (productIndex === -1) shoppingCart.products.push({ _id: product._id, quantity: quantity });
    if (productIndex !== -1) shoppingCart.products[productIndex].quantity += quantity;

    shoppingCart.total += (product.price * quantity);
    shoppingCart.subTotal = shoppingCart.total;
    
    return shoppingCart;
}

export function deleteProductFromShoppingCart(product, quantity, shoppingCart) {
    const productIndex = shoppingCart.products.findIndex((item) => item._id.toString() === product._id.toString());
    
    const previusQuantity = shoppingCart.products[productIndex].quantity;
    if (quantity >= previusQuantity) {
        shoppingCart.products.splice(productIndex, 1);
        shoppingCart.total = 0;
        shoppingCart.subTotal = shoppingCart.total;

    } else {
        shoppingCart.products[productIndex].quantity -= quantity;
        shoppingCart.total -= (product.price * quantity);
        shoppingCart.subTotal = shoppingCart.total;
    }

    return shoppingCart;
}