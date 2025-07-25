const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Erişim reddedildi. Token eksik.' });
    }
    // Bearer token formatını ayıklama
    const bearerToken = token.split(' ')[1];
    jwt.verify(bearerToken, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Geçersiz token.' });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;