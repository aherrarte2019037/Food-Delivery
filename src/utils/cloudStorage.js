import { Storage } from '@google-cloud/storage';
import { URL } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'util';

const storage = new Storage({
    projectId: "food-delivery-c47d2",
    keyFilename: './accountStorageKey.json'
});
const uuid = uuidv4();
const bucket = storage.bucket("gs://food-delivery-c47d2.appspot.com/");

function uploadCloudStorage(file, pathImage, deletePathImage) {
    return new Promise((resolve, reject) => {
        if (deletePathImage) {
            if (deletePathImage != null || deletePathImage != undefined) {
                const parseDeletePathImage = new URL(deletePathImage)
                var ulrDelete = parseDeletePathImage.pathname.slice(23);
                const fileDelete = bucket.file(`${ulrDelete}`)

                fileDelete.delete()
                .then((imageDelete) => {
                    console.log('Imagen eliminada')
                }).catch(err => {
                    console.log('Error al eliminar imagen: ', err)
                });
            }
        }

        if (pathImage) {
            if (pathImage != null || pathImage != undefined) {
                let fileUpload = bucket.file(`${pathImage}`);
                let stream = fileUpload.createWriteStream();
                const blobStream = stream.pipe(fileUpload.createWriteStream({
                    metadata: {
                        contentType: 'image/png',
                        metadata: { firebaseStorageDownloadTokens: uuid }
                    },
                    resumable: false
                }));
                blobStream.on('error', (error) => {
                    console.log('Error al subir archivo', error);
                    reject('Something is wrong! Unable to upload at the moment.');
                });
                blobStream.on('finish', () => {
                    // The public URL can be used to directly access the file via HTTP.
                    const url = format(`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileUpload.name}?alt=media&token=${uuid}`);
                    resolve(url);
                });
                blobStream.end(file.buffer);
            }
        }
    });
}

export { uploadCloudStorage };