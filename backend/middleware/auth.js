import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Kirish tokeni talab qilinadi' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Yaroqsiz token' });
  }
};

export const requireModerator = (req, res, next) => {
  if (req.userRole !== 'moderator' && req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Moderator huquqi talab qilinadi' });
  }
  next();
};
