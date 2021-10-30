import mongoose from "mongoose";

const OrderSchema = mongoose.Schema({
    user             : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'User is required'] },
    delivery         : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deliveryLatitude : { type: Number, default: 0 },
    deliveryLongitude: { type: Number, default: 0 },  
    address          : { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: [true, 'Address is required'] },
    cart             : { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: [true, 'Cart is required'] },    
    status           : { type: String, enum: ['PAGADO', 'DESPACHADO', 'ENTREGANDO', 'ENTREGADO'], default: 'PAGADO'  },
    createdAt        : { type: Date, default: new Date() }
})

OrderSchema.methods.toJSON = function() {
    const order = this;
    const response = order.toObject();
    delete response.__v;
    return response;
};

export default mongoose.model( 'Order', OrderSchema );