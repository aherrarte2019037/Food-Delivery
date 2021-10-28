import mongoose from "mongoose";

const AddressSchema = mongoose.Schema({
    user      : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'User is required'] },
    name      : { type: String, required: [true, 'Name is required'], maxLength: 25 },
    references: { type: String, required: [true, 'References is required'], maxLength: 25 },
    address   : { type: String, required: [true, 'Address is required'], maxLength: 100 },
    latitude  : { type: Number, required: [true, 'Latitude is required'] },
    longitude : { type: Number, required: [true, 'Longitude is required'] },
    createdAt : { type: Date, default: new Date() }
})

AddressSchema.methods.toJSON = function() {
    const address = this;
    const response = address.toObject();
    delete response.__v;
    return response;
};

export default mongoose.model( 'Address', AddressSchema );