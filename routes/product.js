const express = require('express');
const router = express.Router();

const { check } = require('express-validator');

const isAuth = require('../middleware/is-auth');
const imageUpload = require('../middleware/image-upload');

const ProductController = require('../controllers/product');

//Product Routes
router.get('/products', ProductController.getProducts);

router.get('/products/:productSlug', ProductController.getSingleProduct);

//Get product by category name
router.get('/:catSlug', ProductController.getProductByCategory);

router.post('/products', isAuth, [
    check('title').trim().notEmpty().withMessage('Title cannot not be empty!'),
    check('category').trim().notEmpty().withMessage('Category cannot not be empty!'),
    check('sub_category').trim(),
    check('case_collection').trim(),
    check('design').trim(),
    check('device_model').trim().notEmpty().withMessage('Device model cannot not be empty!'),
    check('for_whom').trim(),
    // check('overview').trim(),
    // check('details').isJSON(),
    // check('images').trim(),
    check('price').isFloat().notEmpty().withMessage('Price cannot not be empty!'),
    // check('status').isBoolean()
], ProductController.createProduct);

router.put('/products/:productSlug', isAuth, [
    check('title').trim().notEmpty().withMessage('Title cannot not be empty!'),
    check('category').trim().notEmpty().withMessage('Category cannot not be empty!'),
    check('sub_category').trim(),
    check('case_collection').trim(),
    check('design').trim(),
    check('device_model').trim(),
    check('for_whom').trim(),
    // check('overview').trim(),
    // check('details').isJSON(),
    // check('images').trim(),
    check('price').isFloat().notEmpty().withMessage('Price cannot not be empty!'),
    // check('status').isBoolean()
], ProductController.updateProduct);

router.delete('/products/:productSlug', isAuth, ProductController.deleteProduct);


module.exports = router;