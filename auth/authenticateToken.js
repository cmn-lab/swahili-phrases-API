const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null){
        return res.status(401).json({ error: "You have no access to this resource"})
    }else{
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err){
                res.status(403).json({
                    "errorCode": 1004,
                    "message": "You are not authorized to perform this action"
                })
            }else{
                req.user = user
                next();
            }
        });
    }
}