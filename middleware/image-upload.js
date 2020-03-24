const multer = require('multer');
const { slugify } = require('../util/helperFunctions');
// let imageCounter = 0;


const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let newDestination = 'images/';
        if(req.url.includes('categories')) {
            newDestination = 'images/categories';
        } else if(req.url.includes('products')) {
            newDestination = 'images/products';
        };
        // let stat = null;
        // try {
        //     stat = fs.statSync(newDestination);
        // } catch (err) {
        //     fs.mkdirSync(newDestination);
        // }
        // if (stat && !stat.isDirectory()) {
        //     throw new Error('Directory cannot be created because an inode of a different type exists at "' + dest + '"');
        // }       
        cb(null, newDestination);
    },
    
    filename: (req, file, cb) => {
        // imageCounter += 1;
        
        let filename = new Date().toISOString() + '-' + file.originalname;
        if(req.url.includes('categories')){
            if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
                filename = slugify(req.body.name)+'.jpg';
            } else if (file.mimetype === 'image/png') {
                filename = slugify(req.body.name)+'.png';
            }
        }
        
        if(req.url.includes('products')){
            if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
                filename = slugify(req.body.title) + '-' + req.files.length + '.jpg';
            } else if (file.mimetype === 'image/png') {
                filename = slugify(req.body.title) + '-' + req.files.length + '.png';
            }
        }
        
        cb(null, filename);
    }
})
  
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const imageUpload = multer({ storage: fileStorage, fileFilter: fileFilter });

module.exports = imageUpload;