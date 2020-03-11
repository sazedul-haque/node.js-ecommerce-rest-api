const { validationResult } = require('express-validator');
const cuid = require('cuid');
const { slugify, urlSlug } = require('../util/helperFunctions');

const Category = require('../models/category');

exports.getCategories = (req, res, next) => {
    Category.find()
        .then(categories => {
            res.status(200).json({ data: categories });
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.getSingleCategory = (req, res, next) => {
    const catId = req.params.catId;

    Category.findById(catId)
        .then(category => {
            if(!category){
                return res.status(404).json({ msg: 'Category not found!' });
            }
            res.status(200).json({ data: category });
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.createCategory = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ message: 'Invalid input data.', errors: errors.array() });
    }

    Category.findOne({ slug: slugify(req.body.name)})
        .then(cat => {
            if(cat){
                console.log(cat);
                return res.status(422).json({ msg: 'Category already exist.' });
            }
            const name = req.body.name;
            const slug = slugify(name);
            const image = req.body.image;

            const category = new Category({
                name: name,
                slug: slug,
                image: image
            })

            return category.save()
        })
        .then(result => {
            res.status(201).json('Category created successfully.');
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.updateCategory = (req, res, next) => {
    const catId = req.params.catId;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ message: 'Invalid input data.', errors: errors.array() });
    }
    const updatedName = req.body.name;
    const updatedSlug = slugify(updatedName);
    const updatedImage = req.body.image;

    Category.findById(catId)
        .then(category => {
            if(!category){
                return res.status(404).json({ msg: 'Category not found' });
            }
            category.name = updatedName;
            category.slug = updatedSlug;
            category.image = updatedImage;
            return category.save();
        })
        .then(result => {
            res.status(200).json('Category updated successfully.');
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.deleteCategory = (req, res, next) => {
    const catId = req.params.catId;

    Category.findById(catId)
        .then(category => {
            if(!category){
                return res.status(404).json({ msg: 'Category not found.' });
            }
            return Category.deleteOne({ _id: catId })
        })
        .then(result => {
            res.status(200).json({ msg: 'Category deleted.' });
        })
        .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
}