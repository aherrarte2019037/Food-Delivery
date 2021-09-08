import multer from 'multer';

function upload({ fieldName = 'files', maxFilesSize = 5, maxFiles = Infinity, extensions = [] } = {}) {
    const multerInstance = multer({
        storage: multer.memoryStorage(),
        limits : { fileSize: maxFilesSize * 1048576 },
        fileFilter: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            if(extensions.length > 0 && !extensions.includes(extension)) cb(new Error('Archivo no soportado'));
            cb(null, true);
        }
    });

    const upload = multerInstance.array(fieldName, maxFiles > 0 ? maxFiles : Infinity);

    return function(req, res, next) {
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                if(err?.code === 'LIMIT_UNEXPECTED_FILE') {
                    return res.status(500).send({ success: false, message: `Máximo ${maxFiles} ${maxFiles > 1 ? 'Archivos': 'Archivo'}` });
                }

                if(err?.code === 'LIMIT_FILE_SIZE') {
                    return res.status(500).send({ success: false, message: `Archivo maxímo de ${maxFilesSize}MB` });
                }

            } else if (err) {
                if(err?.message === 'Archivo no soportado') {
                    const message = `${extensions.length > 1 ? 'Formatos':'Formato'} ${extensions.length > 1 ? 'soportados':'soportado'}`;
                    return res.status(500).send({ success: false, message: `${message} ${extensions.toString()}` });
                }
                return res.status(500).send({ success: false, message: 'Error al subir ' + maxFiles > 1 ? 'Archivos': 'Archivo' });
            }
            
            next();
        });
    }
}

export { upload }