const express = require('express');
const router = express.Router();

const { check } = require('express-validator');

const ProductController = require('../controllers/product');
const CategoryController = require('../controllers/category');

//Product Routes
router.get('/products', ProductController.getProducts);

router.get('/products/:productSlug', ProductController.getSingleProduct);

//Get product by category name
router.get('/:catSlug', ProductController.getProductByCategory);

router.post('/products', [
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

router.put('/products/:productSlug', [
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

router.delete('/products/:productSlug', ProductController.deleteProduct);

// Category Routes
router.get('/categories', CategoryController.getCategories);

router.get('/categories/:catId', CategoryController.getSingleCategory);

router.post('/categories', [
    check('name').trim().notEmpty().withMessage('Category name cannot be empty!.')
], CategoryController.createCategory);

router.put('/categories/:catId', [
    check('name').trim().notEmpty().withMessage('Category name cannot be empty!.')
], CategoryController.updateCategory);

router.delete('/categories/:catId', CategoryController.deleteCategory);

module.exports = router;