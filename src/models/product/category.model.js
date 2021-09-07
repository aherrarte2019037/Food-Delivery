import mongoose from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';

const ProductCategorySchema = mongoose.Schema({
    name        : { type: String, required: [true, 'Name is required'], maxLength: 25, unique: true, uniqueCaseInsensitive: true },
    description : { type: String, required: [true, 'Description is required'], maxLength: 60 },
    image       : { type: String, default: 'assets/images/product-category-image.png' },
    createdAt   : { type: Date, default: new Date() }
})

ProductCategorySchema.plugin(uniqueValidator, { message: '{PATH} already exists' });

ProductCategorySchema.methods.toJSON = function() {
    const category = this;
    const response = category.toObject();
    delete response.__v;
    return response;
};

export default mongoose.model( 'ProductCategory', ProductCategorySchema );