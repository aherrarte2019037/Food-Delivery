import mongoose from 'mongoose';

export function isValidId( id ) {
    const valid = mongoose.Types.ObjectId.isValid(id);
    return valid;
}