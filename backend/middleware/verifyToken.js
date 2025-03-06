
import jwt from 'jsonwebtoken';
export const verifyToken = (req,res,next)=> {
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).json({msg: 'No token, authorization denied'});
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({msg: 'Token is not valid'});
    }

    
}

export const adminOnly = (req, res, next) => {
    if (!req.user?.role || req.user.role !== "admin") {
        console.log(req.user.role)
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };