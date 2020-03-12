const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader){
        return res.status(401).json({ msg: 'Not authenticated.'});
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try{
        decodedToken = jwt.verify(token, 'somesecretkeyortext');
    } catch(err){
        return res.status(401).json({ msg: 'Not authenticated.' });
    }
    if(!decodedToken){
        return res.status(401).json({ msg: 'Not authenticated.' });
    }
    req.user = decodedToken;
    next();
}
