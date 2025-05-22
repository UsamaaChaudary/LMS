const jwt = require('jsonwebtoken');
const User = require('../Models/UserModel');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token required' });
        }
         const token = authHeader.split(' ')[1]; 
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decodedToken.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = { id: user._id };
        next(); 
    } catch (error) {
        console.error('JWT verification failed:', error.message);
        return res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
};

module.exports = authMiddleware;
