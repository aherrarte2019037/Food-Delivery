import multer from 'multer';

const upload = ({ fileSize = 5242880 } = {}) => multer({
    storage: multer.memoryStorage(),
    limits : { fileSize: fileSize }
});

export  { upload };