const multer = require('multer');
const path = require('path');
function multerExport (nombreDeCampo, ruta, cantDeFotos){
    const multerDiskStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, "../../public/img/", ruta));
        },
        filename: (req, file, cb) => {
            let fileExt = path.extname(file.originalname);
            let originalName = file.originalname.slice(0, file.originalname.length - fileExt.length)
    
            let imageName = ruta + "-" + originalName + "_" + Date.now() + path.extname(file.originalname)
            cb(null, imageName);
        }
    });
    const uploadFile = multer({storage: multerDiskStorage});
    return uploadFile[cantDeFotos](nombreDeCampo);
}
module.exports = multerExport
//agregar validacion 




