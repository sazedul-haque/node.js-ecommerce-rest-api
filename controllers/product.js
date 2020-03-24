const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');
const cuid = require('cuid');
const { slugify } = require('../util/helperFunctions');

const Product = require('../models/product');
const Category = require('../models/category');

exports.getProducts = (req, res, next) => {
    const currentPage = Number(req.query.page) || 1;
    const perPage = 2;
    let totalItems;
    Product.find().countDocuments()
        .then(count => {
            totalItems = count;
            return Product.find().skip((currentPage - 1) * perPage).limit(perPage)
        })
        .then(products => {
            res.json({ 
                data: products, 
                totalItems: totalItems, 
                itemPerPage: perPage, 
                currentPage: currentPage
            });
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.getSingleProduct = (req, res, next) => {
    const slug = req.params.productSlug;
    Product.findOne({ slug: slug })
        .then(product => {
            if(!product) {
                return res.status(404).json({ msg: 'Product not found' });
            }
            res.status(200).json({ data: product });
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
}

exports.getProductByCategory = (req, res, next) => {
    const catSlug = req.params.catSlug;
    let category;

    const currentPage = Number(req.query.page) || 1;
    const perPage = 2;
    let totalItems;

    Category.findOne({ slug: catSlug })
        .then(cat => {
            if(!cat){
                return res.status(404).json({ msg: 'No Category Found!'})
            }
            category = cat;
            return Product.find({ category: cat._id }).countDocuments()
        })
        .then(count => {
            totalItems = count;
            return Product.find({ category: category._id }).skip((currentPage - 1) * perPage).limit(perPage)
        })
        .then(products => {
            res.status(200).json({
                data: products, 
                totalItems: totalItems, 
                itemPerPage: perPage, 
                currentPage: currentPage
            });
        })
        .catch(err => {
            if(!err){
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.createProduct = (req, res, next) => {
    if(req.user.role === 'admin' || req.user.role === 'manager') {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(422).json({ message: 'Invalid input data.', errors: errors.array() });
        }

        const title = req.body.title;
        const urlSlug = (title, fingerprint) => {
            return `${slugify(title)}-${fingerprint}`;
        }
        const slug = urlSlug(title, cuid.slug());
        const category = req.body.category;
        const sub_category = req.body.sub_category;
        const case_collection = req.body.case_collection;
        const design = req.body.design;
        const device_model = req.body.device_model;
        const for_whom = req.body.for_whom;
        const overview = req.body.overview;
        const details = req.body.details;
        let images;
        if(req.files) {
            images = req.files.map(file => file.path);
        }
        const price = req.body.price;
        const product = new Product({
            title: title,
            slug: slug,
            category: category,
            sub_category: sub_category,
            case_collection: case_collection,
            design: design,
            device_model: device_model,
            for_whom: for_whom,
            overview: overview,
            details: details,
            images: images,
            price: price
        })

        product.save()
            .then(result => {
                res.status(201).json({message: 'Product created.'});
            })
            .catch(err => {
                if(!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            })
    } else {
        return res.status(403).json({ msg: 'Not authorized'});
    }
}

exports.updateProduct = (req, res, next) => {
    if(req.user.role === 'admin' || req.user.role === 'manager') {
        const id = req.params.productId;

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(422).json({ message: 'Invalid input data.', errors: errors.array() });
        }

        const updatedTitle = req.body.title;
        const urlSlug = (title, fingerprint) => {
            return `${slugify(title)}-${fingerprint}`;
        }
        const updatedSlug = urlSlug(updatedTitle, cuid.slug());
        const updatedCategory = req.body.category;
        const updatedSub_category = req.body.sub_category;
        const updatedCase_collection = req.body.case_collection;
        const updatedDesign = req.body.design;
        const updatedDevice_model = req.body.device_model;
        const updatedFor_whom = req.body.for_whom;
        const updatedOverview = req.body.overview;
        const updatedDetails = req.body.details;
        let updatedImages;
        if(req.files) {
            updatedImages = req.files.map(file => file.path);
        }
        const updatedPrice = req.body.price;
        
        Product.findById(id)
            .then(product => {
                if(!product){
                    return res.status(404).json({ msg: 'Product not found' });
                }

                if(req.files){
                    const newPaths = req.files.map(file => file.path);
                    const deleteFiles = product.images.filter(file => !newPaths.includes(file))
                    clearImage(deleteFiles);
                }

                if(product.title !== updatedTitle){
                    product.slug = updatedSlug;
                }
                product.title = updatedTitle;
                product.category =  updatedCategory;
                product.sub_category = updatedSub_category;
                product.case_collection = updatedCase_collection;
                product.design = updatedDesign;
                product.device_model = updatedDevice_model;
                product.for_whom = updatedFor_whom;
                product.overview = updatedOverview;
                product.details = updatedDetails;
                product.images = updatedImages;
                product.price = updatedPrice; 
                return product.save()
            })
            .then(result => {
                res.status(200).json({message: 'Product updated.'});
            })
            .catch(err => {
                if(!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            })
    } else {
        return res.status(403).json({ msg: 'Not authorized'});
    }
}

exports.deleteProduct = (req, res, next) => {
    if(req.user.role === 'admin' || req.user.role === 'manager') {
        const id = req.params.productId;

        Product.findById(id)
            .then(product => {
                if(!product){
                    return res.status(404).json({ msg: 'Product not found' });
                }
                clearImage(product.images);
                return Product.deleteOne({ slug: slug })
            })
            .then(result => {
                res.status(200).json({ msg: 'Product deleted successfully.' });
            })
            .catch(err => {
                if(!err.statusCode){
                    err.statusCode = 500;
                }
                next(err);
            })
    } else {
        return res.status(403).json({ msg: 'Not authorized'});
    }
}

const clearImage = filePaths => {
    for(let filePath of filePaths) {
        filePath = path.join(__dirname, '..', filePath);
        fs.unlink(filePath, err => console.log(err));
    }
}