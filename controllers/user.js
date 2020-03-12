const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.getUsers = (req, res, next) => {
    if(req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Not authorized'})
    }
    User.find()
        .then(users => {
            res.status(200).json({ data: users });
        })
        .catch(err => {
            if(!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
};

exports.registerUser = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).json({ msg: 'Validation faild.', errors: errors.array() });
    }
    
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const address = req.body.address;
    const role = req.body.role;

    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                name: name,
                address: address,
                role: role
            });
            return user.save();
        })
        .then(result => {
            res.status(201).json({ msg: 'Account created successfully.' });
        })
        .catch(err => {
            if(!err) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.loginUser = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;

    User.findOne({ email: email })
        .then(user => {
            if(!user){
                res.status(401).json({ msg: 'User not found with this email.' });
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);f
        })
        .then(isEqual => {
            if(!isEqual){
                return res.status(201).json({ msg: 'Password did not match' });
            }
            const token = jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id.toString(),
                role: loadedUser.role
            }, 'somesecretkeyortext', { expiresIn: '1h'})
            res.status(200).json({
                token: token,
                // userId: loadedUser._id.toString(),
                msg: 'Logged in successfully'
            })
        })
        .catch(err => {
            if(!err) {
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.deleteUser = (req, res, next) => {
    if(req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Not authorized.' });
    }
    const userId = req.params.userId;
    User.findById(userId)
        .then(user => {
            if(!user) {
                return res.status(404).json({ msg: 'User not found.' });
            }
            return User.deleteOne({ _id: userId })
        })
        .then(result => {
            res.status(200).json({ msg: 'User deleted successfully.' });
        })
        .catch(err => {
            if(!err) {
                err.statusCode = 500;
            }
            next(err);
        })
}