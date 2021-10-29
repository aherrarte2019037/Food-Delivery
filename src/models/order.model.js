import mongoose from "mongoose";

const OrderSchema = mongoose.Schema({
    user             : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'User is required'] },
    delivery         : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'Delivery is required'] },
    deliveryLatitude : { type: Number, required: [true, 'Latitude is required'] },
    deliveryLongitude: { type: Number, required: [true, 'Latitude is required'] },  
    address          : { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: [true, 'Address is required'] },
    cart             : { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: [true, 'Cart is required'] },    
    status           : { type: String, enum: ['PAGADO', 'DESPACHADO', 'EN CAMINO', 'ENTREGADO'], default: 'PAGADO'  },
    createdAt        : { type: Date, default: new Date() }
})

OrderSchema.methods.toJSON = function() {
    const order = this;
    const response = order.toObject();
    delete response.__v;
    return response;
};

export default mongoose.model( 'Order', OrderSchema );