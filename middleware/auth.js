const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    if (!req.headers.authorization) return res.status(401).json({ message: 'Auth failed' });
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Auth failed' });

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Auth failed' });
  }
};
