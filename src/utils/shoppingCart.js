export function addProductToShoppingCart(product, quantity, shoppingCart) {
    const productIndex = shoppingCart.products.findIndex((item) => item._id.toString() === product._id.toString());
    if (productIndex === -1) shoppingCart.products.push({ _id: product._id, quantity: quantity });
    if (productIndex !== -1) shoppingCart.products[productIndex].quantity += quantity;
    
    shoppingCart.total += (product.price * quantity);
    shoppingCart.subTotal = shoppingCart.total;
    
    return shoppingCart;
}