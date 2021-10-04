import mongoose from "mongoose";

const CartSchema = mongoose.Schema({
    user     : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'User is required'] },
    products : [{ _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: { type: Number, default: 0 } }],
    subTotal : { type: Number, default: 0 },
    total    : { type: Number, default: 0 },
    createdAt: { type: Date, default: new Date() }
})

CartSchema.methods.toJSON = function() {
    const product = this;
    const response = product.toObject();
    delete response.__v;
    return response;
};

export default mongoose.model( 'Cart', CartSchema );