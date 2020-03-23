const express = require('express');
const router = express.Router();

const { check } = require('express-validator');

const isAuth = require('../middleware/is-auth');
const imageUpload = require('../middleware/image-upload');

const CategoryController = require('../controllers/category');

// Category Routes
router.get('/categories', CategoryController.getCategories);

router.get('/categories/:catId', CategoryController.getSingleCategory);

router.post('/categories', isAuth, imageUpload.single('image'), [
    check('name').trim().notEmpty().withMessage('Category name cannot be empty!.')
], CategoryController.createCategory);

router.put('/categories/:catId', isAuth, imageUpload.single('image'), [
    check('name').trim().notEmpty().withMessage('Category name cannot be empty!.')
], CategoryController.updateCategory);

router.delete('/categories/:catId', isAuth, CategoryController.deleteCategory);

module.exports = router;