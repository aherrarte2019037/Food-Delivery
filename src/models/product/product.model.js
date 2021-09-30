import mongoose from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';

const ProductSchema = mongoose.Schema({
    name        : { type: String, required: [true, 'Name is required'], maxLength: 25, unique: true, uniqueCaseInsensitive: true },
    description : { type: String, required: [true, 'Description is required'], maxLength: 60 },
    price       : { type: Number, required: [true, 'Price is required'], min: [0, 'El precio mínimo es 0'] },
    calories    : { type: Number, required: [true, 'Calories is required'], min: [0, 'Las calorías mínimas es 0'] },
    available   : { type: Boolean, default: true },
    images      : [{ type: String, default: 'assets/images/product-image.png' }],
    category    : { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory', default: '111111111111111111111111' },
    createdAt   : { type: Date, default: new Date() }
})

ProductSchema.plugin(uniqueValidator, { message: '{PATH} already exists' });

ProductSchema.methods.toJSON = function() {
    const product = this;
    const response = product.toObject();
    delete response.__v;
    return response;
};

export default mongoose.model( 'Product', ProductSchema );